import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { useApiStore } from './api'
import { useAuthStore } from './auth'
import { max } from 'lodash'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: useStorage('cart-items', []),
    successMessage: null,
    sharedCarts: [],
    total: 0,
    isPersisted: false,
    errorMessage: null,
    couponValue: 0,
    currentCartId: null,
    sharedCartToken: null,
    totalOrders: null,
    favorite: useStorage('favorite-items', []),
    wishlistCount: null,
    token: localStorage.getItem('auth_token') || null,
    deliveryInfo: null,
    // Ajout d'une propriété pour stocker manuellement le prix final si nécessaire
    manualFinalPrice: null
  }),

  getters: {
    totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    finalPrice: (state) => {
      // Si un prix manuel est défini, l'utiliser (pour les cas spéciaux)
      if (state.manualFinalPrice !== null) {
        return state.manualFinalPrice;
      }
      
      // Sinon, calculer normalement
      const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return total - (state.couponValue || 0);
    },
    totalFavorite: (state) => state.favorite.length,
    formattedTotalPrice: (state) => {
      const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total)
    },
    formattedFinalPrice: (state) => {
      const final = state.finalPrice;
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(final)
    },
    formattedDeliveryCost: (state) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
        .format(state.deliveryInfo?.deliveryCost || 0);
    }
  },

  actions: {
    // Ajouter un produit au panier
    addItem(product) {

      console.log('Ajout au panier:', product)
      const existingItem = this.items.find(i => i.product_id === product.product_id)

      if (existingItem) {
        existingItem.quantity += product.quantity || 1
      } else {
        this.items.push({
          product_id: product.id || product.product_id,
          name: product.name,
          selectedColor: product.selectedColor || null,
          selectedSize: product.selectedSize || null,
          available_stock: product.available_stock || 0,
          price: product.price,
          quantity: product.quantity || 1,
          maxQuantity: product.maxQuantity || 99,
          image: product.image || null
        })
      }
      this.isPersisted = false
      // Réinitialiser le prix manuel lorsqu'on modifie le panier
      this.manualFinalPrice = null;
    },

    // Mettre à jour la quantité
    updateQuantity(product_id, quantity) {
      const item = this.items.find(i => i.product_id === product_id)
      if (item && quantity >= 1 && quantity <= 99) {
        item.quantity = quantity
        this.isPersisted = false
        // Réinitialiser le prix manuel lorsqu'on modifie le panier
        this.manualFinalPrice = null;
      }
    },

    // Supprimer un produit
    removeItem(product_id) {
      const index = this.items.findIndex(i => i.product_id === product_id)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.isPersisted = false
        // Réinitialiser le prix manuel lorsqu'on modifie le panier
        this.manualFinalPrice = null;
      }
    },

    // Vider le panier
    clearCart() {
      this.items = []
      this.isPersisted = false
      this.currentCartId = null
      this.sharedCartToken = null
      this.couponValue = 0
      this.manualFinalPrice = null;
    },

    // Définir manuellement le prix final (pour les cas spéciaux)
    setManualFinalPrice(price) {
      this.manualFinalPrice = price;
    },

    // Réinitialiser le prix manuel pour utiliser le calcul automatique
    resetFinalPrice() {
      this.manualFinalPrice = null;
    },

    // Appliquer une réduction avec coupon
    async applyCoupon(code) {
      try {
        const apiStore = useApiStore();
        const authStore = useAuthStore();
        
        const response = await axios.post(`${apiStore.apiUrl}/coupons/apply`, {
          code: code,
          cart_total: this.totalPrice
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        this.couponValue = response.data.discount_value;
        this.successMessage = response.data.message;
        return true;
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erreur lors de l\'application du coupon';
        return false;
      }
    },

    // Définir les informations de livraison
    setDeliveryInfo(deliveryForm, deliveryOption, deliveryCost, city, district) {
      // Stocker les informations de livraison dans le state
      this.deliveryInfo = {
        // Informations du formulaire
        firstName: deliveryForm.firstName,
        lastName: deliveryForm.lastName,
        email: deliveryForm.email,
        phone: deliveryForm.phone,
        address: deliveryForm.address,
        additionalAddress: deliveryForm.additionalAddress,
        postalCode: deliveryForm.postalCode,
        
        // Options de livraison
        deliveryOption: deliveryOption,
        deliveryCost: deliveryCost,
        
        // Localisation
        city: city,
        district: district,
        
        // Horodatage
        setAt: new Date().toISOString()
      };
      
      // Persister les informations de livraison dans le localStorage
      localStorage.setItem('deliveryInfo', JSON.stringify(this.deliveryInfo));
      
      // Optionnel: synchroniser avec le serveur si l'utilisateur est connecté
      if (this.token) {
        this.syncDeliveryInfoWithServer();
      }
    },

    // Méthode pour synchroniser les informations de livraison avec le serveur
    async syncDeliveryInfoWithServer() {
      try {
        const apiStore = useApiStore();
        const authStore = useAuthStore();
        
        await axios.post(`${apiStore.apiUrl}/delivery-info`, {
          delivery_info: this.deliveryInfo
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        console.log('Informations de livraison synchronisées avec succès');
      } catch (error) {
        console.error('Erreur de synchronisation des informations de livraison:', error);
      }
    },

    // Méthode pour charger les informations de livraison depuis le localStorage
    loadDeliveryInfo() {
      const savedInfo = localStorage.getItem('deliveryInfo');
      if (savedInfo) {
        try {
          this.deliveryInfo = JSON.parse(savedInfo);
          return this.deliveryInfo;
        } catch (e) {
          console.error('Erreur lors du parsing des informations de livraison:', e);
          return null;
        }
      }
      return null;
    },

    // Méthode pour réinitialiser les informations de livraison
    clearDeliveryInfo() {
      this.deliveryInfo = null;
      localStorage.removeItem('deliveryInfo');
      
      // Optionnel: supprimer aussi du serveur
      if (this.token) {
        this.deleteDeliveryInfoFromServer();
      }
    },

    // Méthode pour supprimer les informations de livraison du serveur
    async deleteDeliveryInfoFromServer() {
      try {
        const apiStore = useApiStore();
        const authStore = useAuthStore();
        
        await axios.delete(`${apiStore.apiUrl}/delivery-info`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        console.log('Informations de livraison supprimées du serveur');
      } catch (error) {
        console.error('Erreur lors de la suppression des informations de livraison:', error);
      }
    },

    // Synchroniser avec le serveur
    async syncCartWithServer(isShared) {
      if (this.items.length === 0) return

      console.log('Synchronisation du panier avec le serveur', this.items)

      try {
        const apiStore = useApiStore()
        const authStore = useAuthStore()
        const response = await axios.post(`${apiStore.apiUrl}/cart`, {
          items: this.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            selectedColor: item.selectedColor || null,
            selectedSize: item.selectedSize || null
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
      console.log('Création panier partagé avec:', formData, 'et prix final:', finalPrice);
      try {
        const apiStore = useApiStore()
        const authStore = useAuthStore()
        
        // Si un prix final spécifique est fourni, l'utiliser
        const finalPriceToUse = finalPrice !== undefined ? finalPrice : this.finalPrice;
        
        const response = await axios.post(`${apiStore.apiUrl}/shared-carts`, {
          cart_id: this.currentCartId,
          title: formData.title,
          description: formData.description,
          address_id: formData.address_id,
          phone: formData.phone,
          expires_in: this.formatDateForMySQL(formData.closing_date),
          final_price: finalPriceToUse
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })

        console.log('Panier partagé créé:', response)

        this.sharedCartToken = response.data.data.token
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
      const authStore = useAuthStore()
      console.log('Chargement avec token:', authStore.token)
      try {
        const apiStore = useApiStore()
        const response = await axios.get(`${apiStore.apiUrl}/cart/load`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
        console.log('Chargement du panier:', response)
        
        // Remove the .cart property access since the API returns the cart directly
        this.items = response.data?.cart.items.map(item => ({
          product_id: item.product_id,
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
        
        const response = await axios.get(`${apiStore.apiUrl}/shared-carts/${id}`, {
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
      
      const response = await axios.get(`${apiStore.apiUrl}/shared-carts`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Paniers partagés récupérés:', response.data)

      // Stocker les données dans le store
      this.sharedCarts = response.data.data || [] // Accéder à response.data.data
      this.total = response.data.total || 0 // Stocker le total
      
      return response // Retourner toute la réponse
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

    // Ajouter aux favoris
    addToFavorite(item) {
      if (!this.favorite.some(favoriteItem => favoriteItem.id === item.id)) {
        this.favorite.push({
          id: item.id,
          product_id: item.id,
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
    }
  }
})