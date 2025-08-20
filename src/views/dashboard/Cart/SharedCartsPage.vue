<template>
  <div class="px-4 py-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Paniers Partagés</h1>
      <p class="text-gray-600 max-w-3xl">
        Gérez vos paniers collaboratifs, suivez les contributions et organisez vos achats groupés.
        Créez un nouveau panier pour commencer à partager vos dépenses.
      </p>
    </div>

    <div v-if="sharedCarts.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Total paniers</p>
        <p class="text-2xl font-bold">{{ sharedCarts.length }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Balance</p>
        <p class="text-2xl font-bold text-indigo-600">{{ currencyStore.formatCurrency(balance) }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Encaissé</p>
        <p class="text-2xl font-bold">{{ currencyStore.formatCurrency(rest) }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Contributeurs</p>
        <p class="text-2xl font-bold">0</p>
      </div>
    </div>
    
    <!-- État de chargement -->
    <LoadingSpinner v-if="loading" message="Chargement des paniers..." />
    
    <!-- Gestion des erreurs -->
    <ErrorMessage 
      v-else-if="error" 
      :message="'Erreur lors du chargement : ' + error" 
    />
    
    <!-- Contenu principal -->
    <template v-else>
      <div class="mb-6 flex justify-end relative">
        <PrimaryButton
          :disabled="sharedCarts.length === 3"
          @click="createNewCart"
          @mouseenter="showTooltip = sharedCarts.length === 3"
          @mouseleave="showTooltip = false"
          icon="plus"
          label="Créer un nouveau panier"
        />
        <div 
          v-if="showTooltip"
          class="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg tooltip-box"
          style="top: 100%; right: 0;"
        >
          Vous avez atteint la limite de 3 paniers partagés actifs.
          <div class="absolute w-4 h-4 transform rotate-45 -mt-2 bg-gray-800 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
      
      <!-- Liste vide -->
      <EmptyState 
        v-if="sharedCarts.length === 0" 
        icon="shopping-cart"
        title="Aucun panier partagé"
        message="Commencez par créer un panier partagé pour organiser vos achats groupés"
      >
        <template #actions>
          <PrimaryButton
            @click="createNewCart"
            icon="plus"
            label="Créer mon premier panier"
          />
        </template>
      </EmptyState>
      
      <!-- Liste des paniers -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SharedCartCard 
            v-for="cart in sharedCarts" 
            :key="cart.shared_cart_id"
            :cart="{
              ...cart,
              status: cart.status || 'inactive', // Valeur par défaut
              ownerName: authStore.userName || 'Inconnu'
            }"
            @click="viewCartDetails(cart.shared_cart_id)"
          />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

// Composants UI
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import SharedCartCard from '@/components/cart/SharedCartCard.vue'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const authStore = useAuthStore()

// États
const sharedCarts = ref([])
const balance = ref(0)
const rest = ref(0)
const loading = ref(true)
const error = ref(null)
const showTooltip = ref(false)

// Méthodes
const loadSharedCarts = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await cartStore.fetchSharedCarts()
    sharedCarts.value = response.data

    balance.value = response.total

    sharedCarts.value.forEach(cart => {
      rest.value -= cart.total_paid_by_contributors
    });
    
    // rest.value = balance.value  - sharedCarts.value.total_paid_by_contributors

    console.log('Paniers partagés chargés:', rest.value)
  } catch (err) {
    error.value = err.message || 'Échec du chargement des paniers'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

const viewCartDetails = (cartId) => {
  if (!cartId) {
    console.error('No cart ID provided');
    return;
  }
  console.log('Navigating to cart with ID:', cartId); // Add this before router.push
  router.push({ 
    name: 'dashboard.shared.carts.details', 
    params: { id: cartId } 
  });
}

const createNewCart = () => {
  router.push({ name: 'CreateSharedCart' })
}

// Cycle de vie
onMounted(() => {
  loadSharedCarts()
})
</script>

<style scoped>
.tooltip-box {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-5px); }
}
</style>