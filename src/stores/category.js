import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/axiosConfig'
import { API_ROUTES } from '@/utils/apiRoute'

export const useCategoryStore = defineStore('category', () => {
  // ----- STATE -----
  const categories = ref([])
  const subCategories = ref([])
  const currentCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ----- GETTERS -----
  const categoriesCount = computed(() => categories.value.length)
  const hasCategories = computed(() => categories.value.length > 0)
  const getCategoryById = (id) => categories.value.find(cat => cat.id === id)
  const mainCategories = computed(() => categories.value.filter(cat => !cat.parent_id))
  const getSubCategories = (parentId) => categories.value.filter(cat => cat.parent_id === parentId)

  // ----- ERROR HANDLER -----
  function handleApiError(err) {
    if (!err.response) return err.message || 'Erreur réseau'
    const { status, data } = err.response
    switch (status) {
      case 400: return data.message || 'Requête invalide'
      case 401: return data.message || 'Non authentifié'
      case 403: return 'Accès refusé'
      case 404: return 'Ressource introuvable'
      case 422: return data.errors ? Object.values(data.errors).flat().join(', ') : 'Validation échouée'
      case 429: return 'Trop de tentatives'
      case 500: return 'Erreur serveur'
      default: return data.message || `Erreur inconnue (${status})`
    }
  }

  // ----- ACTIONS -----
  async function index() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.products.navBarCategories)
      
      if (response.success) {
        categories.value = response.categories
        subCategories.value = response.sub_categories
      }
      console.log('Chargement des catégories:', response)
      return true
    } catch (err) {
      error.value = handleApiError(err)
      console.error('Erreur lors du chargement des catégories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function productsCategories() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.products.categories)
      
      console.log('Chargement des catégories:', response)
      return response
    } catch (err) {
      error.value = handleApiError(err)
      console.error('Erreur lors du chargement des catégories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function show(slug) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.products.category(slug))

      if(response.success) {
        return response
      }
    } catch (err) {
      error.value = handleApiError(err)
      console.error('Erreur lors du chargement de la catégorie:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ----- UTILITIES -----
  function buildCategoryTree() {
    const tree = []
    const map = new Map()
    categories.value.forEach(cat => map.set(cat.id, { ...cat, children: [] }))
    map.forEach(cat => {
      if (cat.parent_id) {
        const parent = map.get(cat.parent_id)
        if (parent) parent.children.push(cat)
      } else {
        tree.push(cat)
      }
    })
    return tree
  }

  function getCategoryPath(categoryId) {
    const path = []
    let currentId = categoryId
    while (currentId) {
      const cat = categories.value.find(c => c.id === currentId)
      if (!cat) break
      path.unshift(cat)
      currentId = cat.parent_id
    }
    return path
  }

  function clearError() { error.value = null }
  function clearCurrentCategory() { currentCategory.value = null }
  function setCategories(newCategories) { categories.value = newCategories }

  function $reset() {
    categories.value = []
    currentCategory.value = null
    loading.value = false
    error.value = null
  }

  return {
    categories, subCategories, currentCategory, loading, error,
    categoriesCount, hasCategories, getCategoryById, mainCategories, getSubCategories,
    index, show, productsCategories,
    buildCategoryTree, getCategoryPath, clearError, clearCurrentCategory, setCategories, $reset
  }
})
