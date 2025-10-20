<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation simple -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <button @click="goBack" class="flex items-center text-gray-600 hover:text-purple-600">
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
      </div>
    </nav>

    <!-- Article Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div class="h-64 bg-gray-200 rounded"></div>
      </div>

      <div v-else-if="tutorial" class="bg-white rounded-2xl p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ tutorial.title }}
          </h1>
          <div class="text-sm text-gray-600">
            Par {{ tutorial.instructor?.name || 'Expert Style' }}
          </div>
        </div>

        <!-- Featured Image -->
        <img 
          v-if="tutorial.image"
          :src="tutorial.image"
          :alt="tutorial.title"
          class="w-full h-64 object-cover rounded-2xl mb-8"
        >

        <!-- Article Content -->
        <article class="prose prose-lg max-w-none">
          <!-- Introduction -->
          <div class="bg-purple-50 p-6 rounded-2xl mb-8">
            <p class="text-purple-800">{{ tutorial.description }}</p>
          </div>

          <!-- Contenu de l'article -->
          <div v-html="formattedContent"></div>
        </article>

        <!-- Bouton de retour -->
        <div class="mt-12 pt-8 border-t border-gray-200 text-center">
          <button
            @click="goBack"
            class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Retour au tutoriel
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">❌</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Article non disponible</h3>
        <button
          @click="goBack"
          class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Retour aux tutoriels
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'lucide-vue-next'
import api from '@/api/axiosConfig'

const route = useRoute()
const router = useRouter()

// State
const tutorial = ref(null)
const loading = ref(true)

// Computed
const formattedContent = computed(() => {
  // Contenu exemple basé sur le type de tutoriel
  if (route.params.slug === 'style-soiree-jeu-amis') {
    return `
      <h2>Style décontracté pour soirée jeu</h2>
      <p>Pour une soirée jeu entre amis, privilégiez le confort sans sacrifier le style.</p>
      
      <h3>👕 Tenue de base</h3>
      <p>Un jean bien coupé ou un pantalon confortable associé à un t-shirt ou un sweater.</p>
      
      <h3>🎨 Couleurs et motifs</h3>
      <p>Optez pour des couleurs neutres avec une touche de couleur vive pour rester décontracté mais stylé.</p>
      
      <h3>👟 Chaussures</h3>
      <p>Des baskets confortables ou des sneakers stylées pour pouvoir bouger facilement.</p>
    `
  }
  
  if (route.params.slug === 'tenue-premier-rendez-vous') {
    return `
      <h2>Tenue parfaite pour premier rendez-vous</h2>
      <p>Le premier rendez-vous demande une tenue qui vous met en confiance tout en impressionnant.</p>
      
      <h3>💫 Équilibre parfait</h3>
      <p>Ni trop formel, ni trop décontracté - trouvez le juste milieu qui vous représente.</p>
      
      <h3>🎯 Conseils selon le lieu</h3>
      <p>Adaptez votre tenue au type de rendez-vous : café, restaurant, promenade...</p>
      
      <h3>💎 Détails importants</h3>
      <p>Les accessoires et la propreté générale font toute la différence.</p>
    `
  }
  
  return `<p>Contenu du tutoriel...</p>`
})

// Methods
const loadTutorial = async () => {
  try {
    loading.value = true
    const response = await api.get(`/tutorials/slug/${route.params.slug}`)
    
    if (response.success) {
      tutorial.value = response.data.tutorial
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'tutorial.details', params: { slug: route.params.slug } })
}

// Lifecycle
onMounted(() => {
  loadTutorial()
})
</script>

<style scoped>
.prose {
  line-height: 1.7;
}

.prose h2 {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold text-gray-800 mt-6 mb-3;
}

.prose p {
  @apply text-gray-700 mb-4;
}
</style>