<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <div class="p-6">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-sm font-medium text-gray-900 uppercase">Suivi de commande #{{ order.reference }}</h2>
          <p class="mt-1 text-sm text-gray-500">
            Transporteur: {{ trackingInfo.carrier }} - N°: {{ trackingInfo.tracking_number }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <X class="h-6 w-6" />
        </button>
      </div>

      <div v-if="loading" class="mt-8 flex justify-center">
        <Spinner class="h-8 w-8 text-blue-500" />
      </div>

      <div v-else class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Statut actuel</p>
            <p class="text-lg font-semibold text-gray-900 capitalize">
              {{ getStatusLabel(trackingInfo.current_status) }}
            </p>
          </div>
          <div v-if="trackingInfo.estimated_delivery" class="text-right">
            <p class="text-sm font-medium text-gray-500">Livraison estimée</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatDate(trackingInfo.estimated_delivery) }}
            </p>
          </div>
        </div>

        <div class="mt-8 flow-root">
          <ul class="-mb-8">
            <li v-for="(step, stepIdx) in trackingInfo.steps" :key="step.status" class="relative pb-8">
              <div v-if="stepIdx !== trackingInfo.steps.length - 1" 
                   class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" 
                   aria-hidden="true" />
              
              <div class="relative flex space-x-3">
                <div>
                  <span :class="[step.iconColor, 'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white']">
                    <component :is="step.icon" class="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div class="flex min-w-0 flex-1 justify-between pt-1.5">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ step.label }} - 
                      <span v-if="step.date">{{ formatDate(step.date) }}</span>
                      <span v-else>En attente</span>
                    </p>
                    <p class="text-sm text-gray-500">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="trackingInfo.current_status !== 'delivered'" class="mt-6 border-t border-gray-200 pt-4">
        <p class="text-sm text-gray-500">
          Vous recevrez des notifications par email à chaque étape importante.
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { CheckCircle, PackageOpen, Truck, MapPin, X } from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'
import Spinner from '@/components/ui/LoadingSpinner.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  trackingInfo: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const statusLabels = {
  en_attente: 'En attente de payement',
  paye: 'Payé',
  expedie: 'Expédiée',
  livre: 'Livrée',
  annule: 'Annulée'
}

const getStatusLabel = (status) => {
  return statusLabels[status] || status
}

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
</script>