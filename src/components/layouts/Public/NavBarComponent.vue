<template>
  <header :class="headerClass" role="banner">
    <!-- Top Banner with dismiss option - visible on all devices -->
    <transition name="slide-down">
      <div 
        v-if="showBanner && !isBannerDismissed"
        class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs sm:text-sm py-2 text-center px-4 relative"
        role="alert"
      >
        <div class="container mx-auto flex justify-center items-center">
          <span class="truncate max-w-[90%]">
            🚀 Livraison express gratuite à partir de {{ currencyStore.formatCurrency(deliverableAmount) }} | 
            Retours faciles sous 30 jours
          </span>
          <button 
            @click="dismissBanner"
            class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-indigo-200 transition-colors"
            aria-label="Fermer la bannière"
          >
            <XIcon class="h-3 w-3 sm:h-4 sm:w-4" />
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

          <!-- Mobile Logo - visible only on mobile -->
          <RouterLink 
            to="/" 
            class="lg:hidden flex items-center"
            aria-label="Accueil"
          >
            <img src="@/assets/images/logo-black.png" alt="Logo" class="h-12 w-12" />
          </RouterLink>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <!-- Logo with responsive sizing -->
            <RouterLink 
              to="/" 
              class="flex items-center space-x-2 group"
              aria-label="Accueil"
            >
              <span class="font-extrabold tracking-tight transition-all duration-300">
                <img src="@/assets/images/logo-black.png" alt="Logo" class="w-8 h-8 md:w-10 md:h-10" />
              </span>
            </RouterLink>

            <!-- Main navigation links -->
            <template v-for="link in mainLinks" :key="link.to">
              <div 
                v-if="link.to === '/shop'" 
                class="relative group"
                ref="submenuRef"
                @mouseenter="openSubmenu"
              >
                <RouterLink
                  :to="link.to"
                  class="text-gray-700 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 px-1 py-2 relative group"
                  :class="{
                    'text-indigo-800 font-semibold': route.path === link.to
                  }"
                >
                  {{ link.text }}
                  <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-800 transition-all duration-300 group-hover:w-full"></span>
                </RouterLink>
                
                <!-- Dropdown menu -->
                <div 
                  v-show="activeSubmenu === link.text"
                  class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                >
                  <template v-for="category in categories" :key="category.name">
                    <div 
                      class="px-4 py-2 hover:bg-gray-100 relative submenu-parent"
                      @mouseenter="activeCategory = category.name"
                    >
                      <span class="flex justify-between items-center">
                        {{ category.name }}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </span>
                      
                      <!-- Sous-catégories -->
                      <div 
                        v-if="activeCategory === category.name"
                        class="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                      >
                        <RouterLink
                          v-for="subCategory in category.subCategories"
                          :key="subCategory.name"
                          :to="subCategory.to"
                          class="block px-4 py-2 hover:bg-gray-100 text-sm"
                          @click.native="closeAllMenus"
                        >
                          {{ subCategory.name }}
                        </RouterLink>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              
              <RouterLink
                v-else
                :to="link.to"
                class="text-gray-700 hover:text-indigo-800 text-sm font-medium transition-colors duration-200 px-1 py-2 relative group"
                :class="{
                  'text-indigo-800 font-semibold': route.path === link.to
                }"
              >
                {{ link.text }}
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-800 transition-all duration-300 group-hover:w-full"></span>
              </RouterLink>
            </template>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center space-x-4 sm:space-x-5 md:space-x-6">
            <!-- Enhanced Search with dropdown - hidden on mobile -->
            <div class="hidden sm:block relative">
              <button
                @click="toggleSearch"
                class="p-1 text-gray-600 hover:text-indigo-800 transition-colors"
                aria-label="Rechercher"
                aria-expanded="searchOpen"
              >
                <Search class="h-5 w-5" />
              </button>

              <transition name="slide-fade">
                <div 
                  v-if="searchOpen"
                  class="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                  role="search"
                >
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      @keydown.enter="submitSearch"
                      type="text"
                      placeholder="Rechercher des produits..."
                      class="w-full pl-10 pr-4 py-2 sm:py-3 focus:outline-none"
                      autofocus
                      aria-label="Champ de recherche"
                    />
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div v-if="searchQuery" class="border-t border-gray-100 p-2 text-sm text-gray-500">
                    Suggestions: "T-shirts Pro", "Vêtements Soft", "Ensembles"
                  </div>
                </div>
              </transition>
            </div>

            <!-- User Account with dropdown -->
            <UserHeaderIconSection class="hidden sm:block" />

            <!-- Cart with counter -->
            <CartHeaderIconSection 
              class="relative p-1 text-gray-600 hover:text-indigo-800 transition-colors focus:outline-none"
              aria-label="Panier" 
              role="button"
            />

            <!-- Wishlist - hidden on mobile -->
            <router-link
              to="/wishlists"
              class="hidden sm:block p-1 text-gray-600 hover:text-indigo-800 transition-colors relative"
              aria-label="Liste d'envies"
            >
              <HeartIcon class="h-5 w-5" />
              <span 
                v-if="wishlistStore.totalFavorite > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >
                {{ wishlistStore.totalFavorite }}
              </span>
            </router-link>

            <CurrencySwitcher class="hidden md:block" />

            <!-- Mobile Menu Button -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              class="lg:hidden p-1 text-gray-600 hover:text-indigo-800 transition-colors"
              aria-label="Menu"
              aria-expanded="mobileMenuOpen"
            >
              <MenuIcon class="h-6 w-6" v-if="!mobileMenuOpen" />
              <XIcon class="h-6 w-6" v-else />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu with categories -->
    <transition name="slide-fade">
      <div 
        v-if="mobileMenuOpen" 
        class="lg:hidden fixed inset-0 bg-white z-50 mt-14 sm:mt-16 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div class="container mx-auto px-4 py-4 sm:py-6">
          <!-- Mobile Search - visible only in mobile menu -->
          <div class="mb-4 sm:mb-6">
            <div class="relative mb-3">
              <input
                v-model="mobileSearchQuery"
                @keydown.enter="submitMobileSearch"
                type="text"
                placeholder="Rechercher des produits..."
                class="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Rechercher sur mobile"
              >
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div class="space-y-1">
              <RouterLink 
                v-for="link in mobileLinks"
                :key="link.to"
                :to="link.to"
                @click="closeAllMenus"
                class="px-3 py-2 sm:px-4 sm:py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-sm font-medium rounded-md transition-colors flex items-center"
                :class="{
                  'bg-indigo-50 text-indigo-800': route.path === link.to
                }"
                role="menuitem"
              >
                {{ link.text }}
              </RouterLink>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-3 sm:pt-4">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">Catégories</h3>
            <div class="grid grid-cols-2 gap-2 sm:gap-3">
              <RouterLink
                v-for="category in mobileCategories"
                :key="category.to"
                :to="category.to"
                @click.native="closeAllMenus"
                class="text-sm text-gray-700 hover:bg-gray-50 px-2 py-1 sm:px-3 sm:py-2 rounded-md"
                role="menuitem"
              >
                {{ category.text }}
              </RouterLink>
            </div>
          </div>

          <!-- Additional mobile-only links -->
          <div class="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div class="space-y-1">
              <RouterLink
                to="/account"
                @click.native="closeAllMenus"
                class="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-sm font-medium rounded-md transition-colors sm:hidden"
                role="menuitem"
              >
                Mon compte
              </RouterLink>
              <RouterLink
                to="/wishlists"
                @click.native="closeAllMenus"
                class="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 text-sm font-medium rounded-md transition-colors sm:hidden"
                role="menuitem"
              >
                Liste d'envies
                <span 
                  v-if="wishlistStore.totalFavorite > 0"
                  class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
                >
                  {{ wishlistStore.totalFavorite }}
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { MenuIcon, XIcon, Search, HeartIcon } from 'lucide-vue-next'
import CurrencySwitcher from '@/components/CurrencySwitcher.vue'
import { useCurrencyStore } from '@/stores/currency'
import CartHeaderIconSection from './CartHeaderIconSection.vue'
import { throttle } from 'lodash';
import { useAuthStore } from '@/stores/auth'
import UserHeaderIconSection from './UserHeaderIconSection.vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

const authStore = useAuthStore()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const router = useRouter()
const route = useRoute()


const wishlistStore = useWishlistStore()

// Ajouter un produit
const addToWishlist = (product) => {
  wishlistStore.addItem(product)
}

// Retirer un produit
const removeFromWishlist = (productId) => {
  wishlistStore.removeItem(productId)
}

// State
const mobileMenuOpen = ref(false)
const showBanner = ref(true)
const isScrolled = ref(false)
const searchOpen = ref(false)
const accountMenuOpen = ref(false)
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const activeSubmenu = ref(null)
const activeCategory = ref(null)
const isBannerDismissed = ref(localStorage.getItem('bannerDismissed') === 'true')

const mainLinks = [
  { to: '/', text: 'Accueil' },
  { to: '/shop', text: 'Boutique' },
  { to: '/collections', text: 'Collections', badge: true  },
  { to: '/contact', text: 'Contact' },
  { to: '/services', text: 'Services'},
]

const categories = [
  {
    name: 'Vêtements Soft',
    subCategories: [
      { name: 'T-shirts Soft', to: '/shop/t-shirts-soft' },
      { name: 'Pulls Soft', to: '/shop/pulls-soft' },
      { name: 'Ensembles Soft', to: '/shop/ensembles-soft' },
    ]
  },
  {
    name: 'Vêtements Pro',
    subCategories: [
      { name: 'Chemises Pro', to: '/shop/chemises-pro' },
      { name: 'Costumes Pro', to: '/shop/costumes-pro' },
      { name: 'Ensembles Pro', to: '/shop/ensembles-pro' },
    ]
  },
  {
    name: 'Accessoires',
    subCategories: [
      { name: 'Ceintures', to: '/shop/ceintures' },
      { name: 'Chaussettes', to: '/shop/chaussettes' },
    ]
  }
]

const mobileLinks = [
  ...mainLinks,
  { to: '/about', text: 'À propos' },
  { to: '/account', text: 'Mon compte' },
  { to: '/orders', text: 'Mes commandes' },
]

const mobileCategories = [
  { to: '/shop/soft', text: 'Vêtements Soft' },
  { to: '/shop/pro', text: 'Vêtements Pro' },
  { to: '/shop/accessories', text: 'Accessoires' },
  { to: '/shop/new-arrivals', text: 'Nouveautés' },
]

// Prix stocké en base : 32000 F CFA
const deliverableAmount = 32000

// Computed
const isHome = computed(() => route.path === '/')

const navBackgroundClass = computed(() => {
  return isScrolled.value || !isHome.value 
    ? 'bg-white shadow-sm backdrop-blur-sm bg-opacity-90' 
    : 'bg-white bg-opacity-80'
})

const headerClass = computed(() => {
  return [
    'w-full z-50 fixed top-0',
    isScrolled.value ? 'shadow-sm' : ''
  ]
})

// Methods
const dismissBanner = () => {
  showBanner.value = false
  isBannerDismissed.value = true
  localStorage.setItem('bannerDismissed', 'true')
}

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  accountMenuOpen.value = false
  if (!searchOpen.value) searchQuery.value = ''
}

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value
  searchOpen.value = false
}

const closeAllMenus = () => {
  mobileMenuOpen.value = false
  searchOpen.value = false
  accountMenuOpen.value = false
  activeSubmenu.value = null
  activeCategory.value = null
}

const openSubmenu = (menuName) => {
  activeSubmenu.value = menuName
}

const closeSubmenu = () => {
  activeSubmenu.value = null
  activeCategory.value = null
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

const handleLogout = () => {
  // Logique de déconnexion
  closeAllMenus()
  authStore.logout()
  router.push('/')
}

const handleScroll = throttle(() => {
  isScrolled.value = window.scrollY > 10
  showBanner.value = window.scrollY < 40 && !isBannerDismissed.value
}, 100)

// Watch route changes to close menus
watch(() => route.path, () => {
  closeAllMenus()
})

// Lifecycle
onMounted(() => {
  try {
    currencyStore.fetchRates()
    showBanner.value = !isBannerDismissed.value
    handleScroll()
    window.addEventListener('scroll', handleScroll)
  } catch (error) {
    console.error("Header initialization error:", error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Improved mobile menu transitions */
@media (max-width: 1023px) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .slide-fade-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>