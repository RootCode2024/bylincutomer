<template>
  <div class="p-8">
    <div class="flex items-start mb-8">
      <div class="bg-indigo-50 p-3 rounded-lg mr-4">
        <CheckCircleIcon :size="24" class="text-indigo-600" />
      </div>
      <div>
        <h1 class="text-2xl font-light text-gray-800 tracking-tight">
          Vérification
        </h1>
        <p class="text-gray-500 mt-1">
          Confirmez les détails avant partage du panier
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Colonne gauche - Détails du panier -->
      <div>
        <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
          <ShoppingCartIcon :size="18" class="mr-2 text-indigo-500" />
          Votre panier
        </h2>
        
        <div class="bg-gray-50/50 p-4 rounded-lg border border-gray-200/70">
          <div class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex">
              <div class="w-16 h-16 rounded-md bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                <img v-if="item.image" :src="item.image ||'https://placehold.co/80?text=bylin'" :alt="item.name" class="w-full h-full object-cover object-center">
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-gray-800 text-sm">{{ item.name }}</h3>
                <div class="flex justify-end mt-2 text-sm">
                  <span class="text-gray-600">× {{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200/70 space-y-2 text-sm">
            <div class="flex justify-between font-medium pt-2">
              <span>NET A PAYER</span>
              <span class="text-indigo-600">{{ formatPrice(finalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne droite - Détails de livraison -->
      <div>
        <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
          <TruckIcon :size="18" class="mr-2 text-indigo-500" />
          Livraison
        </h2>
        
        <div class="bg-gray-50/50 p-4 rounded-lg border border-gray-200/70 space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Méthode de livraison</h3>
            <p class="text-gray-600">{{ selectedDeliveryOption?.name }}</p>
            <p class="text-xs text-gray-500">{{ selectedDeliveryOption?.delivery_time }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Adresse</h3>
            <p class="text-gray-600">{{ deliveryForm.address }}</p>
            <p class="text-gray-600">{{ selectedDistrict?.name }}, {{ selectedCity?.name }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Coût de livraison</h3>
            <p class="text-gray-600">{{ formatPrice(deliveryCost) }}</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Téléphone</h3>
            <p class="text-gray-600">{{ sharedCartForm.phone }}</p>
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
        Modifier
      </button>
        <button 
        @click="$emit('confirmAndShare')"
        :disabled="loadingConfAndShare"
        :class="[
          'px-6 py-3 bg-indigo-600 text-white rounded-lg transition flex items-center shadow-sm hover:shadow-md',
          loadingConfAndShare ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
        ]"
        >
        <SendIcon :size="16" class="mr-2" />
        <span v-if="loadingConfAndShare" class="flex items-center">
          <Spinner class="mr-2" />
          Partage en cours...
        </span>
        <span v-else>Partager le panier</span>
        </button>
    </div>
  </div>
</template>

<script setup>
import { 
  CheckCircleIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  ArrowLeftIcon, 
  SendIcon 
} from 'lucide-vue-next';
import Spinner from '@/components/ui/LoadingSpinner.vue';

defineProps({
  cartItems: Array,
  finalPrice: Number,
  selectedDeliveryOption: Object,
  deliveryForm: Object,
  selectedCity: Object,
  selectedDistrict: Object,
  deliveryCost: Number,
  sharedCartForm: Object,
  loadingConfAndShare: Boolean
});

defineEmits(['prevStep', 'confirmAndShare']);

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price);
};
</script>