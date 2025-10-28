<template>
  <transition 
    name="scale-fade"
    appear
  >
    <div class="w-full h-[100vh] flex bg-indigo-800 rounded-2xl shadow-2xl overflow-hidden">
      <!-- Left Side - Fashion Image -->
      <div class="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-indigo-700/20 z-10"></div>
        <img 
          src="@/assets/images/loginregister.jpg" 
          alt="Fashion" 
          class="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <!-- Right Side - Auth Form -->
      <div class="w-full md:w-1/2 flex flex-col relative">
        <!-- Back Button -->
        <button 
          @click="handleBack" 
          class="absolute top-8 left-8 text-indigo-700 hover:text-indigo-800 transition-colors duration-200 p-2 hover:bg-indigo-50 rounded-lg z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <!-- Content Container -->
        <div class="flex-1 flex items-center justify-center p-8 md:p-12">
          <div class="max-w-md w-full">
            <div class="text-center mb-8">
              <transition name="bounce" appear>
                <router-link to="/" class="inline-flex items-center justify-center mb-4">
                  <img src="/images/logo-white.png" alt="bylin logo" class="w-48 h-48 object-contain"/>
                </router-link>
              </transition>
              <h1 class="text-2xl font-bold text-white mb-2">
                Réinitialiser votre mot de passe
              </h1>
              <p class="text-gray-900" v-if="userEmail">
                Pour l'adresse: <span class="font-medium text-white">{{ userEmail }}</span>
              </p>
              <p class="text-gray-900" v-else>
                Entrez votre nouveau mot de passe.
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  autofocus
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': passwordError }"
                />
              </div>
              <transition name="slide-down">
                <p v-if="passwordError" class="text-red-500 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ passwordError }}
                </p>
              </transition>

              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="passwordConfirmation"
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': passwordConfirmationError }"
                />
              </div>
              <transition name="slide-down">
                <p v-if="passwordConfirmationError" class="text-red-500 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ passwordConfirmationError }}
                </p>
              </transition>

              <transition name="slide-down">
                <p v-if="error" class="text-red-500 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ error }}
                </p>
              </transition>

              <transition name="slide-down">
                <p v-if="message" class="text-green-600 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ message }}
                </p>
              </transition>

              <button
                type="submit"
                :disabled="!password || !passwordConfirmation || isLoading || !isTokenValid"
                class="w-full disabled:cursor-not-allowed disabled:opacity-50 bg-white text-black font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Réinitialisation...
                </span>
                <span v-else-if="!isTokenValid">Token invalide</span>
                <span v-else>Réinitialiser le mot de passe</span>
              </button>
            </form>

            <div class="text-center mt-6">
              <p class="text-gray-600 text-sm">
                <router-link to="/login" class="text-black hover:text-white hover:underline font-medium transition-colors">
                  Retour à la connexion
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()


const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const message = ref('')
const passwordError = ref('')
const passwordConfirmationError = ref('')
const isLoading = ref(false)
const token = ref('')
const userEmail = ref('')

const isTokenValid = computed(() => {
  return token.value && token.value.length > 10
})

onMounted(() => {
  // Récupération des paramètres d'URL
  token.value = route.query.token
  userEmail.value = route.query.email ? decodeURIComponent(route.query.email) : ''

  console.log('Token reçu:', token.value)
  console.log('Email reçu:', userEmail.value)

  if (!token.value) {
    error.value = 'Token de réinitialisation manquant. Veuillez demander un nouveau lien.'
  } else if (!isTokenValid.value) {
    error.value = 'Token de réinitialisation invalide. Veuillez demander un nouveau lien.'
  }
})

const handleSubmit = async () => {
  error.value = ''
  passwordError.value = ''
  passwordConfirmationError.value = ''
  message.value = ''

  // Validation du token
  if (!token.value || !isTokenValid.value) {
    error.value = 'Token de réinitialisation invalide. Veuillez demander un nouveau lien.'
    return
  }

  // Validation du mot de passe
  if (!password.value || password.value.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  // Vérification de la complexité du mot de passe
  const hasUpperCase = /[A-Z]/.test(password.value)
  const hasLowerCase = /[a-z]/.test(password.value)
  const hasNumbers = /\d/.test(password.value)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    passwordError.value = 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    passwordConfirmationError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    isLoading.value = true
    console.log('Envoi de la requête de réinitialisation...', {
      token: token.value,
      email: userEmail.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    const response = await authStore.resetPassword({
      token: token.value,
      email: userEmail.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    console.log('Réponse reçue:', response)

    message.value = response.data?.message || 'Mot de passe réinitialisé avec succès!'
    
    // Redirection après succès
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (e) {
    console.error('Erreur lors de la réinitialisation:', e)
    error.value = e.response?.data?.message || e.response?.data?.error || 'Erreur lors de la réinitialisation. Veuillez réessayer.'
    
    // Si le token est expiré
    if (e.response?.status === 400 || e.response?.status === 422) {
      const errorData = e.response.data
      if (errorData.errors?.token || errorData.message?.includes('token') || errorData.message?.includes('expiré')) {
        error.value = 'Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.'
      }
    }
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  router.push('/login')
}
</script>

<style scoped>
/* Vos styles d'animation existants */
.scale-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.bounce-enter-active {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.slide-down-enter-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
</style>