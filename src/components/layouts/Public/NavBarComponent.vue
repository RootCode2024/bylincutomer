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
            <!-- Enhanced Search -->
            <div class="hidden md:block relative">
              <button
                @click="toggleSearch"
                class="p-2 text-gray-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                aria-label="Rechercher"
                aria-expanded="searchOpen"
              >
                <Search class="h-5 w-5" />
              </button>

              <transition name="search-dropdown">
                <div 
                  v-if="searchOpen"
                  class="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  role="search"
                >
                  <div class="relative p-4">
                    <div class="relative">
                      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        v-model="searchQuery"
                        @keydown.enter="submitSearch"
                        type="text"
                        placeholder="Rechercher des produits, marques, catégories..."
                        class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        autofocus
                        aria-label="Champ de recherche"
                      />
                    </div>
                    
                    <!-- Search Suggestions -->
                    <div v-if="searchQuery" class="mt-3 space-y-2">
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Suggestions rapides</div>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="suggestion in searchSuggestions"
                          :key="suggestion"
                          @click="applySuggestion(suggestion)"
                          class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
                        >
                          {{ suggestion }}
                        </button>
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
                to="/account"
                @click.native="closeAllMenus"
                class="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-base font-medium rounded-lg transition-colors"
                role="menuitem"
              >
                Mon compte
              </RouterLink>
              <RouterLink
                to="/orders"
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Menu, X, Search, Heart, ChevronDown, ArrowRight } from 'lucide-vue-next'
import CurrencySwitcher from '@/components/CurrencySwitcher.vue'
import { useCurrencyStore } from '@/stores/currency'
import CartHeaderIconSection from './CartHeaderIconSection.vue'
import { throttle } from 'lodash'
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
let submenuTimer = null

// Données de navigation
const mainLinks = [
  { to: '/', text: 'Accueil', hasDropdown: false },
  { to: '/shop', text: 'Boutique', hasDropdown: true },
  { to: '/collections', text: 'Collections', hasDropdown: false, badge: true },
  { to: '/tutorials', text: 'Tutoriels', hasDropdown: false },
  { to: '/contact', text: 'Contact', hasDropdown: false },
]

const featuredProducts = [
  { id: 1, name: 'T-shirt Premium', price: 24900, emoji: '👕', to: '/product/t-shirt-premium' },
  { id: 2, name: 'Chemise Business', price: 35900, emoji: '👔', to: '/product/chemise-business' },
  { id: 3, name: 'Costume Élégant', price: 89900, emoji: '🥼', to: '/product/costume-elegant' }
]

const searchSuggestions = [
  'T-shirts Pro',
  'Vêtements Soft',
  'Ensembles',
  'Accessoires',
  'Nouveautés',
  'Promotions'
]

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
  if (!searchOpen.value) searchQuery.value = ''
}

const closeAllMenus = () => {
  mobileMenuOpen.value = false
  searchOpen.value = false
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
    router.push({ path: '/search', query: { q: searchQuery.value } })
    searchQuery.value = ''
    closeAllMenus()
  }
}

const submitMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: mobileSearchQuery.value } })
    mobileSearchQuery.value = ''
    closeAllMenus()
  }
}

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion
  submitSearch()
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

// Close search when clicking outside
const handleClickOutside = (event) => {
  if (searchOpen.value && !event.target.closest('.relative')) {
    searchOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  try {
    currencyStore.fetchRates()
    showBanner.value = !isBannerDismissed.value
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
    loadCategories()
  } catch (error) {
    console.error("Header initialization error:", error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
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

.search-dropdown-enter-active,
.search-dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-dropdown-enter-from,
.search-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
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
</style>