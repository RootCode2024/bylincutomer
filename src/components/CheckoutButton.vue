<template>
  <button 
    @click="goToCheckout"
    class="checkout-btn w-full flex items-center justify-center px-6 py-4 bg-indigo-800 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-md tracking-wide"
  >
    <CreditCardIcon :size="18" class="mr-2" />
    <span>Procéder au paiement</span>
  </button>
</template>

<script setup>
import { CreditCardIcon } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCheckout = () => {
  router.push('/checkout');
};
</script>