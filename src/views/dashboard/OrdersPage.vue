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
          v-if="filteredOrders.length === 0 && !isLoading"
          class="p-10 text-center"
        >
          <PackageOpen class="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 class="text-md font-medium text-gray-800 mb-1">Aucune commande trouvée</h3>
          <p class="text-gray-500 max-w-md mx-auto mb-4 text-sm">
            {{ isLoading ? 'Chargement...' : 'Essayez d\'ajuster vos filtres de recherche.' }}
          </p>
          <button 
            @click="resetFilters"
            class="px-3 py-1.5 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
            v-if="!isLoading"
          >
            Réinitialiser
          </button>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="p-10 text-center">
          <div class="animate-pulse">
            <div class="h-12 bg-gray-200 rounded-md mb-4"></div>
            <div class="h-12 bg-gray-200 rounded-md mb-4"></div>
            <div class="h-12 bg-gray-200 rounded-md"></div>
          </div>
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
          v-if="filteredOrders.length > itemsPerPage && !isLoading"
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

// Helper function pour les labels de statut
const getStatusLabel = (status) => {
  const statusLabels = {
    'pending': 'En attente',
    'paye': 'Payé',
    'processing': 'En traitement',
    'shipped': 'Expédié',
    'delivered': 'Livré',
    'cancelled': 'Annulé',
    'refunded': 'Remboursé',
    'en_attente': 'En attente',
    'expedie': 'Expédiée',
    'livre': 'Livrée',
    'annule': 'Annulée'
  }
  return statusLabels[status] || status
}

// Génère un suivi de démonstration
const generateDemoTracking = (order) => {
  console.log('Tracking order:', order);
  
  selectedOrder.value = order;
  trackingInfo.value = generateTrackingData(order);
  showTrackingModal.value = true;
  
  return trackingInfo.value;
}

// Fonction séparée pour générer les données
const generateTrackingData = (order) => {
  // Obtenir le statut actuel
  const currentStatus = getCurrentStatus(order);
  
  const steps = [
    { 
      status: 'order_placed', 
      label: 'Commande passée', 
      description: 'Votre commande a été enregistrée',
      date: order.created_at,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      completed: true
    },
    { 
      status: 'paye', 
      label: 'Payée', 
      description: 'Paiement confirmé',
      date: order.updated_at,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      completed: ['paye', 'processing', 'shipped', 'delivered'].includes(currentStatus)
    },
    { 
      status: 'processing', 
      label: 'En préparation', 
      description: 'Votre commande est en cours de préparation',
      date: order.updated_at,
      icon: PackageOpen,
      iconColor: 'text-blue-500',
      completed: ['processing', 'shipped', 'delivered'].includes(currentStatus)
    },
    { 
      status: 'shipped', 
      label: 'Expédiée', 
      description: 'Votre colis a été expédié',
      date: order.updated_at,
      icon: Truck,
      iconColor: 'text-purple-500',
      completed: ['shipped', 'delivered'].includes(currentStatus)
    },
    { 
      status: 'delivered', 
      label: 'Livrée', 
      description: 'Votre colis a été livré',
      date: order.updated_at,
      icon: MapPin,
      iconColor: 'text-green-500',
      completed: currentStatus === 'delivered'
    }
  ];

  return {
    order_id: order.id,
    tracking_number: order.order_number ? `TRK-${order.order_number.slice(-8)}` : `TRK-${order.id.toString().padStart(8, '0')}`,
    carrier: 'Transporteur Express',
    estimated_delivery: new Date(new Date().getTime() + 3 * 86400000).toISOString(),
    current_status: currentStatus,
    steps: steps
  };
}

// Obtenir le statut actuel d'une commande
const getCurrentStatus = (order) => {
  return Array.isArray(order.status) ? order.status[0]?.status : order.status;
}

// Stats
const orderStats = computed(() => {
  const getCurrentStatus = (order) => {
    return Array.isArray(order.status) ? order.status[0]?.status : order.status;
  }
  
  return [
    {
      label: 'Total commandes',
      value: orders.value.length,
      icon: 'shopping-bag',
      trend: null
    },
    {
      label: 'À traiter',
      value: orders.value.filter(o => getCurrentStatus(o) === 'processing').length,
      icon: 'clock',
      trend: 'up'
    },
    {
      label: 'Expédiées',
      value: orders.value.filter(o => getCurrentStatus(o) === 'shipped').length,
      icon: 'truck',
      trend: 'neutral'
    },
    {
      label: 'Livrées',
      value: orders.value.filter(o => getCurrentStatus(o) === 'delivered').length,
      icon: 'check-circle',
      trend: 'up'
    }
  ]
})

// Options de filtre
const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'paye', label: 'Payé' },
  { value: 'processing', label: 'En traitement' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' }
]

// Computed
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Filtre par statut
    if (selectedStatuses.value.length > 0) {
      const currentStatus = getCurrentStatus(order);
      if (!selectedStatuses.value.includes(currentStatus)) {
        return false;
      }
    }
    
    // Filtre par date
    if (dateRange.value) {
      const orderDate = new Date(order.created_at);
      const startDate = new Date(dateRange.value[0]);
      const endDate = new Date(dateRange.value[1]);
      endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
      
      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
})

// Methods
const loadOrders = async () => {
  try {
    isLoading.value = true;
    const rawOrders = await ordersStore.fetchUserOrders();
    
    // Adapter la structure des commandes pour OrderCard
    orders.value = rawOrders.map(order => ({
      ...order,
      // S'assurer que le statut est dans le format attendu
      status: Array.isArray(order.status) ? order.status : [
        {
          status: order.status,
          changed_at: order.updated_at || order.created_at,
          label: getStatusLabel(order.status)
        }
      ],
      // S'assurer que les champs requis existent
      total_amount: order.total || order.subtotal || 0,
      items_count: order.items?.length || 0,
      reference: order.order_number || `ORD-${order.id}`
    }));
    
    console.log("Commandes adaptées:", orders.value);
    resetFilters();
  } catch (error) {
    console.error("Erreur lors du chargement des commandes", error);
  } finally {
    isLoading.value = false;
  }
}

const resetFilters = () => {
  selectedStatuses.value = [];
  dateRange.value = null;
  currentPage.value = 1;
}

const openCancelModal = (order) => {
  selectedOrder.value = order;
  showCancelModal.value = true;
}

const openReturnModal = (order) => {
  selectedOrder.value = order;
  showReturnModal.value = true;
}

const confirmCancel = async (reason) => {
  try {
    await ordersStore.cancelOrder(selectedOrder.value.id, reason);
    await loadOrders();
    showCancelModal.value = false;
  } catch (error) {
    console.error("Erreur lors de l'annulation", error);
  }
}

const submitReturn = async (data) => {
  try {
    await ordersStore.requestReturn(selectedOrder.value.id, data);
    await loadOrders();
    showReturnModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la demande de retour", error);
  }
}

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Lifecycle
onMounted(() => {
  loadOrders();
});
</script>