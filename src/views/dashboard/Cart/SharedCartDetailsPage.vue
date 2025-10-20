<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
    <!-- Loading Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="loading" class="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="text-center">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p class="mt-4 text-lg font-medium text-gray-700">Chargement du panier...</p>
          <p class="mt-2 text-sm text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    </transition>

    <!-- Error State -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
    >
      <div v-if="error" class="max-w-4xl mx-auto px-4 mb-6">
        <div class="bg-red-50/80 backdrop-blur border border-red-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-medium text-red-800">Erreur de chargement</h3>
              <p class="mt-1 text-red-700">{{ error }}</p>
              <div class="mt-4">
                <button 
                  @click="loadCartDetails" 
                  class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Cart Content -->
    <div v-if="cart" class="max-w-6xl mx-auto px-4">
      <!-- Header avec navigation -->
      <div class="mb-8">
        <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <router-link 
            to="/dashboard/shared-carts" 
            class="hover:text-blue-600 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Mes paniers partagés
          </router-link>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-medium truncate max-w-xs">{{ cart.title }}</span>
        </nav>

        <!-- Cart Header Card -->
        <div class="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div class="p-8">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ cart.title }}</h1>
                    <p class="text-gray-600 text-lg leading-relaxed">{{ cart.description || 'Aucune description' }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Créé le {{ formatDate(cart.created_at) }}
                    </span>
                  </div>
                    <!-- Calcul du temps restant avant clôture du panier -->
                    <div v-if="cart.expires_at" class="ml-4 flex items-center space-x-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ remainingTime }}
                    </span>
                    </div>
                </div>

                <!-- Share Link Section -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-gray-900 mb-2">Lien de partage</h3>
                      <p class="text-sm text-gray-600 mb-3">Partagez ce lien pour inviter des collaborateurs</p>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-2xl font-bold text-indigo-600">
                        {{ currencyStore.formatCurrency(cart.total_amount) }}
                      </span>
                    </div>
                  </div>
                  <div class="relative">
                    <input 
                      :value="shareLink"
                      readonly
                      class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white/50 backdrop-blur truncate pr-32 font-mono"
                    >
                    <button 
                      @click="copyLink"
                      class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                      :class="{'bg-green-600 hover:bg-green-700': copied}"
                    >
                      <CopyIcon :size="16" class="mr-2" v-if="!copied" />
                      <CheckIcon :size="16" class="mr-2" v-else />
                      {{ copied ? 'Copié !' : 'Copier le lien' }}
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ cart.cart.items.length }}</div>
                    <div class="text-sm text-gray-600">Articles</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ cart.contributors || 0 }}</div>
                    <div class="text-sm text-gray-600">Collaborateurs</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">
                      {{ currencyStore.formatCurrency(cart.total_paid_by_contributors || 0) }}
                    </div>
                    <div class="text-sm text-gray-600">Montant collecté</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-8 py-4 bg-gray-50/50 border-t border-gray-200/50">
            <div class="flex flex-wrap gap-3">
              <button
                @click="shareCart"
                class="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Partager
              </button>
              <button
                @click="showDeleteModal = true; cartToDelete = cart"
                class="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md ml-auto"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items Section -->
        <div class="lg:col-span-2">
          <div class="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Articles du panier ({{ cart.cart.items.length }})
              </h2>
            </div>

            <div v-if="cart.cart.items.length === 0" class="p-12 text-center">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Panier vide</h3>
              <p class="text-gray-600 mb-6">Commencez par ajouter des articles à votre panier partagé.</p>
              <button
                @click="addItems"
                class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Ajouter des articles
              </button>
            </div>

            <div v-else class="divide-y divide-gray-200/50">
              <div v-for="item in cart.cart.items" :key="item.id" class="p-6 hover:bg-gray-50/50 transition-colors">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                    <img 
                      :src="item.product.main_image_url || 'https://placehold.co/80?text=bylin'" 
                      :alt="item.product.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    >
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">{{ item.product.name }}</h3>
                        <p class="text-gray-600 text-sm line-clamp-2">{{ item.product.short_description }}</p>
                      </div>
                      <div class="text-right ml-4">
                        <p class="text-lg font-semibold text-gray-900">
                          {{ currencyStore.formatCurrency(item.product.price * item.quantity) }}
                        </p>
                        <p class="text-sm text-gray-500">{{ currencyStore.formatCurrency(item.product.price) }} × {{ item.quantity }}</p>
                      </div>
                    </div>
                    <div class="mt-3 flex items-center justify-between">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Quantité: {{ item.quantity }}
                      </span>
                      <div class="flex items-center space-x-2">
                        <button class="text-gray-400 hover:text-blue-600 transition-colors p-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button class="text-gray-400 hover:text-red-600 transition-colors p-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Collaborators Section -->
          <div class="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Collaborateurs
              </h2>
            </div>

            <div v-if="!cart.contributors || cart.contributors === 0" class="p-8 text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun collaborateur</h3>
              <p class="text-gray-600 mb-4">Partagez ce panier pour inviter des collaborateurs.</p>
              <button
                @click="shareCart"
                class="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                Inviter des collaborateurs
              </button>
            </div>

            <div v-else class="p-6">
              <div class="space-y-4">
                <!-- Exemple de collaborateur (à remplacer par vos données réelles) -->
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {{ authStore.user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user.name }}</p>
                    <p class="text-xs text-gray-500">Propriétaire</p>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Progression</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Montant collecté</span>
                  <span>{{ Math.round((cart.total_paid_by_contributors || 0) / cart.total_amount * 100) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${Math.min(100, Math.round((cart.total_paid_by_contributors || 0) / cart.total_amount * 100))}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{{ currencyStore.formatCurrency(cart.total_paid_by_contributors || 0) }}</span>
                  <span>{{ currencyStore.formatCurrency(cart.total_amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal 
      v-if="showDeleteModal" 
      @cancel="showDeleteModal = false" 
      @confirm="deleteCart"
      :isLoading="isDeleting"
      :title="`Confirmer la suppression de ${cartToDelete?.title || 'le panier'}`"
      :message="`Voulez-vous vraiment supprimer ce panier partagé ? Cette action est irréversible.`"/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/utils/dateUtils';
import { CopyIcon, CheckIcon } from 'lucide-vue-next';
import { useCurrencyStore } from '@/stores/currency';

import ConfirmModal from '@/components/ui/ConfirmModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const currencyStore = useCurrencyStore();

const cart = ref(null);
const loading = ref(true);
const error = ref(null);
const copied = ref(false);
const showDeleteModal = ref(false);
const cartToDelete = ref(null);

const shareLink = computed(() => {
  return cart.value ? `http://localhost:5173/shared-cart/${cart.value.token}` : '';
});

const remainingTime = computed(() => {
  if (!cart.value || !cart.value.expires_at) return 'Pas de date de clôture';
  
  const now = new Date();
  const expiresAt = new Date(cart.value.expires_at);
  const diffMs = expiresAt - now;

  if (diffMs <= 0) return 'Clôturé';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let parts = [];
  if (diffDays > 0) parts.push(`${diffDays} jour${diffDays > 1 ? 's' : ''}`);
  if (diffHours > 0) parts.push(`${diffHours} heure${diffHours > 1 ? 's' : ''}`);
  if (diffMinutes > 0) parts.push(`${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`);

  return parts.join(', ') + ' restantes';
});

// Méthodes
const loadCartDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!route.params.id || isNaN(route.params.id)) {
      throw new Error('ID de panier invalide');
    }

    const response = await cartStore.fetchSharedCart(route.params.id);
    cart.value = response.data;
  } catch (err) {
    error.value = err.message || 'Échec du chargement du panier';
    console.error('Erreur lors du chargement du panier :', err);
    
    if (err.response?.status === 404) {
      router.push({ name: 'not-found' });
    }
  } finally {
    loading.value = false;
  }
};

const copyLink = () => {
  if (!shareLink.value) return;
  
  try {
    navigator.clipboard.writeText(shareLink.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
    // Fallback pour les anciens navigateurs
    const textArea = document.createElement('textarea');
    textArea.value = shareLink.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
};

const shareCart = () => {
  if (navigator.share) {
    navigator.share({
      title: cart.value.title,
      text: `Rejoignez-moi sur ce panier partagé : ${cart.value.description}`,
      url: shareLink.value,
    });
  } else {
    copyLink();
  }
};


const addItems = () => {
  console.log('Ajout d\'articles au panier');
};

const isDeleting = ref(false);

const deleteCart = async () => {
    try {
      isDeleting.value = true;
      await cartStore.deleteSharedCart(route.params.id);
      
      isDeleting.value = false;
      showDeleteModal.value = false;
      cartToDelete.value = null;

      router.push({ name: 'dashboard.shared.carts' });
    } catch (err) {
      alert('Échec de la suppression : ' + err.message);
    } finally {
      isDeleting.value = false;
      showDeleteModal.value = false;
      cartToDelete.value = null;
    }
};

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/80?text=bylin';
};

// Cycle de vie
onMounted(() => {
  loadCartDetails();
});

watch(
  // remainingTime
  remainingTime,

  () => route.params.id,
  (newId) => {
    if (newId) {
      loadCartDetails();
    }
  }
);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation personnalisée pour le bouton copier */
button {
  transition: all 0.2s ease-in-out;
}

/* Effet de hover sur les cartes */
.bg-white:hover {
  backdrop-filter: blur(12px);
}
</style>