<template>
  <div 
    class="border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors relative"
    :class="{ 'ring-2 ring-blue-500 border-blue-500': address.is_default }"
  >
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center">
          <h3 class="font-medium text-gray-900">{{ address.type }}</h3>
          <span 
            v-if="address.is_default"
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            Principale
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-600">{{ address.address_line }}</p>
        <p class="text-sm text-gray-600">{{ address.city }}, {{ address.state }}</p>
        <p class="text-sm text-gray-600">{{ getCountryName(address.country_id) }}</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click.stop="$emit('edit')"
          class="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
          title="Modifier"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          @click.stop="$emit('remove')"
          class="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
          title="Supprimer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <button 
      v-if="!address.is_default"
      @click.stop="$emit('set-default')"
      class="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Définir comme principale
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const props = defineProps({
  address: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'remove', 'set-default'])

const uiStore = useUIStore()

// Obtenir le nom du pays à partir de l'ID
const getCountryName = (countryId) => {
  const country = uiStore.countries.find(c => c.id === countryId)
  return country?.name || 'Inconnu'
}
</script>

<style scoped>
/* Styles spécifiques à la carte d'adresse */
</style>