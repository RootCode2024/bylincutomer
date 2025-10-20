<template>
  <footer class="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-12 pb-8">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Grille principale responsive -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
        
        <!-- Logo & Description -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-3 mb-4">
            <img src="/images/logo-white.png" alt="bylin Logo" class="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
          </div>
          <p class="text-sm leading-relaxed text-gray-400 max-w-xs">
            <strong class="text-white">bylin</strong> incarne l'élégance, la puissance et la liberté.  
            Inspirée de <span class="italic text-white">Kondo, le requin de Béhanzin</span>, notre marque reflète la force intérieure et la résilience à travers la mode.
          </p>
        </div>

        <!-- Liens rapides -->
        <div class="sm:justify-self-center lg:justify-self-start">
          <h3 class="text-lg font-semibold text-white mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="hover:text-white transition-colors duration-200 flex items-center">
                <Home class="w-4 h-4 mr-2" />
                Accueil
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/collections" class="hover:text-white transition-colors duration-200 flex items-center">
                <ShoppingBag class="w-4 h-4 mr-2" />
                Collections
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="hover:text-white transition-colors duration-200 flex items-center">
                <Users class="w-4 h-4 mr-2" />
                À propos
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="hover:text-white transition-colors duration-200 flex items-center">
                <Mail class="w-4 h-4 mr-2" />
                Contact
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/faq" class="hover:text-white transition-colors duration-200 flex items-center">
                <HelpCircle class="w-4 h-4 mr-2" />
                FAQ
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="sm:col-span-2 lg:col-span-1">
          <h3 class="text-lg font-semibold text-white mb-4">Newsletter</h3>
          <p class="text-sm text-gray-400 mb-4 max-w-md">
            Abonnez-vous pour recevoir nos nouveautés et offres exclusives.
          </p>
          <NewsletterSignup />
        </div>

        <!-- Réseaux sociaux & Paiements -->
        <div class="sm:col-span-2 lg:col-span-1">
          <h3 class="text-lg font-semibold text-white mb-4">Suivez-nous</h3>
          
          <!-- Réseaux sociaux -->
          <div class="flex flex-wrap gap-3 mb-6">
            <!-- Facebook -->
            <a 
              href="#" 
              aria-label="Facebook" 
              class="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 group"
            >
              <Facebook class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
            
            <!-- Instagram -->
            <a 
              href="#" 
              aria-label="Instagram" 
              class="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 hover:scale-110 group"
            >
              <Instagram class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
            
            <!-- TikTok -->
            <a 
              href="#" 
              aria-label="TikTok" 
              class="p-3 bg-gray-800 rounded-full hover:bg-black transition-all duration-300 hover:scale-110 group"
            >
              <svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            
            <!-- YouTube -->
            <a 
              href="#" 
              aria-label="YouTube" 
              class="p-3 bg-gray-800 rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 group"
            >
              <Youtube class="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </a>
          </div>

          <!-- Modes de paiement -->
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">Modes de paiement</h3>
            <div class="flex flex-wrap items-center gap-3">
              <!-- MTN MoMo -->
              <div class="bg-white p-1.5 rounded-lg hover:scale-105 transition-transform">
                <img 
                  src="https://www.mtn.com/wp-content/themes/mtn-refresh/public/img/mtn-logo.svg" 
                  alt="MTN MoMo" 
                  class="h-5 object-contain" 
                />
              </div>
              
              <!-- Moov Money -->
              <div class="bg-white p-1.5 rounded-lg hover:scale-105 transition-transform">
                <img 
                  src="https://www.moov-africa.bj/wp-content/uploads/2022/10/LOGO-MOOV-AFRICA-.png" 
                  alt="Moov Money" 
                  class="h-5 object-contain" 
                />
              </div>
              
              <!-- Orange Money -->
              <div class="bg-white p-1.5 rounded-lg hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2560px-Orange_logo.svg.png" 
                  alt="Orange Money" 
                  class="h-5 object-contain" 
                />
              </div>
              
              <!-- Visa -->
              <div class="bg-white p-1.5 rounded-lg hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                  alt="Visa" 
                  class="h-5 object-contain" 
                />
              </div>
              
              <!-- PayPal -->
              <div class="bg-white p-1.5 rounded-lg hover:scale-105 transition-transform">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" 
                  alt="PayPal" 
                  class="h-5 object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations légales et contact -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-gray-800">
        <div class="space-y-3">
          <h4 class="font-semibold text-white">Informations légales</h4>
          <div class="flex flex-wrap gap-4 text-sm">
            <RouterLink to="/privacy" class="hover:text-white transition-colors">Politique de confidentialité</RouterLink>
            <RouterLink to="/terms" class="hover:text-white transition-colors">Conditions d'utilisation</RouterLink>
            <RouterLink to="/cookies" class="hover:text-white transition-colors">Politique des cookies</RouterLink>
          </div>
        </div>
        
        <div class="space-y-3">
          <h4 class="font-semibold text-white">Support client</h4>
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
            <a href="mailto:support@bylin-style.com" class="hover:text-white transition-colors flex items-center">
              <Mail class="w-4 h-4 mr-2" />
              support@bylin-style.com
            </a>
            <a href="tel:+22912345678" class="hover:text-white transition-colors flex items-center">
              <Phone class="w-4 h-4 mr-2" />
              +229 12 34 56 78
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-800 pt-6 text-center">
        <p class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} 
          <span class="font-semibold text-white">bylin</span>. 
          Tous droits réservés.
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Conçu avec <Heart class="w-4 h-4 text-red-500 inline mx-1" /> par 
          <span class="text-blue-400 font-medium">Chrislain AVOCEGAN</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  Home, 
  ShoppingBag, 
  Users, 
  Mail, 
  HelpCircle, 
  Facebook, 
  Instagram, 
  Youtube, 
  Phone,
  Heart
} from 'lucide-vue-next'
import NewsletterSignup from '@/components/NewsletterSignup.vue'
</script>

<style scoped>
/* Animation personnalisée pour le survol des icônes */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Transition fluide pour tous les éléments interactifs */
a, button, .router-link-active {
  transition: all 0.3s ease;
}

/* Responsive design amélioré */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  .sm\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}
</style>