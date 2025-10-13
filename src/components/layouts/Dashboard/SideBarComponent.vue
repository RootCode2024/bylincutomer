<script setup>
import { computed } from 'vue';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  Heart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home
} from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const uiStore = useUIStore();
const authStore = useAuthStore();
const router = useRouter();

const menuItems = [
  { name: 'Tableau de bord', path: '/dashboard/', icon: LayoutDashboard },
  { name: 'Paniers cadeaux', path: '/dashboard/shared-carts', icon: Package },
  { name: 'Favoris', path: '/dashboard/wishlists', icon: Heart },
  { name: 'Commandes', path: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
  { name: 'Retour au site', path: '/', icon: Home }
];

const userInitials = computed(() => {
  if (!authStore.userName) return 'US';
  return authStore.userName.split(' ').map(n => n[0]).join('').toUpperCase();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div>
    <!-- Mobile Overlay -->
    <div 
      v-if="uiStore.isMobileSidebarOpen"
      @click="uiStore.toggleMobileSidebar"
      class="fixed inset-0 bg-black/50 lg:hidden z-40"
    />

    <!-- Sidebar -->
    <aside 
      class="fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg z-50 transition-all duration-300 border-r border-gray-200 flex flex-col"
      :class="{
        'w-72': !uiStore.sidebarCollapsed,
        'w-20': uiStore.sidebarCollapsed,
        '-translate-x-full lg:translate-x-0': !uiStore.isMobileSidebarOpen,
        'translate-x-0': uiStore.isMobileSidebarOpen
      }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 h-16">
        <router-link 
          to="/dashboard" 
          class="flex items-center gap-2 overflow-hidden"
        >
          <img 
            src="@/assets/images/logo-blue.png" 
            alt="Logo"
            class="h-8 w-auto"
          >
          <span 
            class="text-xl font-bold text-gray-800 whitespace-nowrap transition-all"
            :class="{ 'opacity-0 invisible': uiStore.sidebarCollapsed }"
          >
            Dashboard
          </span>
        </router-link>
        
        <button 
          @click="uiStore.toggleSidebar"
          class="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors hidden lg:block"
        >
          <ChevronLeft v-if="!uiStore.sidebarCollapsed" class="h-5 w-5" />
          <ChevronRight v-else class="h-5 w-5" />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          active-class="bg-indigo-50 text-indigo-600"
          class="flex items-center p-3 rounded-lg mb-1 text-gray-600 hover:bg-gray-100 transition-colors duration-200 group relative"
          @click="uiStore.closeMobileSidebar"
        >
          <component 
            :is="item.icon" 
            class="h-5 w-5 flex-shrink-0"
          />
          <span 
            class="ml-3 whitespace-nowrap transition-all duration-300"
            :class="{ 'opacity-0 invisible': uiStore.sidebarCollapsed }"
          >
            {{ item.name }}
          </span>
          <span 
            v-if="uiStore.sidebarCollapsed"
            class="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 whitespace-nowrap"
          >
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">
            {{ userInitials }}
          </div>
          <div 
            class="overflow-hidden transition-all duration-300"
            :class="{ 'opacity-0 invisible': uiStore.sidebarCollapsed }"
          >
            <p class="font-medium text-gray-800 truncate">{{ authStore.userName || 'Utilisateur' }}</p>
            <p class="text-xs text-gray-500 truncate">
              {{ authStore.user?.email || '' }}
            </p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="w-full flex items-center p-3 mt-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 group relative"
        >
          <LogOut class="h-5 w-5 flex-shrink-0" />
          <span 
            class="ml-3 whitespace-nowrap transition-all duration-300"
            :class="{ 'opacity-0 invisible': uiStore.sidebarCollapsed }"
          >
            Déconnexion
          </span>
          <span 
            v-if="uiStore.sidebarCollapsed"
            class="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 whitespace-nowrap"
          >
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>