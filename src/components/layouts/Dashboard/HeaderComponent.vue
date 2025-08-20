<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Bell, ChevronDown, ChevronUp, CircleUser, Search, Settings, Menu, LogOut } from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const notifications = ref([]);
const unreadNotificationsCount = computed(() => notifications.value.filter(n => !n.read).length);
const isUserMenuOpen = ref(false);
const isNotificationsOpen = ref(false);
const isLoading = ref(false);

// Gestion du clic en dehors des menus
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu-container');
  const notificationsMenu = document.querySelector('.notifications-menu');
  
  if (userMenu && !userMenu.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
  
  if (notificationsMenu && !notificationsMenu.contains(event.target)) {
    isNotificationsOpen.value = false;
  }
};

onMounted(() => {
  fetchNotifications();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const userInitials = computed(() => {
  if (!authStore.userName) return 'U';
  const names = authStore.userName.split(' ');
  return names.map(name => name[0]).join('').toUpperCase().substring(0, 2);
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const fetchNotifications = async () => {
  try {
    isLoading.value = true;
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    notifications.value = [
      { id: 1, title: 'Nouvelle commande', message: 'Votre commande #1234 a été expédiée', read: false, date: '2023-05-15T10:30:00' },
      { id: 2, title: 'Promotion', message: 'Réduction spéciale sur votre prochaine commande', read: true, date: '2023-05-14T16:45:00' },
      // Ajouter d'autres notifications...
    ];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  } finally {
    isLoading.value = false;
  }
};

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 sm:px-6">
    <div class="flex items-center gap-4 w-full">
      <!-- Mobile menu button -->
      <button 
        @click.stop="uiStore.toggleMobileSidebar"
        class="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Toggle menu"
      >
        <Menu class="h-5 w-5" />
      </button>
      
      <!-- Search bar -->
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Rechercher produits, commandes..."
          @keyup.enter="() => router.push({ name: 'search', query: { q: searchQuery } })"
        />
      </div>
      
      <!-- Right section -->
      <div class="flex items-center gap-2 sm:gap-4 ml-auto">
        <!-- Notifications -->
        <div class="relative notifications-menu">
          <button 
            @click.stop="isNotificationsOpen = !isNotificationsOpen"
            class="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Notifications"
          >
            <Bell class="h-5 w-5" />
            <span 
              v-if="unreadNotificationsCount > 0"
              class="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
            >
              {{ unreadNotificationsCount }}
            </span>
          </button>
          
          <!-- Notifications dropdown -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div 
              v-if="isNotificationsOpen"
              class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-96 overflow-y-auto"
            >
              <div class="py-1">
                <div class="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                  <button 
                    @click.stop="markAllAsRead"
                    class="text-xs text-indigo-600 hover:text-indigo-900"
                    :disabled="unreadNotificationsCount === 0"
                  >
                    Tout marquer comme lu
                  </button>
                </div>
                
                <template v-if="isLoading">
                  <div class="px-4 py-6 text-center text-sm text-gray-500">
                    Chargement...
                  </div>
                </template>
                
                <template v-else-if="notifications.length === 0">
                  <div class="px-4 py-6 text-center text-sm text-gray-500">
                    Aucune notification
                  </div>
                </template>
                
                <template v-else>
                  <div 
                    v-for="notification in notifications"
                    :key="notification.id"
                    @click="markAsRead(notification.id)"
                    class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    :class="{ 'bg-gray-50': !notification.read }"
                  >
                    <div class="flex items-start">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ notification.title }}
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                          {{ notification.message }}
                        </p>
                        <p class="text-xs text-gray-400 mt-1">
                          {{ formatDate(notification.date) }}
                        </p>
                      </div>
                      <div v-if="!notification.read" class="ml-2">
                        <span class="h-2 w-2 rounded-full bg-indigo-500 block"></span>
                      </div>
                    </div>
                  </div>
                </template>
                
                <div class="px-4 py-2 border-t border-gray-100 text-center">
                  <router-link
                    to="/notifications"
                    @click="isNotificationsOpen = false"
                    class="text-xs text-indigo-600 hover:text-indigo-900"
                  >
                    Voir toutes les notifications
                  </router-link>
                </div>
              </div>
            </div>
          </transition>
        </div>
        
        <!-- User dropdown -->
        <div class="relative user-menu-container">
          <button 
            @click.stop="isUserMenuOpen = !isUserMenuOpen"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="User menu"
          >
            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-medium text-indigo-600">
              {{ userInitials }}
            </div>
            <span class="hidden md:inline text-sm font-medium text-gray-700">
              {{ authStore.userName || 'Utilisateur' }}
            </span>
            <ChevronDown 
              class="h-4 w-4 text-gray-500 hidden md:block transition-transform duration-200"
              :class="{ 'transform rotate-180': isUserMenuOpen }"
            />
          </button>
          
          <!-- User dropdown menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div 
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div class="py-1">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ authStore.userName }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ authStore.userEmail }}
                  </p>
                </div>
                
                <router-link
                  to="/dashboard/profile"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="isUserMenuOpen = false"
                >
                  <CircleUser class="mr-3 h-5 w-5 text-gray-500" />
                  Mon profil
                </router-link>
                
                <router-link
                  to="/settings"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="isUserMenuOpen = false"
                >
                  <Settings class="mr-3 h-5 w-5 text-gray-500" />
                  Paramètres
                </router-link>
                
                <div class="border-t border-gray-100"></div>
                
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <LogOut class="mr-3 h-5 w-5 text-gray-500" />
                  Déconnexion
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>