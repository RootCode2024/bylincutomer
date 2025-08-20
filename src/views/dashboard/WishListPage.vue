<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- En-tête -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">Ma Wishlist</h1>
      <div class="flex gap-2">
        <button 
          @click="shareWishlist"
          class="px-4 py-2 rounded-md flex items-center gap-2 bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <i class="fas fa-share-alt"></i> Partager
        </button>
        <button 
          v-if="wishlistItems.length > 0"
          @click="addAllToCart"
          class="px-4 py-2 rounded-md flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <i class="fas fa-cart-plus"></i> Tout ajouter au panier
        </button>
      </div>
    </div>

    <!-- Contrôles -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Rechercher dans ma wishlist..."
          class="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>
      <div class="flex items-center gap-3">
        <select 
          v-model="sortOption"
          class="border rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="date-desc">Plus récent</option>
          <option value="date-asc">Plus ancien</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
        <button 
          @click="toggleViewMode"
          class="p-2 text-gray-500 hover:text-indigo-600"
        >
          <i :class="viewMode === 'grid' ? 'fas fa-list' : 'fas fa-th'"></i>
        </button>
      </div>
    </div>

    <!-- Liste vide -->
    <div v-if="wishlistItems.length === 0" class="text-center py-16 border-2 border-dashed rounded-lg">
      <i class="far fa-heart text-5xl text-gray-400 mb-4"></i>
      <h3 class="text-xl font-medium text-gray-700 mb-2">Votre wishlist est vide</h3>
      <p class="text-gray-500 mb-4">Commencez à ajouter des produits que vous aimez</p>
      <router-link 
        to="/products"
        class="inline-block px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
      >
        Parcourir les produits
      </router-link>
    </div>

    <!-- Vue Grille -->
    <div v-if="viewMode === 'grid' && wishlistItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="(item, index) in filteredItems" 
        :key="item.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="relative aspect-square">
          <router-link :to="'/product/' + item.slug">
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-full h-full object-cover"
            >
            <div v-if="item.discount" class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{{ item.discount }}%
            </div>
          </router-link>
          <button 
            @click="removeFromWishlist(index)"
            class="absolute top-3 right-3 p-2 bg-white rounded-full shadow text-gray-600 hover:text-red-500 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4">
          <h3 class="mb-1">
            <router-link 
              :to="'/product/' + item.slug"
              class="font-semibold text-gray-900 hover:text-indigo-600"
            >
              {{ item.name }}
            </router-link>
          </h3>
          <p class="text-sm text-gray-500">{{ item.category }}</p>
          <div class="mt-2">
            <span class="text-lg font-bold text-gray-900">{{ item.price }}€</span>
            <span v-if="item.originalPrice" class="ml-2 text-sm text-gray-500 line-through">
              {{ item.originalPrice }}€
            </span>
          </div>
          <div class="flex justify-between mt-4">
            <button 
              @click="toggleFavorite(index)"
              class="p-2 transition-colors"
              :class="item.favorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
            >
              <i class="fas fa-heart"></i>
            </button>
            <button 
              @click="addToCart(item)"
              class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm transition-colors"
              :class="{ 'bg-gray-300 cursor-not-allowed': !item.inStock }"
              :disabled="!item.inStock"
            >
              <i class="fas fa-shopping-cart mr-1"></i> Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Liste -->
    <div v-if="viewMode === 'list' && wishlistItems.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilité</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="item.id" class="border-b border-gray-200">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-4">
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-12 h-12 rounded object-cover"
                >
                <div>
                  <h4 class="font-semibold text-gray-900">
                    <router-link 
                      :to="'/product/' + item.slug"
                      class="hover:text-indigo-600"
                    >
                      {{ item.name }}
                    </router-link>
                  </h4>
                  <p class="text-sm text-gray-500">{{ item.category }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="font-bold text-gray-900">{{ item.price }}€</span>
              <span v-if="item.originalPrice" class="ml-2 text-sm text-gray-500 line-through">
                {{ item.originalPrice }}€
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center" :class="item.inStock ? 'text-green-600' : 'text-red-600'">
                <span class="w-2 h-2 rounded-full mr-1.5" :class="item.inStock ? 'bg-green-500' : 'bg-red-500'"></span>
                {{ item.inStock ? 'En stock' : 'Rupture' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button 
                  @click="toggleFavorite(index)"
                  class="p-2 transition-colors"
                  :class="item.favorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
                >
                  <i class="fas fa-heart"></i>
                </button>
                <button 
                  @click="addToCart(item)"
                  class="p-2 transition-colors"
                  :class="item.inStock ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-400 cursor-not-allowed'"
                  :disabled="!item.inStock"
                >
                  <i class="fas fa-cart-plus"></i>
                </button>
                <button 
                  @click="removeFromWishlist(index)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredItems.length > itemsPerPage" class="flex justify-center items-center mt-8 gap-1">
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="w-10 h-10 flex items-center justify-center rounded-md bg-white border hover:bg-gray-50 transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span 
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        class="w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-colors"
        :class="page === currentPage ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'"
      >
        {{ page }}
      </span>
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="w-10 h-10 flex items-center justify-center rounded-md bg-white border hover:bg-gray-50 transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Modal de partage -->
    <ShareModal 
      v-if="showShareModal"
      @close="showShareModal = false"
      :share-link="shareableLink"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ShareModal from '@/components/ui/ModalUi.vue'

// Données de la wishlist
const wishlistItems = ref([
  {
    id: 1,
    slug: 'casque-sans-fil-premium',
    name: 'Casque sans fil Premium',
    category: 'Audio',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    image: 'https://via.placeholder.com/300',
    inStock: true,
    favorite: true,
    addedDate: '2023-05-15'
  },
  {
    id: 2,
    slug: 'montre-connectee-pro',
    name: 'Montre connectée Pro',
    category: 'Wearables',
    price: 229.99,
    image: 'https://via.placeholder.com/300',
    inStock: true,
    favorite: false,
    addedDate: '2023-06-02'
  },
  {
    id: 3,
    slug: 'appareil-photo-compact',
    name: 'Appareil photo compact',
    category: 'Photographie',
    price: 349.99,
    originalPrice: 399.99,
    discount: 12,
    image: 'https://via.placeholder.com/300',
    inStock: false,
    favorite: true,
    addedDate: '2023-04-20'
  }
])

// États UI
const searchQuery = ref('')
const sortOption = ref('date-desc')
const viewMode = ref('grid')
const showShareModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Données calculées
const filteredItems = computed(() => {
  let items = [...wishlistItems.value]
  
  // Filtrage
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query))
  }
  
  // Tri
  switch (sortOption.value) {
    case 'date-desc': return items.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
    case 'date-asc': return items.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate))
    case 'price-asc': return items.sort((a, b) => a.price - b.price)
    case 'price-desc': return items.sort((a, b) => b.price - a.price)
    default: return items
  }
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value))
const shareableLink = computed(() => `${window.location.origin}/wishlist/share/12345`)

// Méthodes
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const toggleFavorite = (index) => {
  wishlistItems.value[index].favorite = !wishlistItems.value[index].favorite
}

const removeFromWishlist = (index) => {
  wishlistItems.value.splice(index, 1)
}

const addToCart = (item) => {
  console.log('Ajout au panier:', item)
  // Implémentez la logique d'ajout au panier
}

const addAllToCart = () => {
  wishlistItems.value.forEach(item => addToCart(item))
}

const shareWishlist = () => {
  showShareModal.value = true
}
</script>