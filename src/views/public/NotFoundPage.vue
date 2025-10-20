<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-800 to-black flex items-center justify-center p-8">
    <div class="max-w-6xl w-full">
      <div class="grid lg:grid-cols-2 gap-12 items-center bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
        <!-- Illustration Section -->
        <div class="relative h-96 flex items-center justify-center">
          <!-- Astronaut -->
          <div class="relative w-32 h-48 animate-float">
            <!-- Helmet -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-black">
              <div class="absolute top-5 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-sky-300 rounded-lg"></div>
            </div>
            <!-- Body -->
            <div class="absolute top-14 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-white border-4 border-black rounded-2xl"></div>
            <!-- Arms -->
            <div class="absolute top-16 -left-5 w-8 h-12 bg-white border-4 border-black rounded-2xl"></div>
            <div class="absolute top-16 -right-5 w-8 h-12 bg-white border-4 border-black rounded-2xl"></div>
            <!-- Legs -->
            <div class="absolute top-32 left-4 w-6 h-14 bg-white border-4 border-black rounded-2xl"></div>
            <div class="absolute top-32 right-4 w-6 h-14 bg-white border-4 border-black rounded-2xl"></div>
          </div>

          <!-- Stars -->
          <div class="absolute inset-0">
            <div 
              v-for="n in 20" 
              :key="n" 
              class="absolute bg-white rounded-full animate-twinkle"
              :style="starStyle(n)"
            ></div>
          </div>

          <!-- Planet -->
          <div class="absolute bottom-16 right-16 w-28 h-28 bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-full shadow-2xl">
            <div class="absolute inset-0 rounded-full shadow-inner bg-black/20"><img src="/images/logo-black.png" class="object-contain w-12 h-12" alt="bylin"></div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="text-center">
          <!-- Error Code -->
          <h1 class="text-8xl lg:text-9xl font-black bg-gradient-to-r from-indigo-700 to-indigo-800 bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <!-- Title -->
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Page introuvable
          </h2>

          <!-- Description -->
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Oups ! Il semble que vous vous soyez perdu dans l'espace. 
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              @click="goBack"
              class="flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ArrowLeft class="w-5 h-5" />
              Retour
            </button>
            <button 
              @click="goHome"
              class="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              <Home class="w-5 h-5" />
              Page d'accueil
            </button>
          </div>

          <!-- Search Section -->
          <div class="mb-10">
            <p class="text-gray-600 mb-4">
              Ou recherchez ce dont vous avez besoin :
            </p>
            <div class="flex max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <input 
                v-model="searchQuery" 
                @keypress.enter="performSearch"
                type="text" 
                placeholder="Rechercher un produit..."
                class="flex-1 px-6 py-4 text-gray-800 placeholder-gray-400 outline-none"
              >
              <button 
                @click="performSearch"
                class="px-6 bg-indigo-700 hover:bg-indigo-600 text-white transition-colors duration-300"
              >
                <Search class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-6">
              Liens utiles :
            </h3>
            <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <router-link 
                to="/" 
                class="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-indigo-700 hover:text-white text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <ShoppingBag class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span class="font-medium">Boutique</span>
              </router-link>
              <router-link 
                to="/categories" 
                class="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-indigo-700 hover:text-white text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <LayoutGrid class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span class="font-medium">Catégories</span>
              </router-link>
              <router-link 
                to="/promotions" 
                class="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-indigo-700 hover:text-white text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <Tag class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span class="font-medium">Promotions</span>
              </router-link>
              <router-link 
                to="/contact" 
                class="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-indigo-700 hover:text-white text-gray-700 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <Mail class="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span class="font-medium">Contact</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Home, 
  Search, 
  ShoppingBag, 
  LayoutGrid, 
  Tag, 
  Mail 
} from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const starStyle = (index) => {
  const size = Math.random() * 3 + 1
  const opacity = Math.random() * 0.7 + 0.3
  const delay = Math.random() * 3
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}
</style>