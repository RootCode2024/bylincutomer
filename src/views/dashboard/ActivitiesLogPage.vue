<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8 w-full mx-auto">

    <!-- Breadcrumb Navigation -->
    <nav class="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 mb-2">
      <div class="w-full mx-auto">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <RouterLink to="/dashboard" class="text-indigo-800 hover:text-indigo-700">Accueil</RouterLink>
          </li>
          <li>
            <span class="text-gray-400">/</span>
          </li>
          <li class="text-gray-500 truncate max-w-xs">Mon historique des activitées</li>
        </ol>
      </div>
    </nav>
    <!-- Header -->
    <header class="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20">
      <div class="mx-auto px-6 py-5 sm:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Journal d'activités</h1>
            <p class="text-sm text-slate-500 mt-0.5">Historique complet de vos actions</p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Filtres -->
            <div class="flex items-center gap-2">
              <select 
                v-model="filters.type"
                class="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="update_profile">Modification profil</option>
                <option value="order_created">Commande créée</option>
                <option value="order_updated">Commande modifiée</option>
                <option value="order_cancelled">Commande annulée</option>
                <option value="address_created">Adresse ajoutée</option>
                <option value="address_updated">Adresse modifiée</option>
                <option value="address_deleted">Adresse supprimée</option>
                <option value="password_changed">Mot de passe changé</option>
                <option value="email_verified">Email vérifié</option>
                <option value="login">Connexion</option>
                <option value="logout">Déconnexion</option>
              </select>
              
              <select 
                v-model="filters.dateRange"
                class="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              >
                <option value="all">Toute période</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            
            <!-- Statistiques rapides -->
            <div class="hidden sm:flex items-center gap-4 text-sm">
              <span class="text-slate-600">{{ filteredActivities.length }} activité(s)</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto px-6 py-10 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar avec statistiques -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Card Statistiques -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Statistiques</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span class="text-sm text-slate-600">Total activités</span>
                <span class="text-lg font-semibold text-slate-900">{{ activities.length }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span class="text-sm text-slate-600">Ce mois</span>
                <span class="text-lg font-semibold text-slate-900">{{ currentMonthActivities }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span class="text-sm text-slate-600">Cette semaine</span>
                <span class="text-lg font-semibold text-slate-900">{{ currentWeekActivities }}</span>
              </div>
            </div>
          </div>

          <!-- Card Types d'activités -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Types d'activités</h3>
            <div class="space-y-3">
              <div 
                v-for="type in activityTypes"
                :key="type.value"
                class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                :class="{ 'bg-slate-100': filters.type === type.value }"
                @click="filters.type = filters.type === type.value ? '' : type.value"
              >
                <div class="flex items-center gap-2">
                  <div 
                    class="w-3 h-3 rounded-full"
                    :class="type.color"
                  ></div>
                  <span class="text-sm text-slate-700">{{ type.label }}</span>
                </div>
                <span class="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                  {{ type.count }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg shadow-slate-900/20 p-6 text-white">
            <h3 class="text-sm font-medium text-slate-300 mb-4">Actions</h3>
            <div class="space-y-3">
              <button 
                @click="exportActivities"
                class="w-full flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter en CSV
              </button>
              <button 
                @click="clearFilters"
                class="w-full flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-3">
          <!-- En-tête des activités -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-6 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-slate-100 rounded-xl">
                  <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">Historique des activités</h2>
                  <p class="text-xs text-slate-500">Suivi complet de vos actions sur la plateforme</p>
                </div>
              </div>
              
              <!-- Recherche -->
              <div class="relative">
                <input 
                  v-model="filters.search"
                  type="text"
                  placeholder="Rechercher une activité..."
                  class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent w-64"
                >
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Liste des activités -->
          <div class="space-y-4">
            <!-- Chargement -->
            <div v-if="loading" class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-8">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-900"></div>
                <span class="ml-3 text-slate-600">Chargement des activités...</span>
              </div>
            </div>

            <!-- Erreur -->
            <div v-else-if="error" class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-8">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="mt-4 text-lg font-semibold text-slate-900">Erreur de chargement</h3>
                <p class="mt-2 text-sm text-slate-600">{{ error }}</p>
                <button 
                  @click="loadActivities"
                  class="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>

            <!-- Aucune activité -->
            <div v-else-if="filteredActivities.length === 0" class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-12 text-center">
              <div class="inline-flex p-4 bg-slate-100 rounded-2xl mb-4">
                <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Aucune activité trouvée</h3>
              <p class="text-sm text-slate-600 mb-6">
                {{ filters.type || filters.search ? 'Aucune activité ne correspond à vos critères de recherche.' : 'Vous n\'avez encore effectué aucune action.' }}
              </p>
              <button 
                v-if="filters.type || filters.search"
                @click="clearFilters"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser les filtres
              </button>
            </div>

            <!-- Liste des activités -->
            <div v-else class="space-y-4">
              <div 
                v-for="activity in filteredActivities"
                :key="activity.id"
                class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <!-- Icône de l'activité -->
                  <div 
                    class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    :class="getActivityType(activity.type).bgColor"
                  >
                    <svg 
                      class="w-6 h-6"
                      :class="getActivityType(activity.type).iconColor"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path :d="getActivityType(activity.type).icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                  </div>

                  <!-- Contenu de l'activité -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h3 class="text-sm font-semibold text-slate-900">
                          {{ getActivityType(activity.type).label }}
                        </h3>
                        <p class="text-sm text-slate-600 mt-1">
                          {{ activity.description }}
                        </p>
                      </div>
                      <span class="text-xs text-slate-500 whitespace-nowrap ml-4">
                        {{ formatDate(activity.created_at) }}
                      </span>
                    </div>

                    <!-- Métadonnées -->
                    <div class="flex items-center gap-4 text-xs text-slate-500">
                      <span class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatTime(activity.created_at) }}
                      </span>
                      
                      <span v-if="activity.performed_by" class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Effectué par: {{ getPerformedBy(activity) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-6">
                <div class="text-sm text-slate-600">
                  Affichage de {{ startItem }}-{{ endItem }} sur {{ filteredActivities.length }} activités
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div class="flex items-center gap-1">
                    <button 
                      v-for="page in visiblePages"
                      :key="page"
                      @click="currentPage = page"
                      class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                      :class="page === currentPage 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'"
                    >
                      {{ page }}
                    </button>
                  </div>
                  
                  <button 
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

// États
const activities = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Filtres
const filters = reactive({
  type: '',
  dateRange: 'all',
  search: ''
})

// Chargement des activités
// Charger les activités avec filtres
const loadActivities = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = new URLSearchParams()
    if (filters.type) params.append('type', filters.type)
    if (filters.search) params.append('search', filters.search)
    if (filters.per_page) params.append('per_page', filters.per_page)
    
    const response = await userStore.fetchActivityLog(params)
    console.log(response)
    activities.value = response.data
    // Gérer la pagination avec data.meta
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Types d'activités avec configuration
const activityTypesConfig = {
  update_profile: {
    label: 'Modification du profil',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  order_created: {
    label: 'Commande créée',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  order_updated: {
    label: 'Commande modifiée',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  order_cancelled: {
    label: 'Commande annulée',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600'
  },
  address_created: {
    label: 'Adresse ajoutée',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  address_updated: {
    label: 'Adresse modifiée',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  address_deleted: {
    label: 'Adresse supprimée',
    icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600'
  },
  password_changed: {
    label: 'Mot de passe changé',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  email_verified: {
    label: 'Email vérifié',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600'
  },
  login: {
    label: 'Connexion',
    icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
    bgColor: 'bg-sky-50',
    iconColor: 'text-sky-600'
  },
  logout: {
    label: 'Déconnexion',
    icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600'
  }
}

// Computed properties
const activityTypes = computed(() => {
  const types = {}
  activities.value.forEach(activity => {
    if (!types[activity.type]) {
      types[activity.type] = 0
    }
    types[activity.type]++
  })
  
  return Object.entries(types).map(([value, count]) => ({
    value,
    label: activityTypesConfig[value]?.label || value,
    count,
    color: activityTypesConfig[value]?.bgColor.replace('bg-', 'bg-') || 'bg-slate-200'
  }))
})

const filteredActivities = computed(() => {
  let filtered = activities.value

  // Filtre par type
  if (filters.type) {
    filtered = filtered.filter(activity => activity.type === filters.type)
  }

  // Filtre par période
  if (filters.dateRange !== 'all') {
    const now = new Date()
    let startDate

    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
    }

    filtered = filtered.filter(activity => 
      new Date(activity.created_at) >= startDate
    )
  }

  // Filtre par recherche
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.description.toLowerCase().includes(searchLower) ||
      activityTypesConfig[activity.type]?.label.toLowerCase().includes(searchLower)
    )
  }

  // Tri par date (plus récent en premier)
  return filtered.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )
})

const currentMonthActivities = computed(() => {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  return activities.value.filter(activity => 
    new Date(activity.created_at) >= startOfMonth
  ).length
})

const currentWeekActivities = computed(() => {
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  
  return activities.value.filter(activity => 
    new Date(activity.created_at) >= startOfWeek
  ).length
})

// Pagination
const totalPages = computed(() => 
  Math.ceil(filteredActivities.value.length / itemsPerPage)
)

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredActivities.value.slice(start, end)
})

const startItem = computed(() => 
  (currentPage.value - 1) * itemsPerPage + 1
)

const endItem = computed(() => 
  Math.min(currentPage.value * itemsPerPage, filteredActivities.value.length)
)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(total, start + 4)
  
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Méthodes
const getActivityType = (type) => 
  activityTypesConfig[type] || {
    label: type,
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600'
  }

const getPerformedBy = (activity) => {
  if (activity.performed_by === authStore.user.id) {
    return 'Vous'
  }
  return `Utilisateur #${activity.performed_by}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const clearFilters = () => {
  filters.type = ''
  filters.dateRange = 'all'
  filters.search = ''
  currentPage.value = 1
}

const exportActivities = () => {
  const csvContent = [
    ['Date', 'Type', 'Description', 'Effectué par'],
    ...filteredActivities.value.map(activity => [
      new Date(activity.created_at).toLocaleDateString('fr-FR'),
      getActivityType(activity.type).label,
      activity.description,
      getPerformedBy(activity)
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `activites-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// Cycle de vie
onMounted(() => {
  loadActivities()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>