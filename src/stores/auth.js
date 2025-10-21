import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axiosConfig'
import { useCartStore } from './cart'
import { useWishlistStore } from './wishlist'
import { API_ROUTES } from '@/utils/apiRoute'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // ----- STATE -----
  const user = ref(null)
  const roles = ref([])
  const permissions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  // ----- GETTERS -----
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || 'Utilisateur')
  const userEmail = computed(() => user.value?.email || '')
  const isEmailVerified = computed(() => !!user.value?.email_verified_at)

  // ----- ACTIONS -----

  // Initialisation store au refresh de page
  async function initialize() {
    if (initialized.value) {
      console.log('🔐 Store already initialized')
      return
    }
    
    try {
      console.log('🔄 Initializing auth store...')
      initialized.value = true

      // Obtenir le CSRF token d'abord
      await getCsrfToken()
      
      // Essayer de récupérer l'utilisateur
      await fetchUser()
      
      console.log('✅ Auth initialization complete')
    } catch (error) {
      console.log('🔐 Auth initialization complete (user may not be authenticated)')
    }
  }

  
  function getCsrfTokenFromCookies() {
    const cookies = document.cookie.split('; ')
    const xsrfToken = cookies.find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
    return xsrfToken ? decodeURIComponent(xsrfToken) : null
  }

  // Obtenir le CSRF token
  // Obtenir le CSRF token du serveur - VERSION CORRIGÉE
  async function getCsrfToken() {
    try {
      console.log('🔄 Getting CSRF token...')

      debugCsrf()
      
      // Utiliser fetch directement pour éviter les problèmes d'intercepteur
      const response = await fetch('https://api.bylin-style.com/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      })
      
      console.log('✅ CSRF response status:', response.status, response.ok)
      
      if (!response.ok) {
        throw new Error(`CSRF request failed: ${response.status}`)
      }

      debugCsrf()
      
      // Vérifier le token dans les cookies
      const token = getCsrfTokenFromCookies()
      console.log('📋 CSRF token in cookies:', !!token)
      
      if (token) {
        // Mettre à jour le header par défaut d'axios
        api.defaults.headers.common['X-XSRF-TOKEN'] = token
        console.log('🔑 CSRF token length:', token.length)
      } else {
        console.warn('⚠️ CSRF token not found in cookies after request')
      }
      
      return token
    } catch (error) {
      console.error('❌ Failed to get CSRF token:', error)
      throw error
    }
  }

  // Dans votre composant Login ou dans la console
  async function debugCsrf() {
    console.log('🔍 Debug CSRF Token:')
    console.log('Cookies:', document.cookie)
    
    // Vérifier le token CSRF
    const csrfToken = decodeURIComponent(document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1] || '')
    
    console.log('CSRF Token present:', csrfToken.length > 0)
    console.log('CSRF Token length:', csrfToken.length)
    console.log('CSRF Token (first 50 chars):', csrfToken.substring(0, 50) + '...')
    
    // Tester une requête simple
    try {
      const test = await fetch('https://api.bylin-style.com/api/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include'
      })
      console.log('CSRF endpoint status:', test.status)
    } catch (e) {
      console.error('CSRF test failed:', e)
    }
  }

  // Login
  async function login(credentials) {
    loading.value = true
    error.value = null
    const cartStore = useCartStore()
    try {
      console.log('🔐 Attempting login...')
      
      // S'assurer d'avoir un CSRF token frais
      await getCsrfToken()

      const response = await api.post(API_ROUTES.auth.login, credentials)
      
      if (response) {
        user.value = response.user
        roles.value = response.roles || []
        permissions.value = response.permissions || []
        
        console.log('✅ Login successful')
        
        await new Promise(resolve => setTimeout(resolve, 500))

        // Synchroniser le panier
        await cartStore.syncCartWithServer(false)
      
        return true
      }
    } catch (err) {
      error.value = handleApiError(err)
      console.error('❌ Login failed:', error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

      /**
     * Register new user
    */
    async function register(userData) {
      loading.value = true
      error.value = null

      try {
        const response = await api.post(API_ROUTES.auth.register, userData)
        console.log(response)
        if (!response?.otp_sent || !response?.user) {
          throw new Error('Invalid server response')
        }

        return response
      } catch (error) {
        error.value = handleApiError(error)
        console.error('Registration error:', error)
        throw error
      } finally {
        loading.value = false
      }
    }

  async function googleLogin() {
    loading.value = true
    error.value = null
    try {
      window.location.href = API_ROUTES.auth.googleRedirect
    } catch (e) {
      error.value = 'Une erreur est survenue. Veuillez réessayer.'
      loading.value = false
    }
  }

  // Logout
  async function logout() {
    loading.value = true
    error.value = null
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()
    try {
      // Synchroniser le panier avant logout
      if (cartStore.items.length > 0) {
        await cartStore.syncCartWithServer(false)
      }
      if (wishlistStore.items.length > 0) {
        await wishlistStore.syncWithServer()
      }


      wishlistStore.items = []

      await api.post(API_ROUTES.auth.logout)
    } catch (err) {
      console.warn('Logout error:', err)
    } finally {
      cleanupAuthState()
      loading.value = false
      window.location.href = '/'
    }
  }

  // Charger l'utilisateur actuel
  async function fetchUser() {
    try {
      console.log('👤 Fetching user...')
      // const response = await api.get(API_ROUTES.auth.me)
      const response = await axios.get('https://api.bylin-style.com/api/customer/auth/me', { withCredentials: true })

      console.log(response)
      
      if (response.data) {
        user.value = response.data.user
        roles.value = response.data.roles || []
        permissions.value = response.data.permissions || []
        console.log('✅ User fetched successfully')
      }
    } catch (err) {
      console.log(err)
      // 401 est normal si l'utilisateur n'est pas connecté
      if (err.response?.status !== 401) {
        console.warn('Fetch user failed:', err.response?.status, err.message)
      }
      user.value = null
      roles.value = []
      permissions.value = []
    }
  }

  // Mise à jour du profil
  async function updateProfile(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(API_ROUTES.auth.updateProfile, userData)
      user.value = { ...user.value, ...response.data }
      return response.data
    } catch (err) {
      error.value = handleApiError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- OTP, email verification, password reset ---
  async function verifyOtp(data) {
    try { 
      return await api.post(API_ROUTES.auth.verifyOtp, data)
    } catch (err) { 
      console.error('❌ Erreur verifyOtp:', err)
      throw err
    }
  }

  async function resendOtp(email) { 
    return api.post(API_ROUTES.auth.resendOtp, { email }) 
  }

  async function forgotPassword(email) { 
    return api.post(API_ROUTES.auth.forgotPassword, { email }) 
  }

  async function resetPassword(data) { 
    return api.post(API_ROUTES.auth.resetPassword, data) 
  }

  async function verifyEmail(id, hash, signature, expires) {
    return api.get(API_ROUTES.auth.verifyEmail(id, hash), { params: { signature, expires } })
  }

  async function resendVerificationEmail() { 
    return api.post(API_ROUTES.auth.resendVerification) 
  }

  async function changePassword(data) { 
    return api.put(API_ROUTES.auth.changePassword, data) 
  }

  // Synchronisation du panier
  async function handleCartSync() {
    const cartStore = useCartStore()
    try {
      if (!user.value) {
        console.log('User not authenticated, skipping cart sync')
        return
      }

      const response = await api.get(API_ROUTES.cart.check)
      
      if (response.data?.has_cart) {
        if (cartStore.items.length > 0) {
          await api.delete('/cart')
          await cartStore.syncCartWithServer(false)
        } else {
          await cartStore.loadCartFromServer()
        }
      } else if (cartStore.items.length > 0) {
        await cartStore.syncCartWithServer(false)
      }
      
      console.log('✅ Cart sync completed')
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('🔐 Cart sync skipped - user not authenticated')
      } else {
        console.warn('Cart sync error:', err.message)
      }
    }
  }

  // Nettoyage du store
  function cleanupAuthState() {
    user.value = null
    roles.value = []
    permissions.value = []
    error.value = null
    initialized.value = false
  }

  // Gestion erreurs API
  function handleApiError(err) {
    if (!err.response) return err.message || 'Erreur réseau'
    const { status, data } = err.response
    switch(status) {
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

  return {
    // state
    user, roles, permissions, loading, error, initialized,
    // getters
    isAuthenticated, userName, userEmail, isEmailVerified,
    // actions
    initialize, login, register, googleLogin, logout, fetchUser, updateProfile,
    verifyOtp, resendOtp, forgotPassword, resetPassword,
    verifyEmail, resendVerificationEmail, changePassword, debugCsrf,
    handleCartSync, cleanupAuthState
  }
})