<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header avec effet de verre -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <div class="flex items-center space-x-3">
            <span v-if="authStore.user?.email_verified_at" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Compte vérifié
            </span>
            <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Vérifiez votre compte par e-mail
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Carte de profil avec ombre portée subtile -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden divide-y divide-gray-200/60">
        <!-- Section Avatar et Info basique -->
        <div class="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <img class="h-20 w-20 rounded-full ring-4 ring-white/80 shadow-md" :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.fullName" alt="Photo de profil">
              <button class="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user.profile.first_name }}</h2>
              <p class="text-gray-600 mt-1">{{ user.bio || 'Utilisateur standard' }}</p>
              <p class="text-sm text-gray-500 mt-1">Membre depuis le {{ formatDate(authStore.user.created_at) || '01 juin 2022' }}</p>
            </div>
          </div>
        </div>

        <!-- Section 1: Informations de base avec édition inline -->
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations personnelles
            </h2>
          </div>
          <div class="mt-6 grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-8">
            <!-- Prénom -->
            <div>
              <label for="first_nameInput" class="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
              <div class="relative flex items-center">
                <!-- Mode édition -->
                <input 
                  v-if="editModes.first_name"
                  id="first_nameInput"
                  v-model="editableUser.first_name"
                  type="text"
                  :class="[
                    'block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border',
                    first_nameError ? 'border-red-500' : successFeedback.first_name ? 'border-green-500' : 'border-gray-300'
                  ]"
                  placeholder="Jean"
                  aria-label="Modifier le prénom"
                  :disabled="isUpdatingUserData.first_name"
                  @keyup.enter="updateUserInfo('first_name')"
                />

                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 flex-1">
                  {{ user.first_name || 'Non renseigné' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.first_name ? updateUserInfo('first_name') : editModes.first_name = true"
                  class="ml-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.first_name,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.first_name
                  }"
                  :disabled="isUpdatingUserData.first_name"
                  aria-label="Modifier le prénom"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.first_name" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.first_name" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="first_nameError" class="mt-1 text-sm text-red-600">
                {{ first_nameError }}
              </p>
            </div>

            <!-- Nom -->
            <div>
              <label for="last_nameInput" class="block text-sm font-medium text-gray-500 mb-1">Nom</label>
              <div class="relative flex items-center">
                <!-- Mode édition -->
                <input 
                  v-if="editModes.last_name"
                  id="last_nameInput"
                  v-model="editableUser.last_name"
                  type="text"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
                  placeholder="Dupont"
                  aria-label="Modifier le nom"
                  :disabled="isUpdatingUserData.last_name"
                  @keyup.enter="updateUserInfo('last_name')"
                >
                
                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 flex-1">
                  {{ user.last_name || 'Non renseigné' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.last_name ? updateUserInfo('last_name') : editModes.last_name = true"
                  class="ml-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.last_name,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.last_name
                  }"
                  :disabled="isUpdatingUserData.last_name"
                  aria-label="Modifier le nom"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.last_name" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.last_name" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="last_nameError" class="mt-1 text-sm text-red-600">
                {{ last_nameError }}
              </p>
            </div>

            <!-- Date de naissance -->
            <div>
              <label for="birth_dateInput" class="block text-sm font-medium text-gray-500 mb-1">Date de naissance</label>
              <div class="relative flex items-center">
                <!-- Mode édition -->
                <input 
                  v-if="editModes.birth_date"
                  id="birth_dateInput"
                  v-model="editableUser.birth_date"
                  type="date"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
                  aria-label="Modifier la date de naissance"
                  :disabled="isUpdatingUserData.birth_date"
                  @keyup.enter="updateUserInfo('birth_date')"
                >
                
                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 flex-1">
                  {{ user.birth_date || 'Non renseignée' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.birth_date ? updateUserInfo('birth_date') : editModes.birth_date = true"
                  class="ml-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.birth_date,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.birth_date
                  }"
                  :disabled="isUpdatingUserData.birth_date"
                  aria-label="Modifier la date de naissance"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.birth_date" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.birth_date" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="birth_dateError" class="mt-1 text-sm text-red-600">
                {{ birth_dateError }}
              </p>
            </div>

            <!-- Genre -->
            <div>
              <label for="genderInput" class="block text-sm font-medium text-gray-500 mb-1">Genre</label>
              <div class="relative flex items-center">
                <!-- Mode édition -->
                <select 
                  v-if="editModes.gender"
                  id="genderInput"
                  v-model="editableUser.gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
                  aria-label="Modifier le genre"
                  :disabled="isUpdatingUserData.gender"
                  @keyup.enter="updateUserInfo('gender')"
                >
                  <option disabled value="">Choisir un genre</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
                
                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 flex-1">
                  {{ user.gender === 'male' ? 'Homme' : user.gender === 'female' ? 'Femme' : 'Non renseigné' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.gender ? updateUserInfo('gender') : editModes.gender = true"
                  class="ml-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.gender,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.gender
                  }"
                  :disabled="isUpdatingUserData.gender"
                  aria-label="Modifier le genre"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.gender" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.gender" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="genderError" class="mt-1 text-sm text-red-600">
                {{ genderError }}
              </p>
            </div>

            <!-- Bio -->
            <div class="sm:col-span-2">
              <label for="bioInput" class="block text-sm font-medium text-gray-500 mb-1">Biographie</label>
              <div class="relative">
                <!-- Mode édition -->
                <textarea 
                  v-if="editModes.bio"
                  id="bioInput"
                  v-model="editableUser.bio"
                  rows="4"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border resize-none"
                  placeholder="Parle-nous un peu de toi..."
                  aria-label="Modifier la biographie"
                  :disabled="isUpdatingUserData.bio"
                  @keyup.enter="updateUserInfo('bio')"
                ></textarea>
                
                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 whitespace-pre-wrap">
                  {{ user.bio || 'Non renseignée' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.bio ? updateUserInfo('bio') : editModes.bio = true"
                  class="absolute top-0 right-0 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.bio,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.bio
                  }"
                  :disabled="isUpdatingUserData.bio"
                  aria-label="Modifier la biographie"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.bio" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.bio" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="bioError" class="mt-1 text-sm text-red-600">
                {{ bioError }}
              </p>
            </div>

            <!-- Téléphone -->
            <div>
              <label for="phoneInput" class="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
              <div class="relative flex items-center">
                <!-- Mode édition -->
                <input 
                  v-if="editModes.phone"
                  id="phoneInput"
                  v-model="editableUser.phone"
                  type="tel"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
                  placeholder="+33 6 12 34 56 78"
                  aria-label="Modifier le téléphone"
                  :disabled="isUpdatingUserData.phone"
                  @keyup.enter="updateUserInfo('phone')"
                >
                
                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 flex-1">
                  {{ user.phone || 'Non renseigné' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.phone ? updateUserInfo('phone') : editModes.phone = true"
                  class="ml-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.phone,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.phone
                  }"
                  :disabled="isUpdatingUserData.phone"
                  aria-label="Modifier le téléphone"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.phone" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.phone" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="phoneError" class="mt-1 text-sm text-red-600">
                {{ phoneError }}
              </p>
            </div>

            <!-- Email -->
            <div>
              <label for="emailInput" class="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <div class="relative flex items-center">
                <!-- Mode édition -->
                <input 
                  v-if="editModes.email"
                  id="emailInput"
                  v-model="editableUser.email"
                  type="email"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
                  placeholder="example@gmail.com"
                  aria-label="Modifier l'email"
                  :disabled="isUpdatingUserData.email"
                  @keyup.enter="updateUserInfo('email')"
                >
                
                <!-- Mode lecture -->
                <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 flex-1">
                  {{ user.email || 'Non renseigné' }}
                </p>

                <!-- Bouton d'action -->
                <button 
                  @click="editModes.email ? updateUserInfo('email') : editModes.email = true"
                  class="ml-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                  :class="{ 
                    'text-blue-600': editModes.email,
                    'cursor-not-allowed opacity-50': isUpdatingUserData.email
                  }"
                  :disabled="isUpdatingUserData.email"
                  aria-label="Modifier l'email"
                >
                  <!-- Icône de chargement -->
                  <svg v-if="isUpdatingUserData.email" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <!-- Icône normale -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="!editModes.email" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                    <path 
                      v-else 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>

              <!-- Message d'erreur -->
              <p v-if="emailError" class="mt-1 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2: Adresses avec cartes interactives -->
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mes adresses
            </h2>
            <button 
              @click="addAddress()"
              class="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter
            </button>
          </div>
          
          <!-- Section pour une seule adresse (affichage plein largeur) -->
          <div v-if="addresses && addresses.length === 1" class="mt-6">
            <div 
              v-for="(address, index) in addresses" 
              :key="index"
              class="border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors relative"
              :class="{ 'ring-2 ring-blue-500 border-blue-500': address.is_default }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center">
                    <h3 class="font-medium text-gray-900">{{ address.type }}</h3>
                    <span 
                      v-if="address.is_default"
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Principale
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ address.address_line }}</p>
                  <p class="text-sm text-gray-600">{{ address.city }}, {{ address.state }}</p>
                  <p class="text-sm text-gray-600">{{ address.country_id }}</p>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="editAddress(index)"
                    class="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="removeAddress(index)"
                    class="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <button 
                v-if="!address.is_default"
                @click="setDefaultAddress(address.id)"
                class="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Définir comme principale
              </button>
            </div>
          </div>

          <!-- Section pour plusieurs adresses (affichage en grille) -->
          <div v-else-if="addresses && addresses.length > 1" class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div 
              v-for="(address, index) in addresses" 
              :key="index"
              class="border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors relative"
              :class="{ 'ring-2 ring-blue-500 border-blue-500': address.is_default }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center">
                    <h3 class="font-medium text-gray-900">{{ address.type }}</h3>
                    <span 
                      v-if="address.is_default"
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Principale
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ address.address_line }}</p>
                  <p class="text-sm text-gray-600">{{ address.city }}, {{ address.state }}</p>
                  <p class="text-sm text-gray-600">{{ address.country_id }}</p>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="editAddress(index)"
                    class="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="removeAddress(index)"
                    class="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <button 
                v-if="!address.is_default"
                @click="setDefaultAddress(address.id)"
                class="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Définir comme principale
              </button>
            </div>
          </div>

          <!-- Section pour aucune adresse -->
          <div v-else class="mt-6 text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune adresse enregistrée</h3>
            <p class="mt-1 text-sm text-gray-500">Ajoutez votre première adresse pour faciliter vos achats.</p>
            <div class="mt-6">
              <button 
                @click="addAddress()"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une adresse
              </button>
            </div>
          </div>
          
          <div v-else class="mt-6 text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune adresse enregistrée</h3>
            <p class="mt-1 text-sm text-gray-500">Ajoutez votre première adresse pour faciliter vos achats.</p>
            <div class="mt-6">
              <button 
                @click="addAddress()"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une adresse
              </button>
            </div>
          </div>
        </div>

        <!-- Section 3: Sécurité du compte avec indicateurs visuels -->
        <div class="px-8 py-6">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Sécurité du compte
          </h2>
          
          <div class="mt-6 space-y-5">
            <!-- Élément Email vérifié -->
            <div class="flex items-start p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">Email vérifié</h3>
                  <span v-if="authStore.user.email_verified_at" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Sécurisé
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Email non vérifié
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Votre adresse email est vérifiée et protégée.
                </p>
              </div>
            </div>
            
            <!-- Élément Mot de passe -->
            <div v-if="!authStore.user?.is_provider" class="flex items-start p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">Mot de passe</h3>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Moyen
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Dernière modification il y a 3 mois. Pour votre sécurité, nous recommandons de le changer régulièrement.
                </p>
                <div class="mt-3">
                  <button 
                    @click="showPasswordModal = true"
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Élément Authentification à deux facteurs -->
            <div class="flex items-start p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">Authentification à deux facteurs</h3>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Non activé
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Ajoutez une couche de sécurité supplémentaire à votre compte.
                </p>
                <div class="mt-3">
                  <button 
                    @click="showTwoFAModal = true"
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Activer la 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Suppression du compte avec confirmation -->
        <div class="px-8 py-6 bg-red-50/70 rounded-b-2xl">
          <h2 class="text-xl font-semibold text-red-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Zone dangereuse
          </h2>
          <p class="mt-2 text-sm text-red-700">
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
            Cette action ne peut pas être annulée.
          </p>
          <div class="mt-4">
            <button 
              @click="showDeleteConfirmation = true"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal d'édition d'adresse -->
    <Transition name="modal">
      <div v-if="showAddressModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click="showAddressModal = false"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-6 py-5 sm:p-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-5">
                {{ editingAddressIndex === null ? 'Ajouter une adresse' : 'Modifier une adresse' }}
              </h3>
              
              <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div class="sm:col-span-2">
                  <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                  <select 
                    v-model="editableAddress.type"
                    id="type"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  >
                    <option value="Domicile">Domicile</option>
                    <option value="Bureau">Bureau</option>
                  </select>
                </div>
                
                <div class="sm:col-span-2">
                  <label for="address_line" class="block text-sm font-medium text-gray-700">Adresse</label>
                  <input 
                    v-model="editableAddress.address_line"
                    type="text"
                    id="address_line"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    placeholder="123 Rue de l'Exemple"
                  >
                </div>
                
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                  <input 
                    v-model="editableAddress.city"
                    type="text"
                    id="city"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    placeholder="Paris"
                  >
                </div>
                
                <div>
                  <label for="postalCode" class="block text-sm font-medium text-gray-700">Etat</label>
                  <input 
                    v-model="editableAddress.state"
                    type="text"
                    id="postalCode"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    placeholder="75000"
                  >
                </div>
                
                <div class="sm:col-span-2">
                  <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
                  <select 
                    v-model="editableAddress.country_id"
                    id="country_id"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  >
                    <option v-for="(country, index) in countries" :key="index" :value="country.id">{{ country?.name }}</option>
                  </select>
                </div>
                
                <div class="sm:col-span-2">
                  <div class="flex items-center">
                    <input 
                      v-model="editableAddress.is_default"
                      id="default-address"
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <label for="default-address" class="ml-2 block text-sm text-gray-700">
                      Définir comme adresse principale
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end space-x-3">
                <button 
                  @click="showAddressModal = false"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button 
                  @click="saveAddress"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de changement de mot de passe -->
    <Transition name="modal">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click="showPasswordModal = false"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-6 py-5 sm:p-6">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-5">
                Changer le mot de passe
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label for="current-password" class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input 
                      v-model="passwordForm.current"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      id="current-password"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border pr-10"
                    >
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button 
                        @click="showCurrentPassword = !showCurrentPassword"
                        type="button"
                        class="text-gray-500 hover:text-gray-700"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="!showCurrentPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input 
                      v-model="passwordForm.new"
                      :type="showNewPassword ? 'text' : 'password'"
                      id="new-password"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border pr-10"
                    >
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button 
                        @click="showNewPassword = !showNewPassword"
                        type="button"
                        class="text-gray-500 hover:text-gray-700"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial.
                  </p>
                </div>
                
                <div>
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input 
                      v-model="passwordForm.confirm"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirm-password"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border pr-10"
                    >
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button 
                        @click="showConfirmPassword = !showConfirmPassword"
                        type="button"
                        class="text-gray-500 hover:text-gray-700"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end space-x-3">
                <button 
                  @click="showPasswordModal = false"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button 
                  @click="changePassword"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmation de suppression -->
    <Transition name="modal">
      <div v-if="showDeleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75" @click="showDeleteConfirmation = false"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Supprimer votre compte ?</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action ne peut être annulée. Toutes vos données seront perdues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                @click="deleteAccount"
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Supprimer définitivement
              </button>
              <button 
                @click="showDeleteConfirmation = false"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Annuler
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
import { formatDate } from '@/utils/dateUtils'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const uiStore = useUIStore()
const userStore = useUserStore()

const first_nameError = ref(null);
const last_nameError = ref(null);
const emailError = ref(null);
const phoneError = ref(null);
const genderError = ref(null);
const bioError = ref(null);
const birth_dateError = ref(null);
const successFeedback = ref({}); // { first_name: true/false }


// Données utilisateur
const user = reactive({
  first_name: authStore.user.profile.first_name,
  last_name: authStore.user.profile.last_name,
  fullName: authStore.fullName,
  email: authStore.user.email,
  phone: authStore.user.profile.phone,
  avatar: authStore.user.profile.avatar,
  gender: authStore.user.profile.gender,
  birth_date: authStore.user.profile.birth_date,
  email_verified_at: authStore.user.email_verified_at,
  bio: authStore.user.profile.bio,
  created_at: authStore.user.created_at,
  addresses: computed(() => addresses.value)
})

const countries = ref([])
const addresses = ref([])

// États pour les modales
const showAddressModal = ref(false)
const showPasswordModal = ref(false)
const showTwoFAModal = ref(false)
const showDeleteConfirmation = ref(false)

const isUpdatingUserData = ref({})

// États pour l'édition
const editModes = reactive({
  info: false,
  first_name: false,
  last_name: false,
  email: false,
  phone: false,
  bio: false,
  avatar: false,
  gender: false,
  birth_date: false
})

const editableUser = reactive({
  first_name: authStore.user.profile.first_name,
  last_name: authStore.user.profile.last_name,
  email: authStore.user.email,
  bio: authStore.user.profile.bio,
  avatar: authStore.user.profile.avatar,
  gender: authStore.user.profile.gender,
  birth_date: authStore.user.profile.birth_date,
  phone: authStore.user.profile.phone
})

// États pour les mots de passe
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// États pour l'adresse en cours d'édition
const editingAddressIndex = ref(null)
const editableAddress = reactive({
  id: null,
  type: 'Domicile',
  address_line: '',
  city: '',
  state: '',
  country_id: 4,
  is_default: false
})

const editUserError = ref(null)

// Méthodes
const toggleEditMode = (field) => {
  if (field === 'info') {
    editModes.info = !editModes.info
    if (editModes.info) {
      editableUser.first_name = user.first_name
      editableUser.last_name = user.last_name
      editableUser.email = user.email
      editableUser.phone = user.phone
      editableUser.bio = user.bio
      editableUser.avatar = user.avatar
      editableUser.gender = user.gender
      editableUser.birth_date = user.birth_date
    }
  } else {
    editModes[field] = !editModes[field]
    if (editModes[field]) {
      editableUser[field] = user[field]
    } else {
      // Sauvegarder si on avait fait des modifications
      if (editableUser[field] !== user[field]) {
        user[field] = editableUser[field]
      }
    }
  }
}


const updateUserInfo = async (field) => {
  isUpdatingUserData.value[field] = true;
  editUserError.value = null;

  if (!editableUser || !editableUser[field]?.trim()) {
    editUserError.value = `${field} is required`;
    isUpdatingUserData.value[field] = false;
    return;
  }

  try {
    await userStore.updateProfile({ [field]: editableUser[field] });

    if (!user) Object.assign(user, {});
    user[field] = editableUser[field];
    editModes[field] = false;
    editUserError.value = null;

    // ✅ Ajoute succès visuel pendant 500ms
    successFeedback.value[field] = true;
    setTimeout(() => {
      successFeedback.value[field] = false;
    }, 500);

  } catch (error) {
    editUserError.value = userStore.error;
    editModes[field] = true;
  } finally {
    isUpdatingUserData.value[field] = false;
  }
};


// Helper pour obtenir les libellés des champs
const getFieldLabel = (field) => {
  const labels = {
    first_name: 'du prénom',
    last_name: 'du nom',
    email: 'de l\'email',
    phone: 'du numéro de téléphone',
    birth_date: 'de la date de naissance',
    gender: 'du genre',
    bio: 'de la biographie'
  }
  return labels[field] || field
}

const cancelEdit = (field) => {
  editModes[field] = false
}

const addAddress = () => {
  editingAddressIndex.value = null
  resetEditableAddress()
  showAddressModal.value = true
}

const editAddress = (index) => {
  editingAddressIndex.value = index
  Object.assign(editableAddress, user.addresses[index])
  showAddressModal.value = true
}

const removeAddress = (index) => {
  if (user.addresses[index].is_default && user.addresses.length > 1) {
    // Trouver une autre adresse à définir comme principale
    const otherIndex = index === 0 ? 1 : 0
    user.addresses[otherIndex].is_default = true
  }
  user.addresses.splice(index, 1)
}

const setDefaultAddress = (id) => {
  // Assure-toi que addresses.value est un tableau
  addresses.value.forEach(addr => {
    addr.is_default = (addr.id === id)
  })

  userStore.updateAddressDefault(id)
}

const saveAddress = () => {
  if (editableAddress.is_default) {
    user.addresses.forEach(addr => addr.is_default = false)
  }
  
  if (editingAddressIndex.value === null) {
    // Nouvelle adresse
    user.addresses.push({ ...editableAddress })
    const response = userStore.updateAddress(true, editableAddress)
  } else {
    // Mise à jour d'une adresse existante
    Object.assign(user.addresses[editingAddressIndex.value], editableAddress)
  }
  
  showAddressModal.value = false
}

const resetEditableAddress = () => {
  editableAddress.type = 'Domicile'
  editableAddress.address_line = ''
  editableAddress.city = ''
  editableAddress.state = ''
  editableAddress.country_id = 4
  editableAddress.is_default = user.addresses.length === 0
}

const changePassword = () => {
  console.log('Changement de mot de passe:', passwordForm)
  // Implémentez la logique de changement de mot de passe
  showPasswordModal.value = false
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

const deleteAccount = () => {
  console.log('Compte supprimé')
  showDeleteConfirmation.value = false
  // Implémentez la suppression du compte
  userStore.deleteAccount()
}

onMounted(async () => {
  await uiStore.getCountries()
  addresses.value = authStore.user.addresses
  console.log('addresses', authStore.user.addresses)
  countries.value = [...uiStore.countries] // Crée une nouvelle référence
})

watch(
  () => authStore.user.addresses,
  (newAddresses) => {
    addresses.value = newAddresses || []
  },
  { deep: true }
)
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>