<template>
  <div class="min-h-screen bg-gray-50 font-poppins">
    <!-- Hero Section -->
    <section class="relative h-[400px] md:h-[500px] bg-gradient-to-r from-indigo-800 to-indigo-700 overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-between px-8 md:px-16">
        <div class="text-white z-10">
          <h1 class="text-5xl md:text-7xl font-light mb-2">L'élégance</h1>
          <h1 class="text-5xl md:text-7xl font-light">dans la simplicité</h1>
        </div>
        <div class="hidden md:block absolute right-0 bottom-0 h-full w-2/3">
          <img 
            src="@/assets/images/01.png" 
            alt="Fashion model"
            class="h-full w-full object-contain"
          />
        </div>
        <button class="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>

    <!-- Products Section -->
    <div class="mx-auto px-4 py-8">
      <!-- Header with breadcrumb and results -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <!-- Breadcrumb -->
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav class="flex" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <router-link to="/" class="hover:text-indigo-600 transition-colors duration-200">
                    Accueil
                  </router-link>
                </li>
                <li class="flex items-center">
                  <ChevronRight class="h-4 w-4 mx-2" />
                  <router-link to="/shop" class="hover:text-indigo-600 transition-colors duration-200">
                    Boutique
                  </router-link>
                </li>
              </ol>
            </nav>
          </div>
          <h2 class="text-2xl font-semibold">{{ totalProducts }} résultat{{ totalProducts > 1 ? 's' : '' }} pour {{ selectedCategory ? getCategoryName(selectedCategory) : 'articles' }}</h2>
        </div>
        <div class="flex items-center gap-4 mt-4 md:mt-0">
          <button 
            @click="showFilters = !showFilters"
            class="md:hidden px-4 py-2 bg-[#0066bf] text-white rounded-lg"
          >
            Filtres {{ activeFiltersCount > 0 ? `(${activeFiltersCount})` : '' }}
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside 
          :class="[
            'lg:w-64 bg-white rounded-lg p-6 shadow-sm',
            showFilters ? 'block' : 'hidden lg:block'
          ]"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-lg">Filtrer</h3>
            <button 
              @click="resetFilters"
              class="text-[#0066bf] text-sm hover:underline"
            >
              Réinitialiser
            </button>
          </div>

          <!-- Categories Filter -->
          <div class="mb-6">
            <button 
              @click="categoryOpen = !categoryOpen"
              class="w-full flex items-center justify-between py-3 border-b"
            >
              <span class="font-medium">Catégories</span>
              <svg 
                :class="['w-5 h-5 transition-transform', categoryOpen ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="categoryOpen" class="mt-3 space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="category in categories" 
                :key="category.id"
                @click="selectCategory(category.id)"
                :class="[
                  'flex items-center gap-3 p-2 rounded cursor-pointer transition-colors',
                  selectedCategory === category.id ? 'bg-[#0066bf] text-white' : 'hover:bg-gray-100'
                ]"
              >
                <span class="text-sm">{{ category.name }}</span>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <button 
              @click="brandOpen = !brandOpen"
              class="w-full flex items-center justify-between py-3 border-b"
            >
              <span class="font-medium">Marques</span>
              <svg 
                :class="['w-5 h-5 transition-transform', brandOpen ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="brandOpen" class="mt-3 space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="brand in brands" 
                :key="brand.id"
                @click="selectedBrand = brand.id; applyBrandFilter()"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedBrand === brand.id"
                  class="w-4 h-4 accent-[#0066bf]"
                />
                <span class="text-sm">{{ brand.name }}</span>
              </div>
            </div>
          </div>

          <!-- Price Filter -->
          <div class="mb-6">
            <button 
              @click="priceOpen = !priceOpen"
              class="w-full flex items-center justify-between py-3 border-b"
            >
              <span class="font-medium">Prix</span>
              <svg 
                :class="['w-5 h-5 transition-transform', priceOpen ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="priceOpen" class="mt-3 space-y-3">
              <div class="flex gap-2">
                <input 
                  v-model="priceRange.min"
                  type="number" 
                  placeholder="Min"
                  class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066bf]"
                />
                <input 
                  v-model="priceRange.max"
                  type="number" 
                  placeholder="Max"
                  class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066bf]"
                />
              </div>
              <button 
                @click="applyPriceFilter"
                class="w-full py-2 bg-[#0066bf] text-white rounded-lg text-sm hover:bg-[#005cac] transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>

          <!-- Size Filter -->
          <div class="mb-6">
            <button 
              @click="sizeOpen = !sizeOpen"
              class="w-full flex items-center justify-between py-3 border-b"
            >
              <span class="font-medium">Taille</span>
              <svg 
                :class="['w-5 h-5 transition-transform', sizeOpen ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="sizeOpen" class="mt-3 grid grid-cols-3 gap-2">
              <button
                v-for="size in sizes"
                :key="size.id"
                @click="toggleSize(size)"
                :class="[
                  'px-3 py-2 border rounded-lg text-sm font-medium transition-colors',
                  isSizeSelected(size) 
                    ? 'bg-[#0066bf] text-white border-[#0066bf]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#0066bf]'
                ]"
              >
                {{ size.name }}
              </button>
            </div>
          </div>

          <!-- Color Filter -->
          <div class="mb-6">
            <button 
              @click="colorOpen = !colorOpen"
              class="w-full flex items-center justify-between py-3 border-b"
            >
              <span class="font-medium">Couleur</span>
              <svg 
                :class="['w-5 h-5 transition-transform', colorOpen ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="colorOpen" class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="color in colors"
                :key="color.id"
                @click="toggleColor(color)"
                :class="[
                  'w-10 h-10 rounded-full border-2 transition-all',
                  isColorSelected(color) 
                    ? 'border-[#0066bf] scale-110' 
                    : 'border-gray-300'
                ]"
                :style="{ backgroundColor: color.hex_code }"
                :title="color.name"
              />
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="flex-1">
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div class="flex items-center gap-2">
              <button 
                @click="viewGrid = true"
                :class="[
                  'p-2 rounded',
                  viewGrid ? 'bg-[#0066bf] text-white' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                </svg>
              </button>
              <button 
                @click="viewGrid = false"
                :class="[
                  'p-2 rounded',
                  !viewGrid ? 'bg-[#0066bf] text-white' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                </svg>
              </button>
            </div>

            <div class="relative">
              <button 
                @click="sortDropdownOpen = !sortDropdownOpen"
                class="flex items-center gap-2 px-4 py-2 border rounded-lg hover:border-[#0066bf] transition-colors"
              >
                <span class="text-sm">Trier par: {{ selectedSort.label }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                v-show="sortDropdownOpen"
                class="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10"
              >
                <button
                  v-for="option in filters.sort_options"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors',
                    selectedSort.value === option.value ? 'bg-blue-50 text-[#0066bf]' : ''
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066bf]"></div>
          </div>

          <!-- Products Grid/List -->
          <div v-else="products && products.length > 0">
            <!-- Grid View -->
            <div v-if="viewGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
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
          </div>
          
          <!-- No Results -->
          <div v-if="!loading && filteredProducts.length === 0" class="text-center py-16">
            <p class="text-gray-500 text-lg">Aucun produit trouvé</p>
            <button 
              @click="resetFilters"
              class="mt-4 px-6 py-2 bg-[#0066bf] text-white rounded-lg hover:bg-[#005cac] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border hover:bg-[#0066bf] hover:text-white'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              v-for="page in getVisiblePages()"
              :key="page"
              @click="page !== '...' && goToPage(page)"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                page === currentPage 
                  ? 'bg-[#0066bf] text-white' 
                  : page === '...' 
                    ? 'cursor-default' 
                    : 'bg-white border hover:bg-[#0066bf] hover:text-white'
              ]"
            >
              {{ page }}
            </button>

            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border hover:bg-[#0066bf] hover:text-white'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </main>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import ProductCard from '@/components/Product/ProductCard.vue'
import ProductListItem from '@/components/Product/ProductListItem.vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import ProductVariantModal from '@/components/Product/ProductVariantModal.vue'
import { ChevronRight } from 'lucide-vue-next'
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// Props du script fourni
const products = ref([])
const product = ref([])
const colors = ref([])
const sizes = ref([])
const categories = ref([{ id: null, name: 'Toutes les catégories' }])
const brands = ref([{ id: null, name: 'Toutes les marques' }])
const loading = ref(true)

const showVariantModal = ref(false)


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

const currencyStore = useCurrencyStore()

// Filter states
const selectedCategory = ref(null)
const selectedBrand = ref(null)
const selectedColors = ref([])
const selectedSizes = ref([])
const priceRange = ref({ min: '', max: '' })
const selectedSort = ref(filters.value.sort_options[0])
const sortDropdownOpen = ref(false)

// UI states
const viewGrid = ref(true)
const viewList = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(50)
const showFilters = ref(false)

// Accordion states
const categoryOpen = ref(true)
const brandOpen = ref(true)
const priceOpen = ref(true)
const sizeOpen = ref(true)
const colorOpen = ref(true)

// Computed
const totalProducts = computed(() => filteredProducts.value.length)

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category_id === selectedCategory.value)
  }
  
  if (selectedBrand.value) {
    filtered = filtered.filter(p => p.brand_id === selectedBrand.value)
  }

  if (selectedColors.value.length > 0) {
    filtered = filtered.filter(product => {
      if (!product.variants?.length) return false
      return product.variants.some(v => 
        v.color?.name && selectedColors.value.includes(v.color.name)
      )
    })
  }

  if (selectedSizes.value.length > 0) {
    filtered = filtered.filter(product => {
      if (!product.variants?.length) return false
      return product.variants.some(v => 
        v.size?.name && selectedSizes.value.includes(v.size.name)
      )
    })
  }

  if (priceRange.value.min || priceRange.value.max) {
    filtered = filtered.filter(product => {
      const price = parseFloat(product.final_price || product.price || 0)
      const min = priceRange.value.min ? parseFloat(priceRange.value.min) : 0
      const max = priceRange.value.max ? parseFloat(priceRange.value.max) : Infinity
      return price >= min && price <= max
    })
  }

  // Sort
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
    default:
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredProducts.value.length / itemsPerPage.value)
)

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedCategory.value) count++
  if (selectedBrand.value) count++
  count += selectedColors.value.length
  count += selectedSizes.value.length
  if (priceRange.value.min || priceRange.value.max) count++
  return count
})

// Methods
const loadProducts = async () => {
  try {
    loading.value = true
    // Simuler un appel API avec vos données
    const response = await productStore.fetchProducts()
    
    products.value = productStore.allProducts || []
    colors.value = productStore.allColors || []
    sizes.value = productStore.allSizes || []
    
    categories.value = [
      { id: null, name: 'Toutes les catégories' },
      ...(categoryStore.mainCategories || [])
    ]
    
    brands.value = [
      { id: null, name: 'Toutes les marques' },
      ...(productStore.allBrands || [])
    ]
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const onProductAdded = () => {
  console.log('Produit ajouté !')
  // Optionnel: afficher une notification toast
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
}

const getCategoryName = (id) => {
  return categories.value.find(c => c.id === id)?.name || 'clothes'
}

const toggleColor = (color) => {
  const colorName = typeof color === 'object' ? color.name : color
  const index = selectedColors.value.indexOf(colorName)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(colorName)
  }
  currentPage.value = 1
}

const isColorSelected = (color) => {
  const colorName = typeof color === 'object' ? color.name : color
  return selectedColors.value.includes(colorName)
}

const toggleSize = (size) => {
  const sizeName = typeof size === 'object' ? size.name : size
  const index = selectedSizes.value.indexOf(sizeName)
  if (index > -1) {
    selectedSizes.value.splice(index, 1)
  } else {
    selectedSizes.value.push(sizeName)
  }
  currentPage.value = 1
}

const isSizeSelected = (size) => {
  const sizeName = typeof size === 'object' ? size.name : size
  return selectedSizes.value.includes(sizeName)
}

const applyBrandFilter = () => {
  currentPage.value = 1
}

const applyPriceFilter = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  selectedCategory.value = null
  selectedBrand.value = null
  selectedColors.value = []
  selectedSizes.value = []
  priceRange.value = { min: '', max: '' }
  selectedSort.value = filters.value.sort_options[0]
  currentPage.value = 1
}

const selectSort = (sortValue) => {
  selectedSort.value = filters.value.sort_options.find(o => o.value === sortValue)
  sortDropdownOpen.value = false
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
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
    for (let i = 1; i <= total; i++) pages.push(i)
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

const addToWishlist = (product) => {
  console.log('Wishlist:', product)
}

const addToCart = async () => {
  if (isAddingToCart.value) return
  
  try {
    isAddingToCart.value = true
    
    // Récupérer les variants du produit
    const colorVariants = props.product.variants?.filter(variant => variant.type === 'color') || []
    const sizeVariants = props.product.variants?.filter(variant => variant.type === 'size') || []
    
    // Auto-sélectionner les premières options disponibles
    let selectedColor = null
    let selectedSize = null
    let selectedVariantId = null
    
    if (colorVariants.length > 0) {
      selectedColor = colorVariants[0]
      selectedVariantId = colorVariants[0].id
    }
    
    if (sizeVariants.length > 0) {
      selectedSize = sizeVariants[0]
      // Si on a déjà une couleur, combiner, sinon utiliser la taille
      selectedVariantId = sizeVariants[0].id
    }

    // Créer l'objet à ajouter au panier adapté à votre structure
    const cartItem = {
      product_id: props.product.id,
      name: props.product.name,
      price: props.product.final_price || props.product.price,
      quantity: 1,
      maxQuantity: props.product.available_stock || 99,
      image: props.product.main_image_url,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      variant_id: selectedVariantId // Pour la DB
    }

    // Ajouter au store local
    cartStore.addItem(cartItem)
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    // Optionnel: afficher un message d'erreur à l'utilisateur
  } finally {
    isAddingToCart.value = false
  }
}

onMounted(() => {
  loadProducts()
})

watch([selectedCategory, selectedBrand, selectedColors, selectedSizes, priceRange, selectedSort], () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>