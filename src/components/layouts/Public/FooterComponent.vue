<template>
  <footer class="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-10">
    <div class="container mx-auto px-6">
      <!-- Grille principale -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        <!-- Logo & Description -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <img src="/images/logo-blue.png" alt="bylin Logo" class="w-full h-24 object-cover" />
          </div>
          <p class="text-sm leading-relaxed text-gray-400">
            <strong>bylin</strong> incarne l’élégance, la puissance et la liberté.  
            Inspirée de <span class="italic text-white">Kondo, le requin de Béhanzin</span>, notre marque reflète la force intérieure et la résilience à travers la mode.
          </p>
        </div>

        <!-- Liens rapides -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li><RouterLink to="/" class="hover:text-white transition">Accueil</RouterLink></li>
            <li><RouterLink to="/collections" class="hover:text-white transition">Collections</RouterLink></li>
            <li><RouterLink to="/about" class="hover:text-white transition">À propos</RouterLink></li>
            <li><RouterLink to="/contact" class="hover:text-white transition">Contact</RouterLink></li>
            <li><RouterLink to="/faq" class="hover:text-white transition">FAQ</RouterLink></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">Newsletter</h3>
          <p class="text-sm text-gray-400 mb-4">
            Abonnez-vous pour recevoir nos nouveautés et offres exclusives.
          </p>
          <form @submit.prevent="subscribe" class="flex flex-col sm:flex-row items-center gap-3">
            <input
              v-model="email"
              type="email"
              required
              placeholder="Votre email"
              class="w-full px-4 py-3 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              S’abonner
            </button>
          </form>
        </div>

        <!-- Réseaux sociaux & Paiements -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">Suivez-nous</h3>
          <div class="flex space-x-4 mb-6">
            <a href="#" aria-label="Facebook" class="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-white" viewBox="0 0 24 24">
                <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H8.08v-2.9h2.36V9.64c0-2.33 1.4-3.62 3.52-3.62 1.02 0 2.1.18 2.1.18v2.31h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.59l-.41 2.9h-2.18v7.03C18.34 21.2 22 17.06 22 12.07z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" class="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-white" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5C19.55 2 22 4.46 22 7.75v8.5C22 19.55 19.55 22 16.25 22h-8.5C4.46 22 2 19.55 2 16.25v-8.5C2 4.46 4.46 2 7.75 2zm0 2C5.68 4 4 5.68 4 7.75v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.1A2.9 2.9 0 1 0 12 15.9 2.9 2.9 0 0 0 12 9.1zm4.75-.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" class="p-2 bg-gray-800 rounded-full hover:bg-sky-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-white" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.67 8.67 0 0 1-2.74 1.05 4.28 4.28 0 0 0-7.35 3.9 12.14 12.14 0 0 1-8.82-4.47 4.28 4.28 0 0 0 1.32 5.7A4.23 4.23 0 0 1 3 9.86v.05a4.28 4.28 0 0 0 3.43 4.19 4.28 4.28 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.6 8.6 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.7 8.7 0 0 0 22.46 6z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube" class="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-white" viewBox="0 0 24 24">
                <path d="M19.6 3.2H4.4A4.4 4.4 0 0 0 0 7.6v8.8a4.4 4.4 0 0 0 4.4 4.4h15.2a4.4 4.4 0 0 0 4.4-4.4V7.6a4.4 4.4 0 0 0-4.4-4.4zM9.6 16V8l6.4 4-6.4 4z"/>
              </svg>
            </a>
          </div>

          <h3 class="text-lg font-semibold text-white mb-4">Modes de paiement</h3>
          <div class="flex flex-wrap items-center gap-3">
            <!-- MTN MoMo -->
            <img src="https://www.mtn.com/wp-content/themes/mtn-refresh/public/img/mtn-logo.svg" alt="MTN MoMo" class="h-6" />
            <!-- Moov Money -->
            <img src="https://www.moov-africa.bj/wp-content/uploads/2022/10/LOGO-MOOV-AFRICA-.png" alt="Moov Money" class="h-6" />
            <!-- Orange Money -->
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2560px-Orange_logo.svg.png" alt="Orange Money" class="h-6" />
            <!-- Visa -->
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" class="h-6" />
            <!-- PayPal -->
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" class="h-6" />
          </div>
        </div>
      </div>

      <!-- Ligne séparatrice -->
      <div class="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        <p>
          &copy; {{ new Date().getFullYear() }} <span class="font-semibold text-white">BYLIN</span>. 
          Tous droits réservés.  
          <span class="block sm:inline">Conçu avec ❤️ par <span class="text-blue-500">Lanova Digital</span></span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const subscribe = () => {
  if (!email.value) return
  alert(`Merci pour votre inscription, ${email.value}! 💌`)
  email.value = ''
}
</script>
