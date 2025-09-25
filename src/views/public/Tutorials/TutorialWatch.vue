<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation simple -->
    <nav class="bg-black bg-opacity-80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <button @click="goBack" class="flex items-center text-white hover:text-purple-300">
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Retour
          </button>
          <h1 class="text-white font-semibold truncate max-w-md text-sm md:text-base">
            {{ tutorial?.title }}
          </h1>
          <div class="w-10"></div>
        </div>
      </div>
    </nav>

    <!-- Player simple -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <div v-else-if="tutorial" class="bg-black rounded-2xl overflow-hidden">
        <!-- Video Player simple -->
        <div class="aspect-w-16 aspect-h-9">
          <video 
            ref="videoPlayer"
            class="w-full h-full object-cover"
            controls
            controlsList="nodownload"
            :poster="tutorial.thumbnail || '/images/thumbnails/default.jpg'"
          >
            <source :src="videoUrl" type="video/mp4">
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">❌</span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-4">Vidéo non disponible</h3>
        <button
          @click="goBack"
          class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Retour au tutoriel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'lucide-vue-next'
import api from '@/api/axiosConfig'

const route = useRoute()
const router = useRouter()
const videoPlayer = ref(null)

const videoUrl = computed(() => {
  return tutorial.value?.details?.videoUrl || ''
})

// State
const tutorial = ref(null)
const loading = ref(true)

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
.aspect-w-16 {
  position: relative;
}

.aspect-w-16::before {
  content: "";
  display: block;
  padding-bottom: 56.25%;
}

.aspect-h-9 {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>