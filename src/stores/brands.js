import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'   
import { useApiStore, API_ROUTES } from './api'

export const useBrandsStore = defineStore('brands', () => {
    // State
    const brands = ref([])
    const currentBrand = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const brandsCount = computed(() => brands.value.length)
    const hasBrands = computed(() => brands.value.length > 0)
    const getBrandById = computed(() => (id) => 
        brands.value.find(brand => brand.id === id)
    )

    // Get API URL
    const apiStore = useApiStore()
    const apiUrl = apiStore.apiUrl

    // Actions
    async function index() {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.get(`${apiUrl}${API_ROUTES.brands}`)
            brands.value = response.data
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement des marques'
            console.error('Erreur lors du chargement des marques:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function store(data) {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.post(`${apiUrl}${API_ROUTES.brands}`, data)
            
            // Ajouter la nouvelle marque à la liste
            brands.value.push(response.data)
            
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors de la création de la marque'
            console.error('Erreur lors de la création de la marque:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function update(id, data) {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.put(`${apiUrl}${API_ROUTES.brands}/${id}`, data)
            
            // Mettre à jour la marque dans la liste
            const index = brands.value.findIndex(brand => brand.id === id)
            if (index !== -1) {
                brands.value[index] = response.data
            }
            
            // Mettre à jour currentBrand si c'est celle qui est modifiée
            if (currentBrand.value?.id === id) {
                currentBrand.value = response.data
            }
            
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la marque'
            console.error('Erreur lors de la mise à jour de la marque:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function show(id) {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.get(`${apiUrl}${API_ROUTES.brands}/${id}`)
            currentBrand.value = response.data
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement de la marque'
            console.error('Erreur lors du chargement de la marque:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function destroy(id) {
        loading.value = true
        error.value = null
        
        try {
            await axios.delete(`${apiUrl}${API_ROUTES.brands}/${id}`)
            
            // Supprimer la marque de la liste
            const index = brands.value.findIndex(brand => brand.id === id)
            if (index !== -1) {
                brands.value.splice(index, 1)
            }
            
            // Nettoyer currentBrand si c'est celle qui est supprimée
            if (currentBrand.value?.id === id) {
                currentBrand.value = null
            }
            
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors de la suppression de la marque'
            console.error('Erreur lors de la suppression de la marque:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Méthodes utilitaires
    function clearError() {
        error.value = null
    }

    function clearCurrentBrand() {
        currentBrand.value = null
    }

    function setBrands(newBrands) {
        brands.value = newBrands
    }

    // Reset store
    function $reset() {
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
        index, 
        store, 
        update, 
        show, 
        destroy,
        
        // Utilities
        clearError,
        clearCurrentBrand,
        setBrands,
        $reset
    }
})