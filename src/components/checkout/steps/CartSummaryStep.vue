<template>
  <div class="p-8">
    <div class="flex items-start mb-8">
      <div class="bg-indigo-50 p-3 rounded-lg mr-4">
        <ShoppingCartIcon :size="24" class="text-indigo-600" />
      </div>
      <div>
        <h1 class="text-2xl font-light text-gray-800 tracking-tight">
          Votre panier
        </h1>
        <p class="text-gray-500 mt-1">
          {{ cartItems.length }} article{{ cartItems.length > 1 ? 's' : '' }} dans votre panier
        </p>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="item in cartItems" :key="item.id" class="flex border-b border-gray-100 pb-6">
        <div class="w-24 h-24 rounded-md bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
          <img :src="item.image || 'https://placehold.co/80?text=bylin'" :alt="item.name" class="w-full h-full object-cover object-center">
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-gray-800">{{ item.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ item.variant }}</p>
          <div class="flex justify-between mt-3">
            <div class="flex items-center border rounded">
              <span class="px-3">{{ item.quantity }}</span>
            </div>
            <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-200 space-y-3">
      <div class="flex justify-between">
        <span class="text-gray-600">Sous-total</span>
        <span class="font-medium">{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between" v-if="cartStore.couponValue && cartStore.couponValue > 0">
        <span class="">Reduction </span>
        <span class="font-medium text-yellow-600"> - {{ formatPrice(cartStore.couponValue) }}</span>
      </div> 
      <hr>
      <div class="flex justify-between text-lg pt-3">
        <span class="font-medium">NET A PAYER</span>
        <span class="text-indigo-600 font-medium">{{ formatPrice(finalAmount) }}</span>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <button 
        @click="$emit('nextStep')"
        class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md"
      >
        Continuer
        <ArrowRightIcon :size="16" class="ml-2" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ShoppingCartIcon, ArrowRightIcon } from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';

defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  finalAmount: {
    type: Number,
    required: true
  }
});

defineEmits(['nextStep']);

const cartStore = useCartStore();

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price);
};
</script>