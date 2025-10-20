<template>
  <div class="checkout-success">
    <section class="text-center py-12" v-if="!loading && !error">
      <div class="max-w-4xl mx-auto">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
        <p class="text-xl text-blue-600 mb-4 font-semibold">N° {{ orderData.order_number }}</p>
        <p class="text-gray-600 mb-8">Nous avons envoyé les détails à <strong>{{ userEmail }}</strong></p>
        
        <div class="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-8 border">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">Date estimée de livraison</span>
            <span class="font-semibold text-gray-900">{{ estimatedDelivery }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">Statut de la commande</span>
            <span class="font-semibold text-gray-900 capitalize">{{ orderData.status }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">Montant total</span>
            <span class="font-semibold text-gray-900">{{ formatCurrency(orderData.total) }}</span>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-gray-600 font-medium">Méthode de paiement</span>
            <span class="font-semibold text-gray-900 text-right capitalize">
              {{ paymentMethodDisplay }}
            </span>
          </div>
        </div>

        <!-- Bouton de redirection vers le paiement si nécessaire -->
        <div v-if="showPaymentRedirect" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-blue-800 text-sm mb-3">Votre paiement n'est pas encore finalisé</p>
          <button 
            @click="redirectToPayment" 
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔗 Finaliser le paiement
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="trackOrder" 
            class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Suivre ma commande
          </button>
          <button 
            @click="continueShopping" 
            class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Continuer mes achats
          </button>
        </div>
      </div>
    </section>

    <!-- État de chargement -->
    <section v-else-if="loading" class="text-center py-12">
      <div class="max-w-2xl mx-auto">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Chargement...</h2>
        <p class="text-gray-600">Récupération des détails de votre commande</p>
      </div>
    </section>

    <!-- État d'erreur -->
    <section v-else-if="error" class="text-center py-12">
      <div class="max-w-2xl mx-auto">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Erreur</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="retryFetch" 
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Réessayer
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCurrencyStore } from '@/stores/currency';
import { useOrderStore } from '@/stores/order';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const currencyStore = useCurrencyStore();
const orderStore = useOrderStore();

// Réactives
const loading = ref(true);
const error = ref(null);
const orderData = ref({});
const paymentData = ref({});

// Computed properties
const orderNumber = computed(() => route.query.order || 'N/A');
const userEmail = computed(() => authStore.user?.email || 'Non disponible');
const estimatedDelivery = computed(() => {
  if (!orderData.value.created_at) return 'Calcul en cours...';
  
  const deliveryDate = new Date(orderData.value.created_at);
  deliveryDate.setDate(deliveryDate.getDate() + 3); // +3 jours pour la livraison
  
  return deliveryDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const paymentMethodDisplay = computed(() => {
  const method = paymentData.value.gateway || orderData.value.payment_method;
  switch(method) {
    case 'fedapay': return 'Mobile Money';
    case 'stripe': return 'Carte de crédit';
    case 'cash_on_delivery': return 'Paiement à la livraison';
    default: return method || 'Non spécifié';
  }
});

const showPaymentRedirect = computed(() => {
  return orderData.value.status === 'pending' && 
         paymentData.value.status === 'pending' &&
         paymentData.value.gateway !== 'cash_on_delivery';
});

// Methods
const formatCurrency = (amount) => {
  if (currencyStore?.formatCurrency) {
    return currencyStore.formatCurrency(amount);
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

const fetchOrderDetails = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Utiliser l'order_number depuis l'URL
    const response = await orderStore.fetchOrderById(orderNumber.value);

    console.log('Order fetch response:', response);

    const dataOrder = response;
    
    if (dataOrder) {
      orderData.value = dataOrder.order || {};
      paymentData.value = dataOrder.payment || {};
    } else {
      throw new Error(dataOrder.message || 'Erreur lors de la récupération de la commande');
    }

  } catch (err) {
    console.error('Erreur récupération commande:', err);
    error.value = err.message || 'Impossible de charger les détails de la commande';
  } finally {
    loading.value = false;
  }
};

const redirectToPayment = () => {
  const paymentUrl = orderData.value.payment_url || paymentData.value.redirect_url;
  if (paymentUrl) {
    window.location.href = paymentUrl;
  }
};

const trackOrder = () => {
  if (orderData.value.id) {
    router.push(`/orders/track/${orderData.value.id}`);
  } else {
    router.push('/orders');
  }
};

const continueShopping = () => {
  router.push('/shop');
};

const retryFetch = () => {
  fetchOrderDetails();
};

// Lifecycle
onMounted(() => {
  if (!orderNumber.value) {
    error.value = 'Numéro de commande non trouvé dans l\'URL';
    loading.value = false;
    return;
  }
  
  fetchOrderDetails();
});
</script>

<style scoped>
.checkout-success {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .checkout-success {
    padding: 1rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
}
</style>