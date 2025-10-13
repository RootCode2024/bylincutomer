<template>
  <div class="px-6 py-5">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <!-- Mobile Order Number -->
      <div class="md:hidden">
        <p class="text-xs text-gray-500">Commande</p>
        <p class="font-thin text-blue-600">#{{ order.order_number || order.reference }}</p>
      </div>
      
      <!-- Desktop Grid -->
      <div class="grid grid-cols-12 w-full gap-4 items-center">
        <!-- Order Number -->
        <div class="col-span-12 md:col-span-3">
          <p class="hidden md:block font-thin text-sm uppercase text-blue-600">#{{ order.order_number || order.reference }}</p>
        </div>
        
        <!-- Date -->
        <div class="col-span-6 md:col-span-2">
          <p class="text-xs text-gray-500 md:hidden">Date</p>
          <p class="font-semibold text-xs">{{ formatDate(order.created_at) }}</p>
        </div>
        
        <!-- Amount -->
        <div class="col-span-6 md:col-span-2 text-right md:text-left">
          <p class="text-xs text-gray-500 md:hidden">Montant</p>
          <p class="font-semibold text-xs">{{ currencyStore.formatCurrency(order.total || order.total_amount || order.subtotal) }}</p>
        </div>
        
        <!-- Status -->
        <div class="col-span-6 md:col-span-2">
          <p class="text-xs text-gray-500 md:hidden">Statut</p>
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass"
          >
            {{ currentStatusLabel }}
          </span>
        </div>
        
        <!-- Actions -->
        <div class="col-span-6 md:col-span-3 flex justify-start space-x-4">
          <button 
            @click="goToOrderDetails(order)"
            class="text-xs md:text-sm text-blue-600 hover:text-blue-900 flex items-center"
          >
            <Eye class="w-4 h-4 mr-1" />
            <span class="hidden md:inline">Details</span>
          </button>

          <button 
            @click="$emit('track')"
            class="text-xs md:text-sm text-blue-600 hover:text-blue-900 flex items-center"
          >
            <MapPin class="w-4 h-4 mr-1" />
            <span class="hidden md:inline">Suivre</span>
          </button>
          
          <button 
            v-if="canCancel"
            @click="$emit('cancel')"
            class="text-xs md:text-sm text-red-600 hover:text-red-900 flex items-center"
          >
            <X class="w-4 h-4 mr-1" />
            <span class="hidden md:inline">Annuler</span>
          </button>
          
          <button 
            v-if="canReturn"
            @click="$emit('return')"
            class="text-xs md:text-sm text-green-600 hover:text-green-900 flex items-center"
          >
            <RotateCcw class="w-4 h-4 mr-1" />
            <span class="hidden md:inline">Retour</span>
          </button>
        </div>
      </div>
    </div>
    
    <hr class="my-4">
    
    <!-- Items Preview -->
    <div class="mt-4 flex space-x-2 overflow-x-auto pb-2" v-if="order.items && order.items.length > 0">
      <div 
        v-for="item in visibleItems"
        :key="item.id"
        class="flex-shrink-0 relative"
      >
        <img 
          :src="getItemImage(item)" 
          :alt="getItemName(item)"
          class="h-12 w-12 rounded-md object-cover border border-gray-200"
          @error="handleImageError"
        >
        <span 
          v-if="item.quantity > 1"
          class="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {{ item.quantity }}
        </span>
      </div>
      <div 
        v-if="order.items.length > 3"
        class="flex-shrink-0 h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-xs"
      >
        +{{ order.items.length - 3 }}
      </div>
    </div>
    
    <!-- No items message -->
    <div v-else class="mt-4 text-center text-gray-500 text-sm">
      Aucun article dans cette commande
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, X, RotateCcw, Eye } from 'lucide-vue-next'
import { useCurrencyStore } from '@/stores/currency'
import { useRouter } from 'vue-router'

const currencyStore = useCurrencyStore()
const router = useRouter()

const props = defineProps({
  order: {
    type: Object,
    required: true,
    validator: (order) => {
      // Validation plus permissive
      return order && typeof order === 'object' && order.id !== undefined
    }
  }
})

const emit = defineEmits(['cancel', 'return', 'track'])

const currentStatus = computed(() => {
  // Gérer à la fois les tableaux et les statuts simples
  if (Array.isArray(props.order.status)) {
    return props.order.status[0]?.status || props.order.status[0] || 'pending'
  }
  return props.order.status || 'pending'
})

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
    paye: 'bg-green-100 text-green-800',
    en_attente: 'bg-yellow-100 text-yellow-800',
    expedie: 'bg-purple-100 text-purple-800',
    livre: 'bg-green-100 text-green-800',
    annule: 'bg-red-100 text-red-800'
  }
  return classes[currentStatus.value] || 'bg-gray-100 text-gray-800'
})

const canCancel = computed(() => {
  return ['pending', 'processing', 'paye'].includes(currentStatus.value)
})

const canReturn = computed(() => {
  return currentStatus.value === 'delivered' || currentStatus.value === 'livre'
})

const visibleItems = computed(() => {
  return props.order.items ? props.order.items.slice(0, 3) : []
})

const getItemImage = (item) => {
  return item.product?.image || 
         item.product?.main_image || 
         item.image || 
         'https://placehold.co/80?text=bylin'
}

const getItemName = (item) => {
  return item.product?.name || item.name || 'Article sans nom'
}

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/80?text=bylin'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const goToOrderDetails = (order) => {
  router.push(`/orders/${order.order_number}/invoice/download`)
}
</script>