<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
    <!-- Section illustration -->
    <div class="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center p-12">
        <img 
          src="@/assets/images/logo-black.png" 
          alt="Logo Bylin" 
          class="w-full max-w-md object-contain filter drop-shadow-xl"
        >
      </div>
      
      <!-- Produits flottants -->
      <div 
        v-for="(product, index) in floatingProducts" 
        :key="index" 
        class="absolute w-20 h-20 rounded-xl bg-cover bg-center shadow-lg border-2 border-white animate-float"
        :style="{
          backgroundImage: `url(${product.image})`,
          ...getProductPosition(index)
        }"
      ></div>
    </div>

    <!-- Section formulaire -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-12">
      <div class="w-full max-w-md space-y-8">
        <!-- Bouton Retour mobile -->
        <button 
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4 group"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
          <span class="text-sm font-medium">Retour</span>
        </button>

        <div class="text-center">
          <router-link to="/" class="inline-block mb-6 transition-transform hover:scale-105">
            <img 
              src="@/assets/images/logo-black.png" 
              alt="Logo Bylin" 
              class="h-24 mx-auto"
            >
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900">Rejoignez notre communauté</h1>
          <p class="mt-2 text-gray-600">Créez un compte pour bénéficier de nos offres exclusives</p>
        </div>

        <div class="mt-8 space-y-6">
          <!-- Boutons sociaux (uniquement à l'étape 1) -->
          <div v-if="currentStep === 1" class="space-y-3">
            <button 
              @click="loginWithGoogle"
              :disabled="socialLoading"
              class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <GoogleIcon class="w-5 h-5" />
              <span v-if="!socialLoading">Continuer avec Google</span>
              <svg 
                v-else 
                class="animate-spin h-5 w-5 text-gray-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>

          <div v-if="currentStep === 1" class="relative flex items-center my-6">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink mx-4 text-gray-500 text-sm">OU</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Étape 1: Choix du mode de contact -->
            <div v-if="currentStep === 1" class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 text-center mb-6">
                Comment souhaitez-vous être contacté ?
              </h3>
              
              <!-- Choix Email ou Téléphone -->
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="selectContactMethod('email')"
                  class="p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center hover:shadow-md"
                  :class="contactMethod === 'email' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="font-medium">Email</span>
                </button>
                
                <button
                  type="button"
                  @click="selectContactMethod('phone')"
                  class="p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-center hover:shadow-md"
                  :class="contactMethod === 'phone' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="font-medium">Téléphone</span>
                </button>
              </div>

              <!-- Champ email ou téléphone selon le choix -->
              <div v-if="contactMethod" class="relative mt-6">
                <input
                  v-if="contactMethod === 'email'"
                  type="email"
                  id="contact-field"
                  v-model="form.email"
                  required
                  autocomplete="email"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                />
                <input
                  v-else
                  type="tel"
                  id="contact-field"
                  v-model="form.phone"
                  required
                  autocomplete="tel"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                />
                <label 
                  for="contact-field" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  {{ contactMethod === 'email' ? 'Adresse email' : 'Numéro de téléphone' }}
                </label>
              </div>

              <button 
                v-if="contactMethod && (form.email || form.phone)"
                type="button"
                @click="nextStep(currentStep)"
                class="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:scale-[0.98]"
                :disabled="is_loading"
              >
                <template v-if="is_loading">
                  <svg 
                    class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>En cours</span>
                </template>
                <span v-else>Continuer</span>
              </button>
            </div>

            <!-- Étape 2: Informations complètes -->
            <div v-if="currentStep === 2" class="space-y-4">
              <!-- Bouton retour -->
              <button 
                type="button"
                @click="previousStep(currentStep)"
                class="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4 group"
              >
                <ArrowLeftIcon class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                <span class="text-sm">Modifier le contact</span>
              </button>

              <!-- Nom -->
              <div class="relative">
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  autocomplete="name"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                />
                <label 
                  for="name" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Nom complet
                </label>
              </div>

              <!-- Affichage du contact choisi (lecture seule) -->
              <div class="relative">
                <input
                  :type="contactMethod === 'email' ? 'email' : 'tel'"
                  :value="contactMethod === 'email' ? form.email : form.phone"
                  readonly
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                />
                <label class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500">
                  {{ contactMethod === 'email' ? 'Email' : 'Téléphone' }}
                </label>
              </div>

              <!-- Si téléphone choisi, ajouter un champ email optionnel -->
              <div v-if="contactMethod === 'phone'" class="relative">
                <input
                  type="email"
                  id="email-optional"
                  v-model="form.email"
                  autocomplete="email"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                />
                <label 
                  for="email-optional" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Email (optionnel)
                </label>
              </div>

              <!-- Mot de passe -->
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  required
                  autocomplete="new-password"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                  @input="calculatePasswordStrength"
                />
                <label 
                  for="password" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Mot de passe
                </label>
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeOffIcon v-else class="w-5 h-5" />
                </button>
              </div>

              <!-- Confirmation mot de passe -->
              <div class="relative mt-4">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  required
                  autocomplete="new-password"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-transparent peer"
                  placeholder=" "
                  @input="checkPasswordMatch"
                />
                <label 
                  for="password_confirmation" 
                  class="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
                >
                  Confirmer le mot de passe
                </label>
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOffIcon v-else class="w-5 h-5" />
                </button>

                <!-- Indicateur de correspondance -->
                <div 
                  v-if="form.password_confirmation.length > 0"
                  class="absolute -bottom-5 right-0 flex items-center"
                  :class="{
                    'text-green-500': passwordsMatch,
                    'text-red-500': !passwordsMatch
                  }"
                >
                  <span class="text-xs font-medium mr-1">
                    {{ passwordsMatch ? 'Correspondance confirmée' : 'Les mots de passe ne correspondent pas' }}
                  </span>
                  <svg
                    v-if="passwordsMatch"
                    class="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <svg
                    v-else
                    class="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- Indicateur de force du mot de passe -->
              <div v-if="form.password" class="mt-2 space-y-2">
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <!-- Icône dynamique -->
                    <svg
                      v-if="passwordStrength <= 1"
                      class="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      v-else-if="passwordStrength === 2"
                      class="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    
                    <span class="text-xs font-medium" :class="{
                      'text-red-500': passwordStrength <= 1,
                      'text-yellow-500': passwordStrength === 2,
                      'text-green-500': passwordStrength >= 3
                    }">
                      {{ passwordStrengthText }}
                    </span>
                  </div>
                  
                  <span class="text-xs font-medium" :class="{
                    'text-gray-400': form.password.length < 8,
                    'text-yellow-500': form.password.length >= 8 && form.password.length < 12,
                    'text-green-500': form.password.length >= 12
                  }">
                    {{ form.password.length }}/12
                  </span>
                </div>

                <!-- Barre de progression avec segments visibles -->
                <div class="w-full flex space-x-1">
                  <div 
                    v-for="n in 4" 
                    :key="n"
                    class="h-1.5 flex-1 rounded-full transition-all duration-500"
                    :class="{
                      'bg-red-400': passwordStrength <= 1 && n <= passwordStrength,
                      'bg-yellow-400': passwordStrength === 2 && n <= passwordStrength,
                      'bg-green-400': passwordStrength >= 3 && n <= passwordStrength,
                      'bg-gray-200': n > passwordStrength
                    }"
                  ></div>
                </div>

                <!-- Conseils dynamiques -->
                <div v-if="passwordSuggestions.length > 0" class="text-xs text-gray-500 mt-1 space-y-1">
                  <p class="font-medium">Pour renforcer votre mot de passe :</p>
                  <ul class="list-disc list-inside space-y-0.5">
                    <li v-for="(suggestion, index) in passwordSuggestions" :key="index">
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    id="terms"
                    type="checkbox" 
                    v-model="termsAccepted"
                    required
                    class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="font-medium text-gray-700">
                    J'accepte les <a href="#" class="text-indigo-600 hover:underline transition-colors">Conditions d'utilisation</a> et la <a href="#" class="text-indigo-600 hover:underline transition-colors">Politique de confidentialité</a>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                :disabled="loading || !form.name || !form.password || !form.password_confirmation || !termsAccepted"
                class="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Créer un compte</span>
                <svg 
                  v-else 
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading">Création en cours...</span>
              </button>
            </div>

            <!-- Étape 3: OTP -->
            <div v-if="currentStep === 3" class="space-y-6">
              <!-- Bouton retour -->
              <button 
                type="button"
                @click="previousStep(currentStep)"
                class="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4 group"
              >
                <ArrowLeftIcon class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                <span class="text-sm">Modifier les infos</span>
              </button>

              <div class="text-center">
                <h2 class="text-2xl font-bold text-gray-900">Vérification du compte</h2>
                <p class="mt-2 text-gray-600">
                  Nous avons envoyé un code à 6 chiffres à 
                  <span class="font-medium">
                    {{ contactMethod === 'email' ? form.email : form.phone }}
                  </span>
                </p>
              </div>

              <!-- Champ OTP -->
              <div class="space-y-4">
                <div class="flex justify-center space-x-3">
                  <input
                    v-for="n in 6"
                    :key="n"
                    v-model="otp[n-1]"
                    type="text"
                    maxlength="1"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    class="w-12 h-12 text-center text-2xl font-semibold border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    :class="{
                      'border-gray-200': !otpError,
                      'border-red-500': otpError
                    }"
                    @keyup="handleOtpInput(n-1, $event)"
                    @paste="handleOtpPaste"
                    ref="otpInputs"
                  >
                </div>

                <p v-if="otpError" class="text-center text-red-500 text-sm mt-2">
                  {{ otpError }}
                </p>

                <div class="text-center text-sm text-gray-500">
                  <p>Vous n'avez pas reçu de code ?</p>
                  <button 
                    type="button"
                    @click="resendOtp"
                    class="text-indigo-600 font-medium hover:underline transition-colors"
                    :disabled="resendCooldown > 0"
                  >
                    Renvoyer le code {{ resendCooldown > 0 ? `(${resendCooldown}s)` : '' }}
                  </button>
                </div>
              </div>

              <button 
                type="button"
                @click="verifyOtp"
                class="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                :disabled="otp.join('').length !== 6 || loading"
              >
                <span v-if="!loading">Vérifier le code</span>
                <svg 
                  v-else 
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading">Vérification...</span>
              </button>
            </div>
          </form>

          <div v-if="currentStep === 2" class="text-center text-sm">
            <p class="text-gray-600">
              Vous avez déjà un compte ? 
              <router-link 
                to="/login" 
                class="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
              >
                Se connecter
              </router-link>
            </p>
            <p class="mt-2 text-xs text-gray-500">
              En créant un compte, vous acceptez nos 
              <a href="#" class="underline hover:text-indigo-600 transition-colors">Conditions d'utilisation</a> et notre 
              <a href="#" class="underline hover:text-indigo-600 transition-colors">Politique de confidentialité</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-vue-next'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const socialLoading = ref(false) // Nouvel état pour le loading social
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const currentStep = ref(1)
const contactMethod = ref('')
const termsAccepted = ref(false)
const passwordsMatch = ref(false)
const passwordStrength = ref(0)

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  newsletter: true
})

// Ajoutez ces variables réactives
const otp = ref(Array(6).fill(''))
const otpError = ref('')
const resendCooldown = ref(0)
const otpInputs = ref([])

// Méthodes à ajouter
const handleOtpInput = (index, event) => {
  // N'autoriser que les chiffres
  otp.value[index] = event.target.value.replace(/\D/g, '')
  
  // Passer au champ suivant si un chiffre est saisi
  if (event.target.value && index < 5) {
    otpInputs.value[index + 1].focus()
  }
  
  // Revenir au champ précédent si backspace est pressé
  if (event.key === 'Backspace' && index > 0 && !event.target.value) {
    otpInputs.value[index - 1].focus()
  }
  
  otpError.value = ''
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text/plain').replace(/\D/g, '')
  const otpDigits = pasteData.split('').slice(0, 6)
  
  otpDigits.forEach((digit, index) => {
    if (index < 6) {
      otp.value[index] = digit
    }
  })
  
  // Focus sur le dernier champ
  if (otpDigits.length === 6) {
    otpInputs.value[5].focus()
  }
}

const resendOtp = async () => {
  try {
    loading.value = true
    await authStore.resendOtp({
      identifier: contactMethod.value === 'email' ? form.value.email : form.value.phone
    })
    
    // Mettre en place le compte à rebours de 60 secondes
    resendCooldown.value = 60
    const timer = setInterval(() => {
      resendCooldown.value -= 1
      if (resendCooldown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
  } catch (error) {
    otpError.value = error.message || "Erreur lors de l'envoi du code"
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  const otpCode = otp.value.join('')
  
  if (otpCode.length !== 6) {
    otpError.value = "Veuillez entrer un code à 6 chiffres"
    return
  }
  
  try {
    loading.value = true
    await authStore.verifyOtp({
      identifier: contactMethod.value === 'email' ? form.value.email : form.value.phone,
      otp_code: otpCode
    })
    
    // Redirection après vérification réussie
    router.push('/login')
  } catch (error) {
    otpError.value = error.message || "Code invalide. Veuillez réessayer."
    // Réinitialiser les champs OTP
    otp.value = Array(6).fill('')
    otpInputs.value[0].focus()
  } finally {
    loading.value = false
  }
}

// Dans le handleSubmit, modifiez la fin pour passer à l'étape 3
const handleSubmit = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    alert("Les mots de passe ne correspondent pas")
    return
  }

  loading.value = true
  try {
    const submitData = {
      name: form.value.name,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      newsletter: form.value.newsletter
    }
    
    if (contactMethod.value === 'email') {
      submitData.email = form.value.email
    } else {
      submitData.phone = form.value.phone
    }
    
    await authStore.register(submitData)
    nextStep(2) // Passer à l'étape OTP
    
    // Démarrer le compte à rebours pour le renvoi
    resendCooldown.value = 60
    const timer = setInterval(() => {
      resendCooldown.value -= 1
      if (resendCooldown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    // Focus sur le premier champ OTP après un léger délai
    setTimeout(() => {
      if (otpInputs.value[0]) {
        otpInputs.value[0].focus()
      }
    }, 100)
    
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const floatingProducts = ref([
  { image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG9nbyUyMHBuZ3xlbnwwfHwwfHx8MA%3D%3D' },
  { image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dCUyMHNoaXJ0fGVufDB8fDB8fHww' },
  { image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dCUyMHNoaXJ0fGVufDB8fDB8fHww' },
  { image: 'https://images.unsplash.com/photo-1522706604291-210a56c3b376?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHQlMjBzaGlydHxlbnwwfHwwfHx8MA==' }
])

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0: return 'Très faible - À éviter'
    case 1: return 'Faible - À améliorer'
    case 2: return 'Moyen - Peut mieux faire'
    case 3: return 'Fort - Presque parfait'
    case 4: return 'Très fort - Excellent'
    default: return ''
  }
})

const passwordSuggestions = computed(() => {
  const suggestions = []
  if (form.value.password.length < 8) {
    suggestions.push("Minimum 8 caractères")
  }
  if (!/[A-Z]/.test(form.value.password)) {
    suggestions.push("Ajoutez une majuscule")
  }
  if (!/[0-9]/.test(form.value.password)) {
    suggestions.push("Ajoutez un chiffre")
  }
  if (!/[^A-Za-z0-9]/.test(form.value.password)) {
    suggestions.push("Ajoutez un caractère spécial (!@#$...)")
  }
  return suggestions
})

const getProductPosition = (index) => {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '60%', right: '5%' },
    { top: '30%', right: '10%' },
    { top: '75%', left: '15%' }
  ]
  return positions[index]
}

const selectContactMethod = (method) => {
  contactMethod.value = method
  // Réinitialiser les champs selon le choix
  if (method === 'email') {
    form.value.phone = ''
  } else {
    form.value.email = ''
  }
}

const nextStep = (step) => {
  currentStep.value = step + 1
}

const previousStep = (step) => {
  currentStep.value = step - 1
}

const goBack = () => {
  if (currentStep.value === 2) {
    previousStep()
  } else {
    router.push('/')
  }
}

const loginWithGoogle = () => {
  socialLoading.value = true
  window.location.href = 'http://localhost:8000/api/customer/auth/google'
}

const calculatePasswordStrength = () => {
  const password = form.value.password
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  passwordStrength.value = strength
}

const checkPasswordMatch = () => {
  if (form.value.password !== form.value.password_confirmation) {
    passwordsMatch.value = true
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>