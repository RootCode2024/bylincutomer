<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-purple-900 to-pink-700 text-white overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Style & Élégance
          </h1>
          <p class="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Maîtrisez l'art de vous habiller parfaitement pour chaque occasion spéciale
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              @click="scrollToTutorials"
              class="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Explorer les tutoriels
            </button>
            <router-link
              to="/tutorials/free"
              class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300"
            >
              Tutoriels Gratuits
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Floating elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-pink-300 opacity-20 rounded-full animate-float animation-delay-2000"></div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Par occasion spéciale
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Des conseils experts pour briller à chaque événement
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div 
          v-for="category in categories"
          :key="category.id"
          class="group bg-white rounded-2xl shadow-sm p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          @click="filterByCategory(category.slug)"
        >
          <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
            <span class="text-2xl" v-html="category.emoji"></span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
          <p class="text-sm text-gray-600">{{ category.count }} tutoriels</p>
        </div>
      </div>
    </section>

    <!-- Tutorials Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="tutorials">
      <!-- Filter Bar -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Nos Masterclasses
          </h2>
          <p class="text-gray-600" v-if="filteredTutorials.length > 0">
            {{ filteredTutorials.length }} masterclass(s) trouvée(s)
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="applyFilter(filter.value)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="{
              'bg-purple-600 text-white': activeFilter === filter.value,
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': activeFilter !== filter.value
            }"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-6">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Tutorials Grid -->
      <div v-else-if="filteredTutorials.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TutorialCard 
          v-for="tutorial in paginatedTutorials"
          :key="tutorial.id"
          :tutorial="tutorial"
          :is-purchased="isTutorialPurchased(tutorial.id)"
          @select-tutorial="selectTutorial"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white rounded-2xl shadow-sm">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl">🔍</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Aucune masterclass trouvée</h3>
        <p class="text-gray-600 mb-6">
          Aucune masterclass ne correspond à vos critères de recherche.
        </p>
        <button
          @click="resetFilters"
          class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <nav class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            :class="{
              'bg-purple-600 text-white': currentPage === page,
              'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': currentPage !== page
            }"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Devenez expert en style pour toutes les occasions
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">👗</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">1. Choisissez</h3>
            <p class="text-gray-600">
              Sélectionnez la masterclass adaptée à votre événement
            </p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">🎬</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">2. Apprenez</h3>
            <p class="text-gray-600">
              Suivez les conseils experts de nos stylistes
            </p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">💫</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">3. Brillez</h3>
            <p class="text-gray-600">
              Impressionnez par votre style impeccable
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Prêt à maîtriser l'élégance ?
        </h2>
        <p class="text-xl text-purple-100 mb-8">
          Rejoignez ceux qui savent toujours quoi porter, peu importe l'occasion
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/tutorials/premium"
            class="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300"
          >
            Voir les masterclasses premium
          </router-link>
          <button
            @click="scrollToTutorials"
            class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300"
          >
            Commencer gratuitement
          </button>
        </div>
      </div>
    </section>

    <!-- Tutorial Modal -->
    <TutorialModal
      :is-open="!!selectedTutorial"
      :tutorial="selectedTutorial"
      :is-purchased="selectedTutorial ? isTutorialPurchased(selectedTutorial.id) : false"
      @close="selectedTutorial = null"
      @purchase="purchaseTutorial"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TutorialCard from '@/components/Product/TutorialCard.vue'
import TutorialModal from '@/components/ui/TutorialModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const productStore = useProductStore()

// State  
const tutorials = ref([])
const purchasedTutorials = ref([])
const loading = ref(true)
const activeFilter = ref('all')
const activeCategory = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(9)
const selectedTutorial = ref(null)

// Filters
const filters = [
  { value: 'all', label: 'Tous' },
  { value: 'free', label: 'Gratuits' },
  { value: 'premium', label: 'Premium' }
]

const categories = ref([])

// Computed properties...
const filteredTutorials = computed(() => {
  let filtered = [...tutorials.value]

  if (activeCategory.value) {
    filtered = filtered.filter(tutorial => 
      tutorial.categories?.some(cat => cat.slug === activeCategory.value)
    )
  }

  switch (activeFilter.value) {
    case 'free':
      filtered = filtered.filter(tutorial => !tutorial.is_premium)
      break
    case 'premium':
      filtered = filtered.filter(tutorial => tutorial.is_premium)
      break
  }

  return filtered
})

const paginatedTutorials = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTutorials.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTutorials.value.length / itemsPerPage.value)
})

// Methods
const loadTutorials = async () => {
  try {
    loading.value = true
    const tutorialsResponse = await productStore.fetchTutorials()
    const categoriesResponse = await productStore.fetchTutorialsCategories()
    
    if (tutorialsResponse.success) {
      tutorials.value = tutorialsResponse.data
    }
    
    if (categoriesResponse.success) {
      categories.value = categoriesResponse.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        emoji: cat.emoji,
        count: cat.tutorials_count
      }))
    }
    console.log('chargement des tutoriels cat ::::::', categoriesResponse)
  } catch (error) {
    console.error('Erreur lors du chargement des tutoriels:', error)
    // Fallback data avec les nouvelles catégories
    // tutorials.value = [
    //   {
    //     id: 1,
    //     title: 'Tenue parfaite pour un premier rendez-vous',
    //     description: 'Découvrez comment créer une tenue qui vous met en confiance pour ce moment spécial',
    //     price: 0,
    //     is_premium: false,
    //     preview_content: { duration: '12:45' },
    //     level: 'débutant',
    //     format: 'video',
    //     categories: [{ slug: 'premier-rendez-vous' }],
    //     instructor: { name: 'Sophie Style', expertise: 'Experte en relations' }
    //   }
    // ]
    // categories.value = [
    //   { id: 1, name: 'Dîner de Gala', slug: 'diner-gala', emoji: '🎩', count: 3 },
    //   { id: 2, name: 'Premier Rendez-vous', slug: 'premier-rendez-vous', emoji: '💕', count: 2 },
    //   { id: 3, name: 'Soirée Jeu', slug: 'soiree-jeu', emoji: '🎲', count: 1 },
    //   { id: 4, name: 'Cérémonie de Mariage', slug: 'ceremonie-mariage', emoji: '💒', count: 2 },
    //   { id: 5, name: 'Réunion d\'Affaires', slug: 'reunion-affaires', emoji: '💼', count: 1 },
    //   { id: 6, name: 'Brunch Dominical', slug: 'brunch-dominical', emoji: '🥂', count: 1 },
    //   { id: 7, name: 'Soirée Élégante', slug: 'soiree-elegante', emoji: '✨', count: 3 },
    //   { id: 8, name: 'Événement Culturel', slug: 'evenement-culturel', emoji: '🎭', count: 1 }
    // ]
  } finally {
    loading.value = false
  }
}

const loadPurchasedTutorials = async () => {
  try {
    if (!authStore.isAuthenticated) return
    
    const response = await productStore.getPurchasedTutorials()
    
    if (response.success) {
      purchasedTutorials.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tutoriels achetés:', error)
  }
}

const isTutorialPurchased = (tutorialId) => {
  return purchasedTutorials.value.some(t => t.tutorial_id === tutorialId)
}

const purchaseTutorial = async (tutorial) => {
  try {
    if (!authStore.isAuthenticated) {
      router.push('/login')
      return
    }

    const response = await productStore.purchaseTutorial(tutorial.id)
    
    if (response.success) {
      purchasedTutorials.value.push({
        tutorial_id: tutorial.id,
        purchase_price: tutorial.price,
        purchased_at: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Erreur lors de l\'achat du tutoriel:', error)
    alert('Erreur lors de l\'achat. Veuillez réessayer.')
  }
}

const scrollToTutorials = () => {
  const element = document.getElementById('tutorials')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const applyFilter = (filter) => {
  activeFilter.value = filter
  currentPage.value = 1
}

const filterByCategory = (categorySlug) => {
  activeCategory.value = activeCategory.value === categorySlug ? null : categorySlug
  currentPage.value = 1
}

const resetFilters = () => {
  activeFilter.value = 'all'
  activeCategory.value = null
  currentPage.value = 1
}

const selectTutorial = (tutorial) => {
  router.push({ name: 'tutorial.details', params: { slug: tutorial.slug } })
}

// Lifecycle
onMounted(() => {
  loadTutorials()
  loadPurchasedTutorials()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>