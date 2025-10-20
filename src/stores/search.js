import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axiosConfig'

export const useSearchStore = defineStore('search', () => {
  const searchResults = ref([])
  const trendingSearches = ref([])
  const searchSuggestions = ref([])
  const recentSearches = ref(JSON.parse(localStorage.getItem('recentSearches')) || [])
  const isLoading = ref(false)
  const error = ref(null)

  // Recherche de produits
  const searchProducts = async (query, filters = {}) => {
    if (!query?.trim()) {
      searchResults.value = []
      return
    }

    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/search/products', {
        params: {
          q: query.trim(),
          ...filters
        }
      })
      
      searchResults.value = response.data || []
      return response.data
    } catch (err) {
      error.value = err.response?.error || 'Erreur lors de la recherche'
      searchResults.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Suggestions de recherche
  const getSearchSuggestions = async (query) => {
    if (!query?.trim()) {
      searchSuggestions.value = []
      return
    }

    try {
      const response = await api.get('/api/search/suggestions', {
        params: { q: query.trim() }
      })
      
      searchSuggestions.value = response.data || []
    } catch (err) {
      console.error('Erreur suggestions:', err)
      searchSuggestions.value = []
    }
  }

  // Recherches tendances
  const fetchTrendingSearches = async () => {
    try {
      const response = await api.get('/api/search/trending')
      trendingSearches.value = response.data || []
    } catch (err) {
      console.error('Erreur tendances:', err)
      trendingSearches.value = []
    }
  }

  // Gestion des recherches récentes
  const addToRecentSearches = (query) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    // Éviter les doublons
    recentSearches.value = recentSearches.value
      .filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())
      .slice(0, 4) // Garder 4 éléments pour en avoir 5 au total
      
    recentSearches.value.unshift(trimmedQuery)
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }

  const removeRecentSearch = (index) => {
    recentSearches.value.splice(index, 1)
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }

  const clearRecentSearches = () => {
    recentSearches.value = []
    localStorage.setItem('recentSearches', JSON.stringify([]))
  }

  // Reset search state
  const resetSearch = () => {
    searchResults.value = []
    searchSuggestions.value = []
    error.value = null
  }

  return {
    // State
    searchResults,
    trendingSearches,
    searchSuggestions,
    recentSearches,
    isLoading,
    error,
    
    // Actions
    searchProducts,
    getSearchSuggestions,
    fetchTrendingSearches,
    addToRecentSearches,
    removeRecentSearch,
    clearRecentSearches,
    resetSearch
  }
})