<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
    <!-- Modal d'info coupon pour non connectés -->
    <div v-if="showCouponInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-medium text-gray-900">Code promo valide</h3>
          <button @click="showCouponInfoModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <p class="text-gray-600">Code: <span class="font-medium">{{ couponInfo.code }}</span></p>
            <p class="text-gray-600">Type: {{ couponInfo.type === 'percentage' ? 'Pourcentage' : 'Montant fixe' }}</p>
            <p class="text-gray-600">Valeur: {{ couponInfo.type === 'percentage' ? couponInfo.value + '%' : formatPrice(couponInfo.value) }}</p>
            <p v-if="couponInfo.minCartAmount" class="text-gray-600">
              Minimum d'achat: {{ formatPrice(couponInfo.minCartAmount) }}
            </p>
          </div>
          
          <p class="text-sm text-gray-500">{{ couponInfo.description }}</p>
          
          <div class="pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-4">Connectez-vous pour appliquer ce code promo à votre panier.</p>
            
            <button
              @click="redirectToLogin"
              class="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de connexion -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-medium text-gray-900">Connexion</h3>
            <button @click="showLoginModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="auth-content">
            <div class="auth-header text-center mb-6">
              <h1 class="text-2xl font-medium text-gray-900 mb-2">Content de vous revoir</h1>
              <p class="text-gray-600">Connectez-vous pour accéder à votre compte</p>
            </div>
            
            <div class="social-auth mb-6">
              <button class="social-button google w-full" @click="loginWithGoogle">
                <GoogleIcon width="20" height="20" class="mr-2" />
                Continuer avec Google
              </button>
            </div>
            
            <div class="divider mb-6">
              <span class="text-gray-500 text-sm">OU</span>
            </div>
            
            <form @submit.prevent="handleLoginSubmit" class="auth-form">
              <div class="form-group mb-4">
                <label for="modal-email" class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <input
                  type="email"
                  id="modal-email"
                  v-model="loginForm.email"
                  required
                  class="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div class="form-group mb-4 relative">
                <label for="modal-password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="modal-password"
                  v-model="loginForm.password"
                  required
                  class="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" class="absolute right-3 top-9 text-gray-500 hover:text-gray-700" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <input id="remember-me" v-model="loginForm.remember" type="checkbox" class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded">
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
                </div>
                
                <div class="text-sm">
                  <a href="#" class="font-medium text-gray-600 hover:text-gray-500">Mot de passe oublié ?</a>
                </div>
              </div>
              
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" :disabled="loginLoading">
                <span v-if="!loginLoading">Se connecter</span>
                <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </form>
            
            <div class="mt-6 text-center text-sm">
              <p class="text-gray-600">
                Pas encore de compte ?
                <router-link to="/register" class="font-medium text-gray-900 hover:text-gray-700" @click="showRegisterInstead">S'inscrire</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto">
      <div>
        <h1 class="text-3xl font-medium text-gray-900 mb-2">Votre Panier</h1>
        <span class="text-gray-600">{{ cartStore.totalQuantity }} article{{ cartStore.totalQuantity > 1 ? 's' : '' }}</span> dans votre panier.
      </div>

      <!-- Bouton Vider le panier -->
      <div class="p-4 border-t border-gray-200 flex justify-end" v-if="cartItems.length > 0">
        <button @click="clearCart" class="flex items-center text-gray-600 hover:text-red-600 transition-colors">
          <Trash2Icon :size="18" class="mr-2" />
          Vider le panier
        </button>
      </div>
      
      <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <ShoppingCartIcon :size="48" class="mx-auto text-gray-300 mb-4" />
        <h2 class="text-xl font-medium text-gray-700 mb-2">Votre panier est vide</h2>
        <p class="text-gray-500 mb-6">Parcourez nos produits et trouvez ce qui vous plaît !</p>
        <router-link to="/shop" class="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors">
          <span>Commencer vos achats</span>
          <ArrowRightIcon :size="16" class="ml-2" />
        </router-link>
      </div>

      <div v-else class="lg:flex gap-8">
        <!-- Items List -->
        <div class="lg:w-2/3">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="divide-y divide-gray-200">
              <div v-for="item in cartItems" :key="item.product_id" class="p-6 flex flex-col sm:flex-row gap-6">
                <div class="item-image flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover object-center" />
                  <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-center text-xs bg-gray-200 object-cover object-center"
                  >
                    No Image
                  </div>
                </div>
                
                <div class="flex-grow flex flex-col sm:flex-row gap-4">
                  <div class="item-details flex-grow">
                    <h3 class="text-gray-900 tracking-wide text-sm font-medium mb-2">{{ item.name }}</h3>
                    
                    <!-- Prix unitaire -->
                    <div class="text-gray-900 font-medium text-sm mb-3">
                      {{ formatPrice(item.price) }}
                    </div>
                    
                    <!-- Détails couleur et taille -->
                    <div class="flex flex-wrap gap-4 text-xs text-gray-600">
                      <div v-if="item.selectedColor" class="flex items-center">
                        <span class="mr-2">Couleur:</span>
                        <div class="flex items-center">
                          <div 
                            class="w-4 h-4 rounded-full border border-gray-300 shadow-sm mr-1"
                            :style="{ backgroundColor: item.selectedColor.hex_code || '#CCCCCC' }"
                            :title="item.selectedColor.name"
                          ></div>
                          <span>{{ item.selectedColor.name }}</span>
                        </div>
                      </div>
                      
                      <div v-if="item.selectedSize" class="flex items-center">
                        <span class="mr-2">Taille:</span>
                        <span class="font-medium">{{ item.selectedSize.name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Contrôle de quantité -->
                  <div class="item-quantity flex items-center gap-2 self-center">
                    <button @click="decrementQuantity(item.product_id)" :disabled="item.quantity <= 1" 
                            class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 hover:text-gray-800">
                      <MinusIcon :size="14" />
                    </button>
                    <span class="w-8 text-center font-medium text-sm">{{ item.quantity }}</span>
                    <button @click="incrementQuantity(item.product_id)"
                            class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800">
                      <PlusIcon :size="14" />
                    </button>
                  </div>
                  
                  <!-- Prix total pour l'article -->
                  <div class="item-total font-medium text-gray-900 text-sm w-20 text-right self-center">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                  
                  <!-- Bouton de suppression -->
                  <button @click="removeItem(item.product_id)" class="item-remove text-gray-400 hover:text-red-500 transition-colors self-center p-1">
                    <Trash2Icon :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:w-1/3 mt-8 lg:mt-0">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h3 class="text-xl font-medium text-gray-900 mb-6">Récapitulatif</h3>
            
            <div class="space-y-4 mb-6">
              <div class="summary-row flex justify-between">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="text-sm text-gray-500 flex items-end">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span>Frais de livraison non inclus</span>
              </div>

              <!-- Section Code promo améliorée -->
              <div class="summary-row discount pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-700">Code promo</h4>
                  <span v-if="discountApplied" class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Code appliqué
                  </span>
                </div>
                
                <div class="discount-input flex gap-2" v-if="!discountApplied">
                  <input
                    type="text" 
                    v-model="discountCode" 
                    placeholder="Entrez votre code"
                    class="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition"
                  >
                  <button
                    @click="applyDiscount"
                    :disabled="!discountCode || isLoading"
                    class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium max-w-32 min-w-32 rounded-md transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div v-if="isLoading" class="loader"></div>
                      <div>{{ isLoading ? 'Verification ' : 'Appliquer' }}</div>
                    </div>
                  </button>
                </div>
                
                <transition name="fade-slide" mode="out-in">
                  <div v-if="discountApplied" key="success" class="mt-2 flex justify-between items-center rounded-md border border-gray-200 bg-gray-100 px-4 py-2 shadow-sm transition-all duration-500">
                    <span class="text-sm text-gray-700">Réduction appliquée</span>
                    <span class="text-gray-900 font-semibold">-{{ formatPrice(discountAmount) }}</span>
                  </div>
                </transition>

                <transition name="fade-slide" mode="out-in">
                  <div v-if="discountError !== ''" key="error" class="mt-2 flex justify-between items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 shadow-sm transition-all duration-500">
                    <span class="text-sm text-gray-700">Erreur :</span>
                    <span class="text-gray-900 font-semibold">{{ discountError }}</span>
                  </div>
                </transition>
              </div>
            </div>
            
            <!-- Total avec mise en valeur -->
            <div class="summary-total border-t border-gray-200 pt-4 mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-lg font-medium">Total</span>
                <span class="total-price text-xl font-bold text-gray-900">
                  {{ formatPrice(total) }}
                </span>
              </div>
            </div>
            
            <!-- Boutons d'action -->
            <div class="space-y-3 mb-6" v-if="authStore.isAuthenticated">
              <CheckoutButton />
              <button 
                :disabled="authStore.sharedCartCount > 2"
                class="disabled:cursor-not-allowed share-cart-btn w-full flex items-center justify-center px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-50 font-medium rounded-md transition-colors"
                @click="shareCart"
              >
                <Share2Icon :size="18" class="mr-2" />
                Partager le panier
              </button>
            </div>
            <div class="space-y-3 mb-6" v-else>
              <div class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <h4 class="font-medium text-gray-800 mb-1">Connexion requise</h4>
                    <p class="text-sm text-gray-600">
                      Connectez-vous pour finaliser votre commande et bénéficier de :
                    </p>
                    <ul class="list-disc list-inside text-xs text-gray-600 mt-1 space-y-1">
                      <li>Suivi de votre commande en temps réel</li>
                      <li>Historique de vos achats</li>
                      <li>Service client prioritaire</li>
                      <li>Accès à vos avantages fidélité</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                @click="showLoginModal = true"
                class="w-full flex items-center justify-center px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors shadow-sm"
              >
                <LogInIcon :size="18" class="mr-2" />
                Se connecter pour payer
              </button>

              <div class="text-center text-sm text-gray-500 mt-2">
                Pas encore de compte ? 
                <router-link to="/register" class="text-gray-900 hover:text-gray-700 font-medium" @click.prevent="showRegisterInstead">
                  Créer un compte
                </router-link>
              </div>
            </div>
            
            <!-- Méthodes de paiement -->
            <div class="payment-methods mb-6">
              <p class="text-xs text-gray-500 mb-2 uppercase tracking-wider">Méthodes de paiement acceptées :</p>
              <div class="flex gap-4 items-center justify-center p-2 border border-gray-200 bg-gray-100 rounded-md">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" alt="Mastercard" class="h-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" class="h-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" class="h-8">
              </div>
            </div>
            
            <router-link to="/shop" class="continue-shopping flex items-center justify-center text-gray-900 hover:text-gray-700 font-medium transition-colors">
              <ArrowLeftIcon :size="16" class="mr-2" />
              <span>Continuer vos achats</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Nos services -->
      <section class="w-full bg-white py-10 px-6 mt-16 border-t border-gray-200">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Paiement sécurisé -->
            <div class="flex items-start space-x-4">
              <Shield class="text-gray-900 w-6 h-6 mt-1" />
              <div>
                <h4 class="font-medium text-gray-900">Paiement sécurisé</h4>
                <p class="text-sm text-gray-600">Vos données sont protégées par chiffrement SSL</p>
              </div>
            </div>

            <!-- Livraison express -->
            <div class="flex items-start space-x-4">
              <Truck class="text-gray-900 w-6 h-6 mt-1" />
              <div>
                <h4 class="font-medium text-gray-900">Livraison express</h4>
                <p class="text-sm text-gray-600">Expédition sous 24h pour les commandes avant 16h</p>
              </div>
            </div>

            <!-- Support client -->
            <div class="flex items-start space-x-4">
              <HeadphonesIcon class="text-gray-900 w-6 h-6 mt-1" />
              <div>
                <h4 class="font-medium text-gray-900">Support client 7j/7</h4>
                <p class="text-sm text-gray-600">Assistance par chat, email ou téléphone</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ShoppingCartIcon,
  Shield, 
  Truck, 
  HeadphonesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  Share2Icon,
  LogInIcon
} from 'lucide-vue-next';
import { useCurrencyStore } from '@/stores/currency';
import { useCartStore } from '@/stores/cart';
import axios from 'axios'
import { useApiStore } from '@/stores/api';
import { useAuthStore } from '@/stores/auth';
import CheckoutButton from '@/components/CheckoutButton.vue';
import GoogleIcon from '@/components/icons/GoogleIcon.vue';

// Variables d'état
const showLoginModal = ref(false);
const showCouponInfoModal = ref(false);
const showPassword = ref(false);
const loginLoading = ref(false);
const isLoading = ref(false);
const discountCode = ref('');
const discountApplied = ref(false);
const discountAmount = ref(0);
const discountError = ref('');

const couponInfo = ref({
  code: '',
  type: '',
  value: 0,
  minCartAmount: null,
  description: ''
});

const loginForm = ref({
  email: '',
  password: '',
  remember: false
});

// Stores
const currencyStore = useCurrencyStore();
const cartStore = useCartStore();
const apiStore = useApiStore();
const authStore = useAuthStore();

const router = useRouter();

// Données du panier
const cartItems = ref([]);

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const deliveryCost = computed(() => {
  return subtotal.value > 100 ? 0 : 4.99;
});

const total = computed(() => {
  return Math.max(0, subtotal.value + deliveryCost.value - discountAmount.value);
});

// Méthodes
const formatPrice = (price) => {
  console.log('Formatting price:', price);
  return currencyStore.formatCurrency(price);
};

const incrementQuantity = (id) => {
  const item = cartItems.value.find(item => item.product_id === id);
  if (item) {
    item.quantity++;
    // Mettre à jour le store
    cartStore.updateQuantity(id, item.quantity);
  }
};

const decrementQuantity = (id) => {
  const item = cartItems.value.find(item => item.product_id === id);
  if (item && item.quantity > 1) {
    item.quantity--;
    // Mettre à jour le store
    cartStore.updateQuantity(id, item.quantity);
  }
};

const removeItem = (id) => {
  cartStore.removeItem(id);
  cartItems.value = cartItems.value.filter(item => item.product_id !== id);
};

const clearCart = () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    cartItems.value = [];
    cartStore.clearCart();
  }
};

const shareCart = () => {
  if (authStore.sharedCartCount > 2) {
    alert('Vous avez atteint la limite de partage de panier (3 maximum)');
    return;
  }
  localStorage.removeItem('sharedCartStep');
  cartStore.couponValue = discountAmount.value;
  router.push('/shared-cart');
};

const applyDiscount = async () => {
  if (!discountCode.value.trim()) {
    discountError.value = 'Veuillez entrer un code promo';
    setTimeout(() => { discountError.value = ''; }, 3000);
    return;
  }

  isLoading.value = true;
  discountError.value = '';

  try {
    const response = await axios.post(`${apiStore.apiUrl}/cart/coupon`, {
      code: discountCode.value.trim().toUpperCase()
    });

    if (response.data?.success) {
      if (authStore.isAuthenticated) {

        console.log('Coupon applied successfully:', response);
        const resultats = response.data.data;
        discountAmount.value = resultats.discount;
        discountApplied.value = true;
        cartStore.couponValue = discountAmount.value;
      } else {
        couponInfo.value = {
          code: discountCode.value.trim().toUpperCase(),
          type: response.data.data.type,
          value: response.data.data.value,
          minCartAmount: response.data.data.min_cart_amount,
          description: response.data.data.description || ''
        };
        showCouponInfoModal.value = true;
      }
    } else {
      throw new Error(response.data?.message || 'Erreur lors de l\'application du code');
    }
  } catch (error) {
    discountApplied.value = false;
    discountAmount.value = 0;
    discountError.value = error.response?.data?.message || error.message || 'Erreur inconnue';
    setTimeout(() => { discountError.value = ''; }, 5000);
  } finally {
    isLoading.value = false;
  }
};

const redirectToLogin = () => {
  showCouponInfoModal.value = false;
  showLoginModal.value = true;
};

const handleLoginSubmit = async () => {
  loginLoading.value = true;
  try {
    await authStore.login(loginForm.value);
    showLoginModal.value = false;
    // Recharger les données utilisateur
    window.location.reload();
  } catch (error) {
    alert(error.message);
  } finally {
    loginLoading.value = false;
  }
};

const loginWithGoogle = () => {
  window.location.href = `${apiStore.apiUrl}/auth/google/redirect`;
};

const showRegisterInstead = () => {
  showLoginModal.value = false;
  router.push('/register');
};

// Lifecycle hooks
onMounted(() => {
  cartItems.value = [...cartStore.items];
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.loader {
  width: 40px;
  padding: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #ffffff;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {to{transform: rotate(1turn)}}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.font-inter {
  font-family: 'Inter', sans-serif;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  background: white;
}

.social-button.google {
  color: #3c4043;
  border-color: #dadce0;
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.divider {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.divider::before, .divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider::before {
  margin-right: 1rem;
}

.divider::after {
  margin-left: 1rem;
}

/* Améliorations design */
.item-image {
  transition: transform 0.3s ease;
}
.item-image:hover {
  transform: scale(1.05);
}

.item-quantity button {
  transition: all 0.2s ease;
}
.item-quantity button:hover {
  background-color: #f3f4f6;
}

.summary-total {
  border-top: 2px solid #e5e7eb;
}

.total-price {
  color: #111827;
  font-size: 1.25rem;
}

.payment-methods img {
  filter: grayscale(30%);
  opacity: 0.8;
  transition: all 0.3s ease;
}
.payment-methods img:hover {
  filter: grayscale(0%);
  opacity: 1;
}
</style>