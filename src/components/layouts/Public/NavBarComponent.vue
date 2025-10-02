<template>
  <header :class="headerClass" role="banner">
    <!-- Top Banner avec annonce promotionnelle -->
    <transition name="slide-down">
      <div 
        v-if="showBanner && !isBannerDismissed"
        class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm py-2 text-center px-4 relative"
        role="alert"
      >
        <div class="container mx-auto flex justify-center items-center">
          <div class="flex items-center space-x-2">
            <span class="animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gift-icon lucide-gift"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
            </span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck-icon lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </span>
            <span class="truncate max-w-[90%]">
              Livraison express OFFERTE dès {{ currencyStore.formatCurrency(deliverableAmount) }} | 
             Retours gratuits sous 30 jours
            </span>
          </div>
          <button 
            @click="dismissBanner"
            class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-indigo-200 transition-colors p-1"
            aria-label="Fermer la bannière"
          >
            <X class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Main Navigation -->
    <nav 
      :class="['sticky top-0 transition-all duration-300 ease-in-out z-50', navBackgroundClass]"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16 md:h-20">

          <!-- Mobile Menu Button - visible only on mobile -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="lg:hidden p-2 text-gray-600 hover:text-indigo-800 transition-colors"
            aria-label="Menu mobile"
            aria-expanded="mobileMenuOpen"
          >
            <Menu class="h-6 w-6" v-if="!mobileMenuOpen" />
            <X class="h-6 w-6" v-else />
          </button>

          <!-- Logo Mobile -->
          <RouterLink 
            to="/" 
            class="lg:hidden flex items-center mx-auto"
            aria-label="Accueil"
          >
            <img src="@/assets/images/logo-black.png" alt="Logo" class="h-10 w-10" />
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8 xl:space-x-10">
            <!-- Logo Desktop -->
            <RouterLink 
              to="/" 
              class="flex items-center space-x-2 group mr-4"
              aria-label="Accueil"
            >
              <img src="@/assets/images/logo-black.png" alt="Logo" class="w-12 h-12 transition-transform duration-300 group-hover:scale-105" />
            </RouterLink>

            <!-- Main navigation links -->
            <template v-for="link in mainLinks" :key="link.to">
              <div 
                v-if="link.hasDropdown" 
                class="relative group"
                @mouseenter="openSubmenu(link.text)"
                @mouseleave="closeSubmenuWithDelay"
              >
                <button
                  class="flex items-center space-x-1 text-gray-700 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50 group/nav-item"
                  :class="{
                    'text-indigo-800 font-semibold bg-indigo-50': isActiveLink(link.to)
                  }"
                >
                  <span>{{ link.text }}</span>
                  <ChevronDown class="h-4 w-4 transition-transform duration-200 group-hover/nav-item:rotate-180" />
                </button>
                
                <!-- Mega Menu Dropdown -->
                <transition name="mega-menu">
                  <div 
                    v-show="activeSubmenu === link.text && apiCategories.length > 0"
                    class="absolute left-0 top-full mt-1 w-screen max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    @mouseenter="keepSubmenuOpen"
                    @mouseleave="closeSubmenuWithDelay"
                  >

                    <div class="border-b border-gray-100 bg-gray-50 p-4">
                      <RouterLink
                        to="/shop"
                        class="inline-flex items-center text-sm font-semibold text-indigo-800 hover:text-indigo-900 transition-colors group/view-all"
                        @click.native="closeAllMenus"
                      >
                        <span>Voir tout dans la boutique</span>
                        <ArrowRight class="h-4 w-4 ml-1 transition-transform group-hover/view-all:translate-x-1" />
                      </RouterLink>
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-6">
                      <div 
                        v-for="category in apiCategories" 
                        :key="category.id"
                        class="space-y-3"
                      >
                        <RouterLink
                          :to="`/shop/category/${category.slug}`"
                          class="font-semibold text-gray-900 hover:text-indigo-800 text-sm flex items-center group/category"
                          @click.native="closeAllMenus"
                        >
                          <span class="flex-1">{{ category.name }}</span>
                          <ArrowRight class="h-4 w-4 opacity-0 group-hover/category:opacity-100 transition-opacity" />
                        </RouterLink>
                        
                        <div class="space-y-2" v-if="category.children && category.children.length > 0">
                          <RouterLink
                            v-for="subCategory in category.children"
                            :key="subCategory.id"
                            :to="`/shop/category/${subCategory.slug}`"
                            class="block text-sm text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors"
                            @click.native="closeAllMenus"
                          >
                            {{ subCategory.name }}
                          </RouterLink>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Featured Products Section -->
                    <div class="border-t border-gray-100 bg-gray-50 p-6" v-if="featuredProducts.length > 0">
                      <h3 class="font-semibold text-gray-900 text-sm mb-4">Produits populaires</h3>
                      <div class="grid grid-cols-3 gap-4">
                        <RouterLink
                          v-for="featured in featuredProducts"
                          :key="featured.id"
                          :to="featured.to"
                          class="group/featured text-center"
                          @click.native="closeAllMenus"
                        >
                          <div class="bg-white rounded-lg p-3 shadow-sm group-hover/featured:shadow-md transition-shadow">
                            <div class="w-12 h-12 mx-auto mb-2 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span class="text-lg">{{ featured.emoji }}</span>
                            </div>
                            <p class="text-xs font-medium text-gray-900 truncate">{{ featured.name }}</p>
                            <p class="text-xs text-indigo-600 font-semibold">{{ currencyStore.formatCurrency(featured.price) }}</p>
                          </div>
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              
              <RouterLink
                v-else
                :to="link.to"
                class="text-gray-700 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50 relative group/nav-simple"
                :class="{
                  'text-indigo-800 font-semibold bg-indigo-50': isActiveLink(link.to)
                }"
              >
                {{ link.text }}
                <span 
                  v-if="link.badge"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full px-1"
                >
                  Nouveau
                </span>
              </RouterLink>
            </template>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center space-x-4 sm:space-x-5 md:space-x-6">
            <!-- Enhanced Search like Shein -->
            <div class="hidden md:block relative">
              <button
                @click="toggleSearch"
                class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                aria-label="Rechercher"
                aria-expanded="searchOpen"
              >
                <Search class="h-4 w-4" />
                <span class="text-sm text-gray-500">Rechercher...</span>
              </button>

              <!-- Search Overlay like Shein -->
              <transition name="search-overlay">
                <div 
                  v-if="searchOpen"
                  class="fixed inset-0 bg-black bg-opacity-50 z-50"
                  @click="closeSearch"
                >
                  <div 
                    class="bg-white mx-auto max-w-4xl mt-20 rounded-xl shadow-2xl overflow-hidden"
                    @click.stop
                  >
                    <!-- Search Header -->
                    <div class="border-b border-gray-100 p-4">
                      <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          v-model="searchQuery"
                          @input="handleSearchInput"
                          @keydown.enter="submitSearch"
                          @keydown.esc="closeSearch"
                          type="text"
                          placeholder="Rechercher des produits, marques, catégories..."
                          class="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none"
                          autofocus
                          aria-label="Champ de recherche"
                          ref="searchInput"
                        />
                        <button
                          @click="closeSearch"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X class="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <!-- Search Content -->
                    <div class="max-h-96 overflow-y-auto">
                      <!-- Trending Searches -->
                      <div v-if="!searchQuery && trendingSearches.length > 0" class="p-6">
                        <h3 class="font-semibold text-gray-900 text-lg mb-4">Recherches tendances</h3>
                        <div class="flex flex-wrap gap-3">
                          <button
                            v-for="trend in trendingSearches"
                            :key="trend.id"
                            @click="applyTrendingSearch(trend.query)"
                            class="flex items-center space-x-2 px-4 py-3 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-800 rounded-lg transition-colors group"
                          >
                            <TrendingUp class="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                            <span class="font-medium">{{ trend.query }}</span>
                            <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                              +{{ trend.count }}
                            </span>
                          </button>
                        </div>
                      </div>

                      <!-- Search Suggestions -->
                      <div v-if="searchQuery && searchSuggestions.length > 0" class="p-6 border-b border-gray-100">
                        <h3 class="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">Suggestions</h3>
                        <div class="space-y-2">
                          <button
                            v-for="suggestion in searchSuggestions"
                            :key="suggestion"
                            @click="applySuggestion(suggestion)"
                            class="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-md transition-colors group"
                          >
                            <Search class="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                            <span>{{ suggestion }}</span>
                          </button>
                        </div>
                      </div>

                      <!-- Recent Searches -->
                      <div v-if="!searchQuery && recentSearches.length > 0" class="p-6">
                        <div class="flex justify-between items-center mb-4">
                          <h3 class="font-semibold text-gray-900 text-lg">Recherches récentes</h3>
                          <button
                            @click="clearRecentSearches"
                            class="text-sm text-gray-500 hover:text-red-600 transition-colors"
                          >
                            Tout effacer
                          </button>
                        </div>
                        <div class="space-y-2">
                          <button
                            v-for="(recent, index) in recentSearches"
                            :key="index"
                            @click="applyRecentSearch(recent)"
                            class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-md transition-colors group"
                          >
                            <div class="flex items-center space-x-3">
                              <Clock class="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                              <span>{{ recent }}</span>
                            </div>
                            <button
                              @click.stop="removeRecentSearch(index)"
                              class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
                            >
                              <X class="h-4 w-4" />
                            </button>
                          </button>
                        </div>
                      </div>

                      <!-- Quick Categories -->
                      <div v-if="!searchQuery" class="p-6 border-t border-gray-100">
                        <h3 class="font-semibold text-gray-900 text-lg mb-4">Parcourir par catégorie</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <RouterLink
                            v-for="category in quickCategories"
                            :key="category.slug"
                            :to="`/shop/category/${category.slug}`"
                            @click.native="closeSearch"
                            class="flex flex-col items-center p-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition-colors group"
                          >
                            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors">
                              <span class="text-lg">{{ category.emoji }}</span>
                            </div>
                            <span class="text-sm font-medium text-center">{{ category.name }}</span>
                          </RouterLink>
                        </div>
                      </div>

                      <!-- Search Results -->
                      <div v-if="searchQuery && searchResults.length > 0" class="p-6">
                        <h3 class="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">Produits</h3>
                        <div class="space-y-3">
                          <RouterLink
                            v-for="result in searchResults"
                            :key="result.id"
                            :to="result.to"
                            @click.native="closeSearch"
                            class="flex items-center space-x-4 p-3 hover:bg-indigo-50 rounded-lg transition-colors group"
                          >
                            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span class="text-lg">{{ result.emoji }}</span>
                            </div>
                            <div class="flex-1">
                              <p class="font-medium text-gray-900 group-hover:text-indigo-800">{{ result.name }}</p>
                              <p class="text-sm text-gray-500">{{ result.category }}</p>
                            </div>
                            <p class="font-semibold text-indigo-600">{{ currencyStore.formatCurrency(result.price) }}</p>
                          </RouterLink>
                        </div>
                      </div>

                      <!-- No Results -->
                      <div v-if="searchQuery && searchResults.length === 0" class="p-6 text-center">
                        <Search class="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p class="text-gray-500 font-medium">Aucun résultat trouvé pour "{{ searchQuery }}"</p>
                        <p class="text-sm text-gray-400 mt-1">Essayez d'autres mots-clés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- User Account -->
            <UserHeaderIconSection class="hidden sm:block" />

            <!-- Wishlist -->
            <router-link
              to="/wishlists"
              class="hidden sm:block p-2 text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors relative"
              aria-label="Liste d'envies"
            >
              <Heart class="h-5 w-5" />
              <span 
                v-if="wishlistStore.totalFavorite > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
              >
                {{ Math.min(wishlistStore.totalFavorite, 9) }}{{ wishlistStore.totalFavorite > 9 ? '+' : '' }}
              </span>
            </router-link>

            <!-- Cart -->
            <CartHeaderIconSection 
              class="relative p-2 text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Panier" 
            />

            <CurrencySwitcher class="hidden md:block" />
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <transition name="mobile-menu">
      <div 
        v-if="mobileMenuOpen" 
        class="lg:hidden fixed inset-0 bg-white z-40 mt-14 sm:mt-16 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="container mx-auto px-4 py-6">
          <!-- Mobile Search -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="mobileSearchQuery"
                @keydown.enter="submitMobileSearch"
                type="text"
                placeholder="Rechercher des produits..."
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Rechercher sur mobile"
              >
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <!-- Mobile Navigation Links -->
          <nav class="space-y-1 mb-6">
            <RouterLink 
              v-for="link in mobileLinks"
              :key="link.to"
              :to="link.to"
              @click="closeAllMenus"
              class="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-base font-medium rounded-lg transition-colors"
              :class="{
                'bg-indigo-50 text-indigo-800': isActiveLink(link.to)
              }"
              role="menuitem"
            >
              <span>{{ link.text }}</span>
              <span 
                v-if="link.badge"
                class="bg-red-500 text-white text-xs rounded-full px-2 py-1"
              >
                Nouveau
              </span>
            </RouterLink>
          </nav>

          <!-- Mobile Categories -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Catégories</h3>
            <div class="grid grid-cols-2 gap-3" v-if="apiCategories.length > 0">
              <RouterLink
                v-for="category in apiCategories"
                :key="category.id"
                :to="`/shop/category/${category.slug}`"
                @click.native="closeAllMenus"
                class="text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 px-4 py-3 rounded-lg border border-gray-100 transition-colors text-center"
                role="menuitem"
              >
                {{ category.name }}
              </RouterLink>
            </div>
            <div v-else class="text-center text-gray-500 py-4">
              Chargement des catégories...
            </div>
          </div>

          <!-- Mobile Account Links -->
          <div class="border-t border-gray-200 pt-6 mt-6">
            <div class="space-y-2">
              <RouterLink
                to="/dashboard"
                @click.native="closeAllMenus"
                class="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-base font-medium rounded-lg transition-colors"
                role="menuitem"
              >
                Mon compte
              </RouterLink>
              <RouterLink
                to="/dashboard/orders"
                @click.native="closeAllMenus"
                class="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-base font-medium rounded-lg transition-colors"
                role="menuitem"
              >
                Mes commandes
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay for mobile menu -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        @click="closeAllMenus"
      ></div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Menu, X, Search, Heart, ChevronDown, ArrowRight, TrendingUp, Clock } from 'lucide-vue-next'
import CurrencySwitcher from '@/components/CurrencySwitcher.vue'
import { useCurrencyStore } from '@/stores/currency'
import CartHeaderIconSection from './CartHeaderIconSection.vue'
import { throttle, debounce } from 'lodash'
import { useAuthStore } from '@/stores/auth'
import UserHeaderIconSection from './UserHeaderIconSection.vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import api from '@/api/axiosConfig'

const authStore = useAuthStore()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const router = useRouter()
const route = useRoute()
const wishlistStore = useWishlistStore()

// State
const mobileMenuOpen = ref(false)
const showBanner = ref(true)
const isScrolled = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const activeSubmenu = ref(null)
const isBannerDismissed = ref(localStorage.getItem('bannerDismissed') === 'true')
const apiCategories = ref([])
const loadingCategories = ref(false)
const searchInput = ref(null)
let submenuTimer = null

// Search data
const trendingSearches = ref([
  { id: 1, query: 'T-shirts Pro', count: 1243 },
  { id: 2, query: 'Costumes Élégants', count: 987 },
  { id: 3, query: 'Chemises Business', count: 856 },
  { id: 4, query: 'Accessoires Cuir', count: 654 },
  { id: 5, query: 'Ensembles Soft', count: 543 }
])

const recentSearches = ref(JSON.parse(localStorage.getItem('recentSearches')) || [])
const searchResults = ref([])
const isSearching = ref(false)

const quickCategories = ref([
  { name: 'Vêtements Pro', slug: 'vetements-pro', emoji: '👔' },
  { name: 'Vêtements Soft', slug: 'vetements-soft', emoji: '👕' },
  { name: 'Accessoires', slug: 'accessoires', emoji: '🧦' },
  { name: 'Nouveautés', slug: 'nouveautes', emoji: '🆕' }
])

// Données de navigation
const mainLinks = [
  { to: '/', text: 'Accueil', hasDropdown: false },
  { to: '/shop', text: 'Boutique', hasDropdown: true },
  { to: '/collections', text: 'Collections', hasDropdown: false, badge: true },
  { to: '/tutorials', text: 'Tutoriels', hasDropdown: false },
]

const featuredProducts = [
  { id: 1, name: 'T-shirt Premium', price: 24900, emoji: '👕', to: '/product/t-shirt-premium' },
  { id: 2, name: 'Chemise Business', price: 35900, emoji: '👔', to: '/product/chemise-business' },
  { id: 3, name: 'Costume Élégant', price: 89900, emoji: '🥼', to: '/product/costume-elegant' }
]

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return [
    `${query} homme`,
    `${query} femme`,
    `${query} 2024`,
    `${query} premium`,
    `${query} pas cher`
  ]
})

const mobileLinks = [
  ...mainLinks,
]

const deliverableAmount = 60000

// Computed
const isHome = computed(() => route.path === '/')

const navBackgroundClass = computed(() => {
  return isScrolled.value || !isHome.value 
    ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' 
    : 'bg-white bg-opacity-90 backdrop-blur-sm'
})

const headerClass = computed(() => {
  return [
    'w-full z-50 fixed top-0',
    isScrolled.value ? 'shadow-lg' : ''
  ]
})

// Methods
const isActiveLink = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const dismissBanner = () => {
  showBanner.value = false
  isBannerDismissed.value = true
  localStorage.setItem('bannerDismissed', 'true')
}

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    searchQuery.value = ''
    searchResults.value = []
  }
}

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const closeAllMenus = () => {
  mobileMenuOpen.value = false
  closeSearch()
  activeSubmenu.value = null
  clearTimeout(submenuTimer)
}

const openSubmenu = (menuName) => {
  clearTimeout(submenuTimer)
  activeSubmenu.value = menuName
}

const closeSubmenuWithDelay = () => {
  submenuTimer = setTimeout(() => {
    activeSubmenu.value = null
  }, 300)
}

const keepSubmenuOpen = () => {
  clearTimeout(submenuTimer)
}

const submitSearch = () => {
  if (searchQuery.value.trim()) {
    addToRecentSearches(searchQuery.value)
    router.push({ path: '/search', query: { q: searchQuery.value } })
    closeSearch()
  }
}

const submitMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    addToRecentSearches(mobileSearchQuery.value)
    router.push({ path: '/search', query: { q: mobileSearchQuery.value } })
    mobileSearchQuery.value = ''
    closeAllMenus()
  }
}

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion
  submitSearch()
}

const applyTrendingSearch = (query) => {
  searchQuery.value = query
  submitSearch()
}

const applyRecentSearch = (query) => {
  searchQuery.value = query
  submitSearch()
}

const addToRecentSearches = (query) => {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return

  // Remove if already exists
  recentSearches.value = recentSearches.value.filter(item => item !== trimmedQuery)
  
  // Add to beginning
  recentSearches.value.unshift(trimmedQuery)
  
  // Keep only last 5 searches
  recentSearches.value = recentSearches.value.slice(0, 5)
  
  // Save to localStorage
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.setItem('recentSearches', JSON.stringify([]))
}

// Simulated search function
const performSearch = debounce(async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Mock search results
  searchResults.value = [
    {
      id: 1,
      name: `T-shirt ${query}`,
      category: 'Vêtements Soft',
      price: 24900,
      emoji: '👕',
      to: `/product/t-shirt-${query.toLowerCase()}`
    },
    {
      id: 2,
      name: `Chemise ${query}`,
      category: 'Vêtements Pro',
      price: 35900,
      emoji: '👔',
      to: `/product/chemise-${query.toLowerCase()}`
    },
    {
      id: 3,
      name: `Costume ${query}`,
      category: 'Vêtements Pro',
      price: 89900,
      emoji: '🥼',
      to: `/product/costume-${query.toLowerCase()}`
    }
  ]
  
  isSearching.value = false
}, 300)

const handleSearchInput = () => {
  performSearch(searchQuery.value)
}

const loadCategories = async () => {
  try {
    loadingCategories.value = true
    const response = await api.get('/categories-sidebar')
    
    if (response.success) {
      apiCategories.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    // Fallback aux catégories statiques en cas d'erreur
    apiCategories.value = [
      {
        id: 1,
        name: 'Vêtements Soft',
        slug: 'vetements-soft',
        children: [
          { id: 11, name: 'T-shirts Soft', slug: 't-shirts-soft' },
          { id: 12, name: 'Pulls Soft', slug: 'pulls-soft' },
          { id: 13, name: 'Ensembles Soft', slug: 'ensembles-soft' },
        ]
      },
      {
        id: 2,
        name: 'Vêtements Pro',
        slug: 'vetements-pro',
        children: [
          { id: 21, name: 'Chemises Pro', slug: 'chemises-pro' },
          { id: 22, name: 'Costumes Pro', slug: 'costumes-pro' },
          { id: 23, name: 'Ensembles Pro', slug: 'ensembles-pro' },
        ]
      },
      {
        id: 3,
        name: 'Accessoires',
        slug: 'accessoires',
        children: [
          { id: 31, name: 'Ceintures', slug: 'ceintures' },
          { id: 32, name: 'Chaussettes', slug: 'chaussettes' },
          { id: 33, name: 'Montres', slug: 'montres' },
        ]
      }
    ]
  } finally {
    loadingCategories.value = false
  }
}

const handleScroll = throttle(() => {
  isScrolled.value = window.scrollY > 10
  showBanner.value = window.scrollY < 40 && !isBannerDismissed.value
}, 100)

// Watch route changes to close menus
watch(() => route.path, () => {
  closeAllMenus()
})

// Close search when clicking outside is handled by the overlay

// Lifecycle
onMounted(() => {
  try {
    currencyStore.fetchRates()
    showBanner.value = !isBannerDismissed.value
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    loadCategories()
  } catch (error) {
    console.error("Header initialization error:", error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  clearTimeout(submenuTimer)
})
</script>

<style scoped>
/* Animations améliorées */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.mega-menu-enter-active,
.mega-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mega-menu-enter-from,
.mega-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.search-overlay-enter-active,
.search-overlay-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-overlay-enter-from,
.search-overlay-leave-to {
  opacity: 0;
}

.search-overlay-enter-active .search-content,
.search-overlay-leave-active .search-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-overlay-enter-from .search-content,
.search-overlay-leave-to .search-content {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Amélioration de l'accessibilité */
@media (max-width: 1023px) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

/* Custom scrollbar for search results */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>