<template>
<div class="min-h-screen bg-white">
  <!-- Sidebar Navigation Client -->
  <aside class="bg-white border-r border-gray-200 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
    <div class="relative border-b border-gray-200">
      <router-link class="flex items-center gap-4" to="/">
       <img src="@/assets/images/logo-white.png" class="h-32 w-32 object-cover" />
      </router-link>
      <button class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-gray-900 hover:bg-gray-100 active:bg-gray-200 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden" type="button">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Menu class="h-5 w-5" />
        </span>
      </button>
    </div>
    <div class="m-4">
      <ul class="mb-4 flex flex-col gap-1 space-y-4">
        <li v-for="item in navigationItems" :key="item.path">
          <router-link :to="item.path">
            <button 
              :class="getNavItemClasses(item.path)"
              type="button"
            >
              <span v-html="item.icon"></span>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                {{ item.name }}
              </p>
            </button>
          </router-link>
        </li>
      </ul>
      <ul class="mb-4 flex flex-col gap-1">
        <li class="mx-3.5 mt-4 mb-2">
          <p class="block antialiased font-sans text-sm leading-normal text-gray-600 font-black uppercase opacity-75">Paramètres</p>
        </li>
        <li>
          <router-link class="" to="/dashboard/activities-log">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-900 hover:bg-indigo-800/10 active:bg-indigo-800/20 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Historiques</p>
            </button>
          </router-link>
        </li>
        <li>
          <router-link class="" to="">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-900 hover:bg-indigo-800/10 active:bg-indigo-800/20 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Parametre</p>
            </button>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="p-4 xl:ml-80">
    <nav class="block w-full max-w-full bg-white text-gray-900 shadow-sm rounded-xl transition-all px-0 py-1 border border-gray-200">
      <div class="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div class="capitalize">
          <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-gray-900">Bienvenue, {{ authStore?.user?.name }}</h6>
        </div>
        <div class="flex items-center">
          <button class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-indigo-800/10 active:bg-indigo-800/20" type="button">
            <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5 text-gray-500">
                <path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clip-rule="evenodd"></path>
              </svg>
            </span>
          </button>
          <div class="relative mx-4">
            <button
              class="middle none font-sans font-bold center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-900 hover:bg-indigo-800/10 active:bg-indigo-800/20 flex items-center gap-1 px-4 border border-gray-200"
              type="button"
              @click="dropdownOpen = !dropdownOpen"
            >
              <template v-if="authStore.user?.avatar_url">
              <img :src="`https://api.bylin-style.com${authStore.user.avatar_url}`" class="inline-block relative object-cover object-center w-8 h-8 rounded-full" alt="profile">
              </template>
              <template v-else>
              <div
                class="inline-block relative w-8 h-8 rounded-full bg-indigo-800 text-white flex items-center justify-center font-bold text-base"
                :title="authStore.user?.name"
              >
                {{ (authStore.user?.name?.[0] || '').toUpperCase() }}{{ (authStore.user?.name?.[1] || '').toUpperCase() }}
              </div>
              </template>
              <span class="hidden xl:block">{{ authStore.user?.name }}</span>
            </button>
            <div v-show="dropdownOpen" class="absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 z-50 border border-gray-200">
              <div class="py-1">
                <router-link to="/dashboard/profile" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-800/10 text-left">
                  <CircleUser class="mr-3 h-5 w-5 text-gray-500" />
                  Mon profil
                </router-link>
                <router-link to="/dashboard/setting" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-800/10 text-left">
                  <Settings class="mr-3 h-5 w-5 text-gray-500" />
                  Paramètres
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-800/10 text-left"
                >
                  <LogOut class="mr-3 h-5 w-5 text-gray-500" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="mt-12">
      <router-view></router-view>
    </div>

    <div class="text-gray-600">
      <footer class="py-2">
        <div class="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
            <p class="block antialiased font-sans text-sm leading-normal font-normal text-inherit">
            © {{ new Date().getFullYear() }} bylin Style. Tous droits réservés.
            </p>
          <ul class="flex items-center gap-4">
            <li>
              <a href="#" class="block antialiased font-sans text-sm leading-normal py-0.5 px-1 font-normal text-inherit transition-colors hover:text-indigo-800">Conditions générales</a>
            </li>
            <li>
              <a href="#" class="block antialiased font-sans text-sm leading-normal py-0.5 px-1 font-normal text-inherit transition-colors hover:text-indigo-800">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#" class="block antialiased font-sans text-sm leading-normal py-0.5 px-1 font-normal text-inherit transition-colors hover:text-indigo-800">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterView, useRoute, useRouter, RouterLink } from 'vue-router';
import { Bell, ChevronDown, ChevronUp, CircleUser, Search, Settings, Menu, LogOut } from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const uiStore = useUIStore();

const dropdownOpen = ref(false);

// Définition des routes de navigation avec leurs chemins correspondants
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
];

// Fonction pour vérifier si un item de navigation est actif
const isActiveRoute = (itemPath) => {
  // Si c'est la route exacte
  if (route.path === itemPath) {
    return true;
  }
  
  // Pour les sous-routes (ex: /dashboard/orders/123)
  if (itemPath !== '/dashboard' && route.path.startsWith(itemPath)) {
    return true;
  }
  
  return false;
};

// Fonction pour obtenir les classes CSS en fonction de l'état actif
const getNavItemClasses = (itemPath) => {
  const isActive = isActiveRoute(itemPath);
  
  if (isActive) {
    return 'middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-indigo-800 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize';
  } else {
    return 'middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-900 hover:bg-indigo-800/10 active:bg-indigo-800/20 w-full flex items-center gap-4 px-4 capitalize';
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Watcher pour fermer le dropdown quand la route change
import { watch } from 'vue';
watch(() => route.path, () => {
  dropdownOpen.value = false;
});

</script>

<style scoped>
/* Styles pour le footer fixe */
.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Conteneur principal avec sidebar et contenu */
.min-h-screen > div {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Zone de contenu principale */
.p-4 {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Conteneur du router-view */
.mt-12 {
  flex: 1;
}

/* Styles pour le footer */
.text-gray-600 {
  margin-top: auto; /* Pousse le footer vers le bas */
}

footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
  width: 100%;
}
</style>