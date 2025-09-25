<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden transform transition-all">
          <div class="relative h-96">
            <img :src="tutorial.image" :alt="tutorial.title" class="w-full h-full object-cover">
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <span 
                  class="px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block"
                  :class="tutorial.is_premium ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                >
                  {{ tutorial.is_premium ? `€${tutorial.price}` : 'Gratuit' }}
                </span>
                <h2 class="text-2xl font-bold text-gray-900">{{ tutorial.title }}</h2>
              </div>
            </div>
            
            <p class="text-gray-600 mb-6">{{ tutorial.description }}</p>
            
            <div class="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Instructeur</h4>
                <p class="text-gray-600">{{ tutorial.instructor.name }}</p>
                <p class="text-sm text-gray-500">{{ tutorial.instructor.expertise }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Détails</h4>
                <p class="text-gray-600">Durée: {{ tutorial.duration }}</p>
                <p class="text-gray-600">Niveau: {{ tutorial.level }}</p>
                <p class="text-gray-600">Format: {{ tutorial.format }}</p>
              </div>
            </div>
            
            <button
              v-if="!isPurchased && tutorial.is_premium"
              @click="$emit('purchase', tutorial)"
              class="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Acheter pour €{{ tutorial.price }}
            </button>
            
            <button
              v-else
              class="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {{ isPurchased ? 'Accéder au tutoriel' : 'Commencer le tutoriel' }}
            </button>
            
            <!-- Aperçu du contenu pour les tutoriels premium non achetés -->
            <div v-if="!isPurchased && tutorial.is_premium && tutorial.preview_content" class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">Aperçu gratuit</h4>
              <p class="text-gray-600">{{ tutorial.preview_content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  tutorial: Object,
  isPurchased: Boolean
})

defineEmits(['close', 'purchase'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>