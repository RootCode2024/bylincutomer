<template>
  <!-- Section utilisateur connecté -->
  <div class="relative hidden md:block" v-if="authStore.isAuthenticated" ref="dropdownContainer">
    <div class="flex items-center space-x-2">
      <button 
        @click.stop="toggleAccountMenu"
        class="flex items-center justify-center p-1 text-gray-600 hover:text-indigo-600 transition-colors group"
        aria-label="Mon compte"
        :aria-expanded="accountMenuOpen"
      >
        <span class="text-sm font-medium mr-4 text-gray-700 truncate max-w-[120px]">
          Bonjour, {{ authStore.userName }}
        </span>
        <div class="relative">
          <UserIcon class="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 group-hover:scale-110" />
          <span class="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
        </div>
      </button>
    </div>

    <!-- Menu dropdown nouvelle génération -->
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
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-indigo-600 transition-colors"
          role="menuitem"
          @click="closeAccountMenu"
        >
          <UserCircleIcon class="w-5 h-5 mr-2 text-gray-400" />
          Mon compte
        </RouterLink>
        
        <RouterLink 
          to="/orders" 
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-indigo-600 transition-colors"
          role="menuitem"
          @click="closeAccountMenu"
        >
          <ShoppingBagIcon class="w-5 h-5 mr-2 text-gray-400" />
          Mes commandes
        </RouterLink>
        
        <RouterLink 
          to="/wishlist" 
          class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-indigo-600 transition-colors"
          role="menuitem"
          @click="closeAccountMenu"
        >
          <HeartIcon class="w-5 h-5 mr-2 text-gray-400" />
          Favoris
        </RouterLink>

        <div class="border-t border-gray-100 my-1"></div>
        
        <button 
          @click="handleLogout"
          class="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 hover:text-red-600 transition-colors"
          role="menuitem"
        >
          <LogOutIcon class="w-5 h-5 mr-2 text-gray-400" />
          Déconnexion
        </button>
      </div>
    </transition>
  </div>

  <!-- Section utilisateur non connecté -->
  <div class="hidden md:flex items-center space-x-4" v-else>
    <RouterLink
      to="/login"
      class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
    >
      Connexion
    </RouterLink>
    <RouterLink
      to="/register"
      class="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
    >
      Inscription
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { 
  UserIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  LogOutIcon
} from 'lucide-vue-next';

const authStore = useAuthStore();
const accountMenuOpen = ref(false);
const dropdownContainer = ref(null);

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value;
};

const closeAccountMenu = () => {
  accountMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeAccountMenu();
};

// Gestion du click outside
const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    closeAccountMenu();
  }
};

// Gestion des événements
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Animation personnalisée pour le dropdown */
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