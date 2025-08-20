<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Mes adresses
      </h2>
      <button 
        @click="$emit('add-address')"
        class="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Ajouter
      </button>
    </div>
    
    <div v-if="addresses.length" class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <AddressCard 
        v-for="(address, index) in addresses" 
        :key="index"
        :address="address"
        @edit="$emit('edit-address', index)"
        @remove="$emit('remove-address', index)"
        @set-default="$emit('set-default-address', address.id)"
      />
    </div>
    
    <EmptyState v-else @add-address="$emit('add-address')" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import AddressCard from '@/components/profile/AddressCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

defineEmits(['add-address', 'edit-address', 'remove-address', 'set-default-address'])

const userStore = useUserStore()
const addresses = computed(() => userStore.addresses)
</script>