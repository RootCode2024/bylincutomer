<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Section illustration -->
    <div class="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center p-12">
        <img 
          src="@/assets/images/logo.png" 
          alt="Logo Byl In" 
          class="w-full max-w-md object-contain filter drop-shadow-xl"
        >
      </div>
      
      <!-- Icônes flottantes -->
      <div v-for="(icon, index) in floatingIcons" :key="index" 
           class="absolute flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm animate-float"
           :style="getIconPosition(index)">
        <component 
          :is="icon.component" 
          class="w-6 h-6 text-white"
        />
      </div>
    </div>

    <!-- Section formulaire -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md space-y-8">
        <!-- Bouton Retour mobile -->
        <button 
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          <span class="text-sm font-medium">Retour</span>
        </button>
        <div class="text-center">
          <router-link to="/" class="inline-block mb-6">
            <img 
              src="@/assets/images/logo.png" 
              alt="Logo" 
              class="h-10 mx-auto"
            >
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900">Content de vous revoir</h1>
          <p class="mt-2 text-gray-600">Connectez-vous pour accéder à votre compte</p>
        </div>

        <div class="mt-8 space-y-6">
          <!-- Boutons sociaux -->
          <button 
            @click="loginWithGoogle"
            :disabled="loading"
            class="w-full flex items-center disabled:cursor-not-allowed justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <GoogleIcon class="w-5 h-5" />
            <span>Continuer avec Google</span>
          </button>

          <div class="relative flex items-center my-6">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink mx-4 text-gray-500 text-sm">OU</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <ErrorMessage v-if="errorMessage" class="mb-4" :message="errorMessage" />
          <ErrorMessage v-if="authStore.success" class="mb-4" :variant="'success'" :message="authStore.success" />

          <!-- Formulaire -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="space-y-5">
              <!-- Email -->
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                  autocomplete="email"
                />
                <label 
                  for="email" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Adresse email
                </label>
              </div>

              <!-- Mot de passe -->
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  autocomplete="current-password"
                  required
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                />
                <label 
                  for="password" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Mot de passe
                </label>
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeOffIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="form.remember"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                >
                <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              
              <router-link 
                to="/forgot-password" 
                class="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Mot de passe oublié ?
              </router-link>
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Se connecter</span>
              <svg 
                v-else 
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </form>

          <div class="text-center text-sm">
            <p class="text-gray-600">
              Pas encore de compte ? 
              <router-link 
                to="/register" 
                class="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                S'inscrire
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { 
    ShoppingBag, 
    CreditCard, 
    Truck, 
    Percent,
    EyeIcon,
    EyeOffIcon,
    ArrowLeftIcon
  } from 'lucide-vue-next'
  import GoogleIcon from '@/components/icons/GoogleIcon.vue'
  import ErrorMessage from '@/components/ui/ErrorMessage.vue'

  const router = useRouter()
  const route = useRoute() 
  const authStore = useAuthStore()


  const errorMessage = ref(null)
  const showError = ref(false)

  const goBack = () => {
    router.push('/') // Retour à la page précédente
  }


  const floatingIcons = ref([
    { component: ShoppingBag },
    { component: CreditCard },
    { component: Truck },
    { component: Percent }
  ])

  const loading = ref(false)
  const showPassword = ref(false)
  const form = ref({
    email: '',
    password: '',
    remember: false
  })

  const getIconPosition = (index) => {
    const positions = [
      { top: '15%', left: '5%' },
      { top: '65%', right: '5%' },
      { top: '30%', right: '10%' },
      { top: '75%', left: '15%' }
    ]
    return positions[index]
  }

  const handleSubmit = async () => {
    if (!form.value.email || !form.value.password) {
      errorMessage.value = 'Veuillez remplir tous les champs'
      return
    }

    loading.value = true
    try {
      await authStore.login(form.value)
      const redirectPath = '/'
      await router.push(redirectPath)
    } catch (error) {
      console.error('Login error:', error)
      
      errorMessage.value = error.message || 'Échec de la connexion'
      showError.value = true
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = () => {
    loading.value = true
    try {
      window.location.href = 'http://localhost:8000/api/auth/google/callback'
    } catch (error) {
      console.error('Login with Google error:', error)
      errorMessage.value = error.message || 'Échec de la connexion avec Google'
      showError.value = true
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }

  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
</style>