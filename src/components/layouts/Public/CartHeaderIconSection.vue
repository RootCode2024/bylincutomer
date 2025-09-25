<template>
  <div class="relative group" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <!-- Bouton du panier -->
    <button 
      @click="redirectToCart"
      class="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
      aria-label="Panier"
    >
      <ShoppingCartIcon class="h-4 w-4 md:h-5 md:w-5" />
      <span
        v-if="cartItemCount > 0"
        class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ cartItemCount }}
      </span>
    </button>

    <!-- Dropdown menu (apparaît au hover) -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-show="isHovering"
        class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
      >
        <div class="py-1">
          <!-- Header -->
          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-800">Votre panier</h3>
          </div>
          
          <!-- Empty state -->
          <div v-if="cartItems.length === 0" class="px-6 py-8 text-center">
            <ShoppingCartIcon class="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p class="text-sm text-gray-500">Votre panier est vide</p>
            <RouterLink 
              to="/shop"
              class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Commencer vos achats
            </RouterLink>
          </div>
          
          <!-- Items list -->
          <div v-else class="max-h-[400px] overflow-y-auto">
            <div 
              v-for="item in cartItems" 
              :key="item.product_id" 
              class="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 flex items-start"
            >
              <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                <img 
                  v-if="item.image"
                  :src="item.image" 
                  :alt="item.name" 
                  class="h-full w-full object-cover object-center"
                >
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-center text-xs bg-gray-200 object-cover object-center"
                >
                  No Image
                </div>
              </div>
              
              <div class="ml-4 flex-1">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-800">{{ item.name }}</span>
                  <span class="text-sm text-gray-800 font-medium">{{ formatPrice(item.price) }}</span>
                </div>
                
                <div class="flex justify-between mt-2">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click.stop="updateQuantity(item.product_id, -1)"
                      :disabled="item.quantity <= 1"
                      class="text-gray-500 hover:text-indigo-600 disabled:opacity-50"
                    >
                      <MinusIcon class="h-4 w-4" />
                    </button>
                    <span class="text-sm text-gray-600">{{ item.quantity }}</span>
                    <button 
                      @click.stop="updateQuantity(item.product_id, 1)"
                      class="text-gray-500 hover:text-indigo-600"
                    >
                      <PlusIcon class="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    @click.stop="removeFromCart(item.product_id)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="cartItems.length > 0" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex justify-between mb-3">
              <span class="text-base font-medium text-gray-800">Sous-total:</span>
              <span class="text-base font-bold text-gray-900">{{ formatPrice(cartTotal) }}</span>
            </div>
            
            <div class="flex space-x-3">
              <RouterLink 
                v-if="route.path !== '/cart'"
                to="/cart" 
                class="flex-1 text-center px-4 py-3 bg-white text-indigo-600 text-sm font-medium rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
                @click="isHovering = false"
              >
                Voir le panier
              </RouterLink>
              
              <RouterLink 
                v-if="authStore.isAuthenticated"
                to="/checkout" 
                class="flex-1 text-center px-4 py-3 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                @click="isHovering = false"
              >
                Commander
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ShoppingCartIcon, 
  TrashIcon,
  PlusIcon,
  MinusIcon
} from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';
import { useCurrencyStore } from '@/stores/currency';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const currencyStore = useCurrencyStore();
const authStore = useAuthStore();

const isHovering = ref(false);

const cartItems = computed(() => cartStore.items);
const cartItemCount = computed(() => cartStore.totalQuantity);
const cartTotal = computed(() => cartStore.totalPrice);

const redirectToCart = () => {
  router.push('/cart');
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
    }
  }
};

const formatPrice = (price) => {
  return currencyStore.formatCurrency(price);
};
</script>