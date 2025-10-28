<template>
  <div class="min-h-screen bg-gray-100 flex flex-col xl:flex-row">
    <!-- Overlay mobile -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="bg-indigo-800 border-r border-gray-200 fixed xl:static inset-y-0 left-0 z-50 transform transition-transform duration-300 w-72 h-full xl:h-[calc(100vh-32px)] my-4 xl:ml-4 rounded-xl"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-80 xl:translate-x-0'"
    >
      <!-- Header -->
      <div class="relative border-b border-gray-200 flex items-center justify-between p-4">
        <router-link to="/" class="flex items-center gap-4">
          <img src="@/assets/images/logo-white.png" class="h-12 w-12 md:h-20 md:w-20 object-contain" />
        </router-link>
        <!-- Bouton fermer mobile -->
        <button
          @click="sidebarOpen = false"
          class="xl:hidden text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <!-- Navigation -->
      <div class="m-4 overflow-y-auto h-[calc(100vh-160px)]">
        <ul class="flex flex-col gap-3 mb-6">
          <li v-for="item in navigationItems" :key="item.path">
            <router-link :to="item.path">
              <button
                :class="getNavItemClasses(item.path)"
                type="button"
              >
                <span v-html="item.icon"></span>
                <p class="font-sans text-base leading-relaxed font-medium capitalize">
                  {{ item.name }}
                </p>
              </button>
            </router-link>
          </li>
        </ul>

        <div class="border-t border-indigo-700 pt-3">
          <p class="text-gray-300 uppercase text-xs mb-2">Paramètres</p>
          <router-link to="/dashboard/activities-log">
            <button
              :class="(route.name === 'dashboard.activities.log') ? 'bg-white text-indigo-800' : 'text-white hover:bg-indigo-700'"
              class="flex items-center gap-4 w-full px-4 py-3 rounded-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              Historiques
            </button>
          </router-link>
        </div>
      </div>
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 p-4 transition-all flex flex-col">
      <!-- Navbar -->
      <nav class="w-full bg-white shadow-sm rounded-lg px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Bouton menu mobile -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="xl:hidden text-indigo-800 hover:text-indigo-600"
        >
          <Menu class="h-6 w-6" />
        </button>

        <!-- Titre -->
        <h6 class="text-base font-semibold text-gray-900 capitalize text-center md:text-left">
          Bienvenue, {{ authStore?.user?.name }}
        </h6>

        <!-- Dropdown utilisateur -->
        <div class="relative">
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-800/10 transition"
            @click="dropdownOpen = !dropdownOpen"
          >
            <template v-if="authStore.user?.avatar_url">
              <img :src="`http://localhost:8000${authStore.user.avatar_url}`" class="w-8 h-8 rounded-full object-cover" />
            </template>
            <template v-else>
              <div class="w-8 h-8 bg-indigo-800 text-white flex items-center justify-center rounded-full">
                {{ authStore.user?.name?.[0]?.toUpperCase() }}
              </div>
            </template>
            <span class="hidden sm:block">{{ authStore.user?.name }}</span>
          </button>

          <!-- Menu dropdown avec transition -->
          <transition name="fade-slide">
            <div
              v-show="dropdownOpen"
              class="absolute right-0 mt-2 bg-white shadow-md rounded-md border border-gray-200 w-40 z-50"
            >
              <router-link to="/dashboard/profile" class="flex items-center px-4 py-2 text-sm hover:bg-indigo-50">
                <CircleUser class="mr-2 h-4 w-4" /> Profil
              </router-link>
              <router-link to="/dashboard/setting" class="flex items-center px-4 py-2 text-sm hover:bg-indigo-50">
                <Settings class="mr-2 h-4 w-4" /> Paramètres
              </router-link>
              <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-sm hover:bg-indigo-50">
                <LogOut class="mr-2 h-4 w-4" /> Déconnexion
              </button>
            </div>
          </transition>
        </div>
      </nav>

      <!-- Contenu -->
      <div class="mt-8 flex-1">
        <router-view></router-view>
      </div>

      <!-- Footer -->
      <footer class="py-4 border-t border-gray-200 mt-6 text-center text-sm text-gray-600">
        <p>© {{ new Date().getFullYear() }} Bylin Style. Tous droits réservés.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, CircleUser, Settings, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const dropdownOpen = ref(false)
const sidebarOpen = ref(false)

const navigationItems = [
  {
    path: '/dashboard',
    name: 'Tableau de bord',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
      </svg>
    `
  },
  {
    path: '/dashboard/orders',
    name: 'Mes Commandes',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
        <path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clip-rule="evenodd" />
      </svg>
    `
  },
  {
    path: '/dashboard/shared-carts',
    name: 'Mes Paniers Partagés',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2-icon lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
    `
  },
  {
    path: '/dashboard/wishlists',
    name: 'Favoris',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
    `
  },
  {
    path: '/dashboard/profile',
    name: 'Mon Profil',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    `
  }
]

const getNavItemClasses = (path) => {
  const active = route.path === path || route.path.startsWith(path)
  return active
    ? 'flex items-center gap-4 w-full px-4 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow'
    : 'flex items-center gap-4 w-full px-4 py-3 text-gray-100 hover:bg-indigo-700 rounded-lg transition'
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

watch(() => route.path, () => {
  dropdownOpen.value = false
  sidebarOpen.value = false
})
</script>

<style scoped>
/* Transition dropdown */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
