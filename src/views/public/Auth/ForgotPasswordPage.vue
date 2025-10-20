<template>
  <transition 
    name="scale-fade"
    appear
  >
    <div class="w-full h-[100vh] flex bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Left Side - Fashion Image -->
      <div class="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-800/20 to-indigo-700/20 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1716004357049-8671b6cec216?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=600" 
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
                <div class="inline-flex items-center justify-center mb-4">
                  <img src="/images/logo-white.png" alt="bylin logo" class="w-48 h-48 object-contain"/>
                </div>
              </transition>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">
                Mot de passe oublié?
              </h1>
              <p class="text-gray-600">Entrez votre email pour réinitialiser votre mot de passe.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Adresse mail"
                  autofocus
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': emailError }"
                />
              </div>
              <transition name="slide-down">
                <p v-if="emailError" class="text-red-500 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ emailError }}
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
                :disabled="!email || isLoading"
                class="w-full disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
                <span v-else>Envoyer le lien de réinitialisation</span>
              </button>
            </form>

            <div class="text-center mt-6">
              <p class="text-gray-600 text-sm">
                <router-link to="/login" class="text-indigo-700 hover:text-indigo-800 hover:underline font-medium transition-colors">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const error = ref('')
const message = ref('')
const emailError = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  emailError.value = ''
  message.value = ''

  if (!email.value || !email.value.includes('@')) {
    emailError.value = 'Veuillez entrer une adresse mail valide.'
    return
  }

  try {
    isLoading.value = true
    const response = await authStore.forgotPassword(email.value)

    console.log('Password reset link sent:', response)

    message.value = response.data?.message || 'Un lien de réinitialisation a été envoyé à votre adresse email.'
    
    // Redirection après succès
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de l\'envoi du lien. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  router.back()
}
</script>