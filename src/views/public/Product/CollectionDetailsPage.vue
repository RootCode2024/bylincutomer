<template>
    <div>
        <!-- Hero Section de la Collection -->
        <section class="relative bg-gray-900 text-white">
            <!-- Image de fond -->
            <div 
                class="absolute inset-0 bg-cover bg-center"
                :style="{
                    backgroundImage: `url('https://api.bylin-style.com${collection.banner_image}')`
                }"
            >
                <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            <div class="relative container mx-auto px-4 py-24">
                <div class="max-w-3xl">

                    <!-- Informations principales -->
                    <div class="flex items-start justify-between mb-6">
                        <div class="flex-1">
                            <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ collection.name }}</h1>
                            <p class="text-xl md:text-2xl opacity-90 mb-4">
                                {{ collection.description || 'Une collection exceptionnelle soigneusement sélectionnée pour vous' }}
                            </p>
                        </div>
                        
                        <!-- Référence et badges -->
                        <div class="text-right ml-6">
                            <div class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                                {{ collection.ref }}
                            </div>
                            <div v-if="collection.is_featured" class="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                                Vedette
                            </div>
                            <div v-if="collection.is_trending" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Tendence
                            </div>
                        </div>
                    </div>

                    <!-- Métadonnées et statistiques -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Produits -->
                        <div class="flex items-center gap-3 p-4 bg-white bg-opacity-10 rounded-lg">
                            <ShoppingBagIcon class="w-6 h-6 text-blue-400" />
                            <div>
                                <div class="text-2xl font-bold">{{ filteredProducts.length || 0 }}</div>
                                <div class="text-sm opacity-80">Produits</div>
                            </div>
                        </div>

                        <!-- Saison et année -->
                        <div class="flex items-center gap-3 p-4 bg-white bg-opacity-10 rounded-lg">
                            <ClockIcon class="w-6 h-6 text-purple-400" />
                            <div>
                                <div class="text-sm font-semibold">{{ collection.season || 'Toutes saisons' }}</div>
                                <div class="text-sm opacity-80">{{ collection.year || '2024' }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Dates importantes -->
                    <div class="flex flex-wrap gap-6 text-sm text-gray-300">
                        <div v-if="collection.start_date" class="flex items-center gap-2">
                            <CalendarIcon class="w-4 h-4" />
                            <span>Sortie : {{ formatDate(collection.start_date) }}</span>
                        </div>
                        <div v-if="collection.end_date" class="flex items-center gap-2">
                            <CalendarIcon class="w-4 h-4" />
                            <span>Fin: {{ formatDate(collection.end_date) }}</span>
                        </div>
                        <div v-if="collection.featured_until" class="flex items-center gap-2">
                            <StarIcon class="w-4 h-4 text-yellow-400" />
                            <span>Vedette jusqu'au {{ formatDate(collection.featured_until) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Filtres Produits -->
        <section class="bg-white border-b">
            <div class="container mx-auto px-4 py-6">
                <div class="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    <!-- Résultats et informations -->
                    <div class="flex flex-wrap items-center gap-6">
                        <div class="text-sm text-gray-600">
                            {{ filteredProducts.length }} produit(s) affiché(s) sur {{ collection.max_products_display }} maximum
                        </div>
                        
                        <!-- Options d'affichage -->
                        <div class="flex items-center gap-4 text-sm">
                            <label class="flex items-center gap-2">
                                <input 
                                    v-model="showBadges" 
                                    type="checkbox" 
                                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                />
                                <span class="text-gray-700">Badges</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input 
                                    v-model="showPrices" 
                                    type="checkbox" 
                                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                    :checked="collection.show_prices"
                                />
                                <span class="text-gray-700">Prix</span>
                            </label>
                        </div>
                    </div>

                    <!-- Filtres -->
                    <div class="flex flex-wrap gap-4">
                        <select
                            v-model="productSort"
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="newest">Nouveautés</option>
                            <option value="price_asc">Prix croissant</option>
                            <option value="price_desc">Prix décroissant</option>
                            <option value="name_asc">Nom A-Z</option>
                            <option value="name_desc">Nom Z-A</option>
                            <option value="rating_desc">Meilleures notes</option>
                        </select>

                        <select
                            v-model="productsPerPage"
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="12">12 produits</option>
                            <option value="24">24 produits</option>
                            <option value="48">48 produits</option>
                            <option :value="collection.max_products_display">Tous</option>
                        </select>

                        <button
                            @click="toggleProductFilters"
                            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            <FunnelIcon class="w-4 h-4" />
                            Filtres
                            <span v-if="activeFilterCount > 0" class="bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {{ activeFilterCount }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Filtres avancés produits -->
                <div v-if="showProductFilters" class="mt-6 p-6 bg-gray-50 rounded-lg border">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Filtres avancés</h3>
                        <button 
                            @click="resetFilters"
                            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Réinitialiser
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <!-- Prix -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <input
                                        v-model.number="priceRange.min"
                                        type="number"
                                        placeholder="Min"
                                        class="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span class="text-gray-500">-</span>
                                    <input
                                        v-model.number="priceRange.max"
                                        type="number"
                                        placeholder="Max"
                                        class="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Options de stock -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input v-model="filters.inStock" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span class="ml-2 text-sm text-gray-700">En stock seulement</span>
                                </label>
                                <label class="flex items-center">
                                    <input v-model="filters.onSale" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span class="ml-2 text-sm text-gray-700">En promotion</span>
                                </label>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input v-model="filters.highRated" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span class="ml-2 text-sm text-gray-700">4+ étoiles</span>
                                </label>
                            </div>
                        </div>

                        <!-- Statistiques de prix -->
                        <div class="p-3 bg-white rounded-lg border">
                            <h4 class="text-sm font-medium text-gray-700 mb-2">Fourchette de prix</h4>
                            <div class="text-xs text-gray-600">
                                <div>Moyenne: {{ formatPrice(calculateAveragePrice()) }} FCFA</div>
                                <div>Min: {{ formatPrice(calculateMinPrice()) }} FCFA</div>
                                <div>Max: {{ formatPrice(calculateMaxPrice()) }} FCFA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produits de la Collection -->
        <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
                <!-- En-tête des produits -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Produits de la Collection</h2>
                        <p class="text-gray-600 mt-1">
                            Affichage {{ startIndex + 1 }}-{{ endIndex }} sur {{ filteredProducts.length }} produits
                        </p>
                    </div>
                    
                    <!-- Statistiques rapides -->
                    <div class="flex gap-4 text-sm text-gray-600">
                        <span>{{ productsOnSaleCount }} en promotion</span>
                        <span>•</span>
                        <span>Note moyenne: {{ collection.average_rating }}/5</span>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="flex justify-center py-12">
                    <ArrowPathIcon class="w-8 h-8 animate-spin text-blue-600" />
                    <span class="ml-2 text-gray-600">Chargement des produits...</span>
                </div>

                <!-- Produits -->
                <div v-else-if="paginatedProducts.length > 0" 
                     :class="[
                         'grid gap-6 transition-all duration-300',
                         collection.layout_type === 'carousel' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                     ]">
                    <ProductCard
                        v-for="product in paginatedProducts"
                        :key="`product-${product.id}`"
                        :product="product"
                        @add-to-cart="addToCart"
                        @add-to-wishlist="addToWishlist"
                    />
                </div>

                <!-- Aucun produit -->
                <div v-else class="text-center py-12">
                    <ShoppingBagIcon class="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                    <p class="text-gray-600 mb-6">Essayez de modifier vos critères de filtrage</p>
                    <button
                        @click="resetFilters"
                        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>

                <!-- Pagination produits -->
                <div v-if="totalPages > 1" class="flex justify-center mt-12">
                    <div class="flex gap-2">
                        <button
                            @click="currentProductPage = Math.max(1, currentProductPage - 1)"
                            :disabled="currentProductPage === 1"
                            :class="[
                                'px-4 py-2 rounded-lg border transition-colors flex items-center gap-2',
                                currentProductPage === 1
                                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            ]"
                        >
                            <ChevronLeftIcon class="w-4 h-4" />
                            Précédent
                        </button>
                        
                        <button
                            v-for="page in visiblePages"
                            :key="page"
                            @click="currentProductPage = page"
                            :class="[
                                'px-4 py-2 rounded-lg border transition-colors min-w-10',
                                currentProductPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            ]"
                        >
                            {{ page }}
                        </button>

                        <button
                            @click="currentProductPage = Math.min(totalPages, currentProductPage + 1)"
                            :disabled="currentProductPage === totalPages"
                            :class="[
                                'px-4 py-2 rounded-lg border transition-colors flex items-center gap-2',
                                currentProductPage === totalPages
                                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            ]"
                        >
                            Suivant
                            <ChevronRightIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Autres Collections -->
        <section class="py-16 bg-white border-t">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">Découvrez Nos Autres Collections</h2>
                    <router-link 
                        to="/collections" 
                        class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                    >
                        Voir toutes
                        <ChevronRightIcon class="w-4 h-4" />
                    </router-link>
                </div>
                
                <div v-if="otherCollections.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        v-for="otherCollection in otherCollections"
                        :key="otherCollection.id"
                        class="group cursor-pointer bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                        <div class="relative overflow-hidden rounded-xl mb-4">
                            <img
                                :src="getFullImageUrl(otherCollection)"
                                :alt="otherCollection.name"
                                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            
                            <!-- Badges des autres collections -->
                            <div class="absolute top-3 left-3 flex gap-2">
                                <div v-if="otherCollection.is_featured" class="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    Vedette
                                </div>
                                <div v-if="otherCollection.is_trending" class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    Tendence
                                </div>
                            </div>
                        </div>
                        
                        <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            <router-link :to="`/collections/${otherCollection.slug}`">{{ otherCollection.name }}</router-link> 
                        </h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ otherCollection.description }}</p>
                        
                        <div class="flex items-center justify-between text-sm text-gray-500">
                            <span>{{ otherCollection.products_count || 0 }} produits</span>
                            <span class="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{{ otherCollection.ref }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    ShoppingBagIcon,
    CalendarIcon,
    StarIcon,
    FunnelIcon,
    ArrowPathIcon,
    ClockIcon,
} from '@heroicons/vue/24/outline'
import ProductCard from '@/components/Product/ProductCard.vue'
import { useProductStore } from '@/stores/product';


const route = useRoute()
const productStore = useProductStore()


const collection = ref({ products: [] })
const otherCollections = ref([])
const loading = ref(true)

// Filtres et pagination
const productSort = ref('newest')
const productsPerPage = ref(12)
const currentProductPage = ref(1)
const showProductFilters = ref(false)
const showBadges = ref(true)
const showPrices = ref(true)

const priceRange = ref({
    min: null,
    max: null
})

const filters = ref({
    inStock: false,
    onSale: false,
    highRated: false
})

// Computed properties
const filteredProducts = computed(() => {
    let products = [...collection.value.products]
    
    // Filtre par prix
    if (priceRange.value.min !== null) {
        products = products.filter(product => 
            parseFloat(product.discounted_price || product.price) >= priceRange.value.min
        )
    }
    if (priceRange.value.max !== null) {
        products = products.filter(product => 
            parseFloat(product.discounted_price || product.price) <= priceRange.value.max
        )
    }
    
    // Filtre en stock
    if (filters.value.inStock) {
        products = products.filter(product => product.stock_quantity > 0)
    }
    
    // Filtre en promotion
    if (filters.value.onSale) {
        products = products.filter(product => product.discounted_price !== null)
    }
    
    // Filtre par note
    if (filters.value.highRated) {
        products = products.filter(product => parseFloat(product.average_rating) >= 4)
    }
    
    // Tri
    switch (productSort.value) {
        case 'price_asc':
            products.sort((a, b) => parseFloat(a.discounted_price || a.price) - parseFloat(b.discounted_price || b.price))
            break
        case 'price_desc':
            products.sort((a, b) => parseFloat(b.discounted_price || b.price) - parseFloat(a.discounted_price || a.price))
            break
        case 'name_asc':
            products.sort((a, b) => a.name.localeCompare(b.name))
            break
        case 'name_desc':
            products.sort((a, b) => b.name.localeCompare(a.name))
            break
        case 'rating_desc':
            products.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating))
            break
        case 'newest':
        default:
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            break
    }
    
    return products
})

const paginatedProducts = computed(() => {
    const start = (currentProductPage.value - 1) * productsPerPage.value
    const end = start + productsPerPage.value
    return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / productsPerPage.value)
})

const startIndex = computed(() => {
    return (currentProductPage.value - 1) * productsPerPage.value
})

const endIndex = computed(() => {
    return Math.min(startIndex.value + productsPerPage.value, filteredProducts.value.length)
})

const activeFilterCount = computed(() => {
    let count = 0
    if (priceRange.value.min !== null || priceRange.value.max !== null) count++
    if (filters.value.inStock) count++
    if (filters.value.onSale) count++
    if (filters.value.highRated) count++
    return count
})

const productsOnSaleCount = computed(() => {
    return collection.value.products.filter(product => product.discounted_price !== null).length
})

const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = currentProductPage.value
    const delta = 2
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        pages.push(i)
    }
    
    if (current - delta > 2) {
        pages.unshift('...')
    }
    if (current + delta < total - 1) {
        pages.push('...')
    }
    
    pages.unshift(1)
    if (total > 1) {
        pages.push(total)
    }
    
    return pages
})

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'Non définie'
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatPrice = (price) => {
    if (!price) return '0'
    return parseFloat(price).toLocaleString('fr-FR')
}

const getFullImageUrl = (collection) => {
    if (collection.banner_image) {
        return `https://api.bylin-style.com${collection.banner_image}`
    }
    if (collection.cover_image) {
        return `https://api.bylin-style.com${collection.cover_image}`
    }
    return 'https://placehold.co/80?text=Collection+bylin'
}

const toggleProductFilters = () => {
    showProductFilters.value = !showProductFilters.value
}

const resetFilters = () => {
    priceRange.value = { min: null, max: null }
    filters.value = {
        inStock: false,
        onSale: false,
        highRated: false
    }
    productSort.value = 'newest'
    currentProductPage.value = 1
}

const calculateAveragePrice = () => {
    if (collection.value.products.length === 0) return 0
    const total = collection.value.products.reduce((sum, product) => {
        return sum + parseFloat(product.discounted_price || product.price)
    }, 0)
    return total / collection.value.products.length
}

const calculateMinPrice = () => {
    if (collection.value.products.length === 0) return 0
    return Math.min(...collection.value.products.map(product => 
        parseFloat(product.discounted_price || product.price)
    ))
}

const calculateMaxPrice = () => {
    if (collection.value.products.length === 0) return 0
    return Math.max(...collection.value.products.map(product => 
        parseFloat(product.discounted_price || product.price)
    ))
}

// Fetch data
const fetchCollectionData = async () => {
    try {
        loading.value = true
        const slugParam = route.params.slug
        const response = await productStore.fetchCollection(slugParam)

        if (response) {
            const { collection: coll, products, other_collections } = productStore.collection

            collection.value = {
                ...coll,
                products: products || []
            }

            otherCollections.value = other_collections || []

            // Initialiser les prix min/max
            if (collection.value.products.length > 0) {
                priceRange.value.min = calculateMinPrice()
                priceRange.value.max = calculateMaxPrice()
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la collection:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    console.log('ARTYU // ')
    fetchCollectionData()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.shadow-xl {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>