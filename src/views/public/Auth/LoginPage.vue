<template>
  <transition 
    name="scale-fade"
    appear
  >
    <div class="w-full h-[100vh] flex bg-white overflow-hidden">
      <!-- Left Side - Fashion Image -->
      <div class="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 z-10"></div>
        <img 
          src="@/assets/images/loginregister.jpg" 
          alt="Fashion" 
          class="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <!-- Right Side - Auth Form -->
      <div class="w-full md:w-1/2 flex flex-col relative bg-indigo-700">
        <!-- Content Container -->
        <div class="flex-1 flex items-center justify-center p-8 md:p-12">
          <div class="max-w-md w-full">
            <div class="text-center mb-8">
              <transition name="bounce" appear>
                <div class="inline-flex items-center justify-center mb-4">
                  <router-link to="/">
                    <img src="/images/logo-white.png" alt="bylin logo" class="w-48 h-48 object-contain"/>
                  </router-link>
                </div>
              </transition>
              <h1 class="text-2xl font-bold text-gray-300 mb-2">
                Content de vous revoir chez <span class="italic text-white">bylin</span>!
              </h1>
              <p class="text-gray-300">Connectez-vous à votre compte.</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
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
                  autocomplete="email"
                  autofocus
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200"
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

              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Mot de passe"
                  autocomplete="current-password"
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200"
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

              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input type="checkbox" v-model="rememberMe" class="rounded border-gray-300 text-white focus:ring-white">
                  <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <router-link 
                  to="/forgot-password" 
                  class="text-sm text-white hover:text-white hover:underline transition-colors"
                >
                  Mot de passe oublié?
                </router-link>
              </div>

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
                :disabled="!email || !password || emailError || passwordError || isLoading"
                class="w-full disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-white to-white hover:from-white hover:to-indigo-900 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
                <span v-else>Se connecter</span>
              </button>
            </form>

            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">OU</span>
                </div>
              </div>

              <div class="mt-6 space-y-3">
                <button 
                  @click="handleGoogleLogin"
                  :disabled="socialLoading"
                  class="w-full disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-400 rounded-lg hover:border-white bg-gray-300 hover:bg-indigo-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span class="hover:text-gray-200 text-black font-medium" v-if="!socialLoading">Se connecter avec Google</span>
                  <svg 
                    v-else 
                    class="animate-spin h-5 w-5 text-gray-500" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="text-center mt-6">
              <p class="text-gray-200 text-sm">
                Pas encore de compte? 
                <router-link to="/register" class="text-white hover:text-white hover:underline font-medium transition-colors">
                  S'inscrire
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
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const message = ref('')
const emailError = ref('')
const passwordError = ref('')
const isLoading = ref(false)
const socialLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  emailError.value = ''
  passwordError.value = ''
  message.value = ''

  if (!email.value || !email.value.includes('@')) {
    emailError.value = 'Veuillez entrer une adresse mail valide.'
    return
  }

  if (!password.value) {
    passwordError.value = 'Veuillez entrer votre mot de passe.'
    return
  }

  try {
    isLoading.value = true
    const response = await authStore.login({
      email: email.value,
      password: password.value,
      remember_me: rememberMe.value
    })

    if (response) {
      const redirectPath = router.currentRoute.value.query.redirect || '/'
      router.push(redirectPath)
    }
  } catch (e) {
    error.value = e.response?.message || 'Identifiants incorrects. Veuillez réessayer.'
    if (e.response?.data?.errors) {
      const errors = e.response.data.errors
      error.value = Object.values(errors)[0][0]
    }
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  socialLoading.value = true
  try {
    authStore.googleLogin()
  } catch (e) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
    socialLoading.value = false
  } finally {
    socialLoading.value = false
  }
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