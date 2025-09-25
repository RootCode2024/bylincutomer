import { defineStore } from 'pinia'
import axios from 'axios'
import { useApiStore } from '@/stores/api'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { API_ROUTES } from '@/utils/apiRoute'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const apiStore = useApiStore()
  const userStore = useUserStore()

  const apiUrl = apiStore.apiUrl

  // State
  const initialized = ref(false)
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('auth_user')) || null)
  const sharedCartCount = ref(0)
  const roles = ref(JSON.parse(localStorage.getItem('roles')) || [])
  const permissions = ref(JSON.parse(localStorage.getItem('permissions')) || [])
  const returnUrl = ref(null)
  const error = ref(null)
  const loading = ref(false)


  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => { return user.value?.name || 'Utilisateur' })
  const userEmail = computed(() => { return user.value?.email || 'example@email.com' })
  const isEmailVerified = computed(() => { return user.value?.email_verified_at })

    /**
     * Enhanced login with token refresh handling
    */
    async function login(credentials) {
      return withLoading(async () => {
        try {
          
          const response = await axios.post(`${apiUrl}${API_ROUTES.auth.login}`, credentials);
          
          if (!response) {
            throw new Error('Réponse d\'authentification invalide');
          }
          console.log('Login response:', response.data.token);
          console.log(typeof(response.data.token));

          // Stockez les données d'authentification
          // token.value = response.data.token,
          setAuthData(
            response.data.token,
            response.data.user,
            response.data.roles,
            response.data.permissions
          );

          // Attendre que le token soit bien enregistré
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Charger les données utilisateur
          await handleCartSync();
          
          return response;
        } catch (error) {
          console.error('Login error:', error);
          throw error; // Important pour que le composant puisse gérer l'erreur
        }
      });
    }

    /**
     * Set complete auth data
    */
    function setAuthData(authToken, authUser, rolesData = null, permissionsData = null) {
      if (!authToken) {
        throw new Error('Invalid token format');
      }

      if (!authUser || typeof authUser !== 'object' || !authUser.id) {
        throw new Error('User data must be a valid user object');
      }

      // 1. Mise à jour du state
      token.value = authToken; // This updates the ref value
      user.value = authUser;

      // 2. Persistance locale
      try {
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        localStorage.setItem('roles', JSON.stringify(rolesData));
        localStorage.setItem('permissions', JSON.stringify(permissionsData));
      } catch (e) {
        console.error('LocalStorage error:', e);
      }

      // 3. Configuration Axios
      setAuthToken(authToken); // Pass the raw token string
    }

    // Keep only this version of setAuthToken
    function setAuthToken(tokenValue) {
      try {
        if (tokenValue) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Failed to set auth header:', error);
      }
    }

    // Helper pour Axios
    // function setAuthToken(token) {
    //   // console.log('Auth TOKEN dans setAuthToken :', token)
    //   try {
    //     if (token) {
    //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //     } else {
    //       delete axios.defaults.headers.common['Authorization']
    //     }
    //   } catch (error) {
    //     console.error('Failed to set auth header:', error);
    //   }
    // }

    /**
     * Enhanced logout with cleanup
     */
    // async function logout() {
    //   try {
        
    //     if (token.value) {
    //       await axios.post(`${apiUrl}${API_ROUTES.auth.logout}`, null, {
    //         headers: { Authorization: `Bearer ${token.value}` }
    //       })
    //     }
    //   } catch (error) {
    //     console.warn('Logout API error:', error)
    //   } finally {
    //     cleanupAuthState()
    //   }
    // }

    /**
     * Complete auth state cleanup
    */
    function cleanupAuthState() {
      user.value = null
      token.value = null
      roles.value = null
      permissions.value = null
      error.value = null
      loading.value = false
      initialized.value = false

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('roles')
      localStorage.removeItem('permissions')

      delete axios.defaults.headers.common['Authorization']
    }

    /**
     * Verify token validity with server
    */
    async function verifyToken() {
      if (!token.value) return false;

      try {
        const response = await axios.get(`${apiUrl}${API_ROUTES.auth.verifyToken}`, {
          headers: { Authorization: `Bearer ${token.value}` },
          timeout: 10000
        });

        return false;
      } catch (error) {
        console.warn('Token verification failed (will attempt refresh):', error.message);
        return false; // Laisser une chance au refresh
      }
    }

    /**
     * Register new user
    */
    async function register(userData) {
      loading.value = true
      error.value = null

      try {
        const response = await axios.post(`${apiUrl}${API_ROUTES.auth.register}`, userData)
        console.log(response)
        if (!response?.data.otp_sent || !response?.data.user) {
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

    /**
     * 
     * @param {*} otpData 
     * @returns 
     */
    async function verifyOtp(otpData) {
      loading.value = true
      error.value = null
      try {
        const response = await axios.post(`${apiUrl}${API_ROUTES.auth.verifyOtp}`, otpData)
        console.log(response)
        if (response.status === 'error') {
          throw new Error('Invalid server response')
        }
        return response
      } catch (error) {
        error.value = handleApiError(error)
        console.error('OTP Verification error:', error)
        throw error
      } finally { 
        loading.value = false
      }
    }

    /**
     * Resend OTP to user
     */
    async function resendOtp(email) {
      loading.value = true
      error.value = null
      try {
        const response = await axios.post(`${apiUrl}${API_ROUTES.auth.resendOtp}`, { email })
        return response.data
      } catch (err) {
        error.value = handleApiError(err)
        throw err
      } finally {
        loading.value = false
      }
    }

    /**
     * Fetch current user data
    */
    async function fetchUser() {
      try {
        const response = await axios.get(`${apiUrl}${API_ROUTES.auth.me}`, {
            headers: { Authorization: `Bearer ${token.value}` }
          })
        
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid API response structure');
        }
        console.log('resultat Fetch user : ', response)

        // Normalisation des données reçues
        return response;

      } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error; // Propagation pour gestion centralisée
      }
    }

    /**
     * Handle password reset request
    */
    async function forgotPassword(email) {
      return withLoading(async function () {
        const response = await axios.post(`${apiUrl}${API_ROUTES.auth.forgotPassword}`, { email })
        return response.data
      })
    }

    /**
     * Reset password with token
    */
    async function resetPassword(data) {
      return withLoading(async function () {
        const response = await axios.post(`${apiUrl}${API_ROUTES.auth.resetPassword}`, data)
        return response.data
      })
    }

    /**
     * Verify email address
    */
    async function verifyEmail(id, hash, signature, expires) {
      return withLoading(async function () {
        const response = await axios.get(`${apiUrl}${API_ROUTES.auth.verifyEmail(id, hash)}`, {
          params: { signature, expires }
        })

        if (user.value) {
          user.value.email_verified_at = new Date().toISOString()
        }

        return response.data
      })
    }

    /**
     * Resend verification email
    */
    async function resendVerificationEmail() {
      return withLoading(async function () {
        const response = await axios.post(`${apiUrl}${API_ROUTES.auth.resendVerification}`)
        return response.data
      })
    }

    /**
     * Update user profile
    */
    async function updateProfile(userData) {
      return withLoading(async function () {
        const response = await axios.put(`${apiUrl}${API_ROUTES.auth.updateProfile}`, userData)
        user.value = { ...user.value, ...response.data }
        return response.data
      })
    }

    /**
     * Change user password
    */
    async function changePassword(passwordData) {
      return withLoading(async function () {
        const response = await axios.put(`${apiUrl}${API_ROUTES.auth.changePassword}`, passwordData)
        return response.data
      })
    }

    /**
     * Helper to wrap actions with loading/error handling
    */
    async function withLoading(action) {
      loading.value = true
      error.value = null

      try {
        return await action()
      } catch (error) {
        error.value = handleApiError(error)
        throw error
      } finally {
        loading.value = false
      }
    }

    /**
     * Set auth token in axios and store
    */
    // function setAuthToken(token) {
    //   token.value = token
    //   if (token) {
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //     localStorage.setItem('auth_token', token)
    //   } else {
    //     token.value = null
    //     delete axios.defaults.headers.common['Authorization']
    //     localStorage.removeItem('auth_token')
    //   }
    // }

    /**
     * Set return URL
    */
    function setReturnUrl (url) {
      returnUrl.value = url
    }

    /**
     * Handle cart synchronization after login
    */
    async function handleCartSync() {
      const cartStore = useCartStore()

      try {
        const response = await axios.get(`${apiUrl}/cart/check`)
        // const cartFromServer = response

        console.log('Le checkage de cart : ', response)

        if (response.data.data.has_cart) {
          if (cartStore.items.length > 0) {
            console.log('Cart already exists en local, syncing...')
            await axios.delete(`${apiUrl}/cart`)
            console.log('Cart server deleted...')
            await cartStore.syncCartWithServer(false)
            console.log('nouvelle Cart local syncroniser avec le server...')
          } else {
            console.log('Cart is empty, loading from server...')
            await cartStore.loadCartFromServer()
          }
        } else if (cartStore.items.length > 0) {
          await cartStore.syncCartWithServer(false)
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.warn('Cart sync error:', error)
        }
      }
    }

    /**
     * Handle API errors consistently
    */
    function handleApiError(error) {
      if (!error.response) {
        return error.request 
          ? 'Network error. Please check your internet connection'
          : error.message || 'An unexpected error occurred'
      }

      const { status, data } = error.response

      switch (status) {
        case 400: return data.message || 'Bad request'
        case 401: return 'Invalid credentials'
        case 403: return 'Unauthorized access'
        case 404: return 'Resource not found'
        case 422: 
          return data.errors 
            ? Object.values(data.errors).flat().join(', ')
            : data.message || 'Validation failed'
        case 429: return 'Too many attempts. Please try again later'
        case 500: return 'Server error. Please try again later'
        default: return data.message || `An error occurred (${status})`
      }
    }

    /**
     * Clear current error
    */
    function clearError() {
      error.value = null
    }

  // Initialisation
  if (token.value) {
    // On charge d'abord les données en cache
    user.value = JSON.parse(localStorage.getItem('auth_user')) || null;
    roles.value = JSON.parse(localStorage.getItem('roles')) || [];
    permissions.value = JSON.parse(localStorage.getItem('permissions')) || [];

    // Puis on tente une MAJ silencieuse (sans bloquer l'UI)
    fetchUser(); // En arrière-plan
  }

  // Initialisation automatique (remplacez la fin de votre store par ceci)
  async function initializeStore() {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        // Restaurer les données depuis le localStorage
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        roles.value = JSON.parse(localStorage.getItem('roles') || '[]');
        permissions.value = JSON.parse(localStorage.getItem('permissions') || '[]');

        // Configurer Axios avec le token
        setAuthToken(storedToken);

      } catch (error) {
        console.error('Store initialization failed:', error);
        cleanupAuthState();
      }
    } else {
      initialized.value = true;
    }
  }

  // 3. Modifier la fonction verifyToken pour être moins stricte
  async function verifyToken() {
    if (!token.value) return false;

    try {
      const response = await axios.get(`${apiUrl}${API_ROUTES.auth.verifyToken}`, {
        headers: { Authorization: `Bearer ${token.value}` },
        timeout: 10000 // 10 secondes
      });
      
      return false;
    } catch (error) {
      // Ne pas logguer comme erreur, juste comme warning
      console.warn('Token verification failed:', error.message);
      return false;
    }
  }

  // 4. Simplifier initializeAuth (optionnel, pour usage manuel)
  async function initializeAuth() {
    if (initialized.value) {
      return true
    }
    
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (!storedToken || !storedUser) {
      initialized.value = true
      return true
    }

    try {
      // 1. Restaurer les données immédiatement
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      roles.value = JSON.parse(localStorage.getItem('roles') || '[]')
      permissions.value = JSON.parse(localStorage.getItem('permissions') || '[]')

      // 2. Configurer Axios
      setAuthToken(storedToken)
      
    } catch (error) {
      console.error('Failed to restore auth data:', error)
      cleanupAuthState()
      return false
    }
    
    initialized.value = true
    return true
  }

  // 5. Améliorer la fonction logout pour gérer les paramètres
  async function logout(silent = false) {
    try {
      
      const cartStore = useCartStore()
      if (cartStore.items.length > 0) {
        await cartStore.syncCartWithServer(false)
        console.log('Cart syncroniser avec le server avant logout...')
      } else {
        console.log('Cart vide, suppression de la cart dans la db avant logout...')
        await axios.delete(`${apiUrl}/cart`)
      }

      if (token.value && !silent) {
        await axios.post(`${apiUrl}${API_ROUTES.auth.logout}`, null, {
          headers: { Authorization: `Bearer ${token.value}` },
          // timeout: 5000
        });
      }
    } catch (error) {
      if (!silent) {
        console.warn('Logout API error:', error);
      }
    } finally {
      cleanupAuthState();
    }
  }

  async function handleGoogleLogin(responseData) {
    // Stockez le token
    token.value = responseData.token;
    localStorage.setItem('auth_token', responseData.token);
    
    // Configurez Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${responseData.token}`;
    
    // Stockez les données utilisateur
    user.value = responseData.user;
    roles.value = responseData.roles;
    permissions.value = responseData.permissions;
    
    // Stockez le refresh token
    if (responseData.token) {
      localStorage.setItem('auth_token', responseData.token);
    }
  }

  // Initialisation automatique du store
  initializeStore();

  return {
    // State
    initialized,
    user,
    sharedCartCount,
    token,
    roles,
    permissions,
    returnUrl,
    loading,
    error,

    // Getters
    isAuthenticated,
    userName,
    userEmail,
    isEmailVerified,

    // Actions
    handleGoogleLogin,
    initializeAuth,
    setReturnUrl,
    setAuthToken,
    handleCartSync,
    handleApiError,
    clearError,
    login,
    register,
    logout,
    fetchUser,
    verifyToken,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    initializeStore,
    verifyOtp,
    resendOtp
  };
})