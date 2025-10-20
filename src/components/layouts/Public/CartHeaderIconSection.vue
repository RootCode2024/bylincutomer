<template>
  <div class="relative">
    <!-- Bouton du panier -->
    <button 
      @click="openCart"
      class="relative p-2 text-white hover:text-gray-200 transition-colors focus:outline-none"
      aria-label="Panier"
    >
      <ShoppingBag class="h-4 w-4 md:h-5 md:w-5" />
      <span
        v-if="cartItemCount > 0"
        class="absolute -top-1 -right-1 bg-indigo-800 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ cartItemCount }}
      </span>
    </button>

    <!-- Overlay et Panier Sidebar -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-show="isCartOpen"
        class="fixed inset-0 z-50"
      >
        <!-- Overlay -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="closeCart"
        ></div>
        
        <!-- Panier Sidebar -->
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div class="flex items-center space-x-3">
              <ShoppingBag class="h-6 w-6 text-indigo-800" />
              <h2 class="text-xl font-bold text-gray-900">Votre Panier</h2>
              <span 
                v-if="cartItemCount > 0"
                class="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-full"
              >
                {{ cartItemCount }} article{{ cartItemCount > 1 ? 's' : '' }}
              </span>
            </div>
            
            <!-- Bouton Close -->
            <button 
              @click="closeCart"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-800"
              aria-label="Fermer le panier"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Contenu du panier -->
          <div class="flex flex-col h-[calc(100vh-80px)]">
            <!-- Liste des articles -->
            <div class="flex-1 overflow-y-auto">
              <!-- Empty state -->
              <div 
                v-if="cartItems.length === 0" 
                class="flex flex-col items-center justify-center h-full px-6 text-center"
              >
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag class="h-10 w-10 text-gray-400" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
                <p class="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                <button 
                  @click="goToShop"
                  class="px-6 py-3 bg-indigo-800 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                >
                  Découvrir la boutique
                </button>
              </div>

              <!-- Liste des articles -->
              <div v-else class="p-6 space-y-4">
                <div 
                  v-for="item in cartItems" 
                  :key="item.product_id" 
                  class="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <!-- Image -->
                  <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      v-if="item.image"
                      :src="item.image" 
                      :alt="item.name" 
                      class="w-full h-full object-cover"
                    >
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                    >
                      <Image class="h-6 w-6" />
                    </div>
                  </div>
                  
                  <!-- Détails -->
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                      <button 
                        @click="removeFromCart(item.product_id)"
                        class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p class="text-sm text-gray-600 mt-1">{{ formatPrice(item.price) }}</p>
                    
                    <!-- Contrôles de quantité -->
                    <div class="flex items-center justify-between mt-3">
                      <div class="flex items-center space-x-3">
                        <button 
                          @click="updateQuantity(item.product_id, -1)"
                          :disabled="item.quantity <= 1"
                          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <MinusIcon class="h-3 w-3" />
                        </button>
                        
                        <span class="text-sm font-medium text-gray-900 w-8 text-center">
                          {{ item.quantity }}
                        </span>
                        
                        <button 
                          @click="updateQuantity(item.product_id, 1)"
                          class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <PlusIcon class="h-3 w-3" />
                        </button>
                      </div>
                      
                      <span class="text-sm font-bold text-gray-900">
                        {{ formatPrice(item.price * item.quantity) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer avec total et actions -->
            <div 
              v-if="cartItems.length > 0"
              class="bg-white p-6 space-y-4"
            >
              <!-- Sous-total -->
              <div class="space-y-2">
                <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{{ formatPrice(cartTotal) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <button 
                  @click="goToCheckout"
                  class="w-full bg-indigo-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                >
                  Procéder au paiement
                </button>
                
                <button 
                  @click="goToCart"
                  class="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                >
                  Voir le panier détaillé
                </button>
              </div>

              <!-- Message de livraison gratuite -->
              <div 
                v-if="cartTotal < 5000"
                class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
              >
                <p class="text-sm text-blue-800">
                  Plus que <span class="font-bold">{{ formatPrice(5000 - cartTotal) }}</span> pour la livraison gratuite !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ShoppingBag, 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  X,
  Image
} from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';
import { useCurrencyStore } from '@/stores/currency';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const currencyStore = useCurrencyStore();
const authStore = useAuthStore();

const isCartOpen = ref(false);

const cartItems = computed(() => cartStore.items);
const cartItemCount = computed(() => cartStore.totalQuantity);
const cartTotal = computed(() => cartStore.totalPrice);

const openCart = () => {
  isCartOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeCart = () => {
  isCartOpen.value = false;
  document.body.style.overflow = '';
};

const goToShop = () => {
  closeCart();
  router.push('/shop');
};

const goToCart = () => {
  closeCart();
  router.push('/cart');
};

const goToCheckout = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  } else {
    router.push('/checkout');
  }
  closeCart();
};

const removeFromCart = (itemId) => {
  cartStore.removeItem(itemId);
};

const updateQuantity = (itemId, change) => {
  const item = cartStore.items.find(i => i.product_id === itemId);
  if (item) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      cartStore.updateQuantity(itemId, newQuantity);
    } else {
      removeFromCart(itemId);
    }
  }
};

const formatPrice = (price) => {
  return currencyStore.formatCurrency(price);
};

// Gestion des touches ESC
const handleEscape = (event) => {
  if (event.key === 'Escape' && isCartOpen.value) {
    closeCart();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Animation personnalisée pour le slide */
.slide-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-leave-active {
  transition: transform 0.2s ease-in;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>