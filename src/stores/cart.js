import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import api from '@/api/axiosConfig'
import { useAuthStore } from './auth'
import { API_ROUTES } from '@/utils/apiRoute'

export const useCartStore = defineStore('cart', () => {
  // ----- STATE -----
  const items = useStorage('cart-items', [])
  const favorite = useStorage('favorite-items', [])
  const total = ref(0)
  const successMessage = ref(null)
  const errorMessage = ref(null)
  const isPersisted = ref(false)
  const couponValue = useStorage('couponValue', null)
  const currentCartId = ref(null)
  const sharedCartToken = ref(null)
  const sharedCarts = ref([])
  const deliveryInfo = ref(null)
  const manualFinalPrice = ref(null)

  const authStore = useAuthStore()

  // ----- GETTERS -----
  const totalQuantity = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))
  const finalPrice = computed(() => manualFinalPrice.value ?? (totalPrice.value - (couponValue.value || 0)))
  const totalFavorite = computed(() => favorite.value.length)

  const formatXOF = (amount) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)

  const formattedTotalPrice = computed(() => formatXOF(totalPrice.value))
  const formattedFinalPrice = computed(() => formatXOF(finalPrice.value))
  const formattedDeliveryCost = computed(() => formatXOF(deliveryInfo.value?.deliveryCost || 0))

  // ----- ACTIONS -----
  function addItem(product) {
    // Validation des données requises
    if (!product.product_id) {
      console.error('❌ Product ID manquant:', product)
      return
    }

    const existing = items.value.find(i => 
      i.product_id === product.product_id &&
      i.selectedColor?.id === product.selectedColor?.id &&
      i.selectedSize?.id === product.selectedSize?.id
    )
    
    if (existing) {
      existing.quantity += product.quantity || 1
    } else {
      // S'assurer que toutes les données requises sont présentes
      const newItem = {
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        selectedColor: product.selectedColor || null,
        selectedSize: product.selectedSize || null,
        variant_id: product.variant_id || null
      }
      
      console.log('🆕 Ajout au panier:', newItem)
      items.value.push(newItem)
    }
    isPersisted.value = false
    manualFinalPrice.value = null
  }

  function updateQuantity(product_id, quantity) {
    const item = items.value.find(i => i.product_id === product_id)
    if (item && quantity >= 1) {
      item.quantity = quantity
      isPersisted.value = false
      manualFinalPrice.value = null
    }
  }

  function removeItem(product_id) {
    const index = items.value.findIndex(i => i.product_id === product_id)
    if (index !== -1) {
      items.value.splice(index, 1)
      isPersisted.value = false
      manualFinalPrice.value = null
    }
  }

  function clearCart() {
    items.value = []
    isPersisted.value = false
    currentCartId.value = null
    sharedCartToken.value = null
    couponValue.value = 0
    manualFinalPrice.value = null
  }

  function setManualFinalPrice(price) { manualFinalPrice.value = price }
  function resetFinalPrice() { manualFinalPrice.value = null }

  async function applyCoupon(code) {
    try {
      const response = await api.post(API_ROUTES.cart.coupon, { 
        code, 
        cart_total: totalPrice.value 
      })

      console.log('Reponce apre apply du coupon : ', response)
      
      if (response.success) {
        couponValue.value = response.data.discount_value || response.discount
        successMessage.value = response?.message
        errorMessage.value = null
        return response
      } else {
        errorMessage.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'application du coupon'
      errorMessage.value = errorMsg
      return { 
        success: false, 
        message: errorMsg 
      }
    }
  }

  function resetCoupon() {
    couponValue.value = 0
    successMessage.value = null
    errorMessage.value = null
  }

  // ----- Delivery -----
  function setDeliveryInfo(info) {
    deliveryInfo.value = { ...info, setAt: new Date().toISOString() }
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo.value))
  }

  function loadDeliveryInfo() {
    const saved = localStorage.getItem('deliveryInfo')
    if (saved) {
      try { deliveryInfo.value = JSON.parse(saved) } 
      catch (e) { console.error('Erreur parsing livraison:', e) }
    }
  }

  // ----- Cart -----

  function cleanupInvalidItems() {
    const initialLength = items.value.length
    items.value = items.value.filter(item => {
      const isValid = item.product_id && item.quantity > 0
      if (!isValid) {
        console.warn('🗑️ Suppression item invalide:', item)
      }
      return isValid
    })
    
    if (items.value.length !== initialLength) {
      console.log(`🧹 Nettoyage: ${initialLength - items.value.length} items invalides supprimés`)
    }
  }

  async function syncCartWithServer(isShared = false) {
    if (!authStore.isAuthenticated || items.value.length === 0) return false
    
    // Nettoyer les items invalides avant synchronisation
    cleanupInvalidItems()
    
    if (items.value.length === 0) {
      console.log('📦 Panier vide après nettoyage')
      return false
    }
    
    try {
      // Préparer les données avec validation
      const cartData = {
        items: items.value.map(item => {
          // Validation de chaque item
          if (!item.product_id) {
            console.error('❌ Item sans product_id:', item)
            return null
          }
          
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            selectedColor: item.selectedColor || null,
            selectedSize: item.selectedSize || null
          }
        }).filter(item => item !== null), // Filtrer les items invalides
        is_shared: isShared
      }

      console.log('📤 Synchronisation du panier:', cartData)
      
      const response = await api.post(API_ROUTES.cart.base, cartData)
      console.log('✅ Réponse synchronisation:', response)
      
      if (response.success) {
        currentCartId.value = response?.cart?.id || null
        isPersisted.value = true
        successMessage.value = response.message || 'Panier synchronisé'
        errorMessage.value = null
        return true
      } else {
        throw new Error(response.message || 'Erreur de synchronisation')
      }
    } catch (err) {
      console.error('💥 Erreur détaillée synchronisation:', err.response)
      errorMessage.value = err.response?.message || 'Erreur synchronisation panier'
      return false
    }
  }

  async function loadCartFromServer() {
    if (!authStore.isAuthenticated) return false
    try {
      const response = await api.get(API_ROUTES.cart.load)
      items.value = response.data?.cart?.items || []
      isPersisted.value = true
      return true
    } catch (err) {
      console.error('Erreur chargement panier:', err)
      return false
    }
  }

  async function storeSharedCart(formData, finalPriceOverride) {
    try {
      // Synchroniser le panier
      await syncCartWithServer(false)
      
      // Petit délai pour s'assurer que la synchro est bien traitée
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log(formData, finalPriceOverride)
      const finalPriceToUse = finalPriceOverride ?? finalPrice.value
      
      const response = await api.post(API_ROUTES.cart.shared.base, {
        cart_id: currentCartId.value,
        title: formData.title,
        description: formData.description,
        address_id: formData.address_id,
        phone: formData.phone,
        expires_in: formData.closing_date,
        final_price: finalPriceToUse
      })
      console.log(response)
      
      sharedCartToken.value = response.data.token
      return true
      
    } catch (err) {
      console.error('Erreur création shared cart:', err)
      throw err
    }
  }

  async function fetchSharedCarts() {
    if (!authStore.isAuthenticated) return
    try {
      const response = await api.get(API_ROUTES.cart.shared.base)
      console.log('GGGGGG : ', response)
      sharedCarts.value = response.data || []
      return response.data
    } catch (err) {
      console.error('Erreur récupération shared carts:', err)
      throw err
    }
  }

  async function deleteSharedCart(id) {
    try {
      await api.delete(API_ROUTES.cart.shared.delete(id))
      sharedCarts.value = sharedCarts.value.filter(c => c.id !== id)
      return true
    } catch (err) {
      console.error('Erreur suppression shared cart:', err)
      throw err
    }
  }

  return {
    // STATE
    items, favorite, total, successMessage, errorMessage, isPersisted, couponValue, currentCartId, sharedCartToken, sharedCarts, deliveryInfo, manualFinalPrice,
    // GETTERS
    totalQuantity, totalPrice, finalPrice, totalFavorite,
    formattedTotalPrice, formattedFinalPrice, formattedDeliveryCost,
    // ACTIONS
    addItem, updateQuantity, removeItem, clearCart,
    setManualFinalPrice, resetFinalPrice,
    applyCoupon, resetCoupon,
    setDeliveryInfo, loadDeliveryInfo,
    syncCartWithServer, loadCartFromServer,
    storeSharedCart, fetchSharedCarts, deleteSharedCart,
    addToFavorite: (item) => { if (!favorite.value.some(f => f.id === item.id)) favorite.value.push(item) },
    removeFromFavorite: (id) => { favorite.value = favorite.value.filter(f => f.id !== id) },
    toggleFavorite: (item) => { favorite.value.some(f => f.id === item.id) ? favorite.value = favorite.value.filter(f => f.id !== item.id) : favorite.value.push(item) }
  }
})
