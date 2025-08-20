<template>
  <div class="cart-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="font-medium text-lg text-gray-900">{{ cart.name }}</h3>
        <span :class="['status-badge', cart.status]">
          {{ cart.status }}
        </span>
      </div>
      
      <div class="mt-3 text-sm text-gray-600">
        <p class="flex items-center">
          <UserIcon class="w-4 h-4 mr-1" />
          {{ useAuthStore.userName }}
        </p>
        <p class="flex items-center mt-1">
          <ShoppingBagIcon class="w-4 h-4 mr-1" />
          {{ cart.itemCount }} items
        </p>
        <p class="flex items-center mt-1">
          <CalendarIcon class="w-4 h-4 mr-1" />
          {{ formatDate(cart.updatedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, ShoppingBagIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '@/utils/dateUtils'

defineProps({
  cart: {
    type: Object,
    required: true
  }
})
</script>