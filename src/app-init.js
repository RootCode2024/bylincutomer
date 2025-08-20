import { useAuthStore } from '@/stores/auth'

export async function initializeApp() {
  try {
    const authStore = useAuthStore()
    authStore.initializeAuth() // Utilisez la méthode corrigée
  } catch (error) {
    console.error('App init failed:', error)
  }
}