<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
    <!-- Section Hero améliorée -->
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 relative overflow-hidden">
      <!-- Éléments décoratifs -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div class="max-w-4xl mx-auto text-center px-6 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Contactez-nous</h1>
        <p class="mt-4 text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Une question, un projet ou besoin d'assistance ? Notre équipe est là pour vous accompagner.
        </p>
        
        <!-- Indicateurs de statut -->
        <div class="mt-8 flex flex-wrap justify-center gap-6">
          <div class="flex items-center text-blue-100">
            <div class="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span>Disponible maintenant</span>
          </div>
          <div class="flex items-center text-blue-100">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Réponse sous 24h</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section principale -->
    <div class="max-w-7xl mx-auto px-4 py-16 -mt-16 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Formulaire amélioré -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Envoyez-nous un message</h2>
            <p class="text-gray-600">Remplissez le formulaire et nous vous répondrons rapidement</p>
          </div>

          <div class="space-y-6">
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <div class="relative">
                <input 
                  v-model="form.name"
                  type="text"
                  placeholder="Votre nom complet"
                  required
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div class="relative">
                <input 
                  v-model="form.email"
                  type="email"
                  placeholder="votremail@example.com"
                  required
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <div class="relative">
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="Décrivez-nous votre demande..."
                  required
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                ></textarea>
                <div class="absolute top-4 right-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            :disabled="!form.name || !form.email || !form.message"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <span>Envoyer le message</span>
          </button>
        </div>

        <!-- Infos de contact améliorées -->
        <div class="flex flex-col space-y-8">
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Nos coordonnées</h2>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-5 p-4 rounded-xl bg-blue-50 border border-blue-100 transform hover:-translate-y-1 transition-all duration-200">
                <div class="p-3 bg-blue-600 text-white rounded-xl shadow-md">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Adresse</h3>
                  <p class="text-gray-600 mt-1">Cotonou, Bénin</p>
                </div>
              </div>

              <div class="flex items-start space-x-5 p-4 rounded-xl bg-green-50 border border-green-100 transform hover:-translate-y-1 transition-all duration-200">
                <div class="p-3 bg-green-600 text-white rounded-xl shadow-md">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Téléphone</h3>
                  <p class="text-gray-600 mt-1">+229 90 00 00 00</p>
                  <p class="text-sm text-gray-500 mt-1">Lun-Ven: 8h-18h</p>
                </div>
              </div>

              <div class="flex items-start space-x-5 p-4 rounded-xl bg-purple-50 border border-purple-100 transform hover:-translate-y-1 transition-all duration-200">
                <div class="p-3 bg-purple-600 text-white rounded-xl shadow-md">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">Email</h3>
                  <p class="text-gray-600 mt-1">contact@bylin.com</p>
                  <p class="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                </div>
              </div>
            </div>

            <!-- Réseaux sociaux -->
            <div class="mt-8 pt-6 border-t border-gray-100">
              <h3 class="font-semibold text-gray-800 mb-4">Suivez-nous</h3>
              <div class="flex space-x-4">
                <a href="#" class="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" class="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-pink-100 hover:text-pink-600 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" class="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-100 hover:text-blue-400 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.027 10.027 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Google Map améliorée -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 class="font-semibold text-gray-800 mb-4">Notre localisation</h3>
            <div class="rounded-2xl overflow-hidden shadow-md">
              <iframe 
                class="w-full h-64"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.865108!2d2.4401!3d6.3703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102357f4a3d3e!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2sbj!4v169401"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"

const form = reactive({
  name: "",
  email: "",
  message: ""
})

const handleSubmit = () => {
  console.log("Formulaire soumis :", form)
  alert("✅ Merci pour votre message, nous vous répondrons bientôt.")
  form.name = ""
  form.email = ""
  form.message = ""
}
</script>

<style scoped>
/* Animation douce pour les entrées */
input, textarea {
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

/* Effet de survol pour les cartes de contact */
.bg-blue-50:hover, .bg-green-50:hover, .bg-purple-50:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>