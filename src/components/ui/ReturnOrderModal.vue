<template>
  <Modal @close="$emit('close')">
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
          <i class="fas fa-undo text-indigo-600"></i>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Demande de retour pour la commande #{{ order.orderNumber }}
          </h3>
          <div class="mt-2 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Articles à retourner</label>
              <div class="mt-1 space-y-2">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="flex items-center"
                >
                  <input 
                    :id="`item-${item.id}`"
                    v-model="selectedItems"
                    :value="item.id"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <label :for="`item-${item.id}`" class="ml-3 flex items-center">
                    <img :src="item.image" class="w-10 h-10 rounded-md object-cover mr-2">
                    <span class="text-sm text-gray-700">
                      {{ item.name }} ({{ item.quantity }} × {{ item.price }}€)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Motif du retour</label>
              <select 
                v-model="returnReason"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Sélectionnez un motif</option>
                <option value="wrong-item">Article incorrect</option>
                <option value="damaged">Article endommagé</option>
                <option value="not-as-described">Ne correspond pas à la description</option>
                <option value="other">Autre raison</option>
              </select>
            </div>

            <div v-if="returnReason">
              <label class="block text-sm font-medium text-gray-700">Détails supplémentaires</label>
              <textarea
                v-model="returnDetails"
                rows="3"
                class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Décrivez le problème en détails..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Méthode de retour</label>
              <select 
                v-model="returnMethod"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Sélectionnez une méthode</option>
                <option value="pickup">Enlèvement à domicile</option>
                <option value="dropoff">Dépôt en point relais</option>
                <option value="postal">Envoi postal</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        @click="submitReturn"
        :disabled="!canSubmit"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        :class="{ 'opacity-50 cursor-not-allowed': !canSubmit }"
      >
        Soumettre la demande
      </button>
      <button
        type="button"
        @click="$emit('close')"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Annuler
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const selectedItems = ref([])
const returnReason = ref('')
const returnDetails = ref('')
const returnMethod = ref('')

const canSubmit = computed(() => {
  return selectedItems.value.length > 0 && 
         returnReason.value && 
         returnMethod.value
})

const submitReturn = () => {
  const returnData = {
    items: selectedItems.value,
    reason: returnReason.value,
    details: returnDetails.value,
    method: returnMethod.value
  }
  emit('submit', returnData)
  emit('close')
}
</script>