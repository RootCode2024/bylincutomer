<template>
  <div class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <div class="flex flex-col sm:flex-row">
      <!-- Product Image -->
      <div class="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
        <RouterLink 
          :to="`/product/${product.slug}`" 
          class="block h-full w-full"
        >
          <img
            v-if="product.main_image_url"
            :src="product.main_image_url"
            :alt="product.slug"
            class="w-full h-full object-center object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-200"
          >
            No Image
          </div>
        </RouterLink>
        
        <!-- Badges -->
        <div class="absolute top-2 left-2 flex space-x-2">
          <span 
            v-if="product.is_new"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            Nouveau
          </span>
          <span 
            v-if="product.is_best_seller"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
          >
            Best-seller
          </span>
          <span 
            v-if="product.discount > 0"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
          >
            -{{ Math.round(product.discount) }}%
          </span>
          
        </div>
      </div>

      <!-- Product Details -->
      <div class="flex-1 p-4 sm:p-6">
        <div class="flex flex-col h-full justify-between">
          <div>
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  <RouterLink :to="`/product/${product.slug}`">
                    {{ product.name }}
                  </RouterLink>
                </h3>
                <!-- <p class="mt-1 text-sm text-gray-500 capitalize">
                  {{ product.category }}
                </p> -->
              </div>
              
              <!-- Desktop Price -->
              <div class="ml-4 hidden sm:block text-right">
                <div class="text-lg font-semibold text-gray-900">
                  <p class="text-sm text-red-500 line-through" v-if="product.discounted_price">
                    {{ currencyStore.formatCurrency(product.price) }}
                  </p>
                  <p class="text-xl text-gray-900">{{ currencyStore.formatCurrency(product.final_price) }}</p>
                </div>
              </div>
            </div>

            <!-- Rating -->
            <div class="mt-2 flex items-center">
              <div class="flex items-center">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    averageRating >= i ? 'text-yellow-400' : 'text-gray-300',
                    'h-5 w-5 flex-shrink-0'
                  ]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
              <p class="ml-2 text-sm text-gray-500">
                {{ averageRating.toFixed(1) }} sur 5 ({{ reviewCount }} avis)
              </p>
            </div>

            <!-- Description -->
            <p class="mt-3 text-sm text-gray-600 line-clamp-2">
              {{ product.short_description }}
            </p>
          </div>

          <!-- Mobile Price and Actions -->
          <div class="mt-4 sm:mt-0">
            <div class="sm:hidden flex justify-between items-center mb-3">
              <div>
                <div class="text-lg font-semibold text-gray-900">
                  <p v-if="product.dicounted_price" class="text-sm text-red-500 line-through">
                    {{ currencyStore.formatCurrency(product.discounted_price) }}
                  </p>
                  <p class="text-xl text-gray-900">
                    {{ currencyStore.formatCurrency(product.final_price) }}
                  </p>
                </div>
              </div>
              <span 
                v-if="product.stock_quantity < 5"
                class="text-xs text-amber-600"
              >
                Plus que {{ product.stock_quantity }} en stock
              </span>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3 mt-5">
              <div
                class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
              <FavoriteButton 
                @click="addToWishlist"
                :product="product || undefined" 
                :text="favoris"
              />
              </div>
              <button
                @click="addToCart(product)"
                class="flex-1 inline-flex items-center justify-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ShoppingBag class="h-5 w-5" />
                <span class="ml-2">Ajouter au panier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Heart, ShoppingCart as ShoppingBag } from 'lucide-vue-next'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'
import { onMounted, computed, ref } from 'vue'
import FavoriteButton from '@/components/ui/FavoriteButton.vue'

const currencyStore = useCurrencyStore()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const isFavorited = ref(true)
const product = props.product

const averageRating = computed(() => {
  console.log(product)
  if (!product?.reviews?.length) return 0;
  const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / product.reviews.length;
});

const reviewCount = computed(() => {
  return product?.reviews?.length || 0;
});

// onMounted(() => {
//   console.log(product)
// })

const getColorHex = (colorName) => {
    // Mappez les noms de couleurs aux codes hexadécimaux
    const colorMap = {
      'Noir': '#000000',
      'Blanc': '#FFFFFF',
      'Rouge': '#FF0000',
      'Bleu': '#0000FF',
      'Vert': '#00FF00',
      // Ajoutez d'autres couleurs au besoin
    };
    
    return colorMap[colorName] || '#CCCCCC'; // Couleur par défaut si non trouvée
  }

const emit = defineEmits(['add-to-cart', 'add-to-wishlist'])

const categories = [
  { value: 'tshirts', label: 'T-shirts' },
  { value: 'pants', label: 'Pantalons' },
  { value: 'dresses', label: 'Robes' },
  { value: 'jackets', label: 'Vestes' },
  { value: 'shoes', label: 'Chaussures' },
  { value: 'sweaters', label: 'Pulls' }
]

const ecoPrice = (price, discount) => {
  
  const eco = (price * discount) / 100
  const reductPrice = price - eco
  return eco
}

const reductPrice = (price, discount) => {
  
  const eco = (price * discount) / 100
  const reductPrice = price - eco
  return reductPrice
}

const addToCart = async (product) => {
  const dataToSend = {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  }
  try {
    useCartStore().addItem(dataToSend)
    
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const addToWishlist = (product) => {
  emit('add-to-wishlist', product)
}

// const getColorHex = (color) => {
//   const colors = {
//     'Noir': '#000000',
//     'Blanc': '#FFFFFF',
//     'Bleu': '#3B82F6',
//     'Rouge': '#EF4444',
//     'Jaune': '#F59E0B',
//     'Vert': '#10B981',
//     'Bleu clair': '#93C5FD',
//     'Bleu foncé': '#1D4ED8',
//     'Gris': '#6B7280',
//     'Bordeaux': '#7F1D1D',
//     'Crème': '#FEF3C7'
//   }
//   return colors[color] || '#CCCCCC'
// }
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:opacity-75 {
  opacity: 0.75;
}
</style>