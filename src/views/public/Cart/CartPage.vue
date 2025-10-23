<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-inter">
    <!-- Modal d'info coupon pour non connectés -->
    <div v-if="showCouponInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-medium text-gray-900">Code promo valide</h3>
          <button @click="showCouponInfoModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <p class="text-gray-600">Code: <span class="font-medium">{{ couponInfo.code }}</span></p>
            <p class="text-gray-600">Type: {{ couponInfo.type === 'percentage' ? 'Pourcentage' : 'Montant fixe' }}</p>
            <p class="text-gray-600">Valeur: {{ couponInfo.type === 'percentage' ? couponInfo.value + '%' : formatPrice(couponInfo.value) }}</p>
            <p v-if="couponInfo.minCartAmount" class="text-gray-600">
              Minimum d'achat: {{ formatPrice(couponInfo.minCartAmount) }}
            </p>
          </div>
          
          <p class="text-sm text-gray-500">{{ couponInfo.description }}</p>
          
          <div class="pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-4">Connectez-vous pour appliquer ce code promo à votre panier.</p>
            
            <button
              @click="redirectToLogin"
              class="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de connexion -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-medium text-gray-900">Connexion</h3>
            <button @click="showLoginModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="auth-content">
            <div class="auth-header text-center mb-6">
              <h1 class="text-2xl font-medium text-gray-900 mb-2">Content de vous revoir</h1>
              <p class="text-gray-600">Connectez-vous pour accéder à votre compte</p>
            </div>
            
            <div class="social-auth mb-6">
              <button class="social-button google w-full" @click="handleGoogleLogin">
                <GoogleIcon width="20" height="20" class="mr-2" />
                Continuer avec Google
              </button>
            </div>
            
            <div class="divider mb-6">
              <span class="text-gray-500 text-sm">OU</span>
            </div>
            
            <form @submit.prevent="handleLoginSubmit" class="auth-form">
              <div class="form-group mb-4">
                <label for="modal-email" class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <input
                  type="email"
                  id="modal-email"
                  v-model="loginForm.email"
                  required
                  class="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div class="form-group mb-4 relative">
                <label for="modal-password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="modal-password"
                  v-model="loginForm.password"
                  required
                  class="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" class="absolute right-3 top-9 text-gray-500 hover:text-gray-700" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <input id="remember-me" v-model="loginForm.remember" type="checkbox" class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded">
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
                </div>
                
                <div class="text-sm">
                  <a href="#" class="font-medium text-gray-600 hover:text-gray-500">Mot de passe oublié ?</a>
                </div>
              </div>
              
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" :disabled="loginLoading">
                <span v-if="!loginLoading">Se connecter</span>
                <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </form>
            
            <div class="mt-6 text-center text-sm">
              <p class="text-gray-600">
                Pas encore de compte ?
                <router-link to="/register" class="font-medium text-gray-900 hover:text-gray-700" @click="showRegisterInstead">S'inscrire</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-full mx-auto">
      <div>
        <h1 class="text-2xl font-medium text-gray-900 mb-2">Votre Panier</h1>
        <span class="text-gray-600">{{ cartStore.totalQuantity }} article{{ cartStore.totalQuantity > 1 ? 's' : '' }}</span> dans votre panier.
      </div>

      <!-- Bouton Vider le panier -->
      <div class="p-4 border-t border-gray-200 flex justify-end" v-if="cartItems.length > 0">
        <button @click="clearCart" class="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm">
          <Trash2Icon :size="14" class="mr-2" />
          Vider le panier
        </button>
      </div>
      
      <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <ShoppingCartIcon :size="48" class="mx-auto text-gray-300 mb-4" />
        <h2 class="text-xl font-medium text-gray-700 mb-2">Votre panier est vide</h2>
        <p class="text-gray-500 mb-6">Parcourez nos produits et trouvez ce qui vous plaît !</p>
        <router-link to="/shop" class="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors">
          <span>Commencer vos achats</span>
          <ArrowRightIcon :size="16" class="ml-2" />
        </router-link>
      </div>

      <div v-else class="lg:flex gap-8">
        <!-- Items List -->
        <div class="lg:w-2/3">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="divide-y divide-gray-200">
              <div v-for="item in cartItems" :key="item.product_id" class="p-6 flex flex-col sm:flex-row gap-6">
                <div class="item-image flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                  <img :src="item.image || 'https://placehold.co/80?text=bylin'" :alt="item.name" class="w-full h-full object-cover object-center" />
                </div>
                
                <div class="flex-grow flex flex-col sm:flex-row gap-4">
                  <div class="item-details flex-grow">
                    <h3 class="text-indigo-800 tracking-wide text-lg font-thin mb-2">{{ item.name }}</h3>
                    
                    <!-- Prix unitaire -->
                    <div class="text-gray-900 font-medium text-sm mb-3">
                      {{ formatPrice(item.price) }}
                    </div>
                    
                    <!-- Détails couleur et taille -->
                    <div class="flex flex-wrap gap-4 text-xs text-gray-600">
                      <div v-if="item.selectedColor" class="flex items-center">
                        <span class="mr-2">Couleur:</span>
                        <div class="flex items-center">
                          <div 
                            class="w-4 h-4 rounded-full border border-gray-300 shadow-sm mr-1"
                            :style="{ backgroundColor: item.selectedColor.hex_code || '#CCCCCC' }"
                            :title="item.selectedColor.name"
                          ></div>
                          <span>{{ item.selectedColor.name }}</span>
                        </div>
                      </div>
                      
                      <div v-if="item.selectedSize" class="flex items-center">
                        <span class="mr-2">Taille:</span>
                        <span class="font-medium">{{ item.selectedSize.name }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Contrôle de quantité -->
                  <div class="item-quantity flex items-center gap-2 self-center">
                    <button @click="decrementQuantity(item.product_id)" :disabled="item.quantity <= 1" 
                            class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 hover:text-gray-800">
                      <MinusIcon :size="14" />
                    </button>
                    <span class="w-8 text-center font-medium text-sm">{{ item.quantity }}</span>
                    <button @click="incrementQuantity(item.product_id)"
                            :disabled="item.maxQuantity === item.quantity"
                            class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors text-gray-600 hover:text-gray-800">
                      <PlusIcon :size="14" />
                    </button>
                  </div>
                  
                  <!-- Prix total pour l'article -->
                  <div class="item-total font-medium text-indigo-800 text-sm min-w-20 text-right self-center">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                  
                  <!-- Bouton de suppression -->
                  <button @click="removeItem(item.product_id)" class="item-remove text-gray-400 hover:text-red-500 transition-colors self-center p-1">
                    <Trash2Icon :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:w-1/3 mt-8 lg:mt-0">
          <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8 backdrop-blur-sm">
            <h3 class="text-xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">Récapitulatif</h3>
            
            <div class="space-y-5 mb-8">
              <div class="summary-row flex justify-between items-center">
                <span class="text-gray-600 font-medium">Sous-total</span>
                <span class="text-lg font-bold text-gray-900">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="text-xs text-amber-700 bg-amber-50 rounded-lg px-4 py-3 flex items-end border border-amber-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2 flex-shrink-0 mt-0.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span class="font-thin">Frais de livraison calculés à l'étape suivante</span>
              </div>

              <!-- Section Code promo améliorée -->
              <div class="summary-row discount pt-6 border-t-2 border-gray-200">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-bold text-gray-800 text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 text-gray-600">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    Code promo
                  </h4>
                  <span v-if="discountApplied" class="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                    ✓ Appliqué
                  </span>
                </div>
                
                <div class="discount-input flex gap-2" v-if="!discountApplied">
                  <input
                    type="text" 
                    v-model="discountCode" 
                    placeholder="Entrez votre code"
                    class="flex-grow px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                  >
                  <button
                    @click="applyDiscount"
                    :disabled="!discountCode || isLoading"
                    class="px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold max-w-32 min-w-32 rounded-xl transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 active:scale-95"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div v-if="isLoading" class="loader"></div>
                      <div class="text-sm">{{ isLoading ? 'Vérif.' : 'Appliquer' }}</div>
                    </div>
                  </button>
                </div>
                
                <transition name="fade-slide" mode="out-in">
                  <div v-if="discountApplied" key="success" class="mt-3 flex justify-between items-center rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-4 shadow-md transition-all duration-500">
                    <span class="text-sm font-bold text-green-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Réduction appliquée
                    </span>
                    <span class="text-green-900 font-bold text-sm">-{{ formatPrice(discountAmount) }}</span>
                  </div>
                </transition>
                
                <transition name="fade-slide" mode="out-in">
                  <div v-if="discountApplied" class="mt-3 flex justify-between items-center">
                    <span class="text-sm font-medium text-green-600">
                      ✓ Réduction appliquée: -{{ formatPrice(discountAmount) }} <span class="text-sm font-thin text-green-400" v-if="discountPercent != 0">(-{{discountPercent}} %)</span>
                    </span>
                    
                    <button
                    @click="removeDiscount"
                    class="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </transition>
              
                <transition name="fade-slide" mode="out-in">
                  <div v-if="discountError !== ''" key="error" class="mt-3 flex justify-between items-center rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-4 shadow-md transition-all duration-500">
                    <span class="text-sm font-bold text-red-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {{ discountError }}
                    </span>
                  </div>
                </transition>
              </div>
            </div>
            
            <!-- Total avec mise en valeur -->
            <div class="summary-total border-t-2 border-gray-200 pt-2 mb-8">
              <div class="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl px-4 py-2 shadow-lg">
                <span class="text-lg font-bold text-white">Total</span>
                <span class="total-price text-lg text-white">
                  {{ formatPrice(total) }}
                </span>
              </div>
            </div>
            
            <!-- Boutons d'action -->
            <div class="space-y-3 mb-8" v-if="authStore.isAuthenticated">
              <CheckoutButton />
              <button 
                :disabled="authStore.sharedCartCount > 2"
                class="disabled:cursor-not-allowed disabled:opacity-50 share-cart-btn w-full flex items-center justify-center px-6 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                @click="shareCart"
              >
                <Share2Icon :size="20" class="mr-2" />
                Partager le panier
              </button>
            </div>
            <div class="space-y-4 mb-8" v-else>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-md">
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                  </svg>
                  <div>
                    <h4 class="font-bold text-blue-900 mb-2 text-lg">Connexion requise</h4>
                    <p class="text-sm text-blue-800 mb-3 font-medium">
                      Connectez-vous pour finaliser votre commande et profiter de tous vos avantages :
                    </p>
                    <ul class="space-y-2 text-sm text-blue-700">
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Suivi de commande en temps réel</span>
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Historique de vos achats</span>
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Service client prioritaire</span>
                      </li>
                      <li class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Accès à vos avantages fidélité</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                @click="showLoginModal = true"
                class="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <LogInIcon :size="20" class="mr-2" />
                Se connecter pour payer
              </button>

              <div class="text-center text-sm text-gray-600 mt-3">
                Pas encore de compte ? 
                <router-link to="/register" class="text-gray-900 hover:text-gray-700 font-bold underline decoration-2 underline-offset-2" @click.prevent="showRegisterInstead">
                  Créer un compte
                </router-link>
              </div>
            </div>
            
            <!-- Méthodes de paiement -->
            <div class="payment-methods mb-8">
              <p class="text-xs text-gray-500 mb-3 uppercase tracking-widest font-bold text-center">Paiement  sécurisé</p>
              <div class="flex gap-4 items-center justify-center p-4 border-2 border-gray-200 bg-white rounded-xl shadow-sm">
                <!-- Bank Transfer -->
                <div class="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-700">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                  </svg>
                  <span class="text-xs text-gray-600 mt-1 font-medium">Banque</span>
                </div>
                
                <!-- Mobile Payment -->
                <div class="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-700">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  <span class="text-xs text-gray-600 mt-1 font-medium">Mobile</span>
                </div>
                
                <!-- PayPal -->
                <div class="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" class="h-7">
                  <span class="text-xs text-gray-600 mt-1 font-medium">PayPal</span>
                </div>
              </div>
            </div>
            
            <router-link to="/shop" class="continue-shopping flex items-center justify-center text-gray-700 hover:text-gray-900 font-bold transition-all group">
              <ArrowLeftIcon :size="18" class="mr-2 transform group-hover:-translate-x-1 transition-transform" />
              <span class="border-b-2 border-transparent group-hover:border-gray-900 transition-all">Continuer vos achats</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Nos services -->
      <section class="w-full bg-white py-10 px-6 mt-16 border-t border-gray-200">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Paiement sécurisé -->
            <div class="flex items-start space-x-4">
              <Shield class="text-gray-900 w-6 h-6 mt-1" />
              <div>
                <h4 class="font-medium text-gray-900">Paiement sécurisé</h4>
                <p class="text-sm text-gray-600">Vos données sont protégées par chiffrement SSL</p>
              </div>
            </div>

            <!-- Livraison express -->
            <div class="flex items-start space-x-4">
              <Truck class="text-gray-900 w-6 h-6 mt-1" />
              <div>
                <h4 class="font-medium text-gray-900">Livraison express</h4>
                <p class="text-sm text-gray-600">Expédition sous 24h pour les commandes avant 16h</p>
              </div>
            </div>

            <!-- Support client -->
            <div class="flex items-start space-x-4">
              <HeadphonesIcon class="text-gray-900 w-6 h-6 mt-1" />
              <div>
                <h4 class="font-medium text-gray-900">Support client 7j/7</h4>
                <p class="text-sm text-gray-600">Assistance par chat, email ou téléphone</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Modale d'information coupon pour les invités -->
    <Modal :open="showCouponInfoModal" @close="showCouponInfoModal = false">
      <div class="p-6 max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Information du Coupon</h3>
        
        <div class="bg-blue-50 p-4 rounded-lg mb-4">
          <p class="font-semibold">Code: {{ couponInfo.code }}</p>
          <p>Type: {{ couponInfo.type === 'percentage' ? 'Pourcentage' : 'Montant fixe' }}</p>
          <p>Valeur: {{ couponInfo.type === 'percentage' ? couponInfo.value + '%' : couponInfo.value + ' XOF' }}</p>
          <p>Réduction: {{ couponInfo.discount }} XOF</p>
          <p v-if="couponInfo.minCartAmount">Minimum panier: {{ couponInfo.minCartAmount }} XOF</p>
          <p v-if="couponInfo.description">{{ couponInfo.description }}</p>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          ⚠️ Pour les utilisateurs non connectés, cette réduction sera appliquée temporairement.
          Connectez-vous pour sauvegarder définitivement le coupon à votre panier.
        </p>

        <div class="flex justify-end space-x-3">
          <button
            @click="showCouponInfoModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmGuestCoupon"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Appliquer
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ShoppingCartIcon,
  Shield, 
  Truck, 
  HeadphonesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  Share2Icon,
  LogInIcon
} from 'lucide-vue-next';
import { useCurrencyStore } from '@/stores/currency';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import CheckoutButton from '@/components/CheckoutButton.vue';
import GoogleIcon from '@/components/icons/GoogleIcon.vue';
import Modal from '@/components/ui/ModalUi.vue'; // Import manquant

// Variables d'état
const showLoginModal = ref(false);
const showCouponInfoModal = ref(false);
const showPassword = ref(false);
const loginLoading = ref(false);
const isLoading = ref(false);
const discountCode = ref('');
const discountApplied = ref(false);
const discountAmount = ref(0);
const discountPercent = ref(0);
const discountError = ref('');
const successMessage = ref(''); // Variable manquante
const errorMessage = ref(''); // Variable manquante

const couponInfo = ref({
  code: '',
  type: '',
  value: 0,
  discount: 0,
  minCartAmount: null,
  description: ''
});

const loginForm = ref({
  email: '',
  password: '',
  remember: false
});

// Stores
const currencyStore = useCurrencyStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

const router = useRouter();

// Données du panier
const cartItems = computed(() => cartStore.items); // Utiliser computed au lieu de ref

// Computed
const subtotal = computed(() => {
  return cartStore.totalPrice;
});

const total = computed(() => {
  const baseTotal = cartStore.finalPrice;
  return Math.max(0, baseTotal - discountAmount.value);
});

// Méthodes
const formatPrice = (price) => {
  return currencyStore.formatCurrency(price);
};

const incrementQuantity = (id) => {
  const item = cartStore.items.find(item => item.product_id === id);
  if (item) {
    const newQuantity = item.quantity + 1;
    cartStore.updateQuantity(id, newQuantity);
  }
};

const decrementQuantity = (id) => {
  const item = cartStore.items.find(item => item.product_id === id);
  if (item && item.quantity > 1) {
    const newQuantity = item.quantity - 1;
    cartStore.updateQuantity(id, newQuantity);
  }
};

const removeItem = (id) => {
  cartStore.removeItem(id);
};

const clearCart = () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    cartStore.clearCart();
    discountApplied.value = false;
    discountAmount.value = 0;
    discountCode.value = '';
  }
};

const shareCart = () => {
  if (authStore.sharedCartCount > 2) {
    alert('Vous avez atteint la limite de partage de panier (3 maximum)');
    return;
  }
  localStorage.removeItem('sharedCartStep');
  cartStore.couponValue = discountAmount.value;
  router.push('/shared-cart');
};

const applyDiscount = async () => {
  if (!discountCode.value.trim()) {
    discountError.value = 'Veuillez entrer un code promo';
    setTimeout(() => { discountError.value = ''; }, 3000);
    return;
  }

  isLoading.value = true;
  discountError.value = '';

  try {
    // Synchroniser le panier avec le serveur si l'utilisateur est authentifié
    if (authStore.isAuthenticated) {
      await cartStore.syncCartWithServer(false);
    }

    // Appliquer le coupon
    const result = await cartStore.applyCoupon(discountCode.value.trim().toUpperCase());

    if (result.success) {
      console.log('Coupon appliqué avec succès:', result);
      
      if (authStore.isAuthenticated) {
        // Utilisateur authentifié - le coupon est sauvegardé dans le panier
        discountAmount.value = result.data.discount;
        discountApplied.value = true;
        cartStore.couponValue = discountAmount.value;
        successMessage.value = 'Coupon appliqué avec succès';

        if (result?.data?.type === "percentage") discountPercent.value = result.data.value
      } else {
        // Utilisateur non authentifié - afficher les infos du coupon
        couponInfo.value = {
          code: discountCode.value.trim().toUpperCase(),
          type: result.data.type,
          value: result.data.value,
          discount: result.data.discount,
          minCartAmount: result.data.min_cart_amount,
          description: result.data.description || ''
        };
        showCouponInfoModal.value = true;
      }
    } else {
      throw new Error(result.message || 'Erreur lors de l\'application du code');
    }
  } catch (error) {
    discountApplied.value = false;
    discountAmount.value = 0;
    cartStore.couponValue = 0;
    discountError.value = error.message || 'Erreur inconnue';
    setTimeout(() => { discountError.value = ''; }, 5000);
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour confirmer l'application du coupon pour les invités
const confirmGuestCoupon = () => {
  discountApplied.value = true;
  discountAmount.value = couponInfo.value.discount;
  cartStore.couponValue = couponInfo.value.discount;
  showCouponInfoModal.value = false;
  successMessage.value = 'Coupon appliqué avec succès';
};

const removeDiscount = async () => {
  try {
    if (authStore.isAuthenticated) {
      // Pour les utilisateurs authentifiés, appeler l'API pour supprimer le coupon
      // Vous devrez créer cette route API
      // await api.delete(API_ROUTES.cart.coupon);
    }
    
    // Réinitialiser localement dans tous les cas
    cartStore.resetCoupon();
    discountApplied.value = false;
    discountAmount.value = 0;
    discountCode.value = '';
    successMessage.value = 'Coupon retiré avec succès';
    
  } catch (error) {
    console.error('Erreur lors de la suppression du coupon:', error);
    errorMessage.value = 'Erreur lors de la suppression du coupon';
  }
};

const redirectToLogin = () => {
  showCouponInfoModal.value = false;
  showLoginModal.value = true;
};

const handleLoginSubmit = async () => {
  loginLoading.value = true;
  try {
    await authStore.login(loginForm.value);
    showLoginModal.value = false;
    // Recharger les données utilisateur
    window.location.reload();
  } catch (error) {
    alert(error.message);
  } finally {
    loginLoading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    await authStore.googleLogin();
  } catch (e) {
    console.log('Une erreur est survenue. Veuillez réessayer.', e);
  }
};

const showRegisterInstead = () => {
  showLoginModal.value = false;
  router.push('/register');
};

// Ajouter un bouton pour supprimer le coupon
const addRemoveCouponButton = () => {
  // Cette fonction peut être utilisée pour ajouter un bouton de suppression
};

// Lifecycle hooks
onMounted(() => {
  // Initialiser le montant de la réduction depuis le store
  discountAmount.value = cartStore.couponValue;
  discountApplied.value = cartStore.couponValue > 0;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Animation pour le chargement */
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transition pour les messages */
.message-transition-enter-active,
.message-transition-leave-active {
  transition: all 0.3s ease;
}

.message-transition-enter-from,
.message-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Amélioration visuelle des boutons */
.btn-primary {
  @apply bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors;
}

/* Responsive design */
@media (max-width: 768px) {
  .cart-container {
    @apply flex flex-col;
  }
  
  .cart-items {
    @apply w-full;
  }
  
  .cart-summary {
    @apply w-full mt-6;
  }
}
@keyframes l3 {to{transform: rotate(1turn)}}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.font-inter {
  font-family: 'Inter', sans-serif;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  background: white;
}

.social-button.google {
  color: #3c4043;
  border-color: #dadce0;
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.divider {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.divider::before, .divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider::before {
  margin-right: 1rem;
}

.divider::after {
  margin-left: 1rem;
}

/* Améliorations design */
.item-image {
  transition: transform 0.3s ease;
}
.item-image:hover {
  transform: scale(1.05);
}

.item-quantity button {
  transition: all 0.2s ease;
}
.item-quantity button:hover {
  background-color: #f3f4f6;
}

.summary-total {
  border-top: 2px solid #e5e7eb;
}

.total-price {
  font-size: 1.25rem;
}

.payment-methods img {
  filter: grayscale(30%);
  opacity: 0.8;
  transition: all 0.3s ease;
}
.payment-methods img:hover {
  filter: grayscale(0%);
  opacity: 1;
}
</style>