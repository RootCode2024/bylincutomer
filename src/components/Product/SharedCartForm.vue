<template>
  <form class="space-y-6" @submit.prevent="$emit('validate')">
    <!-- Titre -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Titre du panier partagé *
      </label>
      <input
        v-model="form.title"
        type="text"
        required
        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition placeholder-gray-400"
        placeholder="Ex: Cadeaux pour l'anniversaire de Marie"
      >
      <p class="text-xs text-gray-500 mt-1">
        Donnez un nom clair à votre panier partagé
      </p>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Instructions (optionnel)
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition placeholder-gray-400"
        placeholder="Ajoutez des notes ou des instructions spécifiques..."
      ></textarea>
    </div>

    <!-- Téléphone -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Numéro de téléphone *
      </label>
      <input
        v-model="form.phone"
        type="tel"
        required
        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition placeholder-gray-400"
        placeholder="Pour contacter le destinataire"
      >
      <p class="text-xs text-gray-500 mt-1">
        Ex: +229 01 00 00 00
      </p>
    </div>

    <!-- Date limite -->
    <div class="pt-4 border-t border-gray-100">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Date limite de validation (optionnel)
      </label>
      <VueDatePicker
      class=" z-[999999]"
       v-model="form.closing_date"
       :enable-time-picker="false"
       :min-date="new Date(Date.now() + 86400000)"
       :max-date="new Date(Date.now() + 1209600000)"
       placeholder="Date limite de validation"
       :markers="markers"
       ></VueDatePicker>
      <p class="text-xs text-gray-500 mt-1">
        Après cette date, le panier ne pourra plus être validé
      </p>
    </div>

    <!-- Permissions -->
    <div class="pt-4 border-t border-gray-100">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="allow-edits"
            v-model="form.allow_edits"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-400 border-gray-300 rounded"
          >
        </div>
        <div class="ml-3">
          <label for="allow-edits" class="text-sm text-gray-700">
            Autoriser Multi-Contributeurs
          </label>
          <p class="text-xs text-gray-500 mt-1">
            Plusieurs personnes peuvent contribuer au paiement de ce panier en effectuant des paiements individuels basés sur un pourcentage
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
// import { CalendarIcon } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import addDays from 'date-fns/addDays';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'validate']);

const form = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const markers = ref([
  {
    date: addDays(new Date(), 0),
    type: 'dot',
    tooltip: [{ text: 'A partir d\'aujourd’hui', color: 'green' }],
  },
  {
    date: addDays(new Date(), 14),
    type: 'dot',
    tooltip: [
      { text: 'Maximum de 14 jours', color: 'red' },
    ],
  },
  {
    date: computed(() => form.value.closing_date || (new Date(Date.now() + 86400000))),
    type: 'line',
    color: 'orange',
    tooltip: [
      { text: 'Jour de livraison', color: 'orange' },
    ],
  },
])

</script>