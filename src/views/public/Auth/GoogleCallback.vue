<template>
  <div class="loading-container">
    <div v-if="loading" class="spinner"></div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    if (route.query.error) {
      throw new Error(decodeURIComponent(route.query.error));
    }

    if (!route.query.data) {
      throw new Error('Aucune donnée reçue de Google');
    }

    // Décodez les données
    const responseData = JSON.parse(atob(route.query.data));

    if (responseData.success) {
      // Stockez le token et les données utilisateur
      await authStore.handleGoogleLogin(responseData.data);
      
      // Redirigez vers la page d'accueil ou la page précédente
      router.push(route.query.redirect || '/');
    } else {
      throw new Error(responseData.message);
    }
  } catch (err) {
    error.value = err.message;
    console.error('Google auth error:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  margin-top: 20px;
  max-width: 80%;
  text-align: center;
}
</style>