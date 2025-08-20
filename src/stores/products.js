import { defineStore } from 'pinia'
import axios from 'axios'
import { useApiStore } from './api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    apiUrl: useApiStore().apiUrl
  }),

  getters: {
    allProducts: (state) => state.products,
    singleProduct: (state) => state.product,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  },

  actions: {
    // 🔄 Récupérer tous les produits
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`${this.apiUrl}/products`)
        this.products = response.data
      } catch (error) {
        this.error = this.handleError(error)
      } finally {
        this.loading = false
      }
    },

    // 🔍 Récupérer un produit par ID
    async fetchProduct(id) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`${this.apiUrl}/products/${id}`)
        this.product = response.data
      } catch (error) {
        this.error = this.handleError(error)
      } finally {
        this.loading = false
      }
    },

    // ➕ Ajouter un produit
    async createProduct(data) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${this.apiUrl}/products`, data)
        this.products.push(response.data)
        return response.data
      } catch (error) {
        this.error = this.handleError(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ✏️ Mettre à jour un produit
    async updateProduct(id, data) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.put(`${this.apiUrl}/products/${id}`, data)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = this.handleError(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ❌ Supprimer un produit
    async deleteProduct(id) {
      this.loading = true
      this.error = null

      try {
        await axios.delete(`${this.apiUrl}/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        this.error = this.handleError(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 🧹 Nettoyer l’état d’un produit
    clearProduct() {
      this.product = null
    },

    // ⚠️ Gestion centralisée des erreurs
    handleError(error) {
      if (error.response?.data?.message) {
        return error.response.data.message
      } else if (error.message) {
        return error.message
      }
      return 'Une erreur inconnue est survenue'
    }
  }
})
