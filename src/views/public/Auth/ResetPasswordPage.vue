<template>
  <div class="auth-page">
    <h1>Reset Password</h1>
    <form @submit.prevent="handleSubmit">
      <input type="hidden" v-model="form.token" />
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          placeholder="Enter your email"
        />
      </div>
      <div class="form-group">
        <label for="password">New Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          placeholder="Enter new password"
        />
      </div>
      <div class="form-group">
        <label for="password_confirmation">Confirm New Password</label>
        <input
          type="password"
          id="password_confirmation"
          v-model="form.password_confirmation"
          required
          placeholder="Confirm new password"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Resetting...' : 'Reset Password' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const form = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  form.value.token = route.params.token
})

const handleSubmit = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    alert("Passwords don't match")
    return
  }

  loading.value = true
  try {
    await authStore.resetPassword(form.value)
    alert('Password reset successfully')
    router.push('/login')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Same styles as LoginView */
</style>