<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Historique des commandes</h1>
            <p class="mt-1 text-sm text-gray-500">Vos commandes passées</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
            <StatCard 
              v-for="stat in orderStats"
              :key="stat.label"
              :value="stat.value"
              :label="stat.label"
              :icon="stat.icon"
              :trend="stat.trend"
              class="min-w-[120px]"
            />
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="grid grid-cols-2 md:flex md:space-x-3 gap-3 flex-1">
            <div class="min-w-[160px]">
              <label class="block text-xs text-gray-500 mb-1">Statut</label>
              <MultiSelect 
                :options="statusOptions"
                v-model="selectedStatuses"
                placeholder="Tous statuts"
              />
            </div>
            
            <div class="min-w-[160px]">
              <label class="block text-xs text-gray-500 mb-1">Période</label>
              <DateRangePicker v-model="dateRange" />
            </div>
          </div>
          
          <button 
            @click="resetFilters"
            class="text-sm text-blue-600 hover:text-blue-800 flex items-center self-end"
          >
            <RotateCcw class="w-4 h-4 mr-1" />
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
        <!-- En-tête tableau -->
        <div class="hidden md:grid grid-cols-12 bg-gray-50 px-5 py-3 text-xs text-gray-500 uppercase border-b">
          <div class="col-span-3">Commande</div>
          <div class="col-span-2">Date</div>
          <div class="col-span-2">Montant</div>
          <div class="col-span-2">Statut</div>
          <div class="col-span-3">Actions</div>
        </div>

        <!-- Empty State -->
        <div 
          v-if="filteredOrders.length === 0"
          class="p-10 text-center"
        >
          <PackageOpen class="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 class="text-md font-medium text-gray-800 mb-1">Aucune commande trouvée</h3>
          <p class="text-gray-500 max-w-md mx-auto mb-4 text-sm">
            Essayez d'ajuster vos filtres de recherche.
          </p>
          <button 
            @click="resetFilters"
            class="px-3 py-1.5 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Réinitialiser
          </button>
        </div>

        <!-- Commandes -->
        <div v-else class="divide-y divide-gray-200">
          <OrderCard 
            v-for="order in paginatedOrders"
            :key="order.id"
            :order="order"
            @cancel="openCancelModal(order)"
            @return="openReturnModal(order)"
            @track="generateDemoTracking(order)"
            class="hover:bg-gray-50"
          />
        </div>

        <!-- Pagination -->
        <Pagination 
          v-if="filteredOrders.length > itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredOrders.length"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
          class="border-t border-gray-200 px-5 py-3"
        />
      </div>
    </div>

    <!-- Modals -->
    <CancelOrderModal 
      v-if="showCancelModal"
      :order="selectedOrder"
      @close="showCancelModal = false"
      @confirm="confirmCancel"
    />
    
    <ReturnOrderModal 
      v-if="showReturnModal"
      :order="selectedOrder"
      @close="showReturnModal = false"
      @submit="submitReturn"
    />
    
<OrderTrackingModal 
  v-if="showTrackingModal"
  :isOpen="showTrackingModal"
  :order="selectedOrder"
  :tracking-info="trackingInfo"
  :loading="trackingLoading"
  @close="showTrackingModal = false"
/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from '@/stores/order'
import { RotateCcw, PackageOpen, CheckCircle, Truck, MapPin } from 'lucide-vue-next'
import StatCard from '@/components/ui/StatCard.vue'
import MultiSelect from '@/components/ui/MultiSelect.vue'
import DateRangePicker from '@/components/ui/DateRangePicker.vue'
import OrderCard from '@/components/ui/OrderCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import CancelOrderModal from '@/components/ui/CancelOrderModal.vue'
import ReturnOrderModal from '@/components/ui/ReturnOrderModal.vue'
import OrderTrackingModal from '@/components/ui/OrderTrackingModal.vue'

// Data
const orders = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const selectedStatuses = ref([])
const dateRange = ref(null)
const amountFilter = ref('all')

// Modals
const showCancelModal = ref(false)
const showReturnModal = ref(false)
const showTrackingModal = ref(false)
const selectedOrder = ref(null)

const ordersStore = useOrdersStore()



// Ajout des états pour le suivi
const trackingInfo = ref(null)
const trackingLoading = ref(false)
const trackingError = ref(null)

// Méthode pour suivre une commande
const trackOrder = async (order) => {
  try {
    trackingLoading.value = true
    trackingError.value = null
    selectedOrder.value = order
    
    // Récupérer les infos de suivi
    trackingInfo.value = await ordersStore.fetchTrackingInfo(order.id)
    
    // Si pas d'info de suivi, créer un suivi simulé pour la démo
    if (!trackingInfo.value) {
      trackingInfo.value = generateDemoTracking(order)
    }
    
    showTrackingModal.value = true
  } catch (error) {
    trackingError.value = "Impossible de récupérer les informations de suivi"
    console.error("Erreur tracking:", error)
  } finally {
    trackingLoading.value = false
  }
}

// Génère un suivi de démonstration (à remplacer par votre vrai service)
const generateDemoTracking = (order) => {
  console.log('Tracking order:', order); // Debug
  
  // Définir l'ordre sélectionné et les infos de suivi
  selectedOrder.value = order;
  trackingInfo.value = generateTrackingData(order);
  showTrackingModal.value = true;
  
  return trackingInfo.value; // Pour les cas où le retour est utilisé
}

// Fonction séparée pour générer les données
const generateTrackingData = (order) => {
  const steps = [
    { 
      status: 'order_placed', 
      label: 'Commande passée', 
      description: 'Votre commande a été enregistrée',
      date: order.created_at,
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    { 
      status: 'paye', 
      label: 'Payée', 
      description: 'Paiement confirmé',
      date: order.status.find(s => s.status === 'paye')?.changed_at,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      active: true
    },
    { 
      status: 'processing', 
      label: 'En préparation', 
      description: 'Votre commande est en cours de préparation',
      date: order.status.find(s => s.status === 'processing')?.changed_at || 
            new Date(new Date(order.created_at).getTime() + 3600000).toISOString(),
      icon: PackageOpen,
      iconColor: 'text-blue-500'
    },
    { 
      status: 'shipped', 
      label: 'Expédiée', 
      description: 'Votre colis a été expédié',
      date: order.status.find(s => s.status === 'shipped')?.changed_at || 
            new Date(new Date(order.created_at).getTime() + 86400000).toISOString(),
      icon: Truck,
      iconColor: 'text-purple-500'
    },
    { 
      status: 'delivered', 
      label: 'Livrée', 
      description: 'Votre colis a été livré',
      date: order.status.find(s => s.status === 'delivered')?.changed_at || null,
      icon: MapPin,
      iconColor: 'text-green-500'
    }
  ];

  return {
    order_id: order.id,
    tracking_number: `TRK-${order.reference.slice(-8)}`,
    carrier: 'Transporteur Express',
    estimated_delivery: new Date(new Date().getTime() + 3 * 86400000).toISOString(),
    current_status: order.status[0]?.status || 'paye',
    steps: steps.filter(step => step.date !== null) // Filtrer les étapes sans date
  };
}




// Stats
const orderStats = computed(() => [
  {
    label: 'Total commandes',
    value: orders.value.length,
    icon: 'shopping-bag',
    trend: null
  },
  {
    label: 'À traiter',
    value: orders.value.filter(o => o.status[0]?.status === 'processing').length,
    icon: 'clock',
    trend: 'up'
  },
  {
    label: 'Expédiées',
    value: orders.value.filter(o => o.status[0]?.status === 'shipped').length,
    icon: 'truck',
    trend: 'neutral'
  },
  {
    label: 'Livrées',
    value: orders.value.filter(o => o.status[0]?.status === 'delivered').length,
    icon: 'check-circle',
    trend: 'up'
  }
])

// Options de filtre
const statusOptions = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'paye', label: 'Payé' },
  { value: 'expedie', label: 'Expédiée' },
  { value: 'livre', label: 'Livrée' },
  { value: 'annule', label: 'Annulée' }
]

// Computed
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Filtre par statut
    if (selectedStatuses.value.length > 0 && 
        !selectedStatuses.value.includes(order.status[0]?.status)) {
      return false
    }
    
    // Filtre par date
    if (dateRange.value) {
      const orderDate = new Date(order.created_at)
      const startDate = new Date(dateRange.value[0])
      const endDate = new Date(dateRange.value[1])
      
      if (orderDate < startDate || orderDate > endDate) {
        return false
      }
    }
    
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

// Methods
const loadOrders = async () => {
  try {
    isLoading.value = true
    orders.value = await ordersStore.fetchUserOrders()
    resetFilters()
  } catch (error) {
    console.error("Erreur lors du chargement des commandes", error)
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  selectedStatuses.value = []
  dateRange.value = null
  amountFilter.value = 'all'
  currentPage.value = 1
}

const openCancelModal = (order) => {
  selectedOrder.value = order
  showCancelModal.value = true
}

const openReturnModal = (order) => {
  selectedOrder.value = order
  showReturnModal.value = true
}

// const trackOrder = (order) => {
//   selectedOrder.value = order
//   showTrackingModal.value = true
// }

const confirmCancel = async (reason) => {
  try {
    await ordersStore.cancelOrder(selectedOrder.value.id, reason)
    await loadOrders()
    showCancelModal.value = false
  } catch (error) {
    console.error("Erreur lors de l'annulation", error)
  }
}

const submitReturn = async (data) => {
  try {
    await ordersStore.requestReturn(selectedOrder.value.id, data)
    await loadOrders()
    showReturnModal.value = false
  } catch (error) {
    console.error("Erreur lors de la demande de retour", error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>