<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8 w-full mx-auto">

    <!-- Breadcrumb Navigation -->
    <nav class="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 mb-2">
      <div class="max-w-full mx-auto">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <RouterLink to="/dashboard" class="text-indigo-800 hover:text-indigo-700">Accueil</RouterLink>
          </li>
          <li>
            <span class="text-gray-400">/</span>
          </li>
          <li class="text-gray-500 truncate max-w-xs">Mon Profil</li>
        </ol>
      </div>
    </nav>
    <!-- Header sophistiqué -->
    <header class="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20">
      <div class="max-w-6xl mx-auto px-6 py-5 sm:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Mon Profil</h1>
            <p class="text-sm text-slate-500 mt-0.5">Gérez vos informations personnelles</p>
          </div>
          <span v-if="authStore.user?.email_verified_at" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Compte vérifié
          </span>
          <span v-else class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-xl border border-amber-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            En attente de vérification
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto px-6 py-10 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar gauche -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Card Avatar -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-6 transition-all duration-300">
            <div class="relative group">
              <div class="relative">
                <img class="h-32 w-32 rounded-2xl object-cover ring-4 ring-white shadow-lg mx-auto" 
                    :src="authStore.user?.avatar_url ? `http://localhost:8000${authStore.user.avatar_url}` : '/default-avatar.png'" 
                    alt="Photo de profil">
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button @click="showAvatarModal = true" class="absolute bottom-2 right-2 bg-white p-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-6 text-center">
              <h2 class="text-xl font-semibold text-slate-900">{{ authStore.user?.name || 'Utilisateur' }}</h2>
              <p class="text-sm text-slate-500 mt-1">{{ authStore.user?.bio || 'Aucune biographie' }}</p>
              <div class="mt-4 pt-4 border-t border-slate-100">
                <p class="text-xs text-slate-400">Membre depuis</p>
                <p class="text-sm font-medium text-slate-600 mt-0.5">{{ formatDate(authStore.user?.created_at) || 'Date inconnue' }}</p>
              </div>
            </div>
          </div>

          <!-- Card Stats rapides -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg shadow-slate-900/20 p-6 text-white">
            <h3 class="text-sm font-medium text-slate-300 mb-4">Statistiques</h3>
            <div class="space-y-3">
              <!-- Adresses -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-300">Adresses</span>
                <span class="text-lg font-semibold">
                  <span v-if="addressesLoading" class="flex items-center justify-center gap-1">
                    <span class="flex space-x-0.5">
                      <span class="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span class="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span class="w-1 h-1 bg-current rounded-full animate-bounce"></span>
                    </span>
                  </span>
                  <span v-else class="flex items-center gap-1">
                    {{ authStore.user?.addresses?.length || 0 }}
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </span>
              </div>

              <!-- Points de fidélité -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-300">Points de fidélité</span>
                <span class="text-lg font-semibold flex items-center gap-1">
                  {{ authStore.user?.points_balance || 0 }}
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </span>
              </div>

              <!-- Code de parrainage -->
              <div class="flex items-center justify-between group">
                <span class="text-sm text-slate-300">Code de parrainage</span>
                <div class="flex items-center gap-2">
                  <button
                    v-if="authStore.user?.referral_code"
                    @click="copyReferralCode"
                    class="text-lg font-semibold font-mono bg-slate-700/50 hover:bg-slate-700 px-3 py-1 rounded-lg transition-all duration-200 group relative"
                    :class="{ 'bg-green-600/50 hover:bg-green-600/50': copySuccess }"
                  >
                    {{ authStore.user.referral_code }}
                    
                    <!-- Tooltip -->
                    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-400 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {{ copySuccess ? 'Copié !' : 'Copier' }}
                    </div>

                    <!-- Indicateur de copie -->
                    <div v-if="copySuccess" class="absolute -right-1 -top-1">
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      <div class="w-2 h-2 bg-green-400 rounded-full absolute top-0 left-0"></div>
                    </div>
                  </button>
                  
                  <span v-else class="text-lg font-semibold text-slate-400">-</span>

                  <!-- Icône de partage -->
                  <button
                    v-if="authStore.user?.referral_code"
                    @click="shareReferralCode"
                    class="p-1.5 hover:bg-slate-700 rounded-lg transition-colors group relative"
                    title="Partager le code"
                  >
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                    
                    <!-- Tooltip partage -->
                    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Partager
                    </div>
                  </button>
                </div>
              </div>

              <!-- Sécurité -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-300">Sécurité</span>
                <span class="text-lg font-semibold flex items-center gap-1">
                  <span v-if="authStore.user?.email_verified_at" class="flex items-center gap-1 text-emerald-400">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Sécurisé
                  </span>
                  <span v-else class="flex items-center gap-1 text-amber-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    En attente
                  </span>
                </span>
              </div>
            </div>

            <!-- Section partage avancée -->
            <div v-if="authStore.user?.referral_code" class="mt-6 pt-4 border-t border-slate-700/50">
              <p class="text-xs text-slate-400 mb-3">Partage rapide</p>
              <div class="flex gap-2">
                <button
                  @click="shareOnSocial('whatsapp')"
                  class="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                  </svg>
                  WhatsApp
                </button>
                
                <button
                  @click="shareOnSocial('email')"
                  class="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section Informations personnelles -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-5 border-b border-slate-200/60">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-xl shadow-sm">
                  <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">Informations personnelles</h2>
                  <p class="text-xs text-slate-500">Vos coordonnées et détails</p>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nom -->
                <div class="group">
                  <label class="block text-sm font-medium text-slate-600 mb-2">Nom complet</label>
                  <div class="relative">
                    <input 
                      v-if="editModes.name"
                      v-model="editableUser.name"
                      type="text"
                      class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-900"
                      placeholder="Votre nom"
                      :disabled="isUpdatingUserData.name"
                      @keyup.enter="updatePersonalInfo()"
                    >
                    <div v-else class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <span class="text-slate-900 font-medium">{{ authStore.user?.name || 'Non renseigné' }}</span>
                    </div>
                    <button 
                      @click="editModes.name ? updatePersonalInfo() : editModes.name = true"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-200 transition-all"
                      :disabled="isUpdatingUserData.name"
                    >
                      <svg v-if="isUpdatingUserData.name" class="animate-spin w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!editModes.name" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Email -->
                <div class="group">
                  <label class="block text-sm font-medium text-slate-600 mb-2">Adresse email</label>
                  <div class="relative">
                    <input 
                      v-if="editModes.email"
                      v-model="editableUser.email"
                      type="email"
                      class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-900"
                      placeholder="exemple@email.com"
                      :disabled="isUpdatingUserData.email"
                      @keyup.enter="initiateEmailUpdate()"
                      @input="emailError = null"
                    >
                    <div v-else class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <span class="text-slate-900 font-medium">{{ authStore.user?.email || 'Non renseigné' }}</span>
                    </div>
                    <button 
                      @click="editModes.email ? initiateEmailUpdate() : editModes.email = true"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-200 transition-all"
                      :disabled="isUpdatingUserData.email"
                      :title="editableUser.email === authStore.user?.email ? 'Modifiez l\'email avant de confirmer' : 'Modifier l\'email'"
                    >
                      <svg v-if="isUpdatingUserData.email" class="animate-spin w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!editModes.email" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Message d'information -->
                  <div v-if="editModes.email && editableUser.email === authStore.user?.email" 
                      class="mt-2 text-xs text-blue-600 flex items-center gap-1 bg-blue-50 p-2 rounded-lg">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    Modifiez l'adresse email avant de confirmer
                  </div>
                  
                  <p v-if="emailError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    {{ emailError }}
                  </p>
                  <p v-if="successFeedback.email" class="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ successFeedback.email }}
                  </p>
                </div>

                <!-- Téléphone -->
                <div class="group">
                  <label class="block text-sm font-medium text-slate-600 mb-2">Téléphone</label>
                  <div class="relative">
                    <input 
                      v-if="editModes.phone"
                      v-model="editableUser.phone"
                      type="tel"
                      class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-900"
                      placeholder="229 01 52 01 04 42"
                      :disabled="isUpdatingUserData.phone"
                      @keyup.enter="initiatePhoneUpdate()"
                      @input="phoneError = null"
                    >
                    <div v-else class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <span class="text-slate-900 font-medium">{{ authStore.user?.phone || 'Non renseigné' }}</span>
                    </div>
                    <button 
                      @click="editModes.phone ? initiatePhoneUpdate() : editModes.phone = true"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-200 transition-all"
                      :disabled="isUpdatingUserData.phone"
                      :title="editableUser.phone === authStore.user?.phone ? 'Modifiez le téléphone avant de confirmer' : 'Modifier le téléphone'"
                    >
                      <svg v-if="isUpdatingUserData.phone" class="animate-spin w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!editModes.phone" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Message d'information -->
                  <div v-if="editModes.phone && editableUser.phone === authStore.user?.phone" 
                      class="mt-2 text-xs text-blue-600 flex items-center gap-1 bg-blue-50 p-2 rounded-lg">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    Modifiez le numéro de téléphone avant de confirmer
                  </div>
                  
                  <p v-if="phoneError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    {{ phoneError }}
                  </p>
                  <p v-if="successFeedback.phone" class="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ successFeedback.phone }}
                  </p>
                </div>

                <!-- Date de naissance -->
                <div class="group">
                  <label class="block text-sm font-medium text-slate-600 mb-2">Date de naissance</label>
                  <div class="relative">
                    <input 
                      v-if="editModes.birth_date"
                      v-model="formattedBirthDate"
                      type="date"
                      class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-900"
                      :disabled="isUpdatingUserData.birth_date"
                      @keyup.enter="updateBirthDate()"
                    >
                    <div v-else class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <span class="text-slate-900 font-medium">{{ authStore.user?.birth_date ? formatDate(authStore.user.birth_date) : 'Non renseignée' }}</span>
                    </div>
                    <button 
                      @click="editModes.birth_date ? updateBirthDate() : editModes.birth_date = true"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-200 transition-all"
                      :disabled="isUpdatingUserData.birth_date"
                    >
                      <svg v-if="isUpdatingUserData.birth_date" class="animate-spin w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!editModes.birth_date" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="birth_dateError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    {{ birth_dateError }}
                  </p>
                  <p v-if="successFeedback.birth_date" class="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    {{ successFeedback.birth_date }}
                  </p>
                </div>

                <!-- Genre -->
                <div class="group">
                  <label class="block text-sm font-medium text-slate-600 mb-2">Genre</label>
                  <div class="relative">
                    <select 
                      v-if="editModes.gender"
                      v-model="editableUser.gender"
                      class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-900 appearance-none"
                      :disabled="isUpdatingUserData.gender"
                      @keyup.enter="updatePersonalInfo()"
                    >
                      <option value="">Choisir un genre</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                    </select>
                    <div v-else class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent group-hover:border-slate-200 transition-all">
                      <span class="text-slate-900 font-medium">
                        {{ 
                          authStore.user?.gender === 'male' ? 'Homme' : 
                          authStore.user?.gender === 'female' ? 'Femme' : 
                          authStore.user?.gender === 'other' ? 'Autre' : 'Non renseigné' 
                        }}
                      </span>
                    </div>
                    <button 
                      @click="editModes.gender ? updatePersonalInfo() : editModes.gender = true"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-200 transition-all"
                      :disabled="isUpdatingUserData.gender"
                    >
                      <svg v-if="isUpdatingUserData.gender" class="animate-spin w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!editModes.gender" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Bio -->
                <div class="group md:col-span-2">
                  <label class="block text-sm font-medium text-slate-600 mb-2">Biographie</label>
                  <div class="relative">
                    <textarea 
                      v-if="editModes.bio"
                      v-model="editableUser.bio"
                      rows="4"
                      class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-900 resize-none"
                      placeholder="Parlez-nous un peu de vous..."
                      :disabled="isUpdatingUserData.bio"
                      @keyup.enter="updatePersonalInfo()"
                    ></textarea>
                    <div v-else class="px-4 py-3 bg-slate-50 rounded-xl border-2 border-transparent group-hover:border-slate-200 transition-all min-h-[100px]">
                      <p class="text-slate-900 whitespace-pre-wrap">{{ authStore.user?.bio || 'Non renseignée' }}</p>
                    </div>
                    <button 
                      @click="editModes.bio ? updatePersonalInfo() : editModes.bio = true"
                      class="absolute right-3 top-3 p-2 rounded-lg hover:bg-slate-200 transition-all"
                      :disabled="isUpdatingUserData.bio"
                    >
                      <svg v-if="isUpdatingUserData.bio" class="animate-spin w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!editModes.bio" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Adresses -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-5 border-b border-slate-200/60">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-xl shadow-sm">
                    <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-slate-900">Mes adresses</h2>
                    <p class="text-xs text-slate-500">Gérez vos adresses de livraison</p>
                  </div>
                </div>
                <button 
                  @click="addAddress()"
                  class="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-900/20"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Chargement -->
              <div v-if="addressesLoading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-900"></div>
                <p class="text-sm text-slate-500 mt-4">Chargement...</p>
              </div>

              <!-- Erreur -->
              <div v-else-if="addressesError" class="text-center py-12 bg-red-50 rounded-xl">
                <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-sm text-red-600 mt-3">{{ addressesError }}</p>
                <button 
                  @click="loadAddresses()"
                  class="mt-4 px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-xl hover:bg-red-200 transition-colors"
                >
                  Réessayer
                </button>
              </div>

              <!-- Liste des adresses -->
              <div v-else-if="authStore.user?.addresses && authStore.user.addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="address in authStore.user.addresses" 
                  :key="address.id"
                  class="relative group p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  :class="address.is_default ? 'border-slate-900 shadow-md' : 'border-slate-200 hover:border-slate-300'"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div class="p-2 bg-white rounded-lg shadow-sm">
                        <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="address.type === 'home'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-semibold text-slate-900">
                          {{ address.type === 'office' ? 'Bureau' : 'Domicile' }}
                        </h3>
                        <span 
                          v-if="address.is_default"
                          class="inline-block text-xs text-indigo-800 font-medium bg-indigo-100 px-2 py-1 rounded-full"
                        >
                          Défaut
                        </span>
                      </div>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        @click="editAddress(address)"
                        class="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        v-if="authStore.user.addresses.length > 1"
                        @click="confirmDeleteAddress(address)"
                        class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="space-y-1 text-sm text-slate-600">
                    <p>{{ address.street_line }}</p>
                    <p>{{ address.city }}<span v-if="address.state_province">, {{ address.state_province }}</span></p>
                    <p>{{ getCountryName(address.country_code) }}<span v-if="address.postal_code"> - {{ address.postal_code }}</span></p>
                    <p v-if="address.landmark" class="text-xs text-slate-500">Repère: {{ address.landmark }}</p>
                    <p v-if="address.phone" class="text-xs text-slate-500">Telephone: {{ address.phone }}</p>
                  </div>
                  <button 
                    v-if="!address.is_default"
                    :disabled="changingDefaultAddress"
                    @click="setDefaultAddress(address.id)"
                    class="mt-4 disabled:cursor-not-allowed disabled:text-slate-500 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    <span v-if="changingDefaultAddress" class="flex items-center justify-center gap-1">
                      En cours
                      <span class="flex space-x-1">
                        <span class="animate-bounce dot-animation-1">.</span>
                        <span class="animate-bounce dot-animation-2">.</span>
                        <span class="animate-bounce dot-animation-3">.</span>
                      </span>
                    </span>
                    <span class="underline decoration-dashed underline-offset-2" v-else>
                      Définir comme adresse par défaut
                    </span>
                  </button>
                </div>
              </div>

              <!-- Aucune adresse -->
              <div v-else class="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                <div class="inline-flex p-4 bg-slate-100 rounded-2xl mb-4">
                  <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 class="text-sm font-semibold text-slate-900">Aucune adresse</h3>
                <p class="text-sm text-slate-500 mt-1 mb-6">Ajoutez votre première adresse de livraison</p>
                <button 
                  @click="addAddress()"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-900/20"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter une adresse
                </button>
              </div>
            </div>
          </div>

          <!-- Section Sécurité -->
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-5 border-b border-slate-200/60">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-xl shadow-sm">
                  <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">Sécurité</h2>
                  <p class="text-xs text-slate-500">Protégez votre compte</p>
                </div>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              <!-- Email vérifié -->
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-xl border border-emerald-200/60">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-lg">
                    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">Email vérifié</h3>
                    <p class="text-xs text-slate-600">Votre adresse email est protégée</p>
                  </div>
                </div>
                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Actif</span>
              </div>
              
              <!-- Mot de passe -->
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-lg shadow-sm">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">Mot de passe</h3>
                    <p v-if="authStore.user?.last_password_change" class="text-xs text-slate-600">Modifié il y a {{ formatRelativeTime(authStore.user.last_password_change) }}</p>
                    <p v-else class="text-xs text-slate-600">Jamais modifié</p>
                  </div>
                </div>
                <button 
                  @click="showPasswordModal = true"
                  class="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Modifier
                </button>
              </div>
              
              <!-- 2FA -->
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-lg shadow-sm">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">Authentification 2FA</h3>
                    <p class="text-xs text-slate-600">Sécurité renforcée</p>
                  </div>
                </div>
                <button 
                  @click="showTwoFAModal = true"
                  class="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Activer
                </button>
              </div>
            </div>
          </div>

          <!-- Zone dangereuse -->
          <div class="bg-gradient-to-br from-red-50 to-red-50/50 rounded-2xl border-2 border-red-200 p-6">
            <div class="flex items-start gap-4">
              <div class="p-2 bg-white rounded-xl shadow-sm">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-semibold text-red-900">Zone dangereuse</h2>
                <p class="text-sm text-red-700 mt-1 mb-4">
                  La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
                </p>
                <button 
                  @click="showDeleteConfirmation = true"
                  class="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-600/30"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal d'ajout/modification d'adresse -->
    <Transition name="modal">
      <div v-if="showAddressModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddressModal = false"></div>
          <div class="relative bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-900">
                {{ editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse' }}
              </h3>
              <button @click="showAddressModal = false" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- Type d'adresse -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Type d'adresse</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="editableAddress.type = 'home'"
                    class="p-3 border-2 rounded-xl text-center transition-all"
                    :class="editableAddress.type === 'home' 
                      ? 'border-indigo-800 bg-slate-50 text-indigo-800' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'"
                  >
                    <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="text-sm font-medium">Domicile</span>
                  </button>
                  <button
                    type="button"
                    @click="editableAddress.type = 'office'"
                    class="p-3 border-2 rounded-xl text-center transition-all"
                    :class="editableAddress.type === 'office' 
                      ? 'border-indigo-800 bg-slate-50 text-indigo-800' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'"
                  >
                    <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-sm font-medium">Bureau</span>
                  </button>
                </div>
              </div>
              
              <!-- Rue -->
              <div>
                <label for="street" class="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                <input 
                  v-model="editableAddress.street_line"
                  type="text"
                  id="street"
                  class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="123 Rue de l'exemple"
                >
              </div>
              
              <!-- Ville -->
              <div>
                <label for="city" class="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                <input 
                  v-model="editableAddress.city"
                  type="text"
                  id="city"
                  class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="Paris"
                >
              </div>
              
              <!-- Code postal et Pays -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="postal_code" class="block text-sm font-medium text-slate-700 mb-2">Code postal</label>
                  <input 
                    v-model="editableAddress.postal_code"
                    type="text"
                    id="postal_code"
                    class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                    placeholder="75000"
                  >
                </div>
                <div>
                  <label for="country" class="block text-sm font-medium text-slate-700 mb-2">Pays</label>
                  <select 
                    v-model="editableAddress.country_code"
                    id="country"
                    class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all appearance-none"
                  >
                    <option v-for="(country, index) in countries" :key="index" :value="country.code">
                      {{ country.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <!-- Repère -->
              <div>
                <label for="landmark" class="block text-sm font-medium text-slate-700 mb-2">Repère</label>
                <input 
                  v-model="editableAddress.landmark"
                  type="text"
                  id="landmark"
                  class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="Près de la poste, etc."
                >
              </div>
              
              <!-- Telephone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-slate-700 mb-2">Telephone</label>
                <input 
                  v-model="editableAddress.phone"
                  type="text"
                  id="phone"
                  class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  placeholder="+33 6 12 34 56 78"
                >
              </div>
              
              <!-- Adresse par défaut -->
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <input 
                  v-model="editableAddress.is_default"
                  type="checkbox"
                  id="default-address"
                  class="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-400"
                >
                <label for="default-address" class="text-sm text-slate-700">
                  Définir comme adresse par défaut
                </label>
              </div>
            </div>
            
            <div class="mt-8 flex gap-3">
              <button 
                @click="showAddressModal = false"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="saveAddress"
                :disabled="savingAddress"
                class="flex-1 px-5 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="savingAddress" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
                <span v-else>
                  {{ editingAddress ? 'Modifier' : 'Ajouter' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de modification de mot de passe -->
    <Transition name="modal">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showPasswordModal = false"></div>
          <div class="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-900">Modifier le mot de passe</h3>
              <button @click="showPasswordModal = false" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label for="current-password" class="block text-sm font-medium text-slate-700 mb-2">Mot de passe actuel</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.current"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    id="current-password"
                    class="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  >
                  <button 
                    @click="showCurrentPassword = !showCurrentPassword"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div>
                <label for="new-password" class="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.new"
                    :type="showNewPassword ? 'text' : 'password'"
                    id="new-password"
                    class="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  >
                  <button 
                    @click="showNewPassword = !showNewPassword"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  Min. 8 caractères avec majuscule, chiffre et caractère spécial
                </p>
              </div>
              
              <div>
                <label for="confirm-password" class="block text-sm font-medium text-slate-700 mb-2">Confirmer le mot de passe</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.confirm"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    class="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                  >
                  <button 
                    @click="showConfirmPassword = !showConfirmPassword"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="mt-8 flex gap-3">
              <button 
                @click="showPasswordModal = false"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="changePassword"
                :disabled="changingPassword || passwordForm.current === '' || passwordForm.new === '' || passwordForm.confirm === '' || passwordForm.new !== passwordForm.confirm"
                class="flex-1 px-5 py-3 bg-slate-900 text-white text-sm disabled:cursor-not-allowed disabled:opacity-70 font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/30"
              >
                <span v-if="changingPassword" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Modification...
                </span>
                <span v-else>
                  Modifier
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmation de suppression Address -->
    <Transition name="modal">
      <div v-if="showAddressDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddressDeleteConfirmation = false"></div>
          <div class="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Supprimer cette adresse ?</h3>
              <p class="text-sm text-slate-600 mb-8">
                Cette action est <strong>irréversible</strong>. Vous ne pourrez plus utiliser cette adresse pour vos commandes.
              </p>
            </div>
            
            <div class="flex gap-3">
              <button 
                @click="showAddressDeleteConfirmation = false"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="deleteAddress(addressIdToDelete)"
                :disabled="deletingAddress"
                class="flex-1 px-5 py-3 bg-red-600 text-white text-sm disabled:cursor-not-allowed disabled:bg-red-500 font-medium rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
              >
                <span v-if="deletingAddress" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Suppression...
                </span>
                <span v-else>
                  Supprimer
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmation de suppression -->
    <Transition name="modal">
      <div v-if="showDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteConfirmation = false"></div>
          <div class="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Supprimer votre compte ?</h3>
              <p class="text-sm text-slate-600 mb-8">
                Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement perdues et ne pourront pas être récupérées.
              </p>
            </div>
            
            <div class="flex gap-3">
              <button 
                @click="showDeleteConfirmation = false"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="deleteAccount"
                class="flex-1 px-5 py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal d'édition/ajout d'avatar -->
    <Transition name="modal">
        <div v-if="showAvatarModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen px-4">
            <div
              class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              @click="showAvatarModal = false"
            ></div>

            <div class="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <UserCircle class="w-6 h-6 text-blue-600" />
                  Modifier l'avatar
                </h3>

                <button
                  @click="showAvatarModal = false"
                  class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X class="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <!-- Body -->
              <div class="mb-6">
                <label
                  for="avatar"
                  class="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"
                >
                  <ImageIcon class="w-4 h-4 text-slate-500" />
                  Sélectionnez une nouvelle image
                </label>

                <div
                  class="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  @click="openFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    id="avatar"
                    accept="image/*"
                    @change="handleAvatarChange"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div v-if="!previewAvatar" class="flex flex-col items-center gap-3">
                    <Upload class="w-8 h-8 text-slate-500" />
                    <p class="text-sm text-slate-600">
                      Glissez ou cliquez pour importer une image
                    </p>
                  </div>
                  <div v-else class="flex flex-col items-center gap-3">
                    <img
                      :src="previewAvatar"
                      alt="Aperçu"
                      class="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
                    />
                    <p class="text-sm text-slate-600">Image sélectionnée</p>
                  </div>
                </div>
                <p class="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <Info class="w-4 h-4 text-blue-500" />
                  Formats acceptés : JPG, JPEG, PNG · Taille max : 2 Mo · Dimensions : entre 100×100 et 2000×2000 px
                </p>
              </div>

              <!-- Footer -->
              <div class="flex gap-3">
                <button
                  @click="showAvatarModal = false"
                  class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle class="w-4 h-4" />
                  Annuler
                </button>

                <button
                  @click="updateAvatar"
                  :disabled="newAvatarFile === null || isLoading"
                  class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="isLoading" class="animate-spin h-4 w-4" />
                  <Save v-else class="w-4 h-4" />
                  {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
    </Transition>

    <!-- Modal de confirmation pour Email -->
    <Transition name="modal">
      <div v-if="showEmailConfirmModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showEmailConfirmModal = false"></div>
          <div class="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-900">Confirmer la modification de l'email</h3>
              <button @click="showEmailConfirmModal = false" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X class="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div class="mb-6">
              <p class="text-sm text-slate-600 mb-4">
                Pour modifier votre adresse email, veuillez confirmer avec votre mot de passe actuel.
              </p>
              <label for="email-confirm-password" class="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                id="email-confirm-password"
                class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                placeholder="Votre mot de passe"
                @keyup.enter="confirmEmailUpdate"
              />
            </div>

            <p class="px-4 py-1 my-2 rounded-lg italic text-red-800 bg-red-300">{{ emailError }}</p>
            
            <div class="flex gap-3">
              <button 
                @click="showEmailConfirmModal = false; emailError = null"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="confirmEmailUpdate"
                :disabled="!confirmPassword || isUpdatingUserData.email"
                class="flex-1 px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUpdatingUserData.email" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  En cours...
                </span>
                <span v-else>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de vérification d'email -->
    <Transition name="modal">
      <div v-if="emailUpdateStep === 'verification'" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="cancelEmailUpdate"></div>
          <div class="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-900">Vérifiez votre nouvel email</h3>
              <button @click="cancelEmailUpdate" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X class="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div class="mb-6">
              <p class="text-sm text-slate-600 mb-4">
                Nous avons envoyé un code de vérification à 6 chiffres à :
                <strong class="text-slate-900">{{ editableUser.email }}</strong>
              </p>
              
              <label for="verification-code" class="block text-sm font-medium text-slate-700 mb-2">
                Code de vérification
              </label>
              <input
                v-model="emailVerificationCode"
                type="text"
                id="verification-code"
                maxlength="6"
                class="w-full px-4 py-3 text-center text-lg font-mono bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                placeholder="000000"
                @input="emailVerificationCode = emailVerificationCode.replace(/[^0-9]/g, '')"
              />
              
              <div class="mt-4 text-center">
                <button
                  @click="resendVerificationCode"
                  :disabled="countdown > 0 || isSendingVerification"
                  class="text-sm text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <span v-if="isSendingVerification">Envoi en cours...</span>
                  <span v-else-if="countdown > 0">
                    Renvoyer le code ({{ countdown }}s)
                  </span>
                  <span v-else>Renvoyer le code</span>
                </button>
              </div>
            </div>

            <p v-if="emailError" class="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {{ emailError }}
            </p>
            
            <div class="flex gap-3">
              <button 
                @click="cancelEmailUpdate"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="verifyEmailCode"
                :disabled="!emailVerificationCode || emailVerificationCode.length !== 6 || isUpdatingUserData.email"
                class="flex-1 px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUpdatingUserData.email" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Vérification...
                </span>
                <span v-else>Vérifier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmation pour Phone -->
    <Transition name="modal">
      <div v-if="showPhoneConfirmModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showPhoneConfirmModal = false"></div>
          <div class="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-slate-900">Confirmer la modification du téléphone</h3>
              <button @click="showPhoneConfirmModal = false" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X class="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div class="mb-6">
              <p class="text-sm text-slate-600 mb-4">
                Pour modifier votre numéro de téléphone, veuillez confirmer avec votre mot de passe actuel.
              </p>
              <label for="phone-confirm-password" class="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                id="phone-confirm-password"
                class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:bg-white outline-none transition-all"
                placeholder="Votre mot de passe"
                @keyup.enter="confirmPhoneUpdate"
              />
            </div>
            
            <div class="flex gap-3">
              <button 
                @click="showPhoneConfirmModal = false"
                class="flex-1 px-5 py-3 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                @click="confirmPhoneUpdate"
                :disabled="!confirmPassword || isUpdatingUserData.phone"
                class="flex-1 px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUpdatingUserData.phone" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  En cours...
                </span>
                <span v-else>Confirmer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { formatDate, formatRelativeTime } from '@/utils/dateUtils'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import {
  X,
  XCircle,
  Save,
  Upload,
  Loader2,
  UserCircle,
  Info,
  Image as ImageIcon
} from 'lucide-vue-next'

const $toast = useToast()
const authStore = useAuthStore()
const uiStore = useUIStore()
const userStore = useUserStore()

// États d'erreur et succès
const emailError = ref(null)
const phoneError = ref(null)
const birth_dateError = ref(null)
const successFeedback = ref({})

const addresses = ref([])
const addressesLoading = ref(false)
const addressesError = ref(null)
const countries = ref([])

// États des modales
const showAddressModal = ref(false)
const showPasswordModal = ref(false)
const showTwoFAModal = ref(false)
const showDeleteConfirmation = ref(false)
const showAddressDeleteConfirmation = ref(false)

const isUpdatingUserData = ref({})

const showAvatarModal = ref(false)
const newAvatarFile = ref(null)

// États d'édition
const editModes = reactive({
  info: false,
  name: false,
  email: false,
  phone: false,
  bio: false,
  avatar_url: false,
  gender: false,
  birth_date: false
})

const showConfirmModal = ref(false)
// Dans votre script
const passwordInput = ref(null)
const confirmEditPassword = ref('')

// Données éditables
const editableUser = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  bio: authStore.user?.bio || '',
  avatar_url: authStore.user?.avatar_url || '',
  gender: authStore.user?.gender || '',
  birth_date: authStore.user?.birth_date || '',
  phone: authStore.user?.phone || ''
})

// Formulaire mot de passe
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// États adresses
const editingAddress = ref(null)
const savingAddress = ref(false)
const editUserError = ref(null)

const editableAddress = reactive({
  id: null,
  type: 'home',
  street_line: '',
  city: '',
  state_province: '',
  postal_code: '',
  country_code: 'BJ',
  is_default: false,
  landmark: '',
  phone: ''
})

// États
const copySuccess = ref(false)
const copyTimeout = ref(null)

// Méthodes
const copyReferralCode = async () => {
  if (!authStore.user?.referral_code) return
  
  try {
    await navigator.clipboard.writeText(authStore.user.referral_code)
    copySuccess.value = true
    
    // Réinitialiser après 2 secondes
    if (copyTimeout.value) clearTimeout(copyTimeout.value)
    copyTimeout.value = setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    // Fallback pour les anciens navigateurs
    const textArea = document.createElement('textarea')
    textArea.value = authStore.user.referral_code
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    copySuccess.value = true
    if (copyTimeout.value) clearTimeout(copyTimeout.value)
    copyTimeout.value = setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

const shareReferralCode = async () => {
  if (!authStore.user?.referral_code) return
  
  const shareData = {
    title: 'Rejoignez-moi !',
    text: `Utilisez mon code de parrainage : ${authStore.user.referral_code}`,
    url: window.location.origin
  }
  
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await copyReferralCode()
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      await copyReferralCode()
    }
  }
}

const shareOnSocial = (platform) => {
  if (!authStore.user?.referral_code) return
  
  const text = `Rejoignez-moi ! Utilisez mon code de parrainage : ${authStore.user.referral_code}`
  const url = window.location.origin
  
  switch (platform) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
      break
    case 'email':
      window.open(`mailto:?subject=Code de parrainage&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
      break
  }
}

// Dans votre composant AccountPage.vue

// États pour la gestion email
const emailUpdateStep = ref('initial') // 'initial', 'confirm', 'verification'
const emailVerificationCode = ref('')
const isSendingVerification = ref(false)
const countdown = ref(0)
const countdownInterval = ref(null)

// Méthodes pour la mise à jour d'email
const initiateEmailUpdate = () => {
  // Validation basique de l'email
  if (!editableUser.email || !isValidEmail(editableUser.email)) {
    emailError.value = 'Veuillez entrer une adresse email valide'
    return
  }

  // Vérifier si l'email a changé
  if (editableUser.email === authStore.user?.email) {
    emailError.value = 'Veuillez fournir une nouvelle adresse email différente de l\'actuelle'
    return
  }

  // Vérifier la disponibilité de l'email
  checkEmailAvailability()
}

const checkEmailAvailability = async () => {
  isUpdatingUserData.value.email = true
  emailError.value = null

  try {
    const response = await userStore.emailAvailable(editableUser.email)
    
    if (response.available) {
      // Email disponible, passer à l'étape de confirmation
      currentEditingField.value = 'email'
      confirmPassword.value = ''
      showEmailConfirmModal.value = true
    } else {
      emailError.value = 'Cette adresse email est déjà utilisée'
    }
  } catch (error) {
    console.error('Erreur vérification email:', error)
    emailError.value = 'Erreur lors de la vérification de l\'email'
  } finally {
    isUpdatingUserData.value.email = false
  }
}

const confirmEmailUpdate = async () => {
  if (!confirmPassword.value) {
    emailError.value = 'Veuillez confirmer avec votre mot de passe'
    return
  }

  isUpdatingUserData.value.email = true
  emailError.value = null
  
  try {
    // Étape 1: Vérifier le mot de passe et initier le changement
    const response = await userStore.updateEmail(editableUser.email, confirmPassword.value)
    
    if (response.requires_verification) {
      // Passer à l'étape de vérification
      emailUpdateStep.value = 'verification'
      showEmailConfirmModal.value = false
      startCountdown()
      
      // Afficher un message informatif
      successFeedback.value.email = `Un code de vérification a été envoyé à ${editableUser.email}`
    } else {
      // Mise à jour directe (cas rare)
      await completeEmailUpdate()
    }
    
  } catch (error) {
    console.error('Erreur confirmation email:', error)
    handleEmailError(error)
  } finally {
    isUpdatingUserData.value.email = false
  }
}

const verifyEmailCode = async () => {
  if (!emailVerificationCode.value || emailVerificationCode.value.length !== 6) {
    emailError.value = 'Veuillez entrer le code de vérification à 6 chiffres'
    return
  }

  isUpdatingUserData.value.email = true
  
  try {
    // Vérifier le code avec l'API
    const response = await userStore.verifyEmailCode(
      editableUser.email, 
      emailVerificationCode.value
    )
    
    if (response.verified) {
      await completeEmailUpdate()
    } else {
      emailError.value = 'Code de vérification incorrect'
    }
    
  } catch (error) {
    console.error('Erreur vérification code:', error)
    emailError.value = 'Erreur lors de la vérification du code'
  } finally {
    isUpdatingUserData.value.email = false
  }
}

const completeEmailUpdate = async () => {
  try {
    // Finaliser la mise à jour
    await authStore.fetchUser()
    
    // Réinitialiser tous les états
    resetEmailUpdateFlow()
    
    // Afficher le succès
    successFeedback.value.email = 'Email mis à jour avec succès !'
    setTimeout(() => {
      successFeedback.value.email = null
    }, 5000)
    
  } catch (error) {
    console.error('Erreur finalisation email:', error)
    emailError.value = 'Erreur lors de la mise à jour de l\'email'
  }
}

const resendVerificationCode = async () => {
  if (countdown.value > 0) return
  
  isSendingVerification.value = true
  
  try {
    await userStore.resendEmailVerification(editableUser.email)
    startCountdown()
    successFeedback.value.email = 'Nouveau code envoyé !'
  } catch (error) {
    console.error('Erreur renvoi code:', error)
    emailError.value = 'Erreur lors de l\'envoi du code'
  } finally {
    isSendingVerification.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60 // 60 secondes
  countdownInterval.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval.value)
    }
  }, 1000)
}

const resetEmailUpdateFlow = () => {
  emailUpdateStep.value = 'initial'
  emailVerificationCode.value = ''
  confirmPassword.value = ''
  showEmailConfirmModal.value = false
  editModes.email = false
  
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
  countdown.value = 0
}

const cancelEmailUpdate = () => {
  resetEmailUpdateFlow()
  // Restaurer l'email original
  editableUser.email = authStore.user?.email || ''
  emailError.value = null
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleEmailError = (error) => {
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors
    if (errors.email) {
      emailError.value = Array.isArray(errors.email) ? errors.email[0] : errors.email
    } else if (errors.password) {
      emailError.value = 'Mot de passe incorrect'
    } else {
      emailError.value = error.response.data.message || 'Erreur lors de la mise à jour'
    }
  } else {
    emailError.value = 'Erreur lors de la mise à jour de l\'email'
  }
}

const getCountryName = (code) => {
  const country = countries.value.find(c => c.code === code)
  return country ? country.name : code
}

const loadAddresses = async () => {
  addressesLoading.value = true
  addressesError.value = null
  
  try {
    const response = await userStore.fetchAddresses()
    addresses.value = response.addresses || []
  } catch (error) {
    addressesError.value = 'Erreur lors du chargement des adresses'
    console.error('Erreur loadAddresses:', error)
  } finally {
    addressesLoading.value = false
  }
}

const previewAvatar = ref(null)
const fileInput = ref(null)

const openFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    newAvatarFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatar.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const formattedBirthDate = computed({
  get: () => {
    if (!editableUser.birth_date) return ''
    // Convertir le format ISO en YYYY-MM-DD pour l'input date
    return editableUser.birth_date.split('T')[0]
  },
  set: (value) => {
    // Convertir YYYY-MM-DD en format ISO pour l'API
    editableUser.birth_date = value ? value + 'T00:00:00.000Z' : null
  }
})

const isLoading = ref(false)

const addAddress = () => {
  editingAddress.value = null
  resetEditableAddress()
  editableAddress.is_default = authStore.user?.addresses?.length === 0
  showAddressModal.value = true
}

const editAddress = (address) => {
  editingAddress.value = address
  Object.assign(editableAddress, { ...address })
  showAddressModal.value = true
}

let addressIdToDelete = null
const deletingAddress = ref(false)

const confirmDeleteAddress = (address) => {
  addressIdToDelete = address.id
  showAddressDeleteConfirmation.value = true
}

const deleteAddress = async () => {
  try {
    deletingAddress.value = true
    await userStore.deleteAddress(addressIdToDelete)
    // Recharger les données utilisateur après suppression
    await authStore.fetchUser()
  } catch (error) {
    console.error('Erreur suppression adresse:', error)
    alert('Erreur lors de la suppression de l\'adresse')
  } finally {
    deletingAddress.value = false
    showAddressDeleteConfirmation.value = false
    addressIdToDelete = null
  }
}

const changingDefaultAddress = ref(false)

const setDefaultAddress = async (addressId) => {
  try {
    changingDefaultAddress.value = true
    const re = await userStore.setAddressAsDefault(addressId)
    if (re && authStore.user?.addresses) {
      // Mettre à jour l'adresse par défaut dans l'authStore
      authStore.user.addresses = authStore.user.addresses.map(address => ({
        ...address,
        is_default: address.id === addressId
      }))
    }
  } catch (error) {
    console.error('Erreur définition adresse par défaut:', error)
    alert('Erreur lors de la définition de l\'adresse par défaut')
  } finally {
    changingDefaultAddress.value = false
  }
}

const saveAddress = async () => {
  savingAddress.value = true
  
  try {
    if (editingAddress.value) {
      await userStore.updateAddress(editableAddress.id, editableAddress)
    } else {
      await userStore.newAddress(editableAddress)
    }
    
    // Recharger les données utilisateur après mise à jour
    await authStore.fetchUser()
    showAddressModal.value = false
    resetEditableAddress()
  } catch (error) {
    console.error('Erreur sauvegarde adresse:', error)
    alert('Erreur lors de la sauvegarde de l\'adresse')
  } finally {
    savingAddress.value = false
  }
}

const resetEditableAddress = () => {
  Object.assign(editableAddress, {
    id: null,
    type: 'home',
    street_line: '',
    city: '',
    state_province: '',
    postal_code: '',
    country_code: 'BJ',
    is_default: false,
    landmark: '',
    phone: ''
  })
  editingAddress.value = null
}

const changingPassword = ref(false)

const changePassword = async () => {
  try {
    changingPassword.value = true
    
    await userStore.updatePassword({
      current_password: passwordForm.current,
      new_password: passwordForm.new,
      new_password_confirmation: passwordForm.confirm
    })

    alert('Mot de passe modifié avec succès')
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    showPasswordModal.value = false
  } catch (error) {
    console.error('Erreur modification mot de passe:', error)
    alert('Erreur lors de la modification du mot de passe')
  } finally {
    changingPassword.value = false
  }
}

const deleteAccount = () => {
  console.log('Compte supprimé')
  showDeleteConfirmation.value = false
  userStore.deleteAccount()
}

// États pour les modales de confirmation
const showEmailConfirmModal = ref(false)
const showPhoneConfirmModal = ref(false)

// Champs pour la confirmation
const confirmPassword = ref('')
const currentEditingField = ref('') // 'email' ou 'phone'

// Méthodes pour initier les mises à jour avec confirmation
const initiatePhoneUpdate = () => {
  // Vérifier d'abord si le téléphone a changé
  if (editableUser.phone === authStore.user?.phone) {
    phoneError.value = 'Veuillez modifier le téléphone avant de confirmer'
    return
  }
  
  currentEditingField.value = 'phone'
  confirmPassword.value = ''
  phoneError.value = null // Réinitialiser les erreurs
  showPhoneConfirmModal.value = true
}

// Mise à jour des informations personnelles (nom, genre, bio)
const updatePersonalInfo = async () => {
  const fieldsToUpdate = {}
  
  if (editModes.name) fieldsToUpdate.name = editableUser.name
  if (editModes.gender) fieldsToUpdate.gender = editableUser.gender
  if (editModes.bio) fieldsToUpdate.bio = editableUser.bio

  if (Object.keys(fieldsToUpdate).length === 0) return

  isUpdatingUserData.value.name = true
  isUpdatingUserData.value.gender = true
  isUpdatingUserData.value.bio = true

  try {
    await userStore.updateProfile(fieldsToUpdate)
    await authStore.fetchUser()
    
    // Réinitialiser les modes d'édition
    if (editModes.name) editModes.name = false
    if (editModes.gender) editModes.gender = false
    if (editModes.bio) editModes.bio = false
    
    successFeedback.value.personal = 'Informations mises à jour avec succès !'
    setTimeout(() => {
      successFeedback.value.personal = null
    }, 3000)
  } catch (error) {
    console.error('Erreur mise à jour informations personnelles:', error)
    // Gérer les erreurs spécifiques
  } finally {
    isUpdatingUserData.value.name = false
    isUpdatingUserData.value.gender = false
    isUpdatingUserData.value.bio = false
  }
}

// Mise à jour du téléphone avec confirmation
const confirmPhoneUpdate = async () => {
  if (!confirmPassword.value) {
    phoneError.value = 'Veuillez confirmer avec votre mot de passe'
    return
  }

  // Vérifier si le téléphone a vraiment changé
  if (editableUser.phone === authStore.user?.phone) {
    phoneError.value = 'Veuillez fournir un nouveau numéro de téléphone différent de l\'actuel'
    return
  }

  isUpdatingUserData.value.phone = true
  phoneError.value = null // Réinitialiser l'erreur
  
  try {
    await userStore.updatePhone(editableUser.phone, confirmPassword.value)
    await authStore.fetchUser()
    
    editModes.phone = false
    showPhoneConfirmModal.value = false
    confirmPassword.value = ''
    
    successFeedback.value.phone = 'Téléphone mis à jour avec succès !'
    setTimeout(() => {
      successFeedback.value.phone = null
    }, 3000)
  } catch (error) {
    console.error('Erreur mise à jour téléphone:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (errors.phone) {
        phoneError.value = Array.isArray(errors.phone) ? errors.phone[0] : errors.phone
      } else if (errors.password) {
        phoneError.value = Array.isArray(errors.password) ? errors.password[0] : errors.password
      } else {
        phoneError.value = error.response.data.message || 'Erreur lors de la mise à jour'
      }
    } else {
      phoneError.value = 'Erreur lors de la mise à jour du téléphone'
    }
  } finally {
    isUpdatingUserData.value.phone = false
  }
}

// Mise à jour de la date de naissance (séparée)
const updateBirthDate = async () => {
  isUpdatingUserData.value.birth_date = true
  try {
    await userStore.updateProfile({ birth_date: editableUser.birth_date })
    await authStore.fetchUser()
    
    editModes.birth_date = false
    successFeedback.value.birth_date = 'Date de naissance mise à jour avec succès !'
    setTimeout(() => {
      successFeedback.value.birth_date = null
    }, 3000)
  } catch (error) {
    console.error('Erreur mise à jour date de naissance:', error)
    if (error.response?.data?.errors) {
      birth_dateError.value = error.response.data.errors.birth_date?.[0] || 'Erreur lors de la mise à jour'
    }
  } finally {
    isUpdatingUserData.value.birth_date = false
  }
}

// Mise à jour de l'avatar (séparée) - reste inchangée
const updateAvatar = async () => {
  if (!newAvatarFile.value) {
    alert('Aucun fichier sélectionné.')
    return
  }

  const formData = new FormData()
  formData.append('avatar', newAvatarFile.value)

  try {
    isLoading.value = true
    await userStore.updateAvatar(formData)
    await authStore.fetchUser()
    // showAvatarModal.value = false
    newAvatarFile.value = null
    previewAvatar.value = null
    successFeedback.value.avatar = 'Avatar mis à jour avec succès !'
    setTimeout(() => {
      successFeedback.value.avatar = null
    }, 3000)
  } catch (error) {
    console.error('Erreur mise à jour avatar:', error)
    alert('Erreur lors de la mise à jour de l\'avatar')
  } finally {
    isLoading.value = false
    showAvatarModal.value = false
  }
}

// Initialisation
onMounted(async () => {
  await uiStore.getCountries()
  countries.value = [...uiStore.countries]
})

// Watch pour surveiller les changements d'adresses
watch(
  () => authStore.user?.addresses,
  (newAddresses) => {
    console.log('🔄 Adresses mises à jour:', newAddresses)
    
    // Trouver l'adresse par défaut
    const defaultAddress = newAddresses?.find(addr => addr.is_default)
    if (defaultAddress) {
      console.log('📍 Nouvelle adresse par défaut:', defaultAddress)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dot-animation-1 {
  animation-delay: 0.1s;
}
.dot-animation-2 {
  animation-delay: 0.2s;
}
.dot-animation-3 {
  animation-delay: 0.3s;
}
</style>