import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axiosConfig'
import { API_ROUTES } from '@/utils/apiRoute'

export const useUIStore = defineStore('ui', () => {
  // ----- STATE -----
  const sidebarCollapsed = ref(false)
  const isMobileSidebarOpen = ref(false)
  const countries = ref([])
  const loading = ref(false)
  const error = ref(null)
  const cities = ref([])
  const districts = ref([])
  const deliveryOptions = ref([])

  // ----- GETTERS -----
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)
  const isMobileSidebarVisible = computed(() => isMobileSidebarOpen.value)
  const allCountries = computed(() => countries.value)

  // ----- ACTIONS -----

  // 🧭 Gestion de la sidebar
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false
  }

  const getCountries = async () => {
    try {
      loading.value = true
      const response = await api.get('/api/countries')
      countries.value = response.data
      return countries.value
    } catch (err) {
      console.error('Erreur lors du chargement des pays:', err)
      error.value = handleError(err)
      countries.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const getCountry = (code) => {
    if (!code) return ''
    const found = countries.value.find(c => c.code === code)
    return found ? found.name : code
  }

  const getCitiesByCountry = async (countryCode) => {
    if (!countryCode) return []
    try {
      loading.value = true
      const response = await api.get(API_ROUTES.location.cities(countryCode))
      cities.value = response?.cities || response.data || []
      return cities.value
    } catch (err) {
      console.error(`Erreur lors du chargement des villes pour ${countryCode}:`, err)
      error.value = handleError(err)
      cities.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const getDistrictsByCity = async (cityCode) => {
    if (!cityCode) return []
    try {
      loading.value = true
      const response = await api.get(API_ROUTES.location.districts(cityCode))
      districts.value = response?.districts || response.data || []
      return districts.value
    } catch (err) {
      console.error(`Erreur lors du chargement des districts pour ${cityCode}:`, err)
      error.value = handleError(err)
      districts.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const getDeliveryOptions = async (params) => {
    try {
      loading.value = true;
      error.value = null;

      const payload = {
        city: params[0],
        district: params[1],
      };

      // Validation des paramètres
      if (!payload.city) {
        throw new Error('La ville est requise');
      }

      console.log('🔄 Chargement des options de livraison:', payload);
      
      const response = await api.post(API_ROUTES.location.deliveryOptions, payload);
      
      // Gestion robuste de la réponse
      if (!response.success) {
        throw new Error(responseData.message || 'Erreur lors du chargement des options');
      }
      const responseData = response.options;

      deliveryOptions.value = responseData || [];
      
      console.log('✅ Options de livraison chargées:', deliveryOptions.value);
      return deliveryOptions.value;
    } catch (err) {
      console.error('❌ Erreur lors du chargement des options de livraison:', err);
      
      // Gestion d'erreur améliorée
      if (err.response?.status === 500) {
        error.value = 'Service temporairement indisponible. Veuillez réessayer.';
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message;
      } else if (err.message) {
        error.value = err.message;
      } else {
        error.value = 'Impossible de charger les options de livraison';
      }
      
      deliveryOptions.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  }

  const getHomePageDatas = async () => {
    try {
      loading.value = true
      const response = await api.get(API_ROUTES.pages.homepage)
      return response.data
    } catch (err) {
      console.error('Erreur lors du chargement des infos de la page d\'accueil :', err)
      error.value = handleError(err)
      return null
    } finally {
      loading.value = false
    }
  }

  // ⚠️ Gestion centralisée des erreurs
  function handleError(err) {
    if (!err.response) return err.message || 'Erreur réseau'
    const { status, data } = err.response
    switch (status) {
      case 400: return data.message || 'Requête invalide'
      case 404: return 'Ressource introuvable'
      case 500: return 'Erreur serveur'
      default: return data.message || `Erreur inconnue (${status})`
    }
  }

  return {
    // state
    sidebarCollapsed,
    isMobileSidebarOpen,
    countries,
    loading,
    error,
    cities,
    districts,
    deliveryOptions,

    // getters
    isSidebarCollapsed,
    isMobileSidebarVisible,
    allCountries,

    // actions
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    getCountries,
    getCountry,
    getCitiesByCountry,
    getDistrictsByCity,
    getDeliveryOptions,
    getHomePageDatas,
    handleError
  }
})