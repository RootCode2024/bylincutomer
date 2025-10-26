<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Bannière de la catégorie -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-400">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="">
            <!-- Badge indiquant qu'il s'agit d'une catégorie spécifique -->
            <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white mb-3">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Catégorie
            </div>
            <h1 class="text-3xl font-bold text-white">{{ currentCategory?.name || 'Produits de la catégorie' }}</h1>
            <p class="mt-2 text-indigo-100" v-if="currentCategory">
              {{ products.length }} produit(s) dans cette catégorie
            </p>
            <p class="mt-2 text-indigo-100" v-else>
              Explorez notre sélection de produits
            </p>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="goToCart"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-200"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Voir le panier
            </button>
            <button 
              @click="showAllCategories"
              v-if="currentCategory"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Voir toutes les catégories
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" v-if="currentCategory">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <router-link to="/" class="hover:text-indigo-600 transition-colors duration-200">
              Accueil
            </router-link>
          </li>
          <li class="flex items-center">
            <ChevronRight class="h-4 w-4 mx-2" />
            <router-link to="/shop/categories" class="hover:text-indigo-600 transition-colors duration-200">
              Catégories
            </router-link>
          </li>
          <li class="flex items-center">
            <ChevronRight class="h-4 w-4 mx-2" />
            <span class="text-indigo-600 font-medium">{{ currentCategory.name }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Main Shop Section -->
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar Filters -->
        <div class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white p-6 rounded-lg shadow-sm sticky top-4 border border-gray-100">
            <!-- Indicateur de catégorie active -->
            <div v-if="currentCategory" class="mb-6 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <p class="text-xs text-indigo-700 font-medium mb-1">Catégorie active</p>
              <div class="flex items-center">
                <div class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                <span class="text-sm font-medium text-indigo-900">{{ currentCategory.name }}</span>
              </div>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900 mb-4">Filtrer par</h3>
            
            <!-- Brands Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Marques</h4>
              <div class="space-y-2">
                <select 
                  v-model="selectedBrand"
                  @change="applyBrandFilter"
                  class="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200"
                >
                  <option v-for="brand in brands" :value="brand.id" :key="brand.id">{{ brand.name }}</option>
                </select>
              </div>
            </div>
            
            <!-- Sous-catégories (si disponibles) -->
            <div class="mb-6" v-if="subCategories.length > 0">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Sous-catégories</h4>
              <div class="space-y-2">
                <div 
                  v-for="subCategory in subCategories" 
                  :key="subCategory.id"
                  @click="selectSubCategory(subCategory.id)"
                  class="flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors duration-200"
                  :class="{
                    'bg-indigo-50 text-indigo-700': selectedSubCategory === subCategory.id,
                    'hover:bg-gray-50': selectedSubCategory !== subCategory.id
                  }"
                >
                  <span class="ml-2 text-sm">{{ subCategory.name }}</span>
                </div>
              </div>
            </div>

            <!-- Price Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Prix</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <input 
                    v-model="priceRange.min"
                    type="number" 
                    placeholder="Min" 
                    class="w-20 p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200"
                    @change="applyPriceFilter"
                  >
                  <span class="mx-2 text-gray-500">à</span>
                  <input 
                    v-model="priceRange.max"
                    type="number" 
                    placeholder="Max" 
                    class="w-20 p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200"
                    @change="applyPriceFilter"
                  >
                </div>
                <button 
                  @click="applyPriceFilter"
                  class="w-full py-2 px-4 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                  Appliquer
                </button>
              </div>
            </div>

            <!-- Reset Filters -->
            <button 
              @click="resetFilters"
              class="w-full mt-4 py-2 px-4 border border-gray-200 text-sm rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
            >
              <RefreshCcw class="h-4 w-4 mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Header with title and sort options -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div>
              <h2 class="text-2xl font-bold text-gray-900" v-if="currentCategory">
                Produits de la catégorie "{{ currentCategory.name }}"
              </h2>
              <h2 class="text-2xl font-bold text-gray-900" v-else>
                Notre Boutique
              </h2>
              <p class="text-gray-500 mt-1">{{ totalProducts }} produit(s) trouvé(s)</p>
            </div>
            
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <!-- Sort Dropdown -->
              <div class="relative">
                <button 
                  @click="toggleSortDropdown" 
                  class="inline-flex justify-center w-full rounded-md border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  Trier par: {{ selectedSort.label }}
                  <ChevronDown class="-mr-1 ml-2 h-5 w-5" />
                </button>
                
                <transition name="fade">
                  <div 
                    v-if="sortDropdownOpen" 
                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100"
                  >
                    <div class="py-1">
                      <div 
                        v-for="sortOption in filters.sort_options" 
                        :key="sortOption.value"
                        @click="selectSort(sortOption.value)"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors duration-200"
                        :class="{ 'bg-indigo-50 text-indigo-700': selectedSort.value === sortOption.value }"
                      >
                        {{ sortOption.label }}
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              
              <!-- View Toggle -->
              <div class="flex items-center space-x-2 bg-gray-50 rounded-md p-1">
                <button 
                  @click="setGridView(true)" 
                  class="p-2 rounded-md transition-colors duration-200"
                  :class="{ 'bg-white shadow-sm text-indigo-600': gridView, 'text-gray-500': !gridView }"
                  aria-label="Vue grille"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  @click="setGridView(false)" 
                  class="p-2 rounded-md transition-colors duration-200"
                  :class="{ 'bg-white shadow-sm text-indigo-600': !gridView, 'text-gray-500': gridView }"
                  aria-label="Vue liste"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-16">
            <div class="animate-pulse">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="n in 8" :key="n" class="bg-gray-100 h-64 rounded-lg"></div>
              </div>
            </div>
          </div>

          <!-- Products Grid/List -->
          <div v-else-if="products && products.length > 0">
            <!-- Grid View -->
            <div v-if="gridView" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProductCard 
                v-for="product in paginatedProducts" 
                :key="`page-${currentPage}-product-${product.id}`"
                :product="product"
                @add-to-cart="addToCart"
                @add-to-wishlist="addToWishlist"
              />
            </div>
            
            <!-- List View -->
            <div v-else class="space-y-6">
              <ProductListItem 
                v-for="product in paginatedProducts" 
                :key="product.id"
                :product="product"
                @add-to-cart="addToCart"
                @add-to-wishlist="addToWishlist"
              />
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span class="sr-only">Précédent</span>
                  <ChevronLeft class="h-5 w-5" aria-hidden="true" />
                </button>
                
                <!-- Pages dynamiques -->
                <template v-for="page in getVisiblePages()" :key="page">
                  <button 
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="{ 
                      'bg-indigo-50 border-indigo-500 text-indigo-600': currentPage === page,
                      'z-10': currentPage === page
                    }"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {{ page }}
                  </button>
                  <span 
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>
                
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span class="sr-only">Suivant</span>
                  <ChevronRight class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
            <p class="mt-1 text-sm text-gray-500" v-if="currentCategory">
              Aucun produit disponible dans la catégorie "{{ currentCategory.name }}"
            </p>
            <p class="mt-1 text-sm text-gray-500" v-else>
              Essayez de modifier vos filtres de recherche.
            </p>
            <div class="mt-6">
              <button 
                @click="resetFilters"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors duration-200"
              >
                <RefreshCcw class="-ml-1 mr-2 h-5 w-5" />
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter -->
    <div class="bg-white py-16 sm:py-24">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-indigo-50 rounded-2xl px-6 py-16 sm:p-16">
          <div class="max-w-xl mx-auto lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div class="text-center lg:text-left">
              <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span class="block">Restez informé</span>
                <span class="block text-indigo-600">Nouveautés dans {{ currentCategory?.name || 'nos catégories' }}</span>
              </h2>
              <p class="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Soyez le premier à connaître les nouveaux produits et promotions dans cette catégorie.
              </p>
            </div>
            <div class="mt-8 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8">
              <form class="sm:flex" @submit.prevent="subscribeNewsletter">
                <label for="email-address" class="sr-only">Email</label>
                <input 
                  v-model="email" 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="w-full px-5 py-3 border border-gray-200 shadow-sm placeholder-gray-400 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200"
                  placeholder="Votre email"
                >
                <button 
                  type="submit" 
                  :disabled="isSubscribing"
                  class="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span v-if="!isSubscribing">S'abonner</span>
                  <span v-else>Inscription...</span>
                </button>
              </form>
              <p class="mt-3 text-sm text-gray-500">
                Nous respectons votre vie privée. Désabonnez-vous à tout moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProductVariantModal
      :product="product"
      :is-open="showVariantModal"
      @close="showVariantModal = false"
      @added="onProductAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/Product/ProductCard.vue'
import ProductVariantModal from '@/components/Product/ProductVariantModal.vue'
import ProductListItem from '@/components/Product/ProductListItem.vue'
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'

// Reactive data
const route = useRoute()
const router = useRouter()
const products = ref([])
const product = ref([])
const categories = ref([])
const brands = ref([
  { id: null, name: 'Toutes les marques' },
])
const loading = ref(true)
const authStore = useAuthStore()
const categoryStore = useCategoryStore()

const showVariantModal = ref(false)

// Current category data
const currentCategory = ref(null)
const subCategories = ref([])

const filters = ref({
  sort_options: [
    { value: 'newest', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'name_asc', label: 'Nom A-Z' },
    { value: 'name_desc', label: 'Nom Z-A' },
    { value: 'popularity', label: 'Popularité' }
  ]
})

// Filter and sort states
const selectedCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedBrand = ref(null)
const priceRange = ref({
  min: '',
  max: ''
})
const selectedSort = ref(filters.value.sort_options[0])
const sortDropdownOpen = ref(false)

// View and pagination states
const gridView = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Newsletter
const email = ref('')
const isSubscribing = ref(false)

// Computed properties
const totalProducts = computed(() => {
  return filteredProducts.value.length
})

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Filter by sub-category
  if (selectedSubCategory.value) {
    filtered = filtered.filter(product => product.category_id === selectedSubCategory.value)
  }
  
  // Filter by brand
  if (selectedBrand.value) {
    filtered = filtered.filter(product => product.brand_id === selectedBrand.value)
  }

  // Filter by price range
  if (priceRange.value.min || priceRange.value.max) {
    filtered = filtered.filter(product => {
      const price = parseFloat(product.final_price || product.price || 0)
      const min = priceRange.value.min ? parseFloat(priceRange.value.min) : 0
      const max = priceRange.value.max ? parseFloat(priceRange.value.max) : Infinity
      return price >= min && price <= max
    })
  }

  // Sort products
  switch (selectedSort.value.value) {
    case 'price_asc':
      filtered.sort((a, b) => parseFloat(a.final_price || a.price || 0) - parseFloat(b.final_price || b.price || 0))
      break
    case 'price_desc':
      filtered.sort((a, b) => parseFloat(b.final_price || b.price || 0) - parseFloat(a.final_price || a.price || 0))
      break
    case 'name_asc':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'name_desc':
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      break
    case 'popularity':
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      break
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      break
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

// Methods
const loadProducts = async () => {
  const categorySlug = route.params.slug || null
  try {
    loading.value = true
    const response = await categoryStore.show(categorySlug)
    console.log('Response fetched:', response)
    
    if (response.success) {
      products.value = response?.products || []
      
      // Traitement des catégories
      const responseCategories = response.categories || []
      categories.value = responseCategories

      // Trouver la catégorie courante
      if (categorySlug && responseCategories.length > 0) {
        currentCategory.value = responseCategories.find(cat => 
          cat.slug === categorySlug || cat.name.toLowerCase() === categorySlug.toLowerCase()
        )
        
        // Trouver les sous-catégories
        if (currentCategory.value) {
          subCategories.value = responseCategories.filter(cat => 
            cat.parent_id === currentCategory.value.id
          )
        }
      }

      // Traitement des marques
      const responseBrands = response.brands || []
      brands.value = [
        { id: null, name: 'Toutes les marques' },
        ...responseBrands.map(brand => ({
          id: brand.id,
          name: brand.name,
        }))
      ]
    }
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const onProductAdded = () => {
  console.log('Produit ajouté !')
  // Optionnel: afficher une notification toast
}

const selectSubCategory = (categoryId) => {
  selectedSubCategory.value = categoryId
  currentPage.value = 1
}

const applyBrandFilter = () => {
  currentPage.value = 1
}

const applyPriceFilter = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  selectedSubCategory.value = null
  selectedBrand.value = null
  priceRange.value = { min: '', max: '' }
  selectedSort.value = filters.value.sort_options[0]
  currentPage.value = 1
}

const showAllCategories = () => {
  router.push('/shop/categories')
}

const toggleSortDropdown = () => {
  sortDropdownOpen.value = !sortDropdownOpen.value
}

const selectSort = (sortValue) => {
  selectedSort.value = filters.value.sort_options.find(option => option.value === sortValue)
  sortDropdownOpen.value = false
  currentPage.value = 1
}

const setGridView = (isGrid) => {
  gridView.value = isGrid
}

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = async (page) => {
  currentPage.value = page
  await nextTick()
}

const getVisiblePages = () => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
}

// Cart and wishlist methods
const addToCart = (product) => {
  console.log('Ajout au panier:', product)
}

const addToWishlist = (product) => {
  console.log('Ajout à la wishlist:', product)
}

// Navigation methods
const goToCart = () => {
  router.push('/cart')
}

// Newsletter
const subscribeNewsletter = async () => {
  try {
    isSubscribing.value = true
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: email.value,
        category: currentCategory.value?.name || 'all'
      })
    })
    
    if (response.ok) {
      alert('Inscription réussie à la newsletter!')
      email.value = ''
    } else {
      const errorData = await response.json()
      alert(errorData.message || 'Erreur lors de l\'inscription')
    }
  } catch (error) {
    console.error('Erreur newsletter:', error)
    alert('Erreur lors de l\'inscription')
  } finally {
    isSubscribing.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    sortDropdownOpen.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  loadProducts()
  document.addEventListener('click', handleClickOutside)
})

// Watchers
let filterTimeout = null
watch([selectedSubCategory, selectedBrand, priceRange, selectedSort], () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}, { deep: true })

// Watch route changes
watch(() => route.params.slug, () => {
  loadProducts()
  resetFilters()
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (filterTimeout) clearTimeout(filterTimeout)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateY(0);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}
</style>