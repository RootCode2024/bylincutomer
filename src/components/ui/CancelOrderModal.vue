<template>
  <Modal @close="$emit('close')">
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <i class="fas fa-exclamation-triangle text-red-600"></i>
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Annuler la commande #{{ order.orderNumber }}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
            </p>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Raison de l'annulation</label>
              <select 
                v-model="cancelReason"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Sélectionnez une raison</option>
                <option value="changed-mind">Changement d'avis</option>
                <option value="found-cheaper">Trouvé moins cher ailleurs</option>
                <option value="delivery-too-long">Délai de livraison trop long</option>
                <option value="other">Autre raison</option>
              </select>
              <textarea
                v-if="cancelReason === 'other'"
                v-model="customReason"
                rows="3"
                class="mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Veuillez préciser la raison..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        @click="confirmCancel"
        :disabled="!cancelReason"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        :class="{ 'opacity-50 cursor-not-allowed': !cancelReason }"
      >
        Confirmer l'annulation
      </button>
      <button
        type="button"
        @click="$emit('close')"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Annuler
      </button>
    </div>
  </Modal> <!-- This was the missing closing tag -->
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const cancelReason = ref('')
const customReason = ref('')

const confirmCancel = () => {
  const reason = cancelReason.value === 'other' 
    ? customReason.value 
    : cancelReason.value
  emit('confirm', reason)
  emit('close')
}
</script>