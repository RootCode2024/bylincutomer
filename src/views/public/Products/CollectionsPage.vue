<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-indigo-900 to-purple-800 text-white overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            {{ collectionInfos ? collectionInfos.name : 'Nouvelle Collection'}}
          </h1>
          <p class="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            {{ collectionInfos ? collectionInfos.description : 'Découvrez les pièces phares de notre nouvelle collection, alliant élégance et modernité pour un style unique.'}}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link
              to="/shop"
              class="bg-white text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Visiter la boutique
            </router-link>
            <button
              @click="scrollToProducts"
              class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-all duration-300"
            >
              Explorer maintenant
            </button>
          </div>
        </div>
      </div>
      
      <!-- Floating elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-indigo-300 opacity-20 rounded-full animate-float animation-delay-2000"></div>
      <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-300 opacity-15 rounded-full animate-float animation-delay-4000"></div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
          <span class="animate-pulse mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg></span>
          Collection Exclusive
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Les incontournables de la saison
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Des pièces soigneusement sélectionnées pour vous offrir le meilleur de la mode contemporaine
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="n in 8" :key="n" class="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
          <div class="h-48 bg-gray-200 rounded-xl mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <ProductCard 
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
          @add-to-wishlist="addToWishlist"
          class="transform transition-all duration-300 hover:scale-105"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-sm p-12">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 10h6m-6 4h6m-3-2h"/>
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Collection en préparation</h3>
          <p class="text-gray-600 mb-8">
            Notre nouvelle collection arrive bientôt. Soyez le premier informé !
          </p>
          <button
            @click="subscribeNewsletter"
            class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            M'informer du lancement
          </button>
        </div>
      </div>

      <!-- View All Button -->
      <div v-if="products.length > 0" class="text-center mt-16">
        <router-link
          to="/shop?collection=new-arrivals"
          class="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          Voir tous les produits
          <ArrowRightIcon class="ml-2 h-5 w-5" />
        </router-link>
      </div>
    </section>

    <!-- Collection Story -->
    <section class="bg-white py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          L'histoire derrière la collection
        </h2>
        <div class="prose prose-lg text-gray-600 text-left">
          <p class="text-xl leading-relaxed mb-6">
            Nos collections réinventent l'élégance contemporaine avec des pièces qui marient 
            tradition et innovation. Chaque vêtement est le fruit d'un savoir-faire artisanal 
            associé à des matériaux d'exception.
          </p>
          <p class="leading-relaxed mb-6">
            Inspirée par les tendances internationales et ancrée dans notre héritage local, 
            cette collection incarne l'audace et la sophistication. Des coupes impeccables, 
            des tissus premium et une attention aux détails qui font la différence.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div class="text-center">
              <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-icon lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg></span>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Design Innovant</h3>
              <p class="text-sm text-gray-600">Des créations uniques qui repoussent les limites</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout-icon lucide-sprout"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg></span>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Éco-responsable</h3>
              <p class="text-sm text-gray-600">Des matériaux durables et éthiques</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg></span>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Exclusivité</h3>
              <p class="text-sm text-gray-600">Des pièces limitées et numérotées</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Subscription -->
    <section class="bg-gradient-to-r from-indigo-50 to-purple-50 py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Ne manquez pas nos nouveautés
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          Soyez le premier à découvrir nos nouvelles collections et offres exclusives
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Votre email"
            class="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
          <button
            @click="subscribeNewsletter"
            :disabled="!email"
            class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            S'abonner
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRightIcon } from 'lucide-vue-next'
import ProductCard from '@/components/Product/ProductCard.vue'
import api from '@/api/axiosConfig'

// State
const products = ref([])
const loading = ref(true)
const email = ref('')
const collectionInfos = ref(null)

// Methods
const loadNewCollection = async () => {
  try {
    loading.value = true
    // Appel API pour récupérer les produits de la nouvelle collection
    const response = await api.get('/collection/latest')

    console.log('Collection latest : ', response)
    
    if (response.success) {
      products.value = response.data.products
      collectionInfos.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la nouvelle collection:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const scrollToProducts = () => {
  const productsSection = document.querySelector('.grid')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const addToCart = (product) => {
  console.log('Ajouter au panier:', product)
  // Implémentez la logique d'ajout au panier
}

const addToWishlist = (product) => {
  console.log('Ajouter à la wishlist:', product)
  // Implémentez la logique d'ajout à la wishlist
}

const subscribeNewsletter = async () => {
  if (!email.value) return
  
  try {
    const response = await api.post('/newsletter/subscribe', {
      email: email.value,
      collection: 'new-2025'
    })
    
    if (response.data.success) {
      alert('Inscription réussie ! Vous serez informé du lancement.')
      email.value = ''
    }
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    alert('Une erreur est survenue. Veuillez réessayer.')
  }
}

// Lifecycle
onMounted(() => {
  loadNewCollection()
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

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>