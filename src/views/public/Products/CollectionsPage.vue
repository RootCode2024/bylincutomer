<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section - Totalement repensé -->
    <section class="relative bg-gradient-to-br from-indigo-700 via-black to-indigo-800 text-white overflow-hidden min-h-screen flex items-center">
      <!-- Animated mesh background -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 50px 50px;"></div>
      </div>
      
      <!-- Floating particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>
      
      <div class="relative container mx-auto px-6 py-20">
        <div class="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <!-- Left: Text Content -->
          <div class="space-y-8 animate-fade-in-left">
            <!-- Elegant badge -->
            <div class="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-medium tracking-widest">
              <Sparkles class="w-3.5 h-3.5" />
              COLLECTIONS EXCLUSIVES
            </div>

            <!-- Main title -->
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
              <span class="block text-white/90">L'Héritage</span>
              <span class="block bg-gradient-to-r from-white via-indigo-800 to-white bg-clip-text text-transparent">
                de Kondo
              </span>
            </h1>

            <!-- Elegant description -->
            <div class="space-y-4 text-sm leading-relaxed text-indigo-100/90 max-w-xl">
              <p class="font-light">
                Dans les profondeurs de l'histoire béninoise sommeille une légende : 
                <span class="text-white font-medium">Kondo</span>, le requin majestueux du roi Béhanzin. 
                Gardien des mers, symbole de puissance indomptable et de grâce aquatique.
              </p>
              <p class="font-light">
                Nous puisons dans cette mythologie ancestrale pour tisser des collections 
                qui transcendent le textile. Chaque pièce est une ode à la 
                <span class="text-white font-medium">résilience</span>, 
                chaque couture murmure des histoires de 
                <span class="text-white font-medium">grandeur</span> 
                et d'<span class="text-white font-medium">élégance intemporelle</span>.
              </p>
            </div>

            <!-- Elegant values -->
            <div class="grid grid-cols-3 gap-4 pt-6">
              <div class="group text-center space-y-2 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                <Zap class="w-5 h-5 mx-auto text-indigo-700 group-hover:text-white transition-colors" />
                <div class="text-xs font-bold text-white">FORCE</div>
                <div class="text-xs text-indigo-200/70 leading-tight">Puissance brute</div>
              </div>
              <div class="group text-center space-y-2 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                <Waves class="w-5 h-5 mx-auto text-indigo-700 group-hover:text-white transition-colors" />
                <div class="text-xs font-bold text-white">FLUIDITÉ</div>
                <div class="text-xs text-indigo-200/70 leading-tight">Douceur infinie</div>
              </div>
              <div class="group text-center space-y-2 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                <Flame class="w-5 h-5 mx-auto text-indigo-700 group-hover:text-white transition-colors" />
                <div class="text-xs font-bold text-white">PASSION</div>
                <div class="text-xs text-indigo-200/70 leading-tight">Art vivant</div>
              </div>
            </div>

            <!-- Quote -->
            <div class="pt-8 border-t border-white/10">
              <div class="flex gap-3 items-start">
                <Quote class="w-6 h-6 text-indigo-700 flex-shrink-0 mt-1" />
                <p class="text-base font-light italic text-white/90 leading-relaxed">
                  Porter BYLIN, c'est s'envelopper de légendes séculaires, 
                  incarner une essence qui défie l'éphémère, et célébrer un héritage 
                  qui résonne à travers les générations.
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Behanzin Portrait -->
          <div class="relative animate-fade-in-right">
            <div class="relative group">
              <!-- Decorative frame -->
              <div class="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              <!-- Image container -->
              <div class="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Behanzin-1895.jpg" 
                  alt="Roi Béhanzin"
                  class="w-full h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <!-- Text overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-8 space-y-2">
                  <div class="flex items-center gap-2 text-xs text-indigo-200 font-medium">
                    <Crown class="w-4 h-4" />
                    <span>L'HÉRITAGE ROYAL</span>
                  </div>
                  <h3 class="text-2xl font-bold text-white">Roi Béhanzin</h3>
                  <p class="text-xs text-white/80 leading-relaxed">
                    Dernier roi indépendant du Dahomey, symbole de résistance et de fierté africaine
                  </p>
                </div>
              </div>

              <!-- Decorative corner accents -->
              <div class="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-2xl -translate-x-2 -translate-y-2"></div>
              <div class="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-2xl translate-x-2 translate-y-2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown class="w-6 h-6 text-white/50" />
      </div>
    </section>

    <!-- Filters Bar - Minimaliste -->
    <section class="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative group">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 group-focus-within:text-indigo-800 transition-colors" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher..."
                @input="handleSearch"
                class="w-full pl-10 pr-3 py-2.5 text-sm bg-black/5 border border-black/10 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-800/20 focus:border-indigo-800 transition-all"
              />
            </div>
          </div>

          <!-- Sort & Filter -->
          <div class="flex items-center gap-2">
            <select
              v-model="sortBy"
              @change="handleFilterChange"
              class="px-4 py-2.5 text-sm bg-black/5 border border-black/10 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-indigo-800/20 cursor-pointer hover:bg-black/10 transition-all"
            >
              <option value="newest">Plus récentes</option>
              <option value="oldest">Plus anciennes</option>
              <option value="name_asc">A-Z</option>
              <option value="name_desc">Z-A</option>
            </select>

            <button
              @click="toggleFilters"
              :class="[
                'flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl font-medium transition-all',
                showFilters
                  ? 'bg-indigo-800 text-white'
                  : 'bg-black text-white hover:bg-black/90'
              ]"
            >
              <SlidersHorizontal class="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        <!-- Expanded Filters -->
        <transition name="slide-down">
          <div v-if="showFilters" class="mt-4 p-4 bg-black/5 rounded-xl border border-black/10">
            <label class="flex items-center gap-2 cursor-pointer group w-fit">
              <input
                v-model="filters.featured"
                type="checkbox"
                @change="handleFilterChange"
                class="w-4 h-4 rounded border-2 border-black/30 text-indigo-800 focus:ring-2 focus:ring-indigo-800/30 cursor-pointer"
              />
              <span class="text-sm text-black font-medium group-hover:text-indigo-800 transition-colors">
                Collections en vedette
              </span>
            </label>
          </div>
        </transition>
      </div>
    </section>

    <!-- Collections Grid -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-12 space-y-3 max-w-2xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-black text-black tracking-tight">
            Nos Collections
          </h2>
          <div class="flex justify-center">
            <div class="w-20 h-0.5 bg-indigo-800 rounded-full"></div>
          </div>
          <p class="text-sm text-black/60 leading-relaxed">
            Explorez un univers où tradition et modernité fusionnent, 
            où chaque collection raconte une histoire tissée de passion et d'authenticité
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-black/5 rounded-2xl h-[420px] mb-3"></div>
            <div class="bg-black/5 rounded-lg h-5 w-3/4 mb-2"></div>
            <div class="bg-black/5 rounded-lg h-4 w-full"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="collections.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-black/5 rounded-full mb-4">
            <Package class="w-8 h-8 text-black/30" />
          </div>
          <h3 class="text-xl font-bold text-black mb-2">Aucune collection trouvée</h3>
          <p class="text-sm text-black/60 mb-6">Ajustez vos critères de recherche</p>
          <button 
            @click="searchQuery = ''; filters.featured = false; handleFilterChange()"
            class="px-6 py-2.5 text-sm bg-indigo-800 text-white rounded-xl font-medium hover:bg-black transition-all"
          >
            Réinitialiser
          </button>
        </div>

        <!-- Collections Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(collection, index) in collections"
            :key="collection.id"
            class="group cursor-pointer animate-fade-in-up"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="relative overflow-hidden rounded-2xl bg-white border border-black/5 transition-all duration-500 hover:border-indigo-800/30 hover:shadow-xl hover:shadow-indigo-800/5 hover:-translate-y-1">
              <!-- Image -->
              <div class="relative aspect-[3/4] overflow-hidden bg-black/5">
                <img
                  :src="getFullImageUrl(collection)"
                  :alt="collection.name"
                  class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <!-- Badges -->
                <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                  <div
                    v-if="collection.is_featured"
                    class="inline-flex items-center gap-1.5 bg-indigo-800/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    <Star class="w-3 h-3 fill-current" />
                    <span>VEDETTE</span>
                  </div>
                  <div
                    v-if="collection.is_new"
                    class="inline-flex items-center gap-1.5 bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    <Sparkles class="w-3 h-3" />
                    <span>NOUVEAU</span>
                  </div>
                </div>

                <!-- Hover CTA -->
                <div class="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <router-link
                    :to="`/collections/${collection.slug}`"
                    class="block w-full bg-white text-indigo-800 py-3 px-4 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2 hover:bg-indigo-800 hover:text-white transition-all shadow-lg"
                  >
                    <span>Découvrir</span>
                    <ArrowRight class="w-4 h-4" />
                  </router-link>
                </div>
              </div>

              <!-- Content -->
              <div class="p-5 space-y-3">
                <h3 class="text-lg font-bold text-black group-hover:text-indigo-800 transition-colors">
                  {{ collection.name }}
                </h3>
                <p class="text-xs text-black/60 leading-relaxed line-clamp-2">
                  {{ collection.description || 'Une collection qui célèbre l\'art du vêtement et l\'essence de notre héritage.' }}
                </p>

                <!-- Meta -->
                <div class="flex items-center justify-between pt-3 border-t border-black/5 text-xs">
                  <div class="flex items-center gap-1.5 text-black/60">
                    <Package class="w-3.5 h-3.5" />
                    <span class="font-semibold text-black">{{ collection.products_count || 0 }}</span>
                    <span>pièces</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-black/40">
                    <Calendar class="w-3.5 h-3.5" />
                    <span>{{ formatDate(collection.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="relative py-20 bg-gradient-to-b from-indigo-800 via-black to-indigo-50 text-white overflow-hidden my-2">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div class="relative container mx-auto px-6 text-center">
        <div class="max-w-2xl mx-auto space-y-6">
          <div class="inline-flex items-center gap-2 bg-white/5 border border-white/20 rounded-full px-3 py-1.5 text-xs font-medium mb-4">
            <Sparkles class="w-3 h-3" />
            <span>REJOIGNEZ L'AVENTURE</span>
          </div>
          
          <h2 class="text-3xl md:text-4xl font-black tracking-tight">
            Incarnez Votre Propre Légende
          </h2>
          
          <p class="text-sm text-indigo-100/80 max-w-xl mx-auto leading-relaxed">
            Rejoignez une communauté qui célèbre l'authenticité, où chaque vêtement 
            devient une extension de votre identité et un hommage à notre héritage commun
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <router-link to="/contact-us" class="px-8 py-3 bg-transparent border border-white text-white rounded-xl font-semibold text-sm hover:bg-white hover:text-indigo-800 transition-all">
              Nous contacter
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  SlidersHorizontal,
  Package,
  ArrowRight,
  Calendar,
  Star,
  Sparkles,
  Zap,
  Waves,
  Flame,
  Crown,
  Quote,
  ChevronDown
} from 'lucide-vue-next'
import api from '@/api/axiosConfig'

const router = useRouter()

const loading = ref(true)
const collections = ref([])
const searchQuery = ref('')
const sortBy = ref('newest')
const showFilters = ref(false)
const pagination = ref(null)
const currentPage = ref(1)

const filters = ref({
  status: ['active'],
  type: [],
  dateRange: 'all',
  featured: false
})

let searchTimer = null

const fetchCollections = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      search: searchQuery.value,
      sort: sortBy.value,
      ...filters.value
    }

    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await api.get('/collections', { params })
    if (response?.success) {
      collections.value = response.data || []
      pagination.value = response.pagination
    } else {
      collections.value = []
    }
  } catch (error) {
    console.error('Erreur:', error)
    collections.value = []
  } finally {
    loading.value = false
  }
}

const getFullImageUrl = (collection) => {
  if (!collection?.cover_image) return 'https://placehold.co/600x800?textCollection+bylin'
  return 'http://localhost:8000' + collection?.cover_image
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchCollections(1)
  }, 500)
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchCollections(1)
}

onMounted(() => {
  fetchCollections()
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes float-delayed {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, 25px) scale(0.95); }
  66% { transform: translate(25px, -25px) scale(1.05); }
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(15px, -15px); }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
}

.animate-fade-in-left {
  animation: fade-in-left 1s ease-out;
}

.animate-fade-in-right {
  animation: fade-in-right 1s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-enter-active {
  transition: all 0.3s ease-out;
}
.slide-up-leave-active {
  transition: all 0.2s ease-in;
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>