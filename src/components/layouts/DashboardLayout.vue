<script setup>
import { ref, onMounted } from 'vue';
import { RouterView, useRoute, useRouter, RouterLink } from 'vue-router';
import { Bell, ChevronDown, ChevronUp, CircleUser, Search, Settings, Menu, LogOut } from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const uiStore = useUIStore();

const dropdownOpen = ref(false);

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

</script>

<template>
<div class="min-h-screen bg-gray-50/50">
  <!-- Sidebar Navigation Client -->
  <aside class="bg-gradient-to-br from-blue-600 to-blue-800 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
    <div class="relative border-b border-white/20">
      <router-link class="flex items-center gap-4 py-6 px-8" to="/">
        <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
          <span class="text-gray-800 font-bold text-xl">Byl In</span>
        </h6>
      </router-link>
      <button class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden" type="button">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <Menu class="h-5 w-5" />
        </span>
      </button>
    </div>
    <div class="m-4">
      <ul class="mb-4 flex flex-col gap-1">
        <li>
          <router-link aria-current="page" class="active" to="/dashboard">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-gradient-to-tr from-blue-400 to-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Tableau de bord</p>
            </button>
          </router-link>
        </li>
        <li>
          <router-link class="" to="/dashboard/orders">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path fill-rule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clip-rule="evenodd" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Mes Commandes</p>
            </button>
          </router-link>
        </li>
        <li>
          <router-link class="" to="/wishlists">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Favoris</p>
            </button>
          </router-link>
        </li>
        <li>
          <router-link class="" to="/dashboard/profile">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Mon Profil</p>
            </button>
          </router-link>
        </li>
        <li>
          <a class="" href="#">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.53 14.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clip-rule="evenodd" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Historique</p>
            </button>
          </a>
        </li>
      </ul>
      <ul class="mb-4 flex flex-col gap-1">
        <li class="mx-3.5 mt-4 mb-2">
          <p class="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-75">Paramètres</p>
        </li>
        <li>
          <a class="" href="#">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Sécurité</p>
            </button>
          </a>
        </li>
        <li>
          <a class="" href="#">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                <path fill-rule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clip-rule="evenodd" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Méthodes de paiement</p>
            </button>
          </a>
        </li>
        <li>
          <a class="" href="#">
            <button class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/30 w-full flex items-center gap-4 px-4 capitalize" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-5 h-5 text-inherit">
                <path d="M19.5 22.5a3 3 0 003-3v-8.174l-6.879 6.879a.75.75 0 01-1.06-1.06l6.879-6.879-8.174 0a3 3 0 00-3 3V19.5a3 3 0 003 3h9z" />
                <path d="M1.5 9.75a3 3 0 013-3h5.379a.75.75 0 01.53.22l2.122 2.122a.75.75 0 01-.53 1.28H6a1.5 1.5 0 00-1.5 1.5v8.379a.75.75 0 01-1.5 0V9.75z" />
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">Adresses</p>
            </button>
          </a>
        </li>
      </ul>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="p-4 xl:ml-80">
    <nav class="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
      <div class="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div class="capitalize">
          <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-gray-900">Bienvenue, {{ authStore?.user?.profile?.first_name }}</h6>
        </div>
        <div class="flex items-center">
          <button class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30" type="button">
            <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5 text-blue-gray-500">
                <path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clip-rule="evenodd"></path>
              </svg>
            </span>
          </button>
          <div class="relative mx-4">
            <button
              class="middle none font-sans font-bold center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 flex items-center gap-1 px-4"
              type="button"
              @click="dropdownOpen = !dropdownOpen"
            >
              <img src="https://randomuser.me/api/portraits/men/32.jpg" class="inline-block relative object-cover object-center w-8 h-8 rounded-full" alt="profile">
              <span class="hidden xl:block">{{ authStore.user?.profile?.first_name }}</span>
            </button>
            <div v-show="dropdownOpen" class="absolute right-0 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 z-50">
              <div class="py-1">
                <router-link to="dashboard/profile" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  <CircleUser class="mr-3 h-5 w-5 text-gray-500" />
                  Mon profil
                </router-link>
                <router-link to="dashboard/setting" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                  <Settings class="mr-3 h-5 w-5 text-gray-500" />
                  Paramètres
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
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

    <div class="text-blue-gray-600">
      <footer class="py-2">
        <div class="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
          <p class="block antialiased font-sans text-sm leading-normal font-normal text-inherit">© 2023 Ma Boutique en Ligne. Tous droits réservés.</p>
          <ul class="flex items-center gap-4">
            <li>
              <a href="#" class="block antialiased font-sans text-sm leading-normal py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500">Conditions générales</a>
            </li>
            <li>
              <a href="#" class="block antialiased font-sans text-sm leading-normal py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#" class="block antialiased font-sans text-sm leading-normal py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  </div>
</div>
</template>