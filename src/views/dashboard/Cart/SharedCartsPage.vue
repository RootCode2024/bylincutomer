<template>
  <div class="px-4 py-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Paniers Partagés</h1>
      <p class="text-gray-600 max-w-3xl">
        Gérez vos paniers collaboratifs, suivez les contributions et organisez vos achats groupés.
        Créez un nouveau panier pour commencer à partager vos dépenses.
      </p>
    </div>

    <!-- Stats -->
    <div v-if="!loading && !error && sharedCarts.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Total paniers</p>
        <p class="text-2xl font-bold">{{ sharedCarts.length }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Balance</p>
        <p class="text-2xl font-bold text-indigo-600">{{ currencyStore.formatCurrency(totalAmount) }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Encaissé</p>
        <p class="text-2xl font-bold">{{ currencyStore.formatCurrency(totalPaid) }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Contributeurs</p>
        <p class="text-2xl font-bold">{{ totalContributors }}</p>
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
          :disabled="sharedCarts.length >= 3"
          @click="createNewCart"
          @mouseenter="showTooltip = sharedCarts.length >= 3"
          @mouseleave="showTooltip = false"
          icon="plus"
          label="Créer un nouveau panier"
        />
        <div 
          v-if="showTooltip && sharedCarts.length >= 3"
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
          :cart="cart"
          @click="viewCartDetails(cart.shared_cart_id)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'

// Composants UI
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import SharedCartCard from '@/components/cart/SharedCartCard.vue'

const router = useRouter()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const authStore = useAuthStore()

// États
const loading = ref(true)
const error = ref(null)
const showTooltip = ref(false)

// Computed properties pour les données du store
const sharedCarts = computed(() => cartStore.sharedCarts || [])
const totalAmount = computed(() => cartStore.total || 0)

// Calculer les totaux à partir des paniers
const totalPaid = computed(() => {
  return sharedCarts.value.reduce((sum, cart) => sum + (cart.total_paid_by_contributors || 0), 0)
})

const totalContributors = computed(() => {
  return sharedCarts.value.reduce((sum, cart) => sum + (cart.total_contributors || 0), 0)
})

// Méthodes
const loadSharedCarts = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Appeler la méthode du store
    await cartStore.fetchSharedCarts()
    
    console.log('Paniers partagés chargés:', sharedCarts.value)
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Échec du chargement des paniers'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

const viewCartDetails = (cartId) => {
  if (!cartId) {
    console.error('No cart ID provided')
    return
  }
  console.log('Navigating to cart with ID:', cartId)
  router.push({ 
    name: 'dashboard.shared.carts.details', 
    params: { id: cartId } 
  })
}

const createNewCart = () => {
  if (sharedCarts.value.length >= 3) {
    return // Empêcher la création si limite atteinte
  }
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
</style>