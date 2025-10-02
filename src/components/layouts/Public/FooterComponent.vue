<template>
  <footer class="bg-gradient-to-b from-gray-900 to-gray-800">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Section supérieure -->
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <!-- Logo et description -->
        <div>
          <div class="flex items-center">
            <div class="h-10 w-10 bg-indigo-800 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span class="ml-3 text-xl font-bold text-white bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">Byl Company</span>
          </div>
          <p class="mt-4 text-sm text-gray-300 leading-relaxed">
            Votre destination shopping en ligne depuis Octobre 2020. Découvrez notre sélection de produits de qualité avec livraison rapide et service client premium.
          </p>
          <div class="mt-6 flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-indigo-800 transition-colors duration-300">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-base font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Nos Services
          </h3>
          <ul class="mt-4 space-y-3">
            <li>
              <a href="#" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Livraison Express
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Retours Gratuits
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Paiement Sécurisé
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Service Clients 24/7
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Programme de Fidélité
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Carte Cadeau
              </a>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div>
          <h3 class="text-base font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            Informations
          </h3>
          <ul class="mt-4 space-y-3">
            <li>
              <router-link to="/about" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                À Propos de Nous
              </router-link>
            </li>
            <li>
              <router-link to="/terms" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Mentions Légales
              </router-link>
            </li>
            <li>
              <router-link to="/shipping" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Conditions Générales de Vente
              </router-link>
            </li>
            <li>
              <router-link to="/privacy" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Politique de Confidentialité
              </router-link>
            </li>
            <li>
              <router-link to="/sitemap" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Plan du Site
              </router-link>
            </li>
            <li>
              <router-link to="/blog" class="text-sm text-gray-300 hover:text-indigo-800 transition-colors duration-300 flex items-center">
                <span class="w-1 h-1 mr-2 rounded-full bg-indigo-800"></span>
                Blog
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-base font-semibold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Inscrivez-vous à notre newsletter
          </h3>
          <p class="mt-4 text-sm text-gray-300 leading-relaxed">
            Recevez nos dernières offres et actualités directement dans votre boîte mail.
          </p>
          <form class="mt-4">
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder-gray-400"
                placeholder="Votre adresse email"
              />
              <button
                type="submit"
                class="flex-none rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-opacity duration-300"
              >
                S'inscrire
              </button>
            </div>
          </form>

          <!-- Modes de paiement -->
          <div class="mt-8">
            <h4 class="text-sm font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              Moyens de paiement
            </h4>
            <div class="mt-3 grid grid-cols-4 gap-2 bg-white/10 p-3 rounded-lg">
              <img class="h-8 w-auto object-contain" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="Visa" />
              <img class="h-8 w-auto object-contain" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="Mastercard" />
              <img class="h-8 w-auto object-contain" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="PayPal" />
              <img class="h-8 w-auto object-contain" src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg" alt="Apple Pay" />
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-xs text-gray-400">
            © 2025 <span class="text-indigo-800">Bylin Clothing</span>, Inc. Tous droits réservés.
          </p>
          <div class="mt-4 md:mt-0">
            <ul class="flex flex-wrap gap-4 md:gap-6 justify-center">
              <li>
                <router-link to="" class="text-xs text-gray-400 hover:text-indigo-800 transition-colors duration-300">Accessibilité</router-link>
              </li>
              <li>
                <router-link to="" class="text-xs text-gray-400 hover:text-indigo-800 transition-colors duration-300">Cookies</router-link>
              </li>
              <li>
                <router-link to="" class="text-xs text-gray-400 hover:text-indigo-800 transition-colors duration-300">Préférences de cookies</router-link>
              </li>
              <li>
                <router-link to="" class="text-xs text-gray-400 hover:text-indigo-800 transition-colors duration-300">Réclamations</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Ici, vous pouvez ajouter des fonctionnalités spécifiques pour le footer,
// comme la validation du formulaire de newsletter
</script>