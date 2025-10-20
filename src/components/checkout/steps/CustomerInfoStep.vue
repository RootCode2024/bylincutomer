<template>
  <div class="p-8">
    <div class="flex items-start mb-8">
      <div class="bg-indigo-50 p-3 rounded-lg mr-4">
        <UserIcon :size="24" class="text-indigo-600" />
      </div>
      <div>
        <h1 class="text-2xl font-light text-gray-800 tracking-tight">
          Informations de livraison
        </h1>
        <p class="text-gray-500 mt-1">
          Renseignez les détails pour le partage du panier
        </p>
      </div>
    </div>

    <SharedCartForm 
      :model-value="sharedCartForm"
      @update:model-value="$emit('update:sharedCartForm', $event)"
      @validate="$emit('validate')"
    />

    <div class="mt-8 flex justify-between">
      <button 
        @click="$emit('prevStep')"
        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
      >
        <ArrowLeftIcon :size="16" class="mr-2" />
        Retour
      </button>
      <button 
        @click="$emit('validate')"
        class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md"
      >
        Vérifier
        <ArrowRightIcon :size="16" class="ml-2" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-vue-next';
import SharedCartForm from '@/components/Product/SharedCartForm.vue';

defineProps({
  sharedCartForm: {
    type: Object,
    required: true
  }
});

defineEmits(['update:sharedCartForm', 'validate', 'prevStep']);
</script>