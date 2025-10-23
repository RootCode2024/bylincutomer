// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { refreshCsrfToken } from '@/api/axiosConfig'
import { useCartStore } from './cart'
import { useWishlistStore } from './wishlist'
import { API_ROUTES } from '@/utils/apiRoute'

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
  function cleanupAuthState() {
    user.value = null
    roles.value = []
    permissions.value = []
    error.value = null
    initialized.value = false
  }

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

  async function initialize() {
    if (initialized.value) return
    initialized.value = true
    try {
      console.log('🔄 Initializing auth store...')
      await refreshCsrfToken()
      // await fetchUser()
      console.log('✅ Auth initialization complete')
    } catch {
      console.log('🔐 Auth initialization complete (user may not be authenticated)')
    }
  }

  // ----- AUTH -----
  async function login(credentials) {
    loading.value = true
    error.value = null
    const cartStore = useCartStore()
    try {
      await refreshCsrfToken()
      const response = await api.post(API_ROUTES.auth.login, credentials)
      user.value = response.user
      roles.value = response.roles || []
      permissions.value = response.permissions || []
      await cartStore.syncCartWithServer(false)
      return true
    } catch (err) {
      error.value = handleApiError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(API_ROUTES.auth.register, userData)
      if (!response?.otp_sent || !response?.user) throw new Error('Invalid server response')
      return response
    } catch (err) {
      error.value = handleApiError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function googleLogin() {
    loading.value = true
    error.value = null
    try {
      window.location.href = API_ROUTES.auth.googleRedirect
    } catch {
      error.value = 'Une erreur est survenue. Veuillez réessayer.'
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()
    try {
      if (cartStore.items.length > 0) await cartStore.syncCartWithServer(false)
      if (wishlistStore.items.length > 0) await wishlistStore.syncWithServer()
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

  async function fetchUser() {
    try {
      const response = await api.get(API_ROUTES.auth.me)
      if (response) {
        user.value = response.user
        roles.value = response.roles || []
        permissions.value = response.permissions || []
      }
    } catch (err) {
      if (err.response?.status !== 401) console.warn('Fetch user failed:', err.message)
      cleanupAuthState()
    }
  }

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

  // ----- OTP / Email / Password -----
  const verifyOtp = (data) => api.post(API_ROUTES.auth.verifyOtp, data)
  const resendOtp = (email) => api.post(API_ROUTES.auth.resendOtp, { email })
  const forgotPassword = (email) => api.post(API_ROUTES.auth.forgotPassword, { email })
  const resetPassword = (data) => api.post(API_ROUTES.auth.resetPassword, data)
  const verifyEmail = (id, hash, signature, expires) =>
    api.get(API_ROUTES.auth.verifyEmail(id, hash), { params: { signature, expires } })
  const resendVerificationEmail = () => api.post(API_ROUTES.auth.resendVerification)
  const changePassword = (data) => api.put(API_ROUTES.auth.changePassword, data)

  // ----- CART SYNC -----
  async function handleCartSync() {
    const cartStore = useCartStore()
    if (!user.value) return
    try {
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
    } catch (err) {
      if (err.response?.status !== 401) console.warn('Cart sync error:', err.message)
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
    verifyEmail, resendVerificationEmail, changePassword,
    handleCartSync, cleanupAuthState
  }
})
