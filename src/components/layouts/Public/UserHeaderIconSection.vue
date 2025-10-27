<template>
  <!-- Section utilisateur connecté -->
  <div 
    class="relative"
    v-if="authStore.isAuthenticated"
    ref="dropdownContainer"
  >
    <!-- Bouton principal -->
    <div class="flex items-center space-x-2">
      <button 
        @click.stop="toggleAccountMenu"
        class="flex items-center justify-center p-1 text-white hover:text-gray-200 transition-colors group"
        aria-label="Mon compte"
        :aria-expanded="accountMenuOpen"
      >
        <!-- Nom utilisateur : visible uniquement sur écrans moyens et + -->
        <span class="hidden sm:block text-sm font-medium mr-4 text-white truncate max-w-[120px]">
          Bonjour, {{ authStore.userName }}
        </span>

        <!-- Icône utilisateur -->
        <div class="relative">
          <User stroke-width="1" class="transition-transform duration-200 group-hover:scale-110" />
          <span class="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
        </div>
      </button>
    </div>

    <!-- Dropdown menu -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="accountMenuOpen"
        class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 backdrop-blur-sm bg-white/90"
        role="menu"
      >
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-900 truncate">Bonjour, {{ authStore.userName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.userEmail }}</p>
        </div>
        
        <RouterLink 
          to="/dashboard" 
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-indigo-800 transition-colors"
          role="menuitem"
          @click="closeAccountMenu"
        >
          <User stroke-width="1" class="mr-2" />
          Mon compte
        </RouterLink>
        
        <RouterLink 
          to="/dashboard/orders" 
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-indigo-800 transition-colors"
          role="menuitem"
          @click="closeAccountMenu"
        >
          <ShoppingBag stroke-width="1" class="mr-2" />
          Mes commandes
        </RouterLink>
        
        <RouterLink 
          to="/wishlists" 
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-indigo-800 transition-colors"
          role="menuitem"
          @click="closeAccountMenu"
        >
          <Heart stroke-width="1" class="mr-2" />
          Favoris
        </RouterLink>

        <div class="border-t border-gray-100 my-1"></div>
        
        <button 
          @click="handleLogout"
          class="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-red-600 transition-colors"
          role="menuitem"
        >
          <LogOut class="mr-2" />
          Déconnexion
        </button>
      </div>
    </transition>
  </div>

  <!-- Section utilisateur non connecté -->
  <div class="flex items-center space-x-3">
    <!-- Desktop -->
    <div class="hidden md:flex items-center space-x-3" v-if="!authStore.isAuthenticated">
      <RouterLink
        to="/login"
        class="text-sm font-medium text-gray-600 hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 bg-gray-200"
      >
        Connexion
      </RouterLink>
      <RouterLink
        to="/register"
        class="text-sm font-medium text-white bg-indigo-700 hover:bg-white hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
      >
        Inscription
      </RouterLink>
    </div>

    <!-- Mobile (compact) -->
    <div class="flex md:hidden items-center space-x-2" v-if="!authStore.isAuthenticated">
      <RouterLink
        to="/login"
        class="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        aria-label="Connexion"
      >
        <User stroke-width="1" />
      </RouterLink>
      <RouterLink
        to="/register"
        class="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        aria-label="Inscription"
      >
        <Heart stroke-width="1" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ShoppingBag, Heart, User, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const accountMenuOpen = ref(false)
const dropdownContainer = ref(null)

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value
}
const closeAccountMenu = () => {
  accountMenuOpen.value = false
}
const handleLogout = () => {
  authStore.logout()
  closeAccountMenu()
}

// Click outside
const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    closeAccountMenu()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
