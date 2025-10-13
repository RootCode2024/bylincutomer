<template>
  <div>
    <!-- Stats Cards -->
    <div class="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
      <!-- Orders Card -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
        <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
          <ShoppingCart class="text-white w-6 h-6" />
        </div>
        <div class="p-4 text-right">
          <p class="text-sm text-gray-600">Commandes effectuées</p>
          <h4 class="text-2xl font-semibold text-gray-900">{{ dashboardDetails.stats?.total_orders || 0 }}</h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong class="text-blue-500 cursor-pointer" @click="$router.push('/dashboard/orders')">Voir les détails</strong>
          </p>
        </div>
      </div>

      <!-- Shared Carts Card -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
        <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
          <Heart class="text-white w-6 h-6" />
        </div>
        <div class="p-4 text-right">
          <p class="text-sm text-gray-600">Paniers partagés</p>
          <h4 class="text-2xl font-semibold text-gray-900">{{ dashboardDetails.stats?.shared_carts_count || 0 }}</h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong class="text-green-500 cursor-pointer">Voir ma liste</strong>
          </p>
        </div>
      </div>

      <!-- Cart Card -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
        <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-600 to-amber-400 text-white shadow-amber-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
          <ShoppingBag class="text-white w-6 h-6" />
        </div>
        <div class="p-4 text-right">
          <p class="text-sm text-gray-600">Panier actuel</p>
          <h4 class="text-2xl font-semibold text-gray-900">{{ cartStore.items?.length || 0 }} article{{ (cartStore.items?.length || 0) === 1 ? '' : 's' }}</h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong class="text-amber-500 cursor-pointer" @click="$router.push('/shop')">Continuer mes achats</strong>
          </p>
        </div>
      </div>

      <!-- Last Order Card -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
        <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 to-purple-400 text-white shadow-purple-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
          <PackageCheck class="text-white w-6 h-6" />
        </div>
        <div class="p-4 text-right">
          <p class="text-sm text-gray-600">Dernière commande</p>
          <h4 class="text-2xl font-semibold text-gray-900 mt-2">
            {{ dashboardDetails.latest_order?.order_number ? dashboardDetails.latest_order.order_number.substring(0, 10) + '...' : 'Aucune' }}
          </h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong 
              class="text-purple-500 cursor-pointer" 
              @click="dashboardDetails.latest_order && viewOrder(dashboardDetails.latest_order.id)"
              :class="{ 'opacity-50 cursor-not-allowed': !dashboardDetails.latest_order }"
            >
              {{ dashboardDetails.latest_order ? 'Suivre le colis' : 'Pas de commande' }}
            </strong>
          </p>
        </div>
      </div>
    </div>
    
    <!-- Main Content Sections -->
    <div class="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- Recent Orders -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
        <div class="p-6">
          <h5 class="text-xl font-semibold text-gray-900 mb-4">Mes commandes récentes</h5>
          
          <!-- Empty state -->
          <div v-if="!recentOrders?.length" class="text-center py-8">
            <p class="text-gray-500">Aucune commande récente</p>
            <button 
              class="text-sm py-2 px-4 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-85 mt-4 transition-all" 
              type="button"
              @click="$router.push('/shop')"
            >
              Commencer vos achats
            </button>
          </div>
          
          <!-- Orders table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th class="border-b border-gray-200 py-3 px-6 text-left">
                    <p class="text-sm text-gray-900 font-medium">N° Commande</p>
                  </th>
                  <th class="border-b border-gray-200 py-3 px-6 text-left">
                    <p class="text-sm text-gray-900 font-medium">Date</p>
                  </th>
                  <th class="border-b border-gray-200 py-3 px-6 text-left">
                    <p class="text-sm text-gray-900 font-medium">Statut</p>
                  </th>
                  <th class="border-b border-gray-200 py-3 px-6 text-left">
                    <p class="text-sm text-gray-900 font-medium">Total</p>
                  </th>
                  <th class="border-b border-gray-200 py-3 px-6 text-left">
                    <p class="text-sm text-gray-900 font-medium">Actions</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td class="py-3 px-6 border-b border-gray-200">
                    <p class="text-sm text-gray-900 font-medium">{{ order.order_number || order.number }}</p>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <p class="text-sm text-gray-900">{{ formatDate(order.created_at || order.date) }}</p>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <div :class="`w-max ${getStatusClass(order.status).bg} px-2 py-1 rounded-md`">
                      <p :class="`text-xs ${getStatusClass(order.status).text} font-medium`">
                        {{ getStatusLabel(order.status) }}
                      </p>
                    </div>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <p class="text-sm text-gray-900 font-medium">{{ currencyStore.formatCurrency(order.total_amount || order.total) }}</p>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <button 
                      class="text-xs py-2 px-4 rounded-lg border border-blue-500 text-blue-500 hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-85 transition-all" 
                      type="button"
                      @click="viewOrder(order.id)"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <button 
              class="text-sm py-3 px-6 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-85 w-full flex items-center gap-3 justify-center mt-6 transition-all" 
              type="button"
              @click="$router.push('/dashboard/orders')"
            >
              Voir toutes mes commandes
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Product Suggestions -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden">
        <div class="p-6">
          <h5 class="text-xl font-semibold text-gray-900 mb-4">Suggestions pour vous</h5>
          
          <!-- Loading state -->
          <div v-if="loadingSuggestions" class="flex justify-center py-8">
            <div class="animate-pulse text-gray-500">Chargement des suggestions...</div>
          </div>
          
          <!-- Suggestions list -->
          <div v-else-if="suggestedProducts?.length" class="flex flex-col gap-4">
            <div v-for="product in suggestedProducts" :key="product.id" class="flex items-center gap-4">
              <img 
                :src="product.image || product.main_image" 
                :alt="product.name" 
                class="w-16 h-16 rounded-lg object-cover"
                @error="handleImageError"
                v-if="product.image || product.main_image"
              >
              <div
                v-else
                class="w-1/2 h-24 flex items-center justify-center text-center text-xs bg-gray-200 object-cover object-center"
              >
                No Image
              </div>
              <div class="flex-1">
                <h6 class="text-sm text-gray-900 font-medium">{{ product.name }}</h6>
                <p class="text-xs text-gray-600">{{ currencyStore.formatCurrency(product.price) }}</p>
                <button 
                  class="text-xs py-1 px-2 rounded-lg border border-blue-500 text-blue-500 hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-85 mt-1 transition-all" 
                  type="button"
                  @click="showProduct(product)"
                >
                  Voir l'article
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty state for suggestions -->
          <div v-else class="text-center py-8">
            <p class="text-gray-500 text-sm">Aucune suggestion disponible</p>
          </div>
          
          <!-- <button 
            class="text-sm py-3 px-6 rounded-lg border border-blue-500 text-blue-500 hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-85 w-full flex items-center gap-3 justify-center mt-6 transition-all" 
            type="button"
            @click="loadMoreSuggestions"
            :disabled="loadingSuggestions"
          >
            <span>{{ loadingSuggestions ? 'Chargement...' : 'Voir plus de suggestions' }}</span>
            <ArrowRight class="w-4 h-4" v-if="!loadingSuggestions" />
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  ShoppingCart,
  Heart,
  ShoppingBag,
  PackageCheck,
  ArrowRight
} from 'lucide-vue-next'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import api from '@/api/axiosConfig'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

// Data
const recentOrders = ref([])
const loadingSuggestions = ref(false)
const suggestedProducts = ref([])

// Fallback suggestions if API doesn't provide any
const defaultSuggestions = [
  {
    id: 1,
    name: 'Casque Audio Premium',
    price: 129.99,
    image: 'https://placehold.co/80?text=bylin'
  },
  {
    id: 2,
    name: 'Montre Connectée',
    price: 199.99,
    image: 'https://placehold.co/80?text=bylin'
  },
  {
    id: 3,
    name: 'Haut-parleur Bluetooth',
    price: 79.99,
    image: 'https://placehold.co/80?text=bylin'
  }
]

// Status mapping for orders
const statusMapping = {
  'pending': { label: 'En attente', class: 'amber' },
  'paid': { label: 'Payé', class: 'blue' },
  'confirmed': { label: 'Confirmée', class: 'blue' },
  'processing': { label: 'En préparation', class: 'amber' },
  'shipped': { label: 'Expédiée', class: 'blue' },
  'delivered': { label: 'Livrée', class: 'green' },
  'cancelled': { label: 'Annulée', class: 'red' },
  'refunded': { label: 'Remboursée', class: 'gray' }
}

// Computed
const customer = computed(() => ({
  firstName: authStore.user?.profile?.first_name || 'Client',
  lastName: authStore.user?.profile?.last_name || '',
  email: authStore.user?.email || '',
  profileCompletion: calculateProfileCompletion(authStore.user),
  ordersInProgress: dashboardDetails.stats?.orders_in_progress || 0,
  loyaltyPoints: dashboardDetails.stats?.loyalty_points || 0,
  unreadMessages: dashboardDetails.stats?.unread_messages || 0,
  addresses: authStore.user?.addresses || []
}))

// Methods
function calculateProfileCompletion(user) {
  if (!user) return 0
  
  let completion = 0
  const profile = user.profile || {}
  
  if (profile.first_name) completion += 20
  if (profile.last_name) completion += 20
  if (profile.phone) completion += 20
  if (profile.birth_date) completion += 20
  if (user.addresses?.length > 0) completion += 20
  
  return completion
}

function formatDate(dateString) {
  if (!dateString) return 'Date inconnue'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

function formatCurrency(amount) {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount)
}

function getStatusClass(status) {
  const statusInfo = statusMapping[status] || statusMapping['pending']
  const colorClass = statusInfo.class
  
  return {
    bg: `bg-${colorClass}-100`,
    text: `text-${colorClass}-700`
  }
}

function getStatusLabel(status) {
  return statusMapping[status]?.label || 'Statut inconnu'
}

function viewOrder(orderId) {
  router.push(`/dashboard/orders/${orderId}`)
}

function showProduct(product) {
  router.push(`/product/${product.slug}`)
}

function handleImageError(event) {
  event.target.src = 'https://placehold.co/80?text=bylin'
}

async function loadMoreSuggestions() {
  loadingSuggestions.value = true
  try {
    // Implement API call for more suggestions
    const response = await api.get('suggested-products', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    if (response.data?.products) {
      suggestedProducts.value = [...suggestedProducts.value, ...response.data.products]
    }
  } catch (error) {
    console.error('Erreur lors du chargement des suggestions:', error)
  } finally {
    loadingSuggestions.value = false
  }
}

// Load data from API
const dashboardDetails = reactive({
  stats: {},
  latest_order: null,
  recent_orders: [],
  suggested_products: []
})

async function fetchDashboardDetails() {
  try {
    const response = await api.get('dashboard-customer-datas', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    console.log('Dashboard details:', response.data)
    
    // Update reactive object properly
    Object.assign(dashboardDetails, response.data)
    
    // Set recent orders
    recentOrders.value = response.data.recent_orders || []
    
    // Set suggested products or use defaults
    suggestedProducts.value = response.data.suggested_products?.length 
      ? response.data.suggested_products 
      : defaultSuggestions
    
    // Update cart store if needed
    if (response.data.stats?.total_orders !== undefined) {
      cartStore.totalOrders = response.data.stats.total_orders
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error)
    // Set fallback suggestions on error
    suggestedProducts.value = defaultSuggestions
  }
}

onMounted(() => {
  fetchDashboardDetails()
})

// Watch for auth changes
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    fetchDashboardDetails()
  }
}, { immediate: true })

watch(() => authStore.token, (newToken) => {
  if (newToken) {
    fetchDashboardDetails()
  }
})
</script>