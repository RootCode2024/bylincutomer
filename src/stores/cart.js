import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { useApiStore } from './api'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: useStorage('cart-items', []),
    successMessage: null,
    sharedCarts: [],
    isPersisted: false,
    errorMessage: null,
    couponValue: 0, // Initialize as 0 instead of null
    currentCartId: null,
    sharedCartToken: null,
    totalOrders: null,
    favorite: useStorage('favorite-items', []),
    wishlistCount: null,
    token: localStorage.getItem('auth_token') || null
    // Remove finalPrice from state since it's a derived value
  }),

  getters: {
    totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    // Calculate finalPrice as totalPrice minus couponValue
    finalPrice: (state) => {
      const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return total - (state.couponValue || 0);
    },
    totalFavorite: (state) => state.favorite.length,
    formattedTotalPrice: (state) => {
      const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total)
    },
    // You might want a formatted version of finalPrice too
    formattedFinalPrice: (state) => {
      const final = state.finalPrice;
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(final)
    }
  },

  actions: {
    // Ajouter un produit au panier
    addItem(product) {
      const existingItem = this.items.find(i => i.productId === product.productId)

      if (existingItem) {
        existingItem.quantity += product.quantity || 1
      } else {
        this.items.push({
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.image || null
        })
      }
      this.isPersisted = false
    },

    // Mettre à jour la quantité
    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.productId === productId)
      if (item && quantity >= 1 && quantity <= 99) {
        item.quantity = quantity
        this.isPersisted = false
      }
    },

    // Supprimer un produit
    removeItem(productId) {
      const index = this.items.findIndex(i => i.productId === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.isPersisted = false
      }
    },

    // Vider le panier
    clearCart() {
      this.items = []
      this.isPersisted = false
      this.currentCartId = null
      this.sharedCartToken = null
      this.finalPrice = null
      this.couponValue = null
    },

    // Synchroniser avec le serveur
    async syncCartWithServer(isShared) {
      if (this.items.length === 0) return

      try {
        const apiStore = useApiStore()
        const authStore = useAuthStore()
        const response = await axios.post(`${apiStore.apiUrl}/cart`, {
          items: this.items.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          is_shared: isShared
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token || ''}`
          }
        })

        this.successMessage = 'Panier synchronisé avec succès'
        this.isPersisted = true
        this.errorMessage = null
        this.currentCartId = response.data.data?.id || null
        return true
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erreur de synchronisation'
        this.successMessage = null
        console.error('Erreur API:', error)
        return false
      }
    },

    // Créer un panier partagé
    async storeSharedCart(formData, finalPrice) {
      try {
        const apiStore = useApiStore()
        const authStore = useAuthStore()
        
        const response = await axios.post(`${apiStore.apiUrl}/shared-carts`, {
          cart_id: this.currentCartId,
          title: formData.title,
          description: formData.description,
          address_id: formData.address_id,
          phone: formData.phone,
          closing_date: this.formatDateForMySQL(formData.closing_date),
          final_price: finalPrice
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })

        console.log('Panier partagé créé:', response)

        this.sharedCartToken = response.data.token
        return response.data
      } catch (error) {
        console.error('Erreur API:', error)
        throw error
      }
    },

    formatDateForMySQL(date) {
      if (!date) return null
      const jsDate = typeof date === 'string' ? new Date(date) : date
      return jsDate.toISOString().slice(0, 19).replace('T', ' ')
    },

    // Charger le panier depuis le serveur
    async loadCartFromServer() {
      const authStore = useAuthStore() // ← Utilisez toujours le store d'authentification
      console.log('Chargement avec token:', authStore.token)
      try {
        const apiStore = useApiStore()
        const response = await axios.get(`${apiStore.apiUrl}/cart/load`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        console.log('Chargement du panier:', response)
        
        this.items = response.data?.cart.items.map(item => ({
          productId: item.product_id,
          name: item.product?.name || 'Produit sans nom',
          price: item.product?.price || 0,
          quantity: item.quantity,
          image: item.product?.images?.[0]?.url || null
        }))
        
        this.isPersisted = true
        return true
      } catch (error) {
        console.error('Erreur de chargement du panier:', error)
        return false
      }
    },

    // Récupérer un panier partagé
    async fetchSharedCart(id) {
      try {
        const apiStore = useApiStore()
        const authStore = useAuthStore()
        
        const response = await axios.get(`${apiStore.apiUrl}/shared-cart-customer/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        return response.data
      } catch (error) {
        console.error('Erreur de chargement des paniers partagés:', error)
        throw error
      }
    },

    // Récupérer tous les paniers partagés
    async fetchSharedCarts() {
      try {
        const apiStore = useApiStore()
        const authStore = useAuthStore()
        
        const response = await axios.get(`${apiStore.apiUrl}/shared-carts-customer`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })

        this.sharedCarts = response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch shared carts:', error)
        throw error
      }
    },

    // Supprimer le panier côté serveur
    async deleteCartFromServer() {
      try {
        const apiStore = useApiStore()
        await axios.delete(`${apiStore.apiUrl}/cart`)
        this.clearCart()
        return true
      } catch (error) {
        console.error('Erreur suppression panier serveur:', error)
        return false
      }
    },

    // In your cart store actions:
    addToFavorite(item) {
      if (!this.favorite.some(favoriteItem => favoriteItem.id === item.id)) {
        this.favorite.push({
          id: item.id,
          productId: item.id, // Add this for consistency
          name: item.name,
          price: item.price,
          image: item.image || null
        })
      }
    },

    removeFromFavorite(id) {
      this.favorite = this.favorite.filter(item => item.id !== id)
    },

    toggleFavorite(item) {
      const exists = this.favorite.some(fav => fav.id === item.id)
      if (exists) {
        this.removeFromFavorite(item.id)
      } else {
        this.addToFavorite(item)
      }
    },

    setDeliveryInfo(deliveryForm, deliveryOption, deliveryCost, city, district) {

    }

  }
})