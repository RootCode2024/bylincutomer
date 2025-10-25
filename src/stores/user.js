import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { refreshCsrfToken } from '@/api/axiosConfig'
import { API_ROUTES } from '@/utils/apiRoute'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()

  // --- STATE ---
  const user = ref(null)
  const addresses = ref([])
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  // --- GETTERS ---
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // --- ACTIONS ---

  // 🧍‍♂️ Charger le profil utilisateur
  async function fetchProfile() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(API_ROUTES.customers.dashboard)
      console.log(response)
      
      if (response.success) return response
    } catch (err) {
      handleError(err, "Impossible de charger le profil")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📍 Récupérer les adresses
  async function fetchAddresses() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.customers.addresses)
      console.log('ggggggggg::::::::', response)

      if (response.success) {
        addresses.value = response.addresses
        return response
      }
    } catch (err) {
      handleError(err, "Impossible de charger les adresses")
    } finally {
      loading.value = false
    }
  }

  // ✏️ Mettre à jour le profil
  async function updateProfile(updatedFields) {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      const payload = cleanPayload(updatedFields)
      
      console.log('🔄 Mise à jour profil - Champs:', Object.keys(payload))

      let response

      // Gestion séparée pour la date de naissance
      if (payload.birth_date !== undefined) {
        console.log('🎯 Mise à jour date de naissance')
        
        // Préparer la date pour l'API
        const birthDatePayload = prepareBirthDate(payload.birth_date)
        
        response = await api.put(API_ROUTES.auth.updateBirthDate, birthDatePayload)
        
        // Mettre à jour localement
        if (response?.success) {
          authStore.user.birth_date = response.birth_date
          authStore.user.birth_date_updated_at = response.last_updated
        }
      } else {
        console.log('👤 Mise à jour profil général')
        response = await api.put(API_ROUTES.auth.updateProfile, payload)
        
        // Mettre à jour le store avec la réponse
        if (response?.user) {
          authStore.user = { ...authStore.user, ...response.user }
        } else if (response?.data) {
          authStore.user = { ...authStore.user, ...response }
        }
      }

      user.value = { ...authStore.user }
      successMessage.value = response?.message || 'Profil mis à jour avec succès ✅'
      
      return response
      
    } catch (err) {
      console.error('💥 Erreur mise à jour profil:', err)
      
      // Log détaillé pour debug
      if (err.response) {
        console.error('📋 Détails erreur:', {
          status: err.response.status,
          data: err.response,
          endpoint: err.config?.url
        })
      }
      
      handleProfileError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📧 Mettre à jour l'email

  // 📧 Vérifier la disponibilité d'un email
  async function emailAvailable(email) {
    loading.value = true
    error.value = null
    try {
      await refreshCsrfToken()
      const response = await api.post(API_ROUTES.customers.emailAvailable, { email })
      return response
    } catch (err) {
      handleError(err, "Impossible de vérifier l'email")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔐 Mettre à jour l'email (première étape)
  async function updateEmail(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(API_ROUTES.auth.updateEmail, {
        email,
        password,
        send_verification: true // Demander l'envoi d'un code de vérification
      })
      
      return {
        requires_verification: true,
        message: response?.message || 'Code de vérification envoyé'
      }
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour de l'email")
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✅ Vérifier le code de confirmation
  async function verifyEmailCode(email, code) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(API_ROUTES.auth.verifyEmailUpdate, {
        email,
        verification_code: code
      })
      
      return {
        verified: true,
        user: response.user,
        message: response.message
      }
    } catch (err) {
      handleError(err, "Erreur lors de la vérification du code")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔄 Renvoyer le code de vérification
  async function resendEmailVerification(email) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(API_ROUTES.auth.resendEmailVerification, {
        email
      })
      
      return {
        sent: true,
        message: response.message
      }
    } catch (err) {
      handleError(err, "Erreur lors de l'envoi du code")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 📞 Mettre à jour le téléphone
  async function updatePhone(phone, password) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(API_ROUTES.auth.updatePhone, {
        phone,
        password
      })
      return response
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour du téléphone")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🖼️ Mettre à jour l'avatar - CORRIGÉ
  async function updateAvatar(formData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(API_ROUTES.auth.updateAvatar, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('✅ Avatar mis à jour:', response)
      
      // Mettre à jour l'utilisateur dans le store auth
      if (response?.user) {
        authStore.user = { ...authStore.user, ...response.user }
      }
      
      return response
    } catch (err) {
      console.error('❌ Erreur mise à jour avatar:', err)
      handleError(err, "Erreur lors de la mise à jour de l'avatar")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🧩 Ajouter une nouvelle adresse
  async function newAddress(data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(API_ROUTES.customers.addresses.base, data)
      
      if (response.success) {
        addresses.value.push(response)
        // Mettre à jour également dans authStore
        if (authStore.user?.addresses) {
          authStore.user.addresses.push(response)
        }
      }
      
      return response
    } catch (err) {
      handleError(err, "Erreur lors de l'ajout de l'adresse")
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✏️ Modifier une adresse existante
  async function updateAddress(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`${API_ROUTES.customers.addresses.base}/${id}`, data)
      
      if (response.success) {
        // Mettre à jour dans les addresses du store
        addresses.value = addresses.value.map(addr =>
          addr.id === id ? response : addr
        )
        
        // Mettre à jour également dans authStore
        if (authStore.user?.addresses) {
          authStore.user.addresses = authStore.user.addresses.map(addr =>
            addr.id === id ? response : addr
          )
        }
      }
      
      return response
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour de l'adresse")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🗑️ Supprimer une adresse
  async function deleteAddress(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(API_ROUTES.customers.addresses(id))
      
      if (response.success) {
        addresses.value = addresses.value.filter(a => a.id !== id)
        
        // Mettre à jour également dans authStore
        if (authStore.user?.addresses) {
          authStore.user.addresses = authStore.user.addresses.filter(a => a.id !== id)
        }
      }
      
      return response
    } catch (err) {
      handleError(err, "Erreur lors de la suppression de l'adresse")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔄 Définir une adresse comme défaut
  async function setAddressAsDefault(addressId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(API_ROUTES.customers.addresses.setDefault(addressId))

      if (response.success) {
        // Mettre à jour les addresses dans authStore
        await authStore.fetchUser()
      }
      
      return response
    } catch (err) {
      handleError(err, "Impossible de définir l'adresse par défaut")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔐 Mettre à jour le mot de passe
  async function updatePassword(passwordData) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(API_ROUTES.auth.updatePassword, passwordData)
      return response
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour du mot de passe")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🗑️ Supprimer le compte
  async function deleteAccount() {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(API_ROUTES.auth.deleteAccount)
      return response
    } catch (err) {
      handleError(err, "Erreur lors de la suppression du compte")
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🧾 Historique d'activités
  async function fetchActivityLog(params = null) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.customers.activities.base, { params })
      return response
    } catch (err) {
      handleError(err, "Impossible de charger l'historique")
      return []
    } finally {
      loading.value = false
    }
  }

  // 🧹 Helpers

  function prepareBirthDate(birthDate) {
    let formattedDate = birthDate
    
    if (birthDate instanceof Date) {
      formattedDate = birthDate.toISOString().split('T')[0]
    } else if (typeof birthDate === 'string') {
      // Nettoyer la string
      formattedDate = birthDate.trim()
      
      // Si le format est DD/MM/YYYY, le convertir en YYYY-MM-DD
      if (formattedDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = formattedDate.split('/')
        formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      
      // Valider que c'est une date valide
      const dateObj = new Date(formattedDate)
      if (isNaN(dateObj.getTime())) {
        throw new Error('Date de naissance invalide')
      }
      
      // S'assurer du format final
      formattedDate = dateObj.toISOString().split('T')[0]
    }
    
    console.log('📅 Date formatée pour API:', formattedDate)
    return { birth_date: formattedDate }
  }

  function cleanPayload(fields) {
    const payload = {}
    Object.entries(fields).forEach(([k, v]) => {
      // Ne pas inclure les champs vides
      if (v !== undefined && v !== null && v !== '') {
        // Pour les strings, supprimer les espaces inutiles
        if (typeof v === 'string') {
          payload[k] = v.trim()
        } else {
          payload[k] = v
        }
      }
    })
    return payload
  }

  // Gestion d'erreur
  function handleProfileError(err) {
    if (err.response?.data?.errors) {
      const errors = err.response.errors
      Object.values(errors).forEach(errorMessages => {
        errorMessages.forEach(message => {
          // Afficher chaque message d'erreur
          showNotification(message, 'error')
        })
      })
    } else if (err.response?.data?.message) {
      showNotification(err.response.message, 'error')
    } else if (err.code === 'NETWORK_ERROR') {
      showNotification('Erreur de connexion. Vérifiez votre internet.', 'error')
    } else {
      showNotification('Erreur lors de la mise à jour du profil', 'error')
    }
  }

  function handleError(err, defaultMsg) {
    error.value = err.response?.data?.message || err.message || defaultMsg
    console.error('Erreur:', error.value)
  }

  function showNotification(message, type = 'success') {
    // Utiliser votre système de notification préféré
    console.log(`${type.toUpperCase()}:`, message)
    // Exemple avec vue-toast-notification:
    // $toast.open({ message, type })
  }

  function clearMessages() {
    successMessage.value = null
    error.value = null
  }

  return {
    // state
    user,
    addresses,
    loading,
    error,
    successMessage,

    // getters
    isLoading,
    hasError,

    // actions
    fetchProfile,
    fetchAddresses,
    updateProfile,
    newAddress,
    updateAddress,
    deleteAddress,
    updatePassword,
    deleteAccount,
    fetchActivityLog,
    emailAvailable,
    setAddressAsDefault,
    updatePhone,
    updateEmail,
    verifyEmailCode,
    resendEmailVerification,
    updateAvatar,
    clearMessages,
  }
})