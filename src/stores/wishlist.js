// stores/wishlist.js
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useApiStore } from './api'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: useStorage('wishlist-items', []), // [{ productId, name, price, image, addedAt }]
    wishlistCount: null,
    syncing: false,
    error: null,
    lastSync: null
  }),

  getters: {
    count: (state) => state.items.length,
    itemIds: (state) => state.items.map(item => item.productId),
    isEmpty: (state) => state.items.length === 0,
    totalFavorite: (state) => state.items.length,
    groupedByCategory: (state) => {
      // Grouper par catégorie pour l'affichage organisé
      return state.items.reduce((acc, item) => {
        const category = item.category || 'Autres'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(item)
        return acc
      }, {})
    },
    totalValue: (state) => {
      return state.items.reduce((sum, item) => sum + item.price, 0)
    }
  },

  actions: {
    // Ajouter un produit à la wishlist
    async addItem(product) {
      const existingIndex = this.items.findIndex(
        item => item.productId === product.id
      )

      if (existingIndex === -1) {
        this.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          addedAt: new Date().toISOString(),
          variant: product.variant || null
        })

        await this.syncWithServer()
      }
    },

    // Retirer un produit
    async removeItem(productId) {
      this.items = this.items.filter(item => item.productId !== productId)
      await this.syncWithServer()
    },

    // Vider la wishlist
    async clearWishlist() {
      this.items = []
      await this.syncWithServer()
    },

    // Vérifier si un produit est dans la wishlist
    isInWishlist(productId) {
      return this.items.some(item => item.productId === productId)
    },

    // Synchroniser avec le serveur
    async syncWithServer() {
      const authStore = useAuthStore()
      const apiStore = useApiStore()

      if (!authStore.isAuthenticated) return

      this.syncing = true
      this.error = null

      try {
        const response = await axios.put(
          `${apiStore.apiUrl}/wishlists`,
          { items: this.items },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )

        this.lastSync = new Date().toISOString()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de synchronisation'
        console.error('Wishlist sync error:', error)
        throw error
      } finally {
        this.syncing = false
      }
    },

    // Charger depuis le serveur
    async loadFromServer() {
      const authStore = useAuthStore()
      const apiStore = useApiStore()

      if (!authStore.isAuthenticated) return

      this.syncing = true
      this.error = null

      try {
        const response = await axios.get(`${apiStore.apiUrl}/wishlists`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })

        this.items = response.data.items || []
        this.lastSync = new Date().toISOString()
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de chargement'
        console.error('Wishlist load error:', error)
      } finally {
        this.syncing = false
      }
    },

    // Déplacer vers le panier
    async moveToCart(productId, cartStore) {
      const product = this.items.find(item => item.productId === productId)
      if (!product) return

      await cartStore.addItem({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: 1
      })

      await this.removeItem(productId)
    },

    // Partage de la wishlist
    async generateShareLink() {
      const authStore = useAuthStore()
      const apiStore = useApiStore()

      if (!authStore.isAuthenticated) return null

      try {
        const response = await axios.post(
          `${apiStore.apiUrl}/wishlists/share`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          }
        )

        return `${window.location.origin}/shared-wishlist/${response.data.token}`
      } catch (error) {
        console.error('Share link generation failed:', error)
        return null
      }
    },

    async addToFavorite(item) {
      if (!this.items.some(favoriteItem => favoriteItem.id === item.id)) {
        this.items.push({
          id: item.id,
          productId: item.id, // Add this for consistency
          name: item.name,
          price: item.price,
          image: item.image || null
        })
      }
    },

    async removeFromFavorite(id) {
      this.items = this.items.filter(item => item.id !== id)
    },

    async toggleFavorite(item) {
      const exists = this.items.some(fav => fav.id === item.id)
      if (exists) {
        this.removeFromFavorite(item.id)
      } else {
        this.addToFavorite(item)
      }
    }
  },

  persist: {
    key: 'wishlist',
    paths: ['items', 'lastSync']
  }
})