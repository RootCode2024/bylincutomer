import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from './api/axiosConfig'
import { API_ROUTES } from '@/utils/apiRoute'

export const useBrandStore = defineStore('brand', () => {
  // State
  const brands = ref([])
  const currentBrand = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const brandsCount = computed(() => brands.value.length)
  const hasBrands = computed(() => brands.value.length > 0)
  const getBrandById = (id) => computed(() => brands.value.find(brand => brand.id === id))

  // Helper pour gérer les requêtes
  async function request(callback, errorMessage) {
    loading.value = true
    error.value = null
    try {
      const response = await callback()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || errorMessage
      console.error(errorMessage, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions
  const fetchBrands = () => request(
    () => api.get(API_ROUTES.products.brands),
    'Erreur lors du chargement des marques'
  ).then(data => {
    brands.value = data
    return data
  })

  const fetchBrand = (id) => request(
    () => api.get(`${API_ROUTES.products.brands}/${id}`),
    'Erreur lors du chargement de la marque'
  ).then(data => {
    currentBrand.value = data
    return data
  })

  const createBrand = (brandData) => request(
    () => api.post(API_ROUTES.products.brands, brandData),
    'Erreur lors de la création de la marque'
  ).then(data => {
    brands.value.push(data)
    return data
  })

  const updateBrand = (id, brandData) => request(
    () => api.put(`${API_ROUTES.products.brands}/${id}`, brandData),
    'Erreur lors de la mise à jour de la marque'
  ).then(data => {
    const index = brands.value.findIndex(b => b.id === id)
    if (index !== -1) brands.value[index] = data
    if (currentBrand.value?.id === id) currentBrand.value = data
    return data
  })

  const deleteBrand = (id) => request(
    () => api.delete(`${API_ROUTES.products.brands}/${id}`),
    'Erreur lors de la suppression de la marque'
  ).then(() => {
    brands.value = brands.value.filter(b => b.id !== id)
    if (currentBrand.value?.id === id) currentBrand.value = null
    return true
  })

  // Utilities
  const clearError = () => { error.value = null }
  const clearCurrentBrand = () => { currentBrand.value = null }
  const setBrands = (newBrands) => { brands.value = newBrands }

  const $reset = () => {
    brands.value = []
    currentBrand.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    brands,
    currentBrand,
    loading,
    error,
    
    // Getters
    brandsCount,
    hasBrands,
    getBrandById,
    
    // Actions
    index: fetchBrands,
    show: fetchBrand,
    store: createBrand,
    update: updateBrand,
    destroy: deleteBrand,
    
    // Utilities
    clearError,
    clearCurrentBrand,
    setBrands,
    $reset
  }
})