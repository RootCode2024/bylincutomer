<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <div class="relative overflow-hidden">
      <img 
        :src="tutorial.image || '/images/tutorials/default.jpg'" 
        :alt="tutorial.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <div class="absolute top-4 left-4">
        <span 
          class="px-3 py-1 rounded-full text-xs font-semibold"
          :class="tutorial.is_premium ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
        >
          {{ tutorial.is_premium ? formatCurrency(tutorial.price) : 'Gratuit' }}
        </span>
      </div>
      <div v-if="isPurchased" class="absolute top-4 right-4">
        <span class="px-2 py-1 bg-green-600 text-white text-xs rounded">
          Acheté
        </span>
      </div>
      <div class="absolute top-12 right-4 flex gap-2">
        <span class="px-2 py-1 bg-gray-800 text-white text-xs rounded">
          {{ tutorial.preview_content?.duration || formatMap[tutorial.format] }}
        </span>
        <span class="px-2 py-1 bg-gray-600 text-white text-xs rounded">
          {{ levelMap[tutorial.level] }}
        </span>
      </div>
    </div>
    
    <div class="p-6">
      <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
        {{ tutorial.title }}
      </h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ tutorial.description }}
      </p>
      
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
            <span class="text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg></span>
          </div>
          <span class="text-sm text-gray-600">{{ tutorial.instructor?.name || 'Expert Style' }}</span>
        </div>
      </div>

      <button
        @click="$emit('select-tutorial', tutorial)"
        class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        :disabled="isPurchased"
        :class="{ 'bg-green-600 hover:bg-green-700': isPurchased }"
      >
        {{ isPurchased ? 'Accéder' : (tutorial.is_premium ? 'Acheter maintenant' : 'Commencer') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCurrencyStore } from '@/stores/currency'

const currencyStore = useCurrencyStore()

defineProps({
  tutorial: {
    type: Object,
    required: true
  },
  isPurchased: {
    type: Boolean,
    default: false
  }
})

const levelMap = {
  'débutant': 'Débutant',
  'intermédiaire': 'Intermédiaire',
  'expert': 'Expert'
}

const formatMap = {
  'video': 'Vidéo',
  'article': 'Article',
  'pdf': 'PDF'
}

const formatCurrency = (amount) => {
  if (!amount) return 'Gratuit'
  return currencyStore.formatCurrency(parseFloat(amount))
}

defineEmits(['select-tutorial'])
</script>