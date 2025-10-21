<template>
  <transition 
    name="scale-fade"
    appear
  >
    <div class="w-full h-[100vh] flex bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Left Side - Fashion Image -->
      <div class="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div class="absolute inset-0 z-10"></div>
        <img 
          src="@/assets/images/loginregister.jpg" 
          alt="Fashion" 
          class="w-full h-full object-cover object-top transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <!-- Right Side - Auth Form -->
      <div class="w-full md:w-1/2 flex flex-col relative bg-indigo-700">
        <!-- Back Button -->
        <transition name="slide-fade">
          <button 
            v-if="step !== 'email'"
            @click="handleBack" 
            class="absolute top-8 left-8 text-indigo-700 hover:text-indigo-800 transition-colors duration-200 p-2 hover:bg-indigo-50 rounded-lg z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </transition>

        <!-- Content Container -->
        <div class="flex-1 flex items-center justify-center p-8 md:p-12">
          <div class="max-w-md w-full">
            <!-- Email Step -->
            <transition 
              name="slide-fade"
              mode="out-in"
            >
              <div>
                <div v-if="step === 'email'" key="email">
                  <div class="text-center mb-8">
                    <transition name="bounce" appear>
                      <router-link to="/" class="inline-flex items-center justify-center mb-4">
                        <img src="/images/logo-white.png" alt="bylin logo" class="w-48 h-48 object-contain"/>
                      </router-link>
                    </transition>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">
                      Bienvenue chez <span class="italic text-white">bylin</span>!
                    </h1>
                    <p class="text-gray-200">Entrez votre adresse mail pour commencer.</p>
                  </div>

                  <form @submit.prevent="handleEmailSubmit" class="space-y-4">
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        v-model="email"
                        type="email"
                        placeholder="Adresse mail"
                        autofocus
                        class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': emailError }"
                      />
                    </div>
                    <transition name="slide-down">
                      <p v-if="emailError" class="text-red-500 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ emailError }}
                      </p>
                    </transition>

                    <button
                      type="submit"
                      :disabled="!email || isCheckingEmail"
                      class="w-full disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-white font-medium py-3 rounded-lg transition-all border border-white duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      <span v-if="isCheckingEmail">
                        <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Continuons...
                      </span>
                      <span v-else>Continuer</span>
                      
                    </button>
                  </form>

                  <div class="mt-6">
                    <div class="relative">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">OU</span>
                      </div>
                    </div>

                    <div class="mt-6 space-y-3">
                      <button 
                        @click="handleGoogleRegister"
                        :disabled="socialLoading"
                        class="w-full disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-700 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                      <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span class="text-gray-900 font-medium" v-if="!socialLoading">Se connecter avec Google</span>
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
                    
                    <div class="mt-6 text-center">
                      <p class="text-gray-200 text-sm">
                        Déjà un compte?
                        <router-link to="/login" class="text-white font-medium hover:underline">Se connecter</router-link>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Personal Data Step -->
                <div v-if="step === 'other'" key="other">
                  <div class="text-center mb-8">
                    <transition name="bounce" appear>
                      <router-link to="/" class="inline-flex items-center justify-center mb-4">
                        <img src="/images/logo-white.png" alt="bylin logo" class="w-48 h-48 object-contain"/>
                      </router-link>
                    </transition>
                    <h1 class="text-2xl font-bold text-gray-200 mb-2">
                      <span class="italic text-white">bylin</span>, la grandeur depuis les racines!
                    </h1>
                    <p class="text-gray-200">Entrez vos coordonnées pour vous inscrire.</p>
                  </div>

                  <form @submit.prevent="handleDatasSubmit" class="space-y-4">
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        v-model="name"
                        type="text"
                        placeholder="Nom complet"
                        autofocus
                        autocomplete="name"
                        class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': nameError }"
                      />
                    </div>
                    <transition name="slide-down">
                      <p v-if="nameError" class="text-red-500 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ nameError }}
                      </p>
                    </transition>

                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        v-model="password"
                        type="password"
                        placeholder="Mot de passe"
                        class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': passwordError }"
                      />
                    </div>
                    <transition name="slide-down">
                      <p v-if="passwordError" class="text-red-500 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ passwordError }}
                      </p>
                    </transition>

                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        v-model="password_confirmation"
                        type="password"
                        placeholder="Répéter le mot de passe"
                        class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all duration-200"
                        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': passwordConfirmationError }"
                      />
                    </div>

                    <transition name="slide-down">
                      <p v-if="passwordConfirmationError" class="text-red-500 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ passwordConfirmationError }}
                      </p>
                    </transition>

                    <transition name="slide-down">
                      <p v-if="error" class="text-red-500 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ error }}
                      </p>
                    </transition>

                    <transition name="slide-down">
                      <p v-if="message" class="text-green-600 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        {{ message }}
                      </p>
                    </transition>

                    <button
                      type="submit"
                      :disabled="!name || !password || !password_confirmation || isLoading"
                      class="w-full disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      <span v-if="isLoading">
                        <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Création du compte...
                      </span>
                      <span v-else>S'inscrire</span>
                    </button>
                  </form>

                  <div class="mt-6">
                    <div class="relative">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">OU</span>
                      </div>
                    </div>

                    <div class="mt-6 space-y-3">
                      <button class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-indigo-700 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="text-gray-700 font-medium">S'inscrire avec Google</span>
                      </button>
                    </div>

                    <div class="mt-6 text-center">
                      <p class="text-gray-600 text-sm">
                        Déjà un compte?
                        <router-link to="/login" class="text-white font-medium hover:underline">Se connecter</router-link>
                      </p>
                    </div>

                  </div>
                </div>

                <!-- Code Step -->
                <div v-else-if="step === 'code'" key="code">
                  <div class="text-center mb-8">
                    <transition name="bounce" appear>
                      <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white to-black rounded-2xl mb-4 shadow-lg">
                        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </transition>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">
                      Nous avons envoyé un code à 5 chiffres à votre adresse
                    </h2>
                    <p class="text-indigo-200 font-medium">{{ email }}</p>
                    <p class="text-gray-600 text-sm mt-2">Entrez-le ici pour vous connecter.</p>
                  </div>

                  <form @submit.prevent="handleCodeSubmit" class="space-y-6">
                    <div class="flex gap-3 justify-center">
                      <input
                        v-for="(digit, index) in code"
                        :key="index"
                        :id="`code-${index}`"
                        v-model="code[index]"
                        @input="handleCodeInput(index, $event)"
                        @keydown="handleKeyDown(index, $event)"
                        type="text"
                        maxlength="1"
                        class="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-200 rounded-lg focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700 outline-none transition-all duration-200 transform focus:scale-105"
                      />
                    </div>

                    <transition name="slide-down">
                      <p v-if="codeError" class="text-red-500 text-sm flex items-center gap-2 text-center justify-center">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ codeError }}
                      </p>
                    </transition>

                    <button
                      type="submit"
                      :disabled="code.some(d => !d) || isLoadingVerif"
                      class="w-full disabled:cursor-not-allowed disabled:opacity-80 bg-gradient-to-r from-white to-black hover:from-gray-500 hover:to-gray-800 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      <span v-if="isLoadingVerif">
                      <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finaliation...
                    </span>
                    <span v-else>Verifier le code</span>
                    </button>
                  </form>
                  <button
                    @click="handleResendCode"
                    :disabled="isLoadingResend"
                    class="w-full disabled:cursor-not-allowed disabled:opacity-80 bg-black hover:bg-gray-600 text-white font-medium py-3 mt-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <span v-if="isLoadingResend">
                      <svg class="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoie...
                    </span>
                    <span v-else>Renvoyer le code</span>

                  </button>

                  <div class="mt-6">
                    <div class="relative">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                      </div>
                      <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">OU</span>
                      </div>
                    </div>

                    <div class="mt-6 space-y-3">
                      <button class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 bg-white border-gray-200 rounded-lg hover:border-indigo-700 hover:bg-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="text-gray-900 font-medium">Se connecter avec Google</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Terms -->
            <p class="text-center text-xs text-gray-200 mt-8">
              En continuant, vous reconnaissez avoir lu, compris et accepté nos 
              <a href="#" class="text-white hover:text-gray-200 hover:underline transition-colors">Conditions Générales d'Utilisation</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useStorage } from '@vueuse/core'

const authStore = useAuthStore()
const userStore = useUserStore()

// Utilisation de useStorage pour la persistance automatique
const email = useStorage('user_registration_email', '')
const name = useStorage('user_registration_name', '')
const savedStep = useStorage('user_registration_step', 'email')

const step = ref(savedStep.value)
const password = ref('')
const password_confirmation = ref('')
const code = ref(['', '', '', '', ''])
const error = ref('')
const message = ref('')

const nameError = ref('')
const passwordError = ref('')
const passwordConfirmationError = ref('')
const codeError = ref('')
const emailError = ref('')

const isCheckingEmail = ref(false)
const isLoading = ref(false)

// Au montage du composant, vérifier si on doit passer directement à l'étape "other"
onMounted(() => {
  console.log('Données chargées:', {
    email: email.value,
    name: name.value,
    step: step.value
  })
  
  // Si on a déjà un email mais pas de nom, rester sur l'étape "other"
  if (email.value && step.value === 'other') {
    console.log('Passage direct à l\'étape other')
    step.value = 'other'
  }
  // Si on est à l'étape "code" mais l'email est vide, revenir à "email"
  else if (step.value === 'code' && !email.value) {
    console.log('Email vide, retour à l\'étape email')
    step.value = 'email'
    savedStep.value = 'email'
  }
})

const handleEmailSubmit = async () => {
  emailError.value = ''
  error.value = ''
  message.value = ''
  if (!email.value || !email.value.includes('@')) {
    emailError.value = 'Veuillez entrer une adresse mail valide.'
    return
  }

  try {
    isCheckingEmail.value = true
    const response = await userStore.emailAvailable(email.value)
    console.log('Checked email:', response)
    
    if (!response.available) {
      emailError.value = 'Cet adresse mail est déjà liée à un compte.'
      return
    }
    error.value = ''
    emailError.value = ''
    
    // Passer à l'étape "other" - useStorage sauvegarde automatiquement
    step.value = 'other'
    savedStep.value = 'other'
    
  } catch (e) {
    emailError.value = e.response?.data?.message || 'Le mail n\'est pas disponible.'
    return
  } finally {
    isCheckingEmail.value = false
  }
}

const handleDatasSubmit = async () => {
  error.value = ''
  nameError.value = ''
  passwordError.value = ''
  passwordConfirmationError.value = ''
  emailError.value = ''
  message.value = ''

  // Validation côté client cohérente avec le backend
  if (!name.value || name.value.length < 3) {
    nameError.value = 'Le nom doit contenir au moins 3 caractères.'
    return
  }

  if (!password.value || password.value.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  // Vérification de la complexité du mot de passe
  const hasUpperCase = /[A-Z]/.test(password.value)
  const hasLowerCase = /[a-z]/.test(password.value)
  const hasNumbers = /\d/.test(password.value)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    passwordError.value = 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.'
    return
  }

  if (password.value !== password_confirmation.value) {
    passwordConfirmationError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    isLoading.value = true
    
    const response = await authStore.register({
      email: email.value,
      name: name.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    if (response?.data.otp_sent) {
      nameError.value = ''
      passwordError.value = ''
      passwordConfirmationError.value = ''
      error.value = ''
      message.value = response.message
      step.value = 'code'
      savedStep.value = 'code'
      
      // NE PAS nettoyer les données ici ! On en a encore besoin pour la vérification
      console.log('Inscription réussie, passage à l\'étape code')
      
      nextTick(() => {
        const firstInput = document.getElementById('code-0')
        if (firstInput) firstInput.focus()
      })
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Veuillez vérifier vos informations.'
    if (e.response?.data?.errors) {
      const errors = e.response.data.errors
      error.value = Object.values(errors)[0][0]
    }
  } finally {
    isLoading.value = false
  }
}

const handleBack = () => {
  if (step.value === 'other') {
    step.value = 'email'
    savedStep.value = 'email'
  } else if (step.value === 'code') {
    step.value = 'other'
    savedStep.value = 'other'
  } else {
    step.value = 'email'
    savedStep.value = 'email'
  }
  
  error.value = ''
  message.value = ''
}

// Fonction pour nettoyer les données (à appeler seulement après succès complet)
const clearUserData = () => {
  email.value = ''
  name.value = ''
  savedStep.value = 'email'
  console.log('Données utilisateur nettoyées')
}

// Watcher pour synchroniser step avec savedStep
import { watch } from 'vue'

watch(step, (newStep) => {
  savedStep.value = newStep
})

const handleCodeInput = (index, event) => {
  const value = event.target.value
  
  if (value.length > 1) {
    code.value[index] = value[0]
    return
  }
  
  code.value[index] = value
  
  if (value && index < 4) {
    const nextInput = document.getElementById(`code-${index + 1}`)
    if (nextInput) nextInput.focus()
  }
}

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    const prevInput = document.getElementById(`code-${index - 1}`)
    if (prevInput) prevInput.focus()
  }
}

const isLoadingResend = ref(false)

const handleResendCode = async () => {
  error.value = ''
  message.value = ''
  
  try {
    isLoadingResend.value = true
    const response = await authStore.resendOtp(email.value)
    console.log('Code resent:', response)
    
    message.value = 'Un nouveau code vous a été envoyé par mail.'
    
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.'
  } finally {
    isLoadingResend.value = false
  }
}

const isLoadingVerif = ref(false)

const handleCodeSubmit = async () => {
  console.log('Submitting code:', code.value, 'for email:', email.value)
  const verificationCode = code.value.join('')
  console.log('Code submitted:', verificationCode)
  
  if (verificationCode.length !== 5) {
    codeError.value = 'Veuillez entrer le code complet à 5 chiffres.'
    return
  }

  try {
    isLoadingVerif.value = true
    const response = await authStore.verifyOtp({ 
      code: verificationCode, 
      email: email.value 
    })
    console.log('Code verified:', response)
    
    // Redirection ou traitement après vérification réussie
    codeError.value = ''
    message.value = 'Code vérifié avec succès!'
    
    // MAINTENANT nettoyer les données après succès complet
    clearUserData()
    
    if(response?.status === 'success') {
      // Rediriger vers la page de connexion ou dashboard
      router.push('/login')
    }
    
  } catch (e) {
    codeError.value = e.response?.data?.message || 'Code invalide. Veuillez réessayer.'
    console.error('Erreur vérification code:', e.response?.data)
  } finally {
    isLoadingVerif.value = false
  }
}

const socialLoading = ref(false)

const handleGoogleRegister = async () => {
  socialLoading.value = true
  try {
    authStore.googleLogin()
  } catch (e) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
    socialLoading.value = false
  } finally {
    socialLoading.value = false
  }
}
</script>

<style scoped>
/* Scale Fade Animation */
.scale-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

/* Slide Fade Animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Bounce Animation */
.bounce-enter-active {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Slide Down Animation */
.slide-down-enter-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

/* Remove arrows from number inputs */
input[type="text"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="text"] {
  -moz-appearance: textfield;
}
</style>