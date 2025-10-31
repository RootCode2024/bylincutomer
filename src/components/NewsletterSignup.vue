<template>
  <div class="w-full">
    <form @submit.prevent="handleSubscribe" class="flex gap-2">
      <input
        v-model="email"
        type="email"
        placeholder="Votre email"
        required
        :disabled="loading"
        class="flex-1 px-3 py-2 text-sm rounded-lg border-0 focus:ring-1 focus:ring-blue-400 text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm"
      >
      <button
        type="submit"
        :disabled="loading || !email"
        class="bg-white text-blue-600 px-4 py-2 text-sm rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-all whitespace-nowrap"
      >
        {{ loading ? '...' : "S'abonner" }}
      </button>
    </form>
    
    <p v-if="message && !loading" class="mt-2 text-xs" :class="success ? 'text-green-400' : 'text-red-400'">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/axiosConfig'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const authStore = useAuthStore()

const handleSubscribe = async () => {
  if (!email.value.trim()) return
  
  loading.value = true
  message.value = ''

  try {
    const response = await authStore.newsletterSubscribe(email.value)
    success.value = true
    message.value = response.message ?? 'Inscription réussie !'
    email.value = ''
  } catch (error) {
    success.value = false
    message.value = error || 'Erreur, réessayez.'
  } finally {
    loading.value = false
    setTimeout(() => { message.value = '' }, 3000)
  }
}
</script>