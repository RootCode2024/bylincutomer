<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">Nos Catégories</h1>
          <p class="mt-3 text-lg text-gray-600">
            Découvrez notre sélection organisée par catégories
          </p>
          <div class="mt-4 flex justify-center">
            <div class="inline-flex rounded-md shadow-sm">
              <router-link
                to="/shop"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Voir tous les produits
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div class="h-12 w-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Category Cards -->
        <div
          v-for="category in categories"
          :key="category.id"
          class="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
        >
          <router-link
            :to="`/shop/category/${category.slug}`"
            class="block p-6 text-center"
          >
            <!-- Category Icon -->
            <div class="mb-4">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200 overflow-hidden">
                <img
                  v-if="category.icon"
                  :src="getImageUrl(category.icon)"
                  :alt="category.name"
                  class="w-10 h-10 object-contain"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />
                <div v-if="!category.icon" class="w-10 h-10 flex items-center justify-center">
                  <svg
                    class="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Category Name -->
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
              {{ category.name }}
            </h3>

            <!-- Category Description -->
            <p v-if="category.description" class="mt-2 text-sm text-gray-500 line-clamp-2">
              {{ category.description }}
            </p>

            <!-- Product Count -->
            <div class="mt-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {{ category.products_count || 0 }} produit(s)
              </span>
            </div>

            <!-- Subcategories Count -->
            <div v-if="category.subcategories_count > 0" class="mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ category.subcategories_count }} sous-catégorie(s)
              </span>
            </div>

            <!-- View Category Button -->
            <div class="mt-4">
              <span class="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200">
                Voir la catégorie →
              </span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune catégorie disponible</h3>
        <p class="mt-2 text-sm text-gray-500">
          Les catégories seront bientôt disponibles.
        </p>
      </div>

      <!-- Hierarchical View (Optional) -->
      <div v-if="!loading && categories.length > 0" class="mt-16">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Vue hiérarchique des catégories</h2>
          <div class="space-y-3">
            <div
              v-for="category in categories.filter(c => !c.parent_id)"
              :key="`parent-${category.id}`"
              class="border-l-2 border-indigo-200 pl-4"
            >
              <router-link
                :to="`/categories/${category.slug}`"
                class="flex items-center justify-between py-2 group"
              >
                <span class="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {{ category.name }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ category.products_count || 0 }} produits
                </span>
              </router-link>
              
              <!-- Subcategories -->
              <div
                v-if="getSubcategories(category.id).length > 0"
                class="ml-6 space-y-2 mt-2"
              >
                <div
                  v-for="subcategory in getSubcategories(category.id)"
                  :key="subcategory.id"
                  class="border-l-2 border-gray-200 pl-4"
                >
                  <router-link
                    :to="`/categories/${subcategory.slug}`"
                    class="flex items-center justify-between py-1 group"
                  >
                    <span class="text-base text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                      {{ subcategory.name }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ subcategory.products_count || 0 }} produits
                    </span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600">{{ totalCategories }}</div>
            <div class="text-sm font-medium text-gray-500 mt-1">Catégories</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600">{{ totalProducts }}</div>
            <div class="text-sm font-medium text-gray-500 mt-1">Produits au total</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600">{{ totalSubcategories }}</div>
            <div class="text-sm font-medium text-gray-500 mt-1">Sous-catégories</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

// Reactive data
const categories = ref([])
const loading = ref(true)

// Computed properties
const totalCategories = computed(() => {
  return categories.value.length
})

const totalProducts = computed(() => {
  return categories.value.reduce((total, category) => total + (category.products_count || 0), 0)
})

const totalSubcategories = computed(() => {
  return categories.value.reduce((total, category) => total + (category.children_count || 0), 0)
})

// Methods
const loadCategories = async () => {
  try {
    loading.value = true
    const response = await categoryStore.productsCategories()
    
    if (response.success) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    categories.value = []
  } finally {
    loading.value = false
  }
}

const getSubcategories = (parentId) => {
  return categories.value.filter(category => category.parent_id === parentId)
}

const getImageUrl = (iconPath) => {
  // Si c'est une URL complète, on la retourne telle quelle
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath
  }
  
  // Si c'est un chemin relatif, on l'ajoute à la base URL de l'API
  if (iconPath.startsWith('/')) {
    return `${import.meta.env.VITE_API_URL}${iconPath}`
  }
  
  // Sinon, on suppose que c'est un chemin relatif depuis le dossier des images
  return `${import.meta.env.VITE_API_URL}/storage/${iconPath}`
}

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}
</style>