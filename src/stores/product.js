import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axiosConfig'
import { API_ROUTES } from '@/utils/apiRoute'

export const useProductStore = defineStore('product', () => {
  // ----- STATE -----
  const products = ref([])
  const collections = ref([])
  const colors = ref([])
  const sizes = ref([])
  const brands = ref([])
  const product = ref(null)
  const collection = ref(null)
  const reviews = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ----- GETTERS -----
  const allProducts = computed(() => products.value.data)
  const allCollections = computed(() => collections.value.data)
  const allColors = computed(() => colors.value)
  const allSizes = computed(() => sizes.value)
  const allBrands = computed(() => brands.value)
  const singleProduct = computed(() => product.value)
  const singleCollection = computed(() => collection.value)
  const allReviews = computed(() => reviews.value.data)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // ----- ACTIONS -----

  // 🔄 Récupérer tous les produits
  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.products.base)
      
      products.value = response.products
      colors.value = response.colors
      sizes.value = response.sizes
      brands.value = response.brands
    } catch (err) {
      error.value = handleError(err)
    } finally {
      loading.value = false
    }
  }

// 🔍 Récupérer un produit
async function fetchProduct(slug) {
  loading.value = true
  error.value = null
  try {
    console.log('Fetching product with slug:', slug)
    
    // Always fetch from API for product details page
    const response = await api.get(API_ROUTES.products.single(slug))
    console.log('Product fetched successfullyA:', response)
    
    // Handle different response structures
    if (response.product) {
      product.value = response.product
      reviews.value = response.reviews
    }
    
    console.log('Product fetched successfully:', product.value)
    console.log('Product images:', product.value.images)
    
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = handleError(err)
  } finally {
    loading.value = false
  }
}

  // 🔄 Récupérer tous les produits
  async function fetchCollections(params) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.collections.base, params)
      if (response?.success) {
      collections.value = response
      }

      return response
    } catch (err) {
      error.value = handleError(err)
    } finally {
      loading.value = false
    }
  }

// 🔍 Récupérer un produit
async function fetchCollection(slug) {
  loading.value = true
  error.value = null
  try {
    console.log('Fetching collection with slug:', slug)
    
    // Always fetch from API for product details page
    const response = await api.get(API_ROUTES.collections.single(slug))
    console.log('collection fetched successfully:', response)
    
    // Handle different response structures
    if (response.success) {
      collection.value = response.data
    }
    
    console.log('collection fetched successfully:', collection.value)

    return true
    
  } catch (err) {
    console.error('Error fetching collection:', err)
    error.value = handleError(err)
  } finally {
    loading.value = false
  }
}



  // 🧹 Nettoyer l’état
  function clearProduct() {
    product.value = null
  }

  // ⚠️ Gestion centralisée des erreurs
  function handleError(err) {
    if (!err.response) return err.message || 'Erreur réseau'
    const { status, data } = err.response
    switch (status) {
      case 400: return data.message || 'Requête invalide'
      case 401: return data.message || 'Non authentifié'
      case 403: return 'Accès refusé'
      case 404: return 'Produit introuvable'
      case 422: return data.errors ? Object.values(data.errors).flat().join(', ') : 'Validation échouée'
      case 500: return 'Erreur serveur'
      default: return data.message || `Erreur inconnue (${status})`
    }
  }

  return {
    // state
    products, product, collections, collection, colors, sizes, brands, reviews, loading, error,
    // getters
    allProducts, allReviews, allColors, allSizes, allBrands, singleProduct, allCollections, singleCollection, isLoading, hasError,
    // actions
    fetchProducts, fetchProduct, fetchCollections, fetchCollection, clearProduct
  }
})
