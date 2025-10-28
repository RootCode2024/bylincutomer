import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// URL de base de l'API
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bylin-style.com'

// Création de l'instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔐 Cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/**
 * Rafraîchir le token CSRF
 */
export async function refreshCsrfToken() {
  try {
    await axios.get('/sanctum/csrf-cookie', {
      baseURL: BASE_URL,
      withCredentials: true,
      headers: { Accept: 'application/json' },
    })
    // Mettre à jour le header X-XSRF-TOKEN d'axios
    const token = document.cookie
      .split('; ')
      .find(c => c.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
    if (token) api.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
    return token
  } catch (err) {
    console.error('❌ Failed to refresh CSRF token:', err)
    throw err
  }
}

/**
 * Récupérer CSRF token depuis le cookie
 */
function getCsrfTokenFromCookie() {
  const token = document.cookie.split('; ').find(c => c.startsWith('XSRF-TOKEN='))?.split('=')[1]
  return token ? decodeURIComponent(token) : null
}

// ----- Intercepteur de requête -----
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated && config.method !== 'get') {
    const token = getCsrfTokenFromCookie()
    if (token) {
      config.headers['X-XSRF-TOKEN'] = token
    } else {
      console.warn('⚠️ No CSRF token found in cookies')
    }
  }
  return config
  },
  (error) => Promise.reject(error)
)

// ----- Intercepteur de réponse -----
api.interceptors.response.use(
  (response) => response.data, // Retourne directement response.data
  async (error) => {
    const { response, config } = error
    if (!response) {
      console.error('❌ Network error:', error.message)
      return Promise.reject(error)
    }

    // Erreur CSRF
    if (response.status === 419) {
      console.warn('🔄 CSRF Token mismatch, refreshing...')
      try {
        await refreshCsrfToken()
        // Réessayer la requête originale
        const retryConfig = { ...config, headers: { ...config.headers, 'X-XSRF-TOKEN': getCsrfTokenFromCookie() } }
        return api(retryConfig)
      } catch (csrfErr) {
        return Promise.reject(new Error('Unable to refresh CSRF token. Please refresh the page.'))
      }
    }

    // Erreur d'authentification
    if (response.status === 401) {
      try {
        const authStore = useAuthStore()
        authStore.cleanupAuthState()
      } catch (e) {
        console.warn('Auth store cleanup failed')
      }
    }

    return Promise.reject(error)
  }
)

export default api
