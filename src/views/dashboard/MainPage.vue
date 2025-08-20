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
            <strong class="text-blue-500">Voir les détails</strong>
          </p>
        </div>
      </div>

      <!-- Favorites Card -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
        <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
          <Heart class="text-white w-6 h-6" />
        </div>
        <div class="p-4 text-right">
          <p class="text-sm text-gray-600">Panier partagés</p>
          <h4 class="text-2xl font-semibold text-gray-900">{{ dashboardDetails.stats?.shared_carts || 0 }}</h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong class="text-green-500">Voir ma liste</strong>
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
          <h4 class="text-2xl font-semibold text-gray-900">{{ cartStore.items?.length || 0 }} article{{ cartStore.items?.length === 1 ? '' : 's' }}</h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong class="text-amber-500">Continuer mes achats</strong>
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
          <h4 class="text-2xl font-semibold text-gray-900 mt-2">{{ dashboardDetails.last_order?.reference?.substring(0, 10) }}...</h4>
        </div>
        <div class="border-t border-gray-100 p-4">
          <p class="text-sm">
            <strong class="text-purple-500">Suivre le colis</strong>
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
          <div class="overflow-x-auto">
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
                    <p class="text-sm text-gray-900 font-medium">{{ order.number }}</p>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <p class="text-sm text-gray-900">{{ formatDate(order.date) }}</p>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <div :class="`w-max ${statusClasses[order.status].bg} px-2 py-1 rounded-md`">
                      <p :class="`text-xs ${statusClasses[order.status].text} font-medium`">{{ order.statusLabel }}</p>
                    </div>
                  </td>
                  <td class="py-3 px-6 border-b border-gray-200">
                    <p class="text-sm text-gray-900 font-medium">{{ formatCurrency(order.total) }}</p>
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
          </div>
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

      <!-- Product Suggestions -->
      <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden">
        <div class="p-6">
          <h5 class="text-xl font-semibold text-gray-900 mb-4">Suggestions pour vous</h5>
          <div class="flex flex-col gap-4">
            <div v-for="product in suggestedProducts" :key="product.id" class="flex items-center gap-4">
              <img :src="product.image" :alt="product.name" class="w-16 h-16 rounded-lg object-cover">
              <div>
                <h6 class="text-sm text-gray-900 font-medium">{{ product.name }}</h6>
                <p class="text-xs text-gray-600">{{ formatCurrency(product.price) }}</p>
                <button 
                  class="text-xs py-1 px-2 rounded-lg border border-blue-500 text-blue-500 hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-85 mt-1 transition-all" 
                  type="button"
                  @click="addToCart(product)"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
          <button 
            class="text-sm py-3 px-6 rounded-lg border border-blue-500 text-blue-500 hover:opacity-75 focus:ring focus:ring-blue-200 active:opacity-85 w-full flex items-center gap-3 justify-center mt-6 transition-all" 
            type="button"
            @click="loadMoreSuggestions"
          >
            Voir plus de suggestions
            <ArrowRight class="w-4 h-4" />
          </button>
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

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Data
const recentOrders = ref([
  {
    id: 1,
    number: '#CMD-45879',
    date: '2023-06-15',
    status: 'delivered',
    statusLabel: 'Livrée',
    total: 149.99
  },
  {
    id: 2,
    number: '#CMD-45231',
    date: '2023-06-10',
    status: 'processing',
    statusLabel: 'En cours',
    total: 89.99
  },
  {
    id: 3,
    number: '#CMD-44987',
    date: '2023-06-02',
    status: 'shipped',
    statusLabel: 'Expédiée',
    total: 210.50
  }
])

const suggestedProducts = ref([
  {
    id: 1,
    name: 'Casque Audio Premium',
    price: 129.99,
    image: 'https://via.placeholder.com/80'
  },
  {
    id: 2,
    name: 'Montre Connectée',
    price: 199.99,
    image: 'https://via.placeholder.com/80'
  },
  {
    id: 3,
    name: 'Haut-parleur Bluetooth',
    price: 79.99,
    image: 'https://via.placeholder.com/80'
  }
])

const statusClasses = {
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-700'
  },
  processing: {
    bg: 'bg-amber-100',
    text: 'text-amber-700'
  },
  shipped: {
    bg: 'bg-blue-100',
    text: 'text-blue-700'
  }
}

// Computed
const customer = computed(() => ({
  firstName: authStore.user?.profile?.first_name || 'Client',
  lastName: authStore.user?.profile?.last_name || '',
  email: authStore.user?.email || '',
  profileCompletion: calculateProfileCompletion(authStore.user),
  ordersInProgress: 2,
  loyaltyPoints: 450,
  unreadMessages: 3,
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
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount)
}

function viewOrder(orderId) {
  router.push(`/dashboard/orders/${orderId}`)
}

function addToCart(product) {
  console.log('Ajout au panier:', product)
}

function loadMoreSuggestions() {
  console.log('Chargement de plus de suggestions...')
}

//Load datas from api

const dashboardDetails = reactive([])

async function fetchDashboardDetails() {
  try {
    const response = await axios.get('http://localhost:8000/api/dashboard-customer-datas', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    console.log('Dashboard details:', response.data);
    Object.assign(dashboardDetails, response.data);
    cartStore.totalOrders = response.data.stats.total_orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

onMounted(() => {
  fetchDashboardDetails()
})

// watch
watch(() => authStore.user, () => {
  fetchDashboardDetails()
})
</script>