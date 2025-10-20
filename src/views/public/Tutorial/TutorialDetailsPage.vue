<template>
  <div class="min-h-screen bg-gray-50 mt-10">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/tutorials" class="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Retour aux tutoriels
          </router-link>
          <div v-if="tutorial" class="flex items-center space-x-4">
            <span class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="tutorial.is_premium ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
              {{ tutorial.is_premium ? `Premium - ${formatCurrency(tutorial.price)}` : 'Gratuit' }}
            </span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div class="h-96 bg-gray-200 rounded mb-8"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          </div>
          <div class="lg:col-span-1">
            <div class="h-10 bg-gray-200 rounded mb-4"></div>
            <div class="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tutorial Content -->
    <div v-else-if="tutorial" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ tutorial.title }}
        </h1>
        <p class="text-lg text-gray-600 mb-6">
          {{ tutorial.description }}
        </p>
        
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <span v-if="tutorial.preview_content?.duration" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {{ tutorial.preview_content.duration }}
          </span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Niveau: {{ levelMap[tutorial.level] }}
          </span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Format: {{ formatMap[tutorial.format] }}
          </span>
          <span v-for="category in tutorial.categories" :key="category.id"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {{ category.name }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-sm">👤</span>
          </div>
          <div>
            <p class="font-semibold text-gray-900">{{ tutorial.instructor.name }}</p>
            <p class="text-sm text-gray-600">{{ tutorial.instructor.expertise }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Content -->
        <div class="lg:col-span-2">
          <!-- Video/Content Player -->
          <div class="bg-black rounded-2xl overflow-hidden mb-8">
            <div class="aspect-w-16 aspect-h-9 bg-gray-800 flex items-center justify-center">
              <div v-if="!hasAccess" class="text-center text-white p-8">
                <LockIcon class="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 class="text-xl font-semibold mb-2">Contenu verrouillé</h3>
                <p class="text-gray-300 mb-4">
                  {{ tutorial.is_premium ? 'Achetez ce tutoriel pour accéder au contenu complet' : 'Connectez-vous pour accéder au contenu' }}
                </p>
                <button v-if="tutorial.is_premium && !isPurchased"
                        @click="purchaseTutorial"
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Acheter pour {{ formatCurrency(tutorial.price) }}
                </button>
                <router-link v-else to="/login"
                             class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Se connecter
                </router-link>
              </div>
              <div v-else class="text-center text-white p-8">
                <PlayIcon class="h-16 w-16 mx-auto mb-4 text-blue-400" />
                <p class="text-lg">Prêt à commencer le tutoriel</p>
                <button @click="startTutorial" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Commencer maintenant
                </button>
              </div>
            </div>
          </div>

          <!-- Preview Content -->
          <div v-if="tutorial.preview_content && !hasAccess" class="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Aperçu gratuit</h3>
            <div class="prose prose-blue max-w-none">
              <p v-if="tutorial.preview_content.excerpt">{{ tutorial.preview_content.excerpt }}</p>
              <p v-else>{{ tutorial.preview_content }}</p>
              
              <div v-if="tutorial.preview_content.link" class="mt-4">
                <a :href="tutorial.preview_content.link" target="_blank" class="text-blue-600 hover:text-blue-800">
                  Voir la démo →
                </a>
              </div>
              
              <div v-if="tutorial.preview_content.pages" class="mt-2 text-sm text-gray-600">
                {{ tutorial.preview_content.pages }} pages
              </div>
            </div>
          </div>

          <!-- Tutorial Details -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">À propos de ce tutoriel</h3>
            <div class="prose prose-blue max-w-none">
              <p>{{ tutorial.description }}</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Ce que vous apprendrez</h4>
                  <ul class="list-disc list-inside space-y-1 text-gray-600">
                    <li>Techniques de style professionnel</li>
                    <li>Associations de couleurs et motifs</li>
                    <li>Choix des matières et textures</li>
                    <li>Adaptation à votre morphologie</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Niveau requis</h4>
                  <p class="text-gray-600">{{ levelMap[tutorial.level] }}</p>
                  <h4 class="font-semibold text-gray-900 mb-2 mt-4">Format</h4>
                  <p class="text-gray-600">{{ formatMap[tutorial.format] }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Action Card -->
          <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
            <div v-if="hasAccess" class="text-center mb-6">
              <CheckCircleIcon class="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p class="text-green-600 font-semibold">Vous avez accès à ce tutoriel</p>
            </div>
            
            <div class="space-y-4">
              <button v-if="hasAccess"
                      @click="startTutorial"
                      class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Commencer le tutoriel
              </button>
              
              <button v-else-if="tutorial.is_premium && !isPurchased"
                      @click="purchaseTutorial"
                      class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Acheter pour {{ formatCurrency(tutorial.price) }}
              </button>

              <button v-else-if="!tutorial.is_premium"
                      @click="startTutorial"
                      class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Commencer gratuitement
              </button>

              <div class="flex space-x-2">
                <button class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <HeartIcon class="h-5 w-5 mx-auto" />
                </button>
                <button class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <ShareIcon class="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-3">Détails</h4>
              <div class="space-y-2 text-sm text-gray-600">
                <div v-if="tutorial.preview_content?.duration" class="flex justify-between">
                  <span>Durée:</span>
                  <span class="font-medium">{{ tutorial.preview_content.duration }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Niveau:</span>
                  <span class="font-medium">{{ levelMap[tutorial.level] }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Format:</span>
                  <span class="font-medium">{{ formatMap[tutorial.format] }}</span>
                </div>
                <div v-if="tutorial.preview_content?.pages" class="flex justify-between">
                  <span>Pages:</span>
                  <span class="font-medium">{{ tutorial.preview_content.pages }}</span>
                </div>
                <div class="flex justify-between" v-if="tutorial.is_premium">
                  <span>Prix:</span>
                  <span class="font-medium text-blue-600">{{ formatCurrency(tutorial.price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Products -->
          <div v-if="tutorial.products && tutorial.products.length > 0" class="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <h4 class="font-semibold text-gray-900 mb-4">Produits recommandés</h4>
            <div class="space-y-3">
              <div v-for="product in tutorial.products" :key="product.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <img :src="product.image" :alt="product.name" class="w-12 h-12 object-cover rounded">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-500">{{ product.pivot.context }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Tutorials -->
      <div v-if="relatedTutorials.length > 0" class="mt-16">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Tutoriels similaires</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TutorialCard 
            v-for="relatedTutorial in relatedTutorials"
            :key="relatedTutorial.id"
            :tutorial="relatedTutorial"
            :is-purchased="isTutorialPurchased(relatedTutorial.id)"
            @select-tutorial="selectTutorial"
          />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">❌</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Tutoriel non trouvé</h3>
        <p class="text-gray-600 mb-6">
          Le tutoriel que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <router-link to="/tutorials" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Retour aux tutoriels
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeftIcon, 
  LockIcon, 
  PlayIcon, 
  CheckCircleIcon, 
  HeartIcon, 
  ShareIcon 
} from 'lucide-vue-next'
import TutorialCard from '@/components/Product/TutorialCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useCurrencyStore } from '@/stores/currency'
import { useProductStore } from '@/stores/product'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const currencyStore = useCurrencyStore()
const productStore = useProductStore()

// State
const tutorial = ref(null)
const relatedTutorials = ref([])
const purchasedTutorials = ref([])
const loading = ref(true)
const error = ref(null)

// Maps
const levelMap = {
  'débutant': 'Débutant',
  'intermédiaire': 'Intermédiaire',
  'expert': 'Expert'
}

const formatMap = {
  'video': 'Vidéo',
  'article': 'Article',
  'pdf': 'PDF'
}

// Computed
const isPurchased = computed(() => {
  if (!tutorial.value) return false
  return purchasedTutorials.value.some(t => t.tutorial_id === tutorial.value.id)
})

const hasAccess = computed(() => {
  if (!tutorial.value) return false
  return !tutorial.value.is_premium || isPurchased.value
})

// Methods
const loadTutorial = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await productStore.getTutorial(route.params.slug)
    
    if (response.success) {
      tutorial.value = response.data.tutorial
      relatedTutorials.value = response.data.related_tutorials
      purchasedTutorials.value = response.data.purchased_tutorials
    }
  } catch (err) {
    console.error('Erreur lors du chargement du tutoriel:', err)
    error.value = 'Impossible de charger le tutoriel'
  } finally {
    loading.value = false
  }
}

const isTutorialPurchased = (tutorialId) => {
  return purchasedTutorials.value.some(t => t.tutorial_id === tutorialId)
}

const startTutorial = () => {
  if (!hasAccess.value) return
  
  if (tutorial.value.format === 'video') {
    router.push({ name: 'TutorialWatch', params: { slug: tutorial.value.slug } })
  } else if (tutorial.value.format === 'article') {
    router.push({ name: 'TutorialRead', params: { slug: tutorial.value.slug } })
  } else if (tutorial.value.format === 'pdf') {
    window.open(tutorial.value.content_url, '_blank')
  }
}

const purchaseTutorial = async () => {
  try {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return
    }

    const response = await productStore.purchaseTutorial(tutorial.value.id)
    
    if (response.success) {
      await loadTutorial()
    }
  } catch (err) {
    console.error('Erreur lors de l\'achat:', err)
    alert('Erreur lors de l\'achat. Veuillez réessayer.')
  }
}

const selectTutorial = (selectedTutorial) => {
  router.push(`/tutorials/${selectedTutorial.slug}`)
}

const formatCurrency = (amount) => {
  if (!amount) return 'Gratuit'
  return currencyStore.formatCurrency(parseFloat(amount))
}

// Lifecycle
onMounted(() => {
  loadTutorial()
  loadPurchasedTutorials()
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