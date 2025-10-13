<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec navigation -->
      <div class="mb-8">
        <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <router-link to="/dashboard/orders" class="hover:text-blue-600 transition-colors">
            Mes commandes
          </router-link>
          <span class="text-gray-300">/</span>
          <span class="text-gray-900 font-medium">Commande #{{ order?.order_number }}</span>
        </nav>
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Détails de la commande</h1>
            <p class="mt-1 text-sm text-gray-500">Numéro de commande: {{ order?.order_number || order?.id }}</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="statusClass">
              {{ currentStatusLabel }}
            </span>
            <button 
              @click="generateDemoTracking(order)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <MapPin class="w-4 h-4 mr-2" />
              Suivre la commande
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <PackageOpen class="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur lors du chargement</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button 
          @click="loadOrderDetails"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="space-y-6">
        <!-- Informations générales -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Informations de la commande</h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Date de commande</h3>
              <p class="text-sm text-gray-900">{{ formatDate(order.created_at) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Statut</h3>
              <p class="text-sm text-gray-900">{{ currentStatusLabel }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Total</h3>
              <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(order.total || order.total_amount) }}</p>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Méthode de paiement</h3>
            <ul class="text-sm text-gray-900 space-y-4">
              <li v-if="payment?.method">
                <span class="font-medium">Méthode:</span> {{ getPaymentMethod(payment.method) }}
              </li>
              <li v-if="payment?.gateway">
                <span class="font-medium">Passerelle:</span> {{ payment.gateway }}
              </li>
              <li v-if="payment?.transaction_id">
                <span class="font-medium">ID Transaction:</span> {{ payment.transaction_id }}
              </li>
              
              <!-- Parser le metadata JSON -->
              <template v-if="payment?.metadata && parsedMetadata" class="mt-5">
                <li v-if="parsedMetadata.payment_method">
                  <span class="font-medium">Type de paiement:</span> {{ getPaymentMethod(parsedMetadata.payment_method) }}
                </li>
                <li v-if="parsedMetadata.phone">
                  <span class="font-medium">Numéro de facturation:</span> {{ parsedMetadata.phone }}
                </li>
                <li v-if="parsedMetadata.initiation_response?.payment_url && payment.status === 'pending'">
                  <span class="font-medium">URL de paiement:</span> 
                  <a :href="parsedMetadata.initiation_response.payment_url" target="_blank" class="text-blue-600 hover:text-blue-800 underline">
                    Lien de paiement
                  </a>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <!-- Articles de la commande -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Articles commandés</h2>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-for="item in order.items" :key="item.id" class="p-6 flex items-center space-x-4">
              <img 
                :src="getProductImage(item)" 
                :alt="getProductName(item)"
                class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                @error="handleImageError"
              />
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ getProductName(item) }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">Quantité: {{ item.quantity }}</p>
                <p class="text-sm text-gray-500">Prix unitaire: {{ formatCurrency(item.unit_price || item.price) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ formatCurrency((item.unit_price || item.price) * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-900">Total</span>
              <span class="text-lg font-semibold text-gray-900">{{ formatCurrency(order.total || order.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Adresse de livraison -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Adresse de livraison</h2>
          </div>
          <div class="p-6">
            <div v-if="order.shipping_address" class="text-sm text-gray-900">
              <p class="font-medium">{{ order.shipping_address.type || 'Adresse de livraison' }}</p>
              <p class="mt-1">{{ order.shipping_address.street_line }}</p>
              <p>{{ order.shipping_address.postal_code }} {{ order.shipping_address.city }}</p>
              <p>{{ order.shipping_address.state_province }}, {{ getCountryName(order.shipping_address.country_code) }}</p>
              <p>{{ order.shipping_address.landmark }}</p>
            </div>
            <div v-else class="text-sm text-gray-500">
              Aucune adresse de livraison renseignée
            </div>
          </div>
        </div>

        <!-- Informations de livraison -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Informations de livraison</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 class="font-medium text-gray-500 mb-2">Frais de livraison</h3>
                <p class="text-gray-900">{{ formatCurrency(order.shipping_cost || 0) }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-500 mb-2">Mode de livraison</h3>
                <p class="text-gray-900">{{ getShippingMethod(order.shipping_method) }}</p>
              </div>
              <div v-if="order.tracking_number" class="md:col-span-2">
                <h3 class="font-medium text-gray-500 mb-2">Numéro de suivi</h3>
                <p class="text-gray-900">{{ order.tracking_number }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Actions</h2>
          </div>
          <div class="p-6 flex flex-wrap gap-4">
            <button 
              v-if="canCancel"
              @click="openCancelModal(order)"
              class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
            >
              <X class="w-4 h-4 mr-2" />
              Annuler la commande
            </button>
            
            <button 
              v-if="canReturn"
              @click="openReturnModal(order)"
              class="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
            >
              <RotateCcw class="w-4 h-4 mr-2" />
              Demander un retour
            </button>
            
            <button 
              @click="downloadInvoice"
              :disabled="!order?.invoice_path"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download class="w-4 h-4 mr-2" />
              Télécharger la facture
            </button>
            
            <button 
              @click="contactSupport"
              class="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
            >
              <MessageCircle class="w-4 h-4 mr-2" />
              Contacter le support
            </button>
          </div>
        </div>
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
import { useRoute, useRouter } from 'vue-router'
import { 
  RotateCcw, 
  PackageOpen, 
  CheckCircle, 
  Truck, 
  MapPin, 
  X, 
  Download,
  MessageCircle 
} from 'lucide-vue-next'
import { useOrdersStore } from '@/stores/order'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import CancelOrderModal from '@/components/ui/CancelOrderModal.vue'
import ReturnOrderModal from '@/components/ui/ReturnOrderModal.vue'
import OrderTrackingModal from '@/components/ui/OrderTrackingModal.vue'
import api from '@/api/axiosConfig'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()
const currencyStore = useCurrencyStore()
const uiStore = useUIStore()
const authStore = useAuthStore()

// Data
const order = ref(null)
const payment = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Modals
const showCancelModal = ref(false)
const showReturnModal = ref(false)
const showTrackingModal = ref(false)
const selectedOrder = ref(null)
const trackingInfo = ref(null)

// Computed
const currentStatus = computed(() => {
  if (!order.value) return 'pending'
  return Array.isArray(order.value.status) ? order.value.status[0]?.status : order.value.status
})

// Parser le metadata JSON
const parsedMetadata = computed(() => {
  if (!payment.value?.metadata) return null
  
  try {
    return JSON.parse(payment.value.metadata)
  } catch (error) {
    console.error('Erreur parsing metadata:', error)
    return null
  }
})

// Méthode pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const currentStatusLabel = computed(() => {
  const statusMap = {
    pending: 'En attente',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    returned: 'Retournée',
    paid: 'Payé',
    paye: 'Payé',
    en_attente: 'En attente',
    expedie: 'Expédiée',
    livre: 'Livrée',
    annule: 'Annulée'
  }
  return statusMap[currentStatus.value] || currentStatus.value
})

const statusClass = computed(() => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    paye: 'bg-green-100 text-green-800'
  }
  return classes[currentStatus.value] || 'bg-gray-100 text-gray-800'
})

const canCancel = computed(() => {
  return ['pending', 'processing', 'paye'].includes(currentStatus.value)
})

const canReturn = computed(() => {
  return currentStatus.value === 'delivered' || currentStatus.value === 'livre'
})

// Methods
const loadOrderDetails = async () => {
  try {
    isLoading.value = true
    error.value = null
    const orderNumber = route.params.orderNumber
    
    if (!orderNumber) {
      error.value = 'ID de commande manquant'
      return
    }
    
    const orderData = await ordersStore.fetchOrderById(orderNumber)
    console.log('Détails de la commande chargés:', orderData)
    order.value = orderData.order
    payment.value = orderData.payment
    
    // Adapter la structure si nécessaire
    if (order.value && !Array.isArray(order.value.status)) {
      order.value.status = [
        {
          status: order.value.status,
          changed_at: order.value.updated_at,
          label: currentStatusLabel.value
        }
      ]
    }
    
  } catch (err) {
    console.error('Erreur lors du chargement des détails de la commande:', err)
    error.value = 'Impossible de charger les détails de la commande'
  } finally {
    isLoading.value = false
  }
}

// const formatDate = (dateString) => {
//   if (!dateString) return 'Date inconnue'
//   const options = { 
//     year: 'numeric', 
//     month: 'long', 
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   }
//   return new Date(dateString).toLocaleDateString('fr-FR', options)
// }

const formatCurrency = (amount) => {
  return currencyStore.formatCurrency(amount)
}

const getProductImage = (item) => {
  return item.product?.image || 
         item.product?.main_image || 
         item.image || 
         'https://placehold.co/80?text=bylin'
}

const getProductName = (item) => {
  return item.product?.name || item.name || 'Article sans nom'
}

const getPaymentMethod = (method) => {
  const methods = {
    'credit_card': 'Carte de crédit',
    'paypal': 'PayPal',
    'bank_transfer': 'Virement bancaire',
    'cash': 'Paiement en espèces',
    'mobile_money': 'Mobile Money'
  }
  return methods[method] || method || 'Non spécifié'
}

const getShippingMethod = (method) => {
  const methods = {
    'standard': 'Livraison standard',
    'express': 'Livraison express',
    'pickup': 'Retrait en magasin'
  }
  return methods[method] || method || 'Standard'
}

const getCountryName = (countryCode) => {
  // Vérifie si le pays est déjà dans la liste
  const country = uiStore.countries.find(c => c.code === countryCode)
  return country ? country.name : countryCode
}

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/80?text=bylin'
}

const generateDemoTracking = (order) => {
  selectedOrder.value = order
  trackingInfo.value = generateTrackingData(order)
  showTrackingModal.value = true
}

const generateTrackingData = (order) => {
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
      completed: ['paye', 'processing', 'shipped', 'delivered'].includes(currentStatus.value)
    },
    { 
      status: 'processing', 
      label: 'En préparation', 
      description: 'Votre commande est en cours de préparation',
      date: order.updated_at,
      icon: PackageOpen,
      iconColor: 'text-blue-500',
      completed: ['processing', 'shipped', 'delivered'].includes(currentStatus.value)
    },
    { 
      status: 'shipped', 
      label: 'Expédiée', 
      description: 'Votre colis a été expédié',
      date: order.updated_at,
      icon: Truck,
      iconColor: 'text-purple-500',
      completed: ['shipped', 'delivered'].includes(currentStatus.value)
    },
    { 
      status: 'delivered', 
      label: 'Livrée', 
      description: 'Votre colis a été livré',
      date: order.updated_at,
      icon: MapPin,
      iconColor: 'text-green-500',
      completed: currentStatus.value === 'delivered'
    }
  ]

  return {
    order_id: order.id,
    tracking_number: order.tracking_number || `TRK-${order.order_number?.slice(-8) || order.id.toString().padStart(8, '0')}`,
    carrier: 'Transporteur Express',
    estimated_delivery: new Date(new Date().getTime() + 3 * 86400000).toISOString(),
    current_status: currentStatus.value,
    steps: steps
  }
}

const openCancelModal = (order) => {
  selectedOrder.value = order
  showCancelModal.value = true
}

const openReturnModal = (order) => {
  selectedOrder.value = order
  showReturnModal.value = true
}

const confirmCancel = async (reason) => {
  try {
    await ordersStore.cancelOrder(selectedOrder.value.id, reason)
    await loadOrderDetails() // Recharger les détails
    showCancelModal.value = false
  } catch (error) {
    console.error("Erreur lors de l'annulation", error)
  }
}

const submitReturn = async (data) => {
  try {
    await ordersStore.requestReturn(selectedOrder.value.id, data)
    await loadOrderDetails() // Recharger les détails
    showReturnModal.value = false
  } catch (error) {
    console.error("Erreur lors de la demande de retour", error)
  }
}

const downloadInvoice = async () => {
  try {
    console.log('Téléchargement de la facture pour la commande:', order.value.id);
    
    if (!order.value.invoice_path) {
      alert('Aucune facture disponible pour cette commande.');
      return;
    }

    const response = await api.get(`/orders/${order.value.id}/invoice/download`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    });

    console.log('Response reçue:', response);
    console.log('Taille des données:', response.size, 'bytes');
    console.log('Type des données:', typeof response.type);

    // Vérifier que c'est bien un Blob
    if (!(response instanceof Blob)) {
      console.error('Les données ne sont pas un Blob:', response);
      throw new Error('Format de réponse invalide');
    }

    // Créer l'URL directement depuis response.data (qui est déjà un Blob)
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-commande-${order.value.id}.pdf`;
    
    // Ajouter des styles pour s'assurer que le lien est visible (pour le debug)
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Déclencher le téléchargement
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Téléchargement déclenché avec succès');
    
  } catch (error) {
    console.error('Erreur détaillée:', error);
    
    if (error.response?.status === 404) {
      alert('Facture non trouvée pour cette commande.');
    } else if (error.response?.status === 403) {
      alert('Vous n\'êtes pas autorisé à télécharger cette facture.');
    } else {
      alert('Erreur lors du téléchargement: ' + error.message);
    }
  }
};

const contactSupport = () => {
  router.push('/dashboard/support/order/' + order.value.order_number)
}

// Lifecycle
onMounted(() => {
  loadOrderDetails()
  uiStore.getCountries()
})
</script>

<style scoped>
/* Styles spécifiques à la page */
</style>