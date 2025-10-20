<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div v-if="loading" class="text-gray-500">Connexion en cours...</div>
    <div v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const errorMessage = ref(null)

onMounted(async () => {
  try {
    // 🔥 Appel à l’API pour récupérer l’utilisateur depuis le cookie
    const response = await authStore.fetchUser()

    if (response) {
      const user = response.user || response?.data?.user
      authStore.user = user
      
      localStorage.setItem('auth_user', JSON.stringify(user))
      console.log('✅ Authentifié via cookie Sanctum:', user)
    }

    // Redirection
    await router.push('/')
  } catch (error) {
    console.error('❌ Erreur callback Google:', error)
    errorMessage.value = 'Connexion Google échouée. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
})
</script>