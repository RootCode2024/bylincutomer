<template>
  <div 
    class="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer transition-all hover:transform hover:-translate-y-1 hover:shadow-lg"
    @click="onClick"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="font-semibold text-lg text-gray-800 truncate max-w-[180px]">{{ cart.title }}</h3>
        <p class="text-xs text-gray-400 mt-1">ID: {{ cart.shared_cart_id }}</p>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-xl font-bold text-indigo-600">{{ currencyStore.formatCurrency(cart.total_amount) }}</span>
        <StatusBadge 
          :label="getStatusLabel(cart)"
          :status="getStatusVariant(cart)"
          class="mt-2"
        />
      </div>
    </div>
    
    <div class="mt-4 text-sm text-gray-600">
      <div class="grid grid-cols-2 gap-3">
        <CartInfoItem 
          icon="user" 
          :text="`${cart.total_contributors} participant${cart.total_contributors > 1 ? 's' : ''}`" 
          color="primary"
        />
        <CartInfoItem 
          icon="shopping-bag" 
          :text="`${cart.quantity} article${cart.quantity > 1 ? 's' : ''}`"
          color="success"
        />
        <CartInfoItem 
          icon="calendar" 
          :text="`Créé: ${formatDate(cart.created_at)}`"
          color="warning"
        />
        <CartInfoItem 
          icon="time" 
          :text="`Clôture: ${formatDate(cart.closing_date)}`"
          color="info"
        />
        <CartInfoItem 
          icon="currency" 
          :text="`Total: ${currencyStore.formatCurrency(cart.total_amount)}`"
          color="primary"
        />
        <CartInfoItem 
          icon="currency" 
          :text="`Payé: ${currencyStore.formatCurrency(cart.total_paid_by_contributors)}`"
          color="success"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import CartInfoItem from './CartInfoItem.vue'
import { useCurrencyStore } from '@/stores/currency'

const currencyStore = useCurrencyStore()

const props = defineProps({
  cart: {
    type: Object,
    required: true,
    default: () => ({
      shared_cart_id: '',
      title: '',
      total_amount: 0,
      total_paid_by_contributors: 0,
      total_contributors: 0,
      quantity: 0,
      created_at: '',
      closing_date: ''
    })
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (cart) => {
  const now = new Date()
  const closingDate = new Date(cart.closing_date)
  return now > closingDate ? 'Clôturé' : 'Actif'
}

const getStatusVariant = (cart) => {
  const now = new Date()
  const closingDate = new Date(cart.closing_date)
  return now > closingDate ? 'neutral' : 'success'
}
</script>