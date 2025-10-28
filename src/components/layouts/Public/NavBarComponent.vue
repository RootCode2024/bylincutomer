<template>
  <div :class="{ 'min-h-screen': $route.path === '/' }" class="font-poppins">

    <!-- Top Header -->
    <header :class="headerClass" :style="navBackgroundClass">
      <div class="top-header">
        <!-- Mobile menu button -->
        <div class="mobile-menu-btn lg:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Menu mobile"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>

        <!-- Main Navigation - Desktop -->
        <nav class="main-nav hidden lg:flex" v-if="!route.path.startsWith('/collections')">
          <RouterLink
            v-for="item in mainLinks"
            :key="item.to"
            :to="item.to"
            :class="[
              'nav-link',
              {
                active: isActiveLink(item.to),
              },
            ]"
            @mouseenter="item.hasDropdown ? openSubmenu('shop') : null"
            @mouseleave="item.hasDropdown ? closeSubmenuWithDelay() : null"
          >
            {{ item.text }}
          </RouterLink>
        </nav>

        <!-- Logo -->
        <div class="logo flex-1 lg:flex-none text-center lg:text-left">
          <RouterLink to="/" class="inline-block">
            <img
              src="@/assets/images/logo-white.png"
              class="lg:w-24 lg:h-24 w-12 h-12 object-contain mx-auto lg:mx-0"
              alt="Logo"
              loading="lazy"
            />
          </RouterLink>
        </div>

        <!-- Header Icons -->
        <div class="header-icons">
          <!-- Search -->
          <div class="relative">
            <button
              @click="toggleSearch"
              class="icon p-2"
              :class="{ 'text-white': searchOpen }"
              aria-label="Recherche"
            >
              <Search stroke-width="1" class="w-5 h-5 text-white" />
            </button>

            <!-- Search Overlay -->
            <div v-if="searchOpen" class="search-overlay" @click="closeSearch">
              <div class="search-container" @click.stop>
                <!-- Search Input -->
                <div class="search-input-wrapper">
                  <Search class="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref="searchInput"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher des produits, catégories..."
                    class="search-input"
                    @input="handleSearchInput"
                    @keyup.enter="submitSearch"
                  />
                  <button
                    v-if="searchQuery"
                    @click="clearSearch"
                    class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    aria-label="Effacer la recherche"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  <Loader2 
                    v-if="searchStore.isLoading" 
                    class="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" 
                  />
                </div>

                <!-- Search Content -->
                <div class="search-content">
                  <!-- Quick Categories -->
                  <div class="search-section">
                    <h3 class="search-section-title">Recherche Rapide</h3>
                    <div class="quick-categories">
                      <button
                        v-for="category in quickCategories"
                        :key="category.slug"
                        @click="applyTrendingSearch(category.name)"
                        class="quick-category-btn"
                      >
                        <span class="emoji">{{ category.emoji }}</span>
                        <span class="quick-category-text">{{ category.name }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Trending Searches -->
                  <div v-if="searchStore.trendingSearches.length" class="search-section">
                    <h3 class="search-section-title">
                      <TrendingUp class="w-4 h-4" />
                      Tendances
                    </h3>
                    <div class="trending-searches">
                      <button
                        v-for="trend in searchStore.trendingSearches"
                        :key="trend.id"
                        @click="applyTrendingSearch(trend.query)"
                        class="trending-search-item"
                      >
                        <span class="trending-query">{{ trend.query }}</span>
                        <span class="trending-count"
                          >{{ trend.count }} recherches</span
                        >
                      </button>
                    </div>
                  </div>

                  <!-- Recent Searches -->
                  <div v-if="searchStore.recentSearches.length" class="search-section">
                    <div class="search-section-header">
                      <h3 class="search-section-title">
                        <Clock class="w-4 h-4" />
                        Recherches récentes
                      </h3>
                      <button
                        @click="clearRecentSearches"
                        class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Tout effacer
                      </button>
                    </div>
                    <div class="recent-searches">
                      <button
                        v-for="(search, index) in searchStore.recentSearches"
                        :key="index"
                        @click="applyRecentSearch(search)"
                        class="recent-search-item"
                      >
                        <span class="recent-query">{{ search }}</span>
                        <span
                          @click.stop="removeRecentSearch(index)"
                          class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
                        >
                          <X class="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- Search Suggestions -->
                  <div
                    v-if="searchQuery && searchStore.searchSuggestions.length"
                    class="search-section"
                  >
                    <h3 class="search-section-title">Suggestions</h3>
                    <div class="search-suggestions">
                      <button
                        v-for="suggestion in searchStore.searchSuggestions"
                        :key="suggestion"
                        @click="applySuggestion(suggestion)"
                        class="suggestion-item"
                      >
                        {{ suggestion }}
                        <ArrowRight class="w-3 h-3 flex-shrink-0" />
                      </button>
                    </div>
                  </div>

                  <!-- Search Results -->
                  <div
                    v-if="searchQuery && searchStore.searchResults.length"
                    class="search-section"
                  >
                    <h3 class="search-section-title">
                      Résultats ({{ searchStore.searchResults.length }})
                    </h3>
                    <div class="search-results">
                      <RouterLink
                        v-for="result in searchStore.searchResults"
                        :key="result.id"
                        :to="`/product/${result.slug}`"
                        @click="closeSearch"
                        class="search-result-item"
                      >
                        <img 
                          :src="result.images?.[0]?.url || '/images/placeholder.jpg'" 
                          :alt="result.name"
                          class="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          loading="lazy"
                        />
                        <div class="result-info">
                          <span class="result-name">{{ result.name }}</span>
                          <span class="result-category">{{ result.category?.name }}</span>
                        </div>
                        <span class="result-price">{{
                          currencyStore.formatCurrency(result.price)
                        }}</span>
                      </RouterLink>
                    </div>
                  </div>

                  <!-- Loading State -->
                  <div v-if="searchStore.isLoading && searchQuery" class="search-section">
                    <div class="flex items-center justify-center py-8">
                      <Loader2 class="w-6 h-6 animate-spin text-blue-600 mr-2 flex-shrink-0" />
                      <span class="text-gray-600">Recherche en cours...</span>
                    </div>
                  </div>

                  <!-- No Results -->
                  <div
                    v-if="searchQuery && !searchStore.isLoading && !searchStore.searchResults.length"
                    class="search-no-results"
                  >
                    <div class="text-center py-8">
                      <Search class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p class="text-gray-600">Aucun résultat trouvé pour</p>
                      <p class="text-gray-900 font-medium">"{{ searchQuery }}"</p>
                      <p class="text-sm text-gray-500 mt-2">Essayez d'autres mots-clés</p>
                    </div>
                  </div>

                  <!-- Error State -->
                  <div
                    v-if="searchStore.error"
                    class="search-section"
                  >
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div class="flex items-center">
                        <XCircle class="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                        <p class="text-red-800 text-sm">
                          {{ searchStore.error }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Account -->
          <UserHeaderIconSection />

          <!-- Wishlist -->
          <RouterLink
            to="/wishlists"
            class="icon relative p-2 text-white"
            :class="{ 'text-red-500': wishlistStore.items.length }"
            aria-label="Liste de souhaits"
          >
            <Heart stroke-width="1" class="w-5 h-5" />
            <span
              v-if="wishlistStore.items.length"
              class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center min-w-[1rem]"
            >
              {{ wishlistStore.items.length > 99 ? '99+' : wishlistStore.items.length }}
            </span>
          </RouterLink>

          <!-- Currency Switcher -->
          <CurrencySwitcher class="hidden lg:block" />

          <!-- Shopping Cart -->
          <CartHeaderIconSection />
        </div>
      </div>

      <!-- Secondary Navigation -->
      <nav class="secondary-nav" v-if="!route.path.startsWith('/collections') && navItems?.length">
        <div class="secondary-nav-container">
          <RouterLink
            v-for="item in navItems"
            :key="item.id"
            :to="`/shop/category/${item.slug}`"
            :class="[
              'nav-item',
              {
                sale: item.name === 'Sale',
              },
            ]"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="mobile-menu-overlay"
        @click="closeAllMenus"
      >
        <div class="mobile-menu-content" @click.stop>
          <!-- Mobile Header -->
          <div class="mobile-menu-header">
            <button
              @click="closeAllMenus"
              class="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Fermer le menu"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
          
          <!-- User Account -->
          <UserHeaderIconSection />

          <!-- Mobile Search -->
          <div class="mobile-search">
            <div class="search-input-wrapper">
              <Search class="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                v-model="mobileSearchQuery"
                type="text"
                placeholder="Rechercher..."
                class="search-input"
                @keyup.enter="submitMobileSearch"
              />
              <button
                @click="submitMobileSearch"
                class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Rechercher"
              >
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Mobile Navigation Links -->
          <nav class="mobile-nav">
            <RouterLink
              v-for="link in mobileLinks"
              :key="link.to"
              :to="link.to"
              :class="['mobile-nav-link', { active: isActiveLink(link.to) }]"
              @click="closeAllMenus"
            >
              {{ link.text }}
            </RouterLink>

            <!-- Mobile Categories -->
            <div class="mobile-categories" v-if="apiCategories.length">
              <h3 class="mobile-categories-title">Catégories</h3>
              <div class="mobile-categories-list">
                <div
                  v-for="category in apiCategories"
                  :key="category.id"
                  class="mobile-category"
                >
                  <RouterLink
                    :to="`/shop/category/${category.slug}`"
                    class="mobile-category-main"
                    @click="closeAllMenus"
                  >
                    {{ category.name }}
                  </RouterLink>
                  <div class="mobile-category-children" v-if="category.children?.length">
                    <RouterLink
                      v-for="child in category.children"
                      :key="child.id"
                      :to="`/shop/category/${child.slug}`"
                      class="mobile-category-child"
                      @click="closeAllMenus"
                    >
                      {{ child.name }}
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <!-- Mobile Footer -->
          <div class="mobile-menu-footer">
            <div class="currency-mobile">
              <CurrencySwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Revolution Slider -->
    <div
      v-if="route.path === '/'"
      class="slider-container"
      @mouseenter="stopAutoPlay"
      @mouseleave="startAutoPlay"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Progress Bar -->
      <div class="slide-progress" :style="{ width: progress + '%' }"></div>

      <!-- Slides -->
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="['rev-slide', { active: currentSlide === index }]"
      >
        <!-- Background with Ken Burns Effect -->
        <div
          class="slide-bg"
          :style="{ backgroundImage: `url(${slide.image})` }"
          :aria-label="`Slide ${index + 1}: ${slide.title}`"
        ></div>

        <!-- Overlay -->
        <div class="slide-overlay"></div>

        <!-- Particles -->
        <div class="particles">
          <div
            v-for="particle in particles"
            :key="particle.id"
            class="particle"
            :style="{
              left: particle.left + '%',
              animationDelay: particle.delay + 's',
              animationDuration: particle.duration + 's',
            }"
          ></div>
        </div>

        <!-- Content -->
        <div class="slide-content">
          <h1 class="slide-title">{{ slide.title }}</h1>
          <div class="slide-subtitle">{{ slide.subtitle }}</div>
          <div class="slide-description">{{ slide.description }}</div>
          <div class="slide-cta">
            <button class="btn-primary">{{ slide.primaryBtn }}</button>
            <button class="btn-secondary">{{ slide.secondaryBtn }}</button>
          </div>
        </div>
      </div>

      <!-- Bullet Navigation -->
      <div class="slider-nav">
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          :class="['nav-bullet', { active: currentSlide === index }]"
          :aria-label="`Aller au slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Search,
  Gift,
  Menu,
  X,
  Heart,
  ArrowRight,
  TrendingUp,
  Clock,
  Loader2,
  XCircle
} from "lucide-vue-next";
import { throttle, debounce } from "lodash";
import { useCurrencyStore } from "@/stores/currency";
import { useWishlistStore } from "@/stores/wishlist";
import { useCategoryStore } from "@/stores/category";
import { useSearchStore } from "@/stores/search";
import CurrencySwitcher from "@/components/CurrencySwitcher.vue";
import CartHeaderIconSection from "./CartHeaderIconSection.vue";
import UserHeaderIconSection from "./UserHeaderIconSection.vue";

// Store instances
const route = useRoute();
const router = useRouter();
const currencyStore = useCurrencyStore();
const wishlistStore = useWishlistStore();
const categoryStore = useCategoryStore();
const searchStore = useSearchStore();

// Slider State
const currentSlide = ref(0);
const progress = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

// Navigation State
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const searchOpen = ref(false);
const searchQuery = ref("");
const mobileSearchQuery = ref("");
const activeSubmenu = ref(null);
const apiCategories = ref([]);
const loadingCategories = ref(false);
const searchInput = ref(null);
let submenuTimer = null;

// Search data
const quickCategories = ref([
  { name: "Vêtements Pro", slug: "vetements-pro", emoji: "👔" },
  { name: "Vêtements Soft", slug: "vetements-soft", emoji: "👕" },
  { name: "Accessoires", slug: "accessoires", emoji: "🧦" },
]);

// Navigation Data
const mainLinks = [
  { to: "/shop", text: "Boutique", hasDropdown: true },
  { to: "/collections", text: "Collections", hasDropdown: false, badge: true },
  { to: "/tutorials", text: "Tutoriels", hasDropdown: false },
];

const navItems = ref(null);

const slides = [
  {
    id: 1,
    gradient: "linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)",
    image:
      "https://images.unsplash.com/photo-1559842905-635a89deef34?q=80&w=1170&auto=format&fit=crop",
    title: "L’Héritage de Kondo",
    subtitle: "Force & Élégance",
    description:
      "Inspirée de la légende du requin Kondo, symbole du roi Béhanzin, notre collection rend hommage à la puissance, la fluidité et la grâce béninoise. Porter Bylin, c’est incarner une histoire vivante.",
    primaryBtn: "DÉCOUVRIR LA COLLECTION",
    secondaryBtn: "EN SAVOIR PLUS",
  },
  {
    id: 2,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    image:
      "https://images.unsplash.com/photo-1546213290-e1b492ab3eee?q=80&w=1074&auto=format&fit=crop",
    title: "Soleil & Style",
    subtitle: "Lumière du Golfe de Guinée",
    description:
      "Des créations pensées pour le climat tropical : légères, audacieuses et vibrantes. Confort et élégance s’unissent sous le soleil béninois.",
    primaryBtn: "VOIR LA COLLECTION",
    secondaryBtn: "EXPLORER LES LOOKS",
  },
  {
    id: 3,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    image:
      "https://images.unsplash.com/photo-1727632028162-9fa28ddf5d7a?q=80&w=1074&auto=format&fit=crop",
    title: "Mode Responsable",
    subtitle: "Ancrée, Durable, Locale",
    description:
      "Chez Bylin, la mode est une promesse : respecter la terre, valoriser les savoir-faire locaux et créer sans gaspiller. Une élégance consciente, née au Bénin.",
    primaryBtn: "DÉCOUVRIR NOTRE VISION",
    secondaryBtn: "NOTRE ENGAGEMENT",
  },
  {
    id: 4,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1170&auto=format&fit=crop",
    title: "Moments d’Exception",
    subtitle: "Brillez à Chaque Occasion",
    description:
      "Mariages, célébrations, galas ou soirées… Bylin habille vos moments uniques avec des pièces raffinées qui captent la lumière et les regards.",
    primaryBtn: "TROUVER SON STYLE",
    secondaryBtn: "VOIR LE LOOKBOOK",
  },
  {
    id: 5,
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    image:
      "https://images.unsplash.com/photo-1485231183945-fffde7cb34e0?q=80&w=1170&auto=format&fit=crop",
    title: "Offres du Moment",
    subtitle: "Style Accessible",
    description:
      "Profitez d’offres exclusives sur nos pièces iconiques. L’élégance Bylin devient encore plus accessible — parce que la beauté n’attend pas.",
    primaryBtn: "PROFITER MAINTENANT",
    secondaryBtn: "VOIR TOUTES LES OFFRES",
  },
  {
    id: 6,
    gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1170&auto=format&fit=crop",
    title: "Esprit Urbain",
    subtitle: "Chic & Authentique",
    description:
      "Née entre Cotonou et Abomey, la collection urbaine fusionne les lignes modernes avec les couleurs de nos racines. Une attitude, un art de vivre signé Bylin.",
    primaryBtn: "SHOPPER LE STYLE",
    secondaryBtn: "INSPIRATION URBAINE",
  },
];


const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 15,
  duration: Math.random() * 10 + 10,
}));

const mobileLinks = [...mainLinks];

const deliverableAmount = 60000;

// Computed
const isHome = computed(() => route.path === "/");

const navBackgroundClass = computed(() => {
  return isScrolled.value || !isHome.value
    ? "bg-white shadow-lg backdrop-blur-md bg-opacity-95"
    : "bg-white bg-opacity-90 backdrop-blur-sm";
});

const headerClass = computed(() => {
  return [
    "w-full z-50 transition-all duration-300",
    isScrolled.value ? "shadow-lg" : "",
  ];
});

// Slider Methods
const startAutoPlay = () => {
  stopAutoPlay();
  progress.value = 0;

  progressInterval = setInterval(() => {
    if (progress.value >= 100) {
      progress.value = 0;
    } else {
      progress.value += 100 / (slideDelay / 100);
    }
  }, 100);

  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, slideDelay);
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
  if (progressInterval) {
    clearInterval(progressInterval);
  }
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
  progress.value = 0;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
  progress.value = 0;
};

const goToSlide = (index) => {
  currentSlide.value = index;
  progress.value = 0;
};

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
};

const handleKeyDown = (e) => {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
};

// Navigation Methods
const isActiveLink = (path) => {
  return route.path === path || route.path.startsWith(path + "/");
};


const toggleSearch = () => {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  } else {
    clearSearch();
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  searchStore.searchResults = [];
  searchStore.searchSuggestions = [];
  searchStore.error = null;
};

const closeSearch = () => {
  searchOpen.value = false;
  clearSearch();
};

const closeAllMenus = () => {
  mobileMenuOpen.value = false;
  closeSearch();
  activeSubmenu.value = null;
  clearTimeout(submenuTimer);
};

const openSubmenu = (menuName) => {
  clearTimeout(submenuTimer);
  activeSubmenu.value = menuName;
};

const closeSubmenuWithDelay = () => {
  submenuTimer = setTimeout(() => {
    activeSubmenu.value = null;
  }, 300);
};

const keepSubmenuOpen = () => {
  clearTimeout(submenuTimer);
};

// Search Methods
const performSearch = debounce(async (query) => {
  if (!query.trim()) {
    searchStore.searchResults = [];
    searchStore.searchSuggestions = [];
    return;
  }

  try {
    await searchStore.searchProducts(query);
  } catch (error) {
    console.error('Erreur recherche:', error);
  }
}, 300);

const handleSearchInput = () => {
  const query = searchQuery.value.trim();
  
  if (query) {
    searchStore.getSearchSuggestions(query);
    performSearch(query);
  } else {
    searchStore.searchResults = [];
    searchStore.searchSuggestions = [];
  }
};

const submitSearch = async () => {
  const query = searchQuery.value.trim();
  if (!query) return;

  try {
    searchStore.addToRecentSearches(query);
    router.push({ 
      path: "/search", 
      query: { q: query }
    });
    closeSearch();
  } catch (error) {
    console.error('Erreur soumission recherche:', error);
  }
};

const submitMobileSearch = async () => {
  const query = mobileSearchQuery.value.trim();
  if (!query) return;

  try {
    searchStore.addToRecentSearches(query);
    router.push({ path: "/search", query: { q: query } });
    mobileSearchQuery.value = "";
    closeAllMenus();
  } catch (error) {
    console.error('Erreur recherche mobile:', error);
  }
};

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  submitSearch();
};

const applyTrendingSearch = (query) => {
  searchQuery.value = query;
  submitSearch();
};

const applyRecentSearch = (query) => {
  searchQuery.value = query;
  submitSearch();
};

const removeRecentSearch = (index) => {
  searchStore.removeRecentSearch(index);
};

const clearRecentSearches = () => {
  searchStore.clearRecentSearches();
};

// Categories Methods
const loadCategories = async () => {
  try {
    loadingCategories.value = true;
    const response = await categoryStore.index();

    if (response) {
      apiCategories.value = categoryStore.categories;
      navItems.value = categoryStore.subCategories;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
    apiCategories.value = [
      {
        id: 1,
        name: "Vêtements Soft",
        slug: "vetements-soft",
        children: [
          { id: 11, name: "T-shirts Soft", slug: "t-shirts-soft" },
          { id: 12, name: "Pulls Soft", slug: "pulls-soft" },
          { id: 13, name: "Ensembles Soft", slug: "ensembles-soft" },
        ],
      },
      {
        id: 2,
        name: "Vêtements Pro",
        slug: "vetements-pro",
        children: [
          { id: 21, name: "Chemises Pro", slug: "chemises-pro" },
          { id: 22, name: "Costumes Pro", slug: "costumes-pro" },
          { id: 23, name: "Ensembles Pro", slug: "ensembles-pro" },
        ],
      },
      {
        id: 3,
        name: "Accessoires",
        slug: "accessoires",
        children: [
          { id: 31, name: "Ceintures", slug: "ceintures" },
          { id: 32, name: "Chaussettes", slug: "chaussettes" },
          { id: 33, name: "Montres", slug: "montres" },
        ],
      },
    ];
  } finally {
    loadingCategories.value = false;
  }
};

const loadTrendingSearches = async () => {
  try {
    await searchStore.fetchTrendingSearches();
  } catch (error) {
    console.error('Erreur chargement tendances:', error);
  }
};

const handleScroll = throttle(() => {
  isScrolled.value = window.scrollY > 10;
}, 100);

// Constants
const slideDelay = 6000;

// Refs
let autoPlayInterval = null;
let progressInterval = null;

// Watch route changes to close menus
watch(
  () => route.path,
  () => {
    closeAllMenus();
  }
);

// Lifecycle
onMounted(() => {
  try {
    currencyStore.fetchRates();
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", handleKeyDown);
    loadCategories();
    loadTrendingSearches();
    startAutoPlay();
  } catch (error) {
    console.error("Header initialization error:", error);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("keydown", handleKeyDown);
  clearTimeout(submenuTimer);
  stopAutoPlay();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Header */
.top-header {
  background-color: #0066bf;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  z-index: 100;
  gap: 16px;
}

@media (min-width: 1024px) {
  .top-header {
    padding: 10px 40px;
    gap: 0;
  }
}

.main-nav {
  display: none;
  gap: 30px;
  align-items: center;
}

@media (min-width: 1024px) {
  .main-nav {
    display: flex;
  }
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding-bottom: 12px;
  position: relative;
  transition: color 0.3s;
  white-space: nowrap;
}

.nav-link.active {
  border-bottom: 2px solid #000;
}

.nav-link.has-badge::after {
  position: absolute;
  top: -8px;
  right: -25px;
  background: #ff4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

.badge {
  background: #ff4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #fff;
}

.header-icons {
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (min-width: 640px) {
  .header-icons {
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .header-icons {
    gap: 25px;
  }
}

.icon {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon:hover {
  color: #bebebe;
}

/* Search Overlay */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 16px 16px;
}

@media (min-width: 640px) {
  .search-overlay {
    padding: 100px 20px 20px;
  }
}

.search-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
}

@media (min-width: 640px) {
  .search-input-wrapper {
    padding: 20px;
  }
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  min-width: 0;
}

.search-content {
  padding: 16px;
}

@media (min-width: 640px) {
  .search-content {
    padding: 20px;
  }
}

.search-section {
  margin-bottom: 20px;
}

.search-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
}

.quick-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (min-width: 480px) {
  .quick-categories {
    grid-template-columns: repeat(3, 1fr);
  }
}

.quick-category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 0;
}

.quick-category-btn:hover {
  border-color: #000;
  background: #f8f8f8;
}

.quick-category-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.emoji {
  font-size: 16px;
  flex-shrink: 0;
}

.trending-searches,
.recent-searches,
.search-suggestions,
.search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trending-search-item,
.recent-search-item,
.suggestion-item,
.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  min-width: 0;
}

.trending-search-item:hover,
.recent-search-item:hover,
.suggestion-item:hover,
.search-result-item:hover {
  background: #f8f8f8;
}

.trending-query {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trending-count {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-left: 8px;
}

.recent-search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-category {
  font-size: 12px;
  color: #666;
}

.result-price {
  font-weight: 600;
  flex-shrink: 0;
  margin-left: 8px;
}

.search-no-results {
  text-align: center;
  color: #666;
  padding: 20px;
}

/* Mobile Menu */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.mobile-search {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.mobile-nav {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.mobile-nav-link {
  display: block;
  padding: 12px 0;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  font-size: 16px;
}

.mobile-nav-link.active {
  color: #000;
  font-weight: 600;
}

.mobile-badge {
  background: #ff4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

.mobile-categories {
  margin-top: 20px;
}

.mobile-categories-title {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 18px;
}

.mobile-categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-category-main {
  display: block;
  font-weight: 600;
  color: #000;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 16px;
}

.mobile-category-children {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 12px;
}

.mobile-category-child {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  padding: 6px 0;
}

.mobile-menu-footer {
  padding: 16px;
  border-top: 1px solid #e5e5e5;
  margin-top: auto;
}

/* Secondary Nav */
.secondary-nav {
  background-color: #fff;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  z-index: 40;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.secondary-nav::-webkit-scrollbar {
  display: none;
}

.secondary-nav-container {
  display: flex;
  gap: 20px;
  min-width: max-content;
  justify-content: flex-start;
}

@media (min-width: 768px) {
  .secondary-nav {
    padding: 20px 40px;
  }
  
  .secondary-nav-container {
    justify-content: center;
    gap: 35px;
  }
}

.nav-item {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s;
  white-space: nowrap;
  padding: 4px 0;
}

.nav-item:hover {
  color: #000;
}

.nav-item.sale {
  color: #d32f2f;
  font-weight: 600;
}

.nav-item.active {
  color: #000;
  font-weight: 500;
}

/* Slider Container */
.slider-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  background: #000;
  background-color: #0066bf;
}

@media (min-width: 768px) {
  .slider-container {
    height: 70vh;
  }
}

@media (min-width: 1024px) {
  .slider-container {
    height: 80vh;
  }
}

.rev-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rev-slide.active {
  opacity: 1;
  z-index: 2;
}

.slide-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transform: scale(1);
  transition: transform 8s ease-out;
}

.rev-slide.active .slide-bg {
  transform: scale(1.1);
}

.slide-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

/* Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 15s infinite;
}

@media (min-width: 768px) {
  .particle {
    width: 4px;
    height: 4px;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

/* Slide Content */
.slide-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  padding: 0 20px;
  color: #fff;
  text-align: center;
}

@media (min-width: 768px) {
  .slide-content {
    padding: 0 40px;
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .slide-content {
    padding: 0 60px;
  }
}

.slide-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.1;
  opacity: 0;
  transform: translateY(50px);
  animation: slideUp 1s ease-out forwards;
}

@media (min-width: 640px) {
  .slide-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 768px) {
  .slide-title {
    font-size: 4rem;
  }
}

@media (min-width: 1024px) {
  .slide-title {
    font-size: 5rem;
  }
}

.slide-subtitle {
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(50px);
  animation: slideUp 1s ease-out 0.3s forwards;
  letter-spacing: 0.5px;
}

@media (min-width: 768px) {
  .slide-subtitle {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .slide-subtitle {
    font-size: 1.75rem;
  }
}

.slide-description {
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(50px);
  animation: slideUp 1s ease-out 0.6s forwards;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .slide-description {
    font-size: 1.125rem;
    margin-left: 0;
    margin-right: 0;
  }
}

.slide-cta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(50px);
  animation: slideUp 1s ease-out 0.9s forwards;
}

@media (min-width: 640px) {
  .slide-cta {
    flex-direction: row;
    gap: 1.25rem;
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  min-width: 200px;
  text-align: center;
}

.btn-primary {
  background: #fff;
  color: #000;
}

.btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #000;
  transition: left 0.4s;
  z-index: -1;
}

.btn-primary:hover {
  color: #fff;
}

.btn-primary:hover::before {
  left: 0;
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.btn-secondary:hover {
  background: #fff;
  color: #000;
}

/* Navigation */
.slider-nav {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 20;
}

@media (min-width: 768px) {
  .slider-nav {
    bottom: 40px;
    right: 40px;
    gap: 15px;
  }
}

.nav-bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.4s;
  border: none;
}

@media (min-width: 768px) {
  .nav-bullet {
    width: 12px;
    height: 12px;
  }
}

.nav-bullet:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
}

.nav-bullet.active {
  background: #fff;
  width: 30px;
  border-radius: 10px;
}

@media (min-width: 768px) {
  .nav-bullet.active {
    width: 40px;
  }
}

/* Progress Bar */
.slide-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: #fff;
  z-index: 30;
  transition: width 0.1s linear;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: block;
}

@media (min-width: 1024px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* Utility classes */
.flex-shrink-0 {
  flex-shrink: 0;
}

.min-w-0 {
  min-width: 0;
}

.min-w-\[1rem\] {
  min-width: 1rem;
}
</style>