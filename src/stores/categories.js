import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'   
import { useApiStore, API_ROUTES } from './api'

export const useCategoriesStore = defineStore('categories', () => {
    // State
    const categories = ref([])
    const currentCategory = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const categoriesCount = computed(() => categories.value.length)
    const hasCategories = computed(() => categories.value.length > 0)
    const getCategoryById = computed(() => (id) => 
        categories.value.find(category => category.id === id)
    )
    
    // Getter pour les catégories principales (sans parent)
    const mainCategories = computed(() => 
        categories.value.filter(category => !category.parent_id)
    )
    
    // Getter pour les sous-catégories d'une catégorie donnée
    const getSubCategories = computed(() => (parentId) => 
        categories.value.filter(category => category.parent_id === parentId)
    )

    // Get API URL
    const apiStore = useApiStore()
    const apiUrl = apiStore.apiUrl

    // Actions
    async function index() {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.get(`${apiUrl}${API_ROUTES.categories}`)
            categories.value = response.data
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement des catégories'
            console.error('Erreur lors du chargement des catégories:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function store(data) {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.post(`${apiUrl}${API_ROUTES.categories}`, data)
            
            // Ajouter la nouvelle catégorie à la liste
            categories.value.push(response.data)
            
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors de la création de la catégorie'
            console.error('Erreur lors de la création de la catégorie:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function update(id, data) {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.put(`${apiUrl}${API_ROUTES.categories}/${id}`, data)
            
            // Mettre à jour la catégorie dans la liste
            const index = categories.value.findIndex(category => category.id === id)
            if (index !== -1) {
                categories.value[index] = response.data
            }
            
            // Mettre à jour currentCategory si c'est celle qui est modifiée
            if (currentCategory.value?.id === id) {
                currentCategory.value = response.data
            }
            
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie'
            console.error('Erreur lors de la mise à jour de la catégorie:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function show(id) {
        loading.value = true
        error.value = null
        
        try {
            const response = await axios.get(`${apiUrl}${API_ROUTES.categories}/${id}`)
            currentCategory.value = response.data
            return response.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement de la catégorie'
            console.error('Erreur lors du chargement de la catégorie:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function destroy(id) {
        loading.value = true
        error.value = null
        
        try {
            await axios.delete(`${apiUrl}${API_ROUTES.categories}/${id}`)
            
            // Supprimer la catégorie de la liste
            const index = categories.value.findIndex(category => category.id === id)
            if (index !== -1) {
                categories.value.splice(index, 1)
            }
            
            // Nettoyer currentCategory si c'est celle qui est supprimée
            if (currentCategory.value?.id === id) {
                currentCategory.value = null
            }
            
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur lors de la suppression de la catégorie'
            console.error('Erreur lors de la suppression de la catégorie:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Méthodes utilitaires spécifiques aux catégories
    function buildCategoryTree() {
        const tree = []
        const categoryMap = new Map()
        
        // Créer une map de toutes les catégories
        categories.value.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] })
        })
        
        // Construire l'arbre
        categoryMap.forEach(category => {
            if (category.parent_id) {
                const parent = categoryMap.get(category.parent_id)
                if (parent) {
                    parent.children.push(category)
                }
            } else {
                tree.push(category)
            }
        })
        
        return tree
    }

    function getCategoryPath(categoryId) {
        const path = []
        let currentId = categoryId
        
        while (currentId) {
            const category = categories.value.find(cat => cat.id === currentId)
            if (category) {
                path.unshift(category)
                currentId = category.parent_id
            } else {
                break
            }
        }
        
        return path
    }

    // Méthodes utilitaires générales
    function clearError() {
        error.value = null
    }

    function clearCurrentCategory() {
        currentCategory.value = null
    }

    function setCategories(newCategories) {
        categories.value = newCategories
    }

    // Reset store
    function $reset() {
        categories.value = []
        currentCategory.value = null
        loading.value = false
        error.value = null
    }

    return { 
        // State
        categories, 
        currentCategory, 
        loading, 
        error,
        
        // Getters
        categoriesCount,
        hasCategories,
        getCategoryById,
        mainCategories,
        getSubCategories,
        
        // Actions
        index, 
        store, 
        update, 
        show, 
        destroy,
        
        // Utilities
        buildCategoryTree,
        getCategoryPath,
        clearError,
        clearCurrentCategory,
        setCategories,
        $reset
    }
})