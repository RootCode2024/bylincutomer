<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p class="mt-4 text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    </transition>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            Erreur lors du chargement : {{ error }}
            <button @click="loadCartDetails" class="ml-2 text-red-700 underline">Réessayer</button>
          </p>
        </div>
      </div>
    </div>

    <!-- Cart Content -->
    <div v-if="cart" class="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      <!-- Cart Header -->
      <div class="px-6 py-5">
        <div class="flex items-center justify-between">
          <button @click="router.go(-1)" class="text-blue-600 hover:text-blue-800 flex items-center">
            <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Retour
          </button>
          <div class="text-right text-sm text-gray-500">
            Dernière mise à jour : {{ formatDate(cart.created_at) }}
          </div>
        </div>
        <h1 class="mt-4 text-2xl font-medium text-gray-900">{{ cart.name }}</h1>
        <p class="mt-1 text-sm text-gray-500">Créé par : {{ authStore.userName }}</p>
      </div>

      <!-- Cart Actions -->
      <div class="px-6 py-4 bg-gray-50 flex flex-wrap gap-3">
        <button
          @click="editCart"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Modifier
        </button>
        <button
          @click="shareCart"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Partager
        </button>
        <button
          @click="deleteCart"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none ml-auto"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Supprimer
        </button>
      </div>

      <!-- Items Section -->
      <div class="px-6 py-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Articles ({{ cart.items.length }})</h2>
          <button
            @click="addItems"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Ajouter
          </button>
        </div>

        <div v-if="cart.items.length === 0" class="mt-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Panier vide</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par ajouter des articles à votre panier partagé.</p>
        </div>

        <ul v-else class="mt-6 divide-y divide-gray-200">
          <li v-for="item in cart.items" :key="item.id" class="py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                <img :src="item.imageUrl || '/placeholder-item.png'" :alt="item.name" class="h-full w-full object-cover">
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="ml-4 text-sm font-medium text-gray-900">{{ formatCurrency(item.price) }}</p>
                </div>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ item.description }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-sm text-gray-500">Quantité: {{ item.quantity }}</span>
                  <div class="flex space-x-2">
                    <button
                      @click.stop="editItem(item)"
                      class="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      @click.stop="removeItem(item.id)"
                      class="text-sm text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Collaborators Section -->
      <div class="px-6 py-5 bg-gray-50">
        <h2 class="text-lg font-medium text-gray-900">Collaborateurs ({{ cart.contributors.length }})</h2>

        <div v-if="cart.contributors.length === 0" class="mt-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun collaborateur</h3>
          <p class="mt-1 text-sm text-gray-500">Partagez ce panier pour inviter des collaborateurs.</p>
          <div class="mt-6">
            <button
              @click="shareCart"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Inviter des collaborateurs
            </button>
          </div>
        </div>

        <ul v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <li v-for="contributor in cart.contributors" :key="contributor.id" class="bg-white shadow overflow-hidden rounded-md px-4 py-4 flex items-center">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {{ contributor.name.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ contributor.name }}</p>
              <p class="text-sm text-gray-500">{{ contributor.email }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatUtils';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const cart = ref(null);
const loading = ref(true);
const error = ref(null);

const isOwner = computed(() => {
  return cart.value && cart.value.ownerId === authStore.user.id;
});

const loadCartDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!route.params.id || isNaN(route.params.id)) {
      throw new Error('ID de panier invalide');
    }

    const response = await cartStore.fetchSharedCart(route.params.id);
    cart.value = response.data.data;
  } catch (err) {
    error.value = err.message || 'Échec du chargement du panier';
    console.error('Erreur lors du chargement du panier :', err);
    
    if (err.response?.status === 404) {
      router.push({ name: 'NotFound' });
    }
  } finally {
    loading.value = false;
  }
};

const editCart = () => {
  router.push({ 
    name: 'EditSharedCart', 
    params: { id: route.params.id } 
  });
};

const shareCart = () => {
  console.log('Partage du panier', route.params.id);
};

const deleteCart = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce panier partagé ? Cette action est irréversible.')) {
    try {
      await cartStore.deleteSharedCart(route.params.id);
      router.push({ name: 'SharedCarts' });
    } catch (err) {
      alert('Échec de la suppression : ' + err.message);
    }
  }
};

const addItems = () => {
  router.push({ 
    name: 'AddCartItems', 
    params: { id: route.params.id } 
  });
};

const editItem = (item) => {
  router.push({ 
    name: 'EditCartItem', 
    params: { 
      cartId: route.params.id,
      itemId: item.id 
    } 
  });
};

const removeItem = async (itemId) => {
  if (confirm('Supprimer cet article du panier ?')) {
    try {
      await cartStore.removeCartItem(route.params.id, itemId);
      cart.value.items = cart.value.items.filter(item => item.id !== itemId);
    } catch (err) {
      alert('Échec de la suppression : ' + err.message);
    }
  }
};

onMounted(() => {
  loadCartDetails();
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadCartDetails();
    }
  }
);
</script>