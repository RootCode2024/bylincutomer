import { defineStore } from 'pinia'
import axios from 'axios'
import { useApiStore } from './api'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
    addresses: [],
    apiUrl: useApiStore().apiUrl,
    authStore: useAuthStore()
  }),

  actions: {
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      
      try {
        // Rafraîchir le token si nécessaire
        const authStore = useAuthStore();
        if (authStore.isTokenExpired) {
          await authStore.refreshToken();
        }

        const response = await axios.get(`${this.apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${authStore.token}` // Utilisez le token du store
          }
        });

        if (!response.data?.data) {
          throw new Error('Invalid profile data received');
        }

        this.profile = {
          ...response.data.data
        };
        
      } catch (error) {
        this.handleError(error, 'Failed to load profile');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAddresses() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${this.apiUrl}/profile/addresses`, {
          headers: {
            Authorization: `Bearer ${this.authStore.toke}`
          }
        })
        this.addresses = response.data.data
      } catch (error) {
        this.handleError(error, 'Impossible de charger les adresses')
      } finally {
        this.loading = false
      }
    },

    async updateProfile(updatedFields) {
      this.loading = true;
      this.error = null;

      try {
        // Safely prepare payload with fallbacks
        const payload = {
          email: updatedFields.email ?? this.authStore.user?.email ?? '',
          first_name: updatedFields.first_name ?? this.authStore.user?.profile?.first_name ?? '',
          last_name: updatedFields.last_name ?? this.authStore.user?.profile?.last_name ?? '',
          phone: updatedFields.phone ?? this.authStore.user?.profile?.phone ?? null,
          birth_date: updatedFields.birth_date ?? this.authStore.user?.profile?.birth_date ?? null,
          gender: updatedFields.gender ?? this.authStore.user?.profile?.gender ?? null,
          bio: updatedFields.bio ?? this.authStore.user?.profile?.bio ?? null
        };

        // Remove undefined fields
        Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === null) {
            delete payload[key];
          }
        });

        const response = await axios.put(`${this.apiUrl}/profile`, payload, {
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            'Content-Type': 'application/json'
          }
        });

        const updatedUser = response.data.user || {};

        // Safely update profile state
        if (updatedUser.profile) {
          this.authStore.user.profile = {
            ...this.authStore.user.profile,
            ...updatedUser.profile
          };
        }

        // Mise à jour des autres champs utilisateur (ex: email)
        this.authStore.user = {
          ...this.authStore.user,
          ...updatedUser,
          profile: this.authStore.user.profile // on garde le profil déjà mis à jour
        };

        this.profile = this.authStore.user.profile;

        this.successMessage = 'Profile updated successfully';
        return response.data;
        
      } catch (error) {
        this.handleProfileError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    handleProfileError(error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        this.error = Object.entries(errors)
          .map(([field, messages]) => {
            const fieldName = this.getFieldLabel(field);
            return `${fieldName}: ${messages.join(', ')}`;
          })
          .join('; ');
      } else {
        this.error = error.response?.data?.message || 
                  error.message || 
                  'Failed to update profile';
      }
    },

    getFieldLabel(field) {
      const labels = {
        'first_name': 'First name',
        'last_name': 'Last name',
        'email': 'Email',
        'phone': 'Phone',
        'birth_date': 'Birth date',
        'gender': 'Gender',
        'bio': 'Bio'
      };
      return labels[field] || field;
    },

    prepareProfilePayload(fields) {
      const payload = {}
      
      // Champs obligatoires
      if ('first_name' in fields) payload.first_name = fields.first_name?.trim() || ''
      if ('last_name' in fields) payload.last_name = fields.last_name?.trim() || ''
      if ('email' in fields) payload.email = fields.email?.trim() || ''
      
      // Champs optionnels
      if ('phone' in fields) payload.phone = fields.phone?.trim()
      if ('birth_date' in fields) payload.birth_date = fields.birth_date
      if ('gender' in fields) payload.gender = fields.gender
      if ('bio' in fields) payload.bio = fields.bio?.trim()
      
      return payload
    },

    formatValidationMessage(error) {
      const messages = {
        'validation.required': 'Ce champ est obligatoire',
        'validation.email': 'Email invalide',
        'validation.date_format': 'Format de date invalide (YYYY-MM-DD)',
        'validation.unique': 'Cette valeur est déjà utilisée'
      }
      
      return messages[error] || error
    },
    
    async updateProfileField(field, value) {
      return this.updateProfile({ [field]: value })
    },

    async newAddress(data) {
      this.loading = true
      this.error = null
      try {
      const response = await axios.post(`${this.apiUrl}/profile/addresses`, data, {
        headers: {
        Authorization: `Bearer ${this.authStore.token}`,
        'Content-Type': 'application/json'
        }
      })
      const newAddr = response.data
      this.addresses.push(newAddr)
      this.successMessage = 'Adresse ajoutée avec succès'
      return newAddr.id
      } catch (error) {
      this.handleError(error, 'Erreur lors de l\'ajout de l\'adresse')
      throw error
      } finally {
      this.loading = false
      }
    },

    async updateAddress(newAddress = false, data) {
      console.log('yooooooo')
      this.loading = true
      this.error = null
      
      const payload = {
        type: data.type,
        address_line: data.address_line,
        city: data.city,
        state: data.state,
        country_id: data.country_id,
        is_default: data.is_default
      }

      try {
        let response
        if (newAddress) {
          response = await axios.post(`${this.apiUrl}/profile/address`, payload, {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              'Content-Type': 'application/json'
            }
          })
          this.addresses.push(response.data)
        } else {
          response = await axios.put(`${this.apiUrl}/profile/address/${data.id}`, payload, {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              'Content-Type': 'application/json'
            }
          })
          this.addresses = this.addresses.map(addr => 
            addr.id === data.id ? response.data : addr
          )
        }
        
        this.successMessage = newAddress 
          ? 'Adresse ajoutée avec succès' 
          : 'Adresse mise à jour avec succès'
          
        return response.data
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour de l\'adresse')
      } finally {
        this.loading = false
      }
    },

    async updateAddressDefault(addressId) {
      this.loading = true
      this.error = null
      
      try {
        await axios.put(
          `${this.apiUrl}/profile/address/${addressId}/default`,
          { is_default: true },
          {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        this.addresses = this.addresses.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        }))
        
        this.successMessage = 'Adresse par défaut mise à jour'
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour de l\'adresse par défaut')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEmailAndPhone({ email, phone }) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(
          `${this.apiUrl}/profile/contact`, 
          { email, phone },
          {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        this.profile = { ...this.profile, ...response.data }
        this.successMessage = 'Email et téléphone mis à jour'
      } catch (error) {
        this.handleError(error, 'Erreur de mise à jour des informations de contact')
      } finally {
        this.loading = false
      }
    },

    async updateAvatar(formData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(
          `${this.apiUrl}/profile/avatar`, 
          formData, 
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${this.authStore.token}`
            }
          }
        )
        this.profile.avatar_url = response.data.avatar_url
        this.successMessage = 'Avatar mis à jour avec succès'
      } catch (error) {
        this.handleError(error, 'Erreur lors du téléchargement de l\'avatar')
      } finally {
        this.loading = false
      }
    },

    async updatePassword({ current_password, new_password, new_password_confirmation }) {
      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const response = await axios.put(
          `${this.apiUrl}/profile/password`,
          { current_password, new_password, new_password_confirmation },
          {
            headers: {
              Authorization: `Bearer ${this.authStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        this.successMessage = response.data.message || 'Mot de passe mis à jour avec succès'
      } catch (error) {
        this.handleError(error, 'Erreur lors de la mise à jour du mot de passe')
      } finally {
        this.loading = false
      }
    },

    clearMessages() {
      this.successMessage = null
      this.error = null
    },

    // Méthodes utilitaires
    validateProfileFields(fields) {
      if ('first_name' in fields && !fields.first_name?.trim()) {
        throw new Error('Le prénom est obligatoire')
      }
      
      if ('last_name' in fields && !fields.last_name?.trim()) {
        throw new Error('Le nom est obligatoire')
      }
      
      if ('email' in fields && fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) {
        throw new Error('Email invalide')
      }

      if ('birth_date' in fields && fields.birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(fields.birth_date)) {
        throw new Error('Format de date invalide (YYYY-MM-DD attendu)')
      }
    },

    handleError(error, defaultMessage) {
      this.error = error.response?.data?.message || 
                  error.message || 
                  defaultMessage
      console.error('Erreur:', error)
    },

    //delete account
    async deleteAccount() {
      try {
        const response = await axios.delete(`${this.apiUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${this.authStore.token}`
          }
        })
        this.authStore.logout()
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error)
      }
    }
  }
})