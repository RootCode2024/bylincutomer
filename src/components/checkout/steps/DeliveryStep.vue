<template>
  <div class="p-8">
    <div class="flex items-start mb-8">
      <div class="bg-indigo-50 p-3 rounded-lg mr-4">
        <TruckIcon :size="24" class="text-indigo-600" />
      </div>
      <div>
        <h1 class="text-2xl font-light text-gray-800 tracking-tight">
          Options de livraison
        </h1>
        <p class="text-gray-500 mt-1">
          Choisissez votre méthode et adresse de livraison
        </p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <Spinner class="mx-auto" />
      <p class="mt-4 text-gray-600">Chargement des options de livraison...</p>
    </div>

    <div v-else-if="deliveryError" class="text-center py-8">
      <TriangleAlert class="mx-auto h-12 w-12 text-red-500" />
      <p class="mt-4 text-red-600">{{ deliveryError }}</p>
      <button 
        @click="$emit('loadCities')"
        class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Réessayer
      </button>
    </div>

    <div v-else class="grid md:grid-cols-3 gap-6">
      <!-- Colonne gauche - Adresse de livraison -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Adresse de livraison</h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                <select 
                  v-model="deliveryForm.country"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  @change="$emit('loadCities')"
                >
                  <option v-for="country in countries" :value="country.code" :key="country.code">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <select 
                  v-model="deliveryForm.city"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  :disabled="!deliveryForm.country || loadingCities"
                  @change="$emit('loadDistricts')"
                >
                  <option value="">Sélectionnez une ville</option>
                  <option v-for="city in availableCities" :value="city.id" :key="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="availableDistricts.length > 0" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Quartier/District</label>
                <select 
                  v-model="deliveryForm.district"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  :disabled="!deliveryForm.city || loadingDistricts"
                  @change="$emit('loadDeliveryOptions')"
                >
                  <option value="">Sélectionnez un quartier</option>
                  <option v-for="district in availableDistricts" :value="district.id" :key="district.id">
                    {{ district.name }} - {{ formatPrice(district.standard_price) }}
                  </option>
                </select>
            </div>

            <div v-if="deliveryForm.district" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse détaillée</label>
              <input 
                v-model="deliveryForm.address"
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Rue, numéro, lieu-dit..."
              >
            </div>

            <div class="flex items-center">
              <input 
                id="save-address"
                type="checkbox" 
                v-model="deliveryForm.saveAddress"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              >
              <label for="save-address" class="ml-2 block text-sm text-gray-700">
                Enregistrer cette adresse pour mes prochaines commandes
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne droite - Options de livraison -->
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Méthode de livraison</h2>
          
          <div v-if="loadingDeliveryOptions" class="text-center py-4">
            <Spinner class="mx-auto" />
            <p class="mt-2 text-sm text-gray-600">Chargement...</p>
          </div>

          <div v-else-if="deliveryOptions.length === 0 && deliveryForm.district" class="text-center py-4">
            <p class="text-gray-500">Aucune option de livraison disponible</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="option in deliveryOptions" 
              :key="option.id"
              @click="$emit('selectDeliveryOption', option)"
              :class="[
                'border rounded-lg p-4 cursor-pointer transition',
                selectedDeliveryOption?.id === option.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              ]"
            >
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    type="radio" 
                    :checked="selectedDeliveryOption?.id === option.id"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  >
                </div>
                <div class="ml-3">
                  <div class="flex justify-between">
                    <p><span class="block text-sm font-medium text-gray-700">{{ option.name }}</span></p>
                    <span class="text-sm font-medium">{{ formatPrice(getOptionPrice(option)) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ option.delivery_time }}</p>
                  <p v-if="option.free_threshold" class="text-xs text-green-600 mt-1">
                    Livraison gratuite à partir de {{ formatPrice(option.free_threshold) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Résumé -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Résumé</h2>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Sous-total</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between" v-if="deliveryCost > 0">
              <span class="text-gray-600">Livraison</span>
              <span>{{ formatPrice(deliveryCost) }}</span>
            </div>
            <div v-if="cartStore.couponValue && cartStore.couponValue > 0" class="flex justify-between">
              <span class="text-gray-600">Réduction</span>
              <span class="text-yellow-600">-{{ formatPrice(cartStore.couponValue) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span class="text-indigo-600">{{ formatPrice(finalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button 
        @click="$emit('prevStep')"
        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
      >
        <ArrowLeftIcon :size="16" class="mr-2" />
        Retour
      </button>
      <button 
        @click="$emit('validateDelivery')"
        :disabled="!isDeliveryFormValid"
        :class="[
          'px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md',
          !isDeliveryFormValid ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        Continuer
        <ArrowRightIcon :size="16" class="ml-2" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { TruckIcon, ArrowLeftIcon, ArrowRightIcon, TriangleAlert } from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';
import Spinner from '@/components/ui/LoadingSpinner.vue';

defineProps({
  loading: Boolean,
  deliveryError: String,
  countries: Array,
  availableCities: Array,
  availableDistricts: Array,
  deliveryOptions: Array,
  selectedDeliveryOption: Object,
  deliveryForm: Object,
  subtotal: Number,
  deliveryCost: Number,
  finalPrice: Number,
  loadingCities: Boolean,
  loadingDistricts: Boolean,
  loadingDeliveryOptions: Boolean,
  isDeliveryFormValid: Boolean
});

defineEmits([
  'loadCities',
  'loadDistricts',
  'loadDeliveryOptions',
  'selectDeliveryOption',
  'validateDelivery',
  'prevStep'
]);

const cartStore = useCartStore();

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price);
};

const getOptionPrice = (option) => {
  // Cette fonction sera implémentée dans le parent
  return option.price;
};
</script>