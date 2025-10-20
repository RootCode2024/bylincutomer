<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Contactez-nous</h1>
            <p class="text-gray-600 mt-2">Nous sommes là pour vous aider</p>
          </div>
          <div class="flex items-center space-x-2 text-amber-600">
            <Clock class="w-6 h-6" />
            <span class="font-medium">Réponse sous 24h</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Informations de contact -->
        <div class="space-y-8">
          <!-- Introduction -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Besoin d'aide ?</h2>
            <p class="text-gray-600 text-lg leading-relaxed">
              Notre équipe de support est disponible pour répondre à toutes vos questions 
              concernant vos commandes, nos produits ou tout autre sujet. N'hésitez pas 
              à nous contacter, nous serons ravis de vous aider.
            </p>
          </div>

          <!-- Canaux de contact -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Email -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-blue-50 rounded-xl">
                  <Mail class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Email</h3>
                  <p class="text-gray-600 text-sm mb-3">Pour toutes questions générales</p>
                  <a 
                    href="mailto:contact@bylin-style.com" 
                    class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    contact@bylin-style.com
                  </a>
                </div>
              </div>
            </div>

            <!-- Support client -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-green-50 rounded-xl">
                  <Headset class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Support client</h3>
                  <p class="text-gray-600 text-sm mb-3">Assistance dédiée</p>
                  <a 
                    href="mailto:support@bylin-style.com" 
                    class="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                  >
                    support@bylin-style.com
                  </a>
                </div>
              </div>
            </div>

            <!-- Téléphone -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-purple-50 rounded-xl">
                  <Phone class="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Téléphone</h3>
                  <p class="text-gray-600 text-sm mb-3">Du lundi au vendredi</p>
                  <a 
                    href="tel:+2290152010442" 
                    class="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                  >
                    +229 01 52 01 04 42
                  </a>
                </div>
              </div>
            </div>

            <!-- WhatsApp -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-green-50 rounded-xl">
                  <MessageCircle class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                  <p class="text-gray-600 text-sm mb-3">Support instantané</p>
                  <a 
                    href="https://wa.me/22952010442" 
                    target="_blank"
                    class="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                  >
                    +229 52 01 04 42
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Horaires -->
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div class="flex items-start space-x-4">
              <Clock class="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 class="font-semibold text-gray-900 mb-3">Horaires d'ouverture</h3>
                <div class="space-y-2 text-sm text-gray-700">
                  <div class="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span class="font-medium">8h00 - 18h00</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Samedi</span>
                    <span class="font-medium">9h00 - 16h00</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Dimanche</span>
                    <span class="font-medium text-amber-600">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Rapide -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
              <HelpCircle class="w-5 h-5 text-gray-400 mr-2" />
              Questions fréquentes
            </h3>
            <div class="space-y-3">
              <router-link 
                to="/faq#livraison" 
                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-gray-900">Délais de livraison</span>
                <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </router-link>
              <router-link 
                to="/faq#retours" 
                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-gray-900">Politique de retours</span>
                <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </router-link>
              <router-link 
                to="/faq#paiement" 
                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span class="text-gray-700 group-hover:text-gray-900">Modes de paiement</span>
                <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Formulaire de contact -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
            <p class="text-gray-600">Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.</p>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Sujet -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Sujet <span class="text-red-500">*</span>
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Choisissez un sujet</option>
                <option value="commande">Question sur ma commande</option>
                <option value="produit">Information produit</option>
                <option value="livraison">Problème de livraison</option>
                <option value="retour">Demande de retour</option>
                <option value="autre">Autre question</option>
              </select>
            </div>

            <!-- Informations personnelles -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span class="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Votre prénom"
                >
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Votre nom"
                >
              </div>
            </div>

            <!-- Email et Téléphone -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre@email.com"
                >
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+229 12 34 56 78"
                >
              </div>
            </div>

            <!-- Numéro de commande -->
            <div>
              <label for="orderNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Numéro de commande (optionnel)
              </label>
              <input
                id="orderNumber"
                v-model="form.orderNumber"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ex: CMD-123456"
              >
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Décrivez votre demande en détail..."
              ></textarea>
            </div>

            <!-- Pièce jointe -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pièce jointe (optionnel)
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudUpload class="w-8 h-8 text-gray-400 mb-2" />
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p class="text-xs text-gray-400 mt-1">PNG, JPG, PDF jusqu'à 10MB</p>
                  </div>
                  <input type="file" class="hidden" @change="handleFileUpload" />
                </label>
              </div>
              <p v-if="form.attachment" class="text-sm text-green-600 mt-2 flex items-center">
                <CheckCircle class="w-4 h-4 mr-1" />
                Fichier sélectionné: {{ form.attachment.name }}
              </p>
            </div>

            <!-- Bouton d'envoi -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin mr-2" />
              {{ loading ? 'Envoi en cours...' : 'Envoyer le message' }}
            </button>

            <!-- Confidentialité -->
            <p class="text-xs text-gray-500 text-center">
              En soumettant ce formulaire, vous acceptez notre 
              <a href="/privacy" class="text-blue-600 hover:text-blue-700">politique de confidentialité</a>. 
              Vos données ne seront jamais partagées avec des tiers.
            </p>
          </form>
        </div>
      </div>
    </main>

    <!-- Section réseaux sociaux -->
    <section class="bg-white border-t border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Suivez-nous</h2>
          <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Restez connecté avec Bylin et soyez le premier à découvrir nos nouvelles collections, 
            promotions exclusives et actualités.
          </p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="p-3 bg-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group">
              <Facebook class="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
            </a>
            <a href="#" class="p-3 bg-gray-100 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all group">
              <Instagram class="w-6 h-6 text-gray-600 group-hover:text-pink-600" />
            </a>
            <a href="#" class="p-3 bg-gray-100 rounded-xl hover:bg-blue-50 hover:text-blue-400 transition-all group">
              <Twitter class="w-6 h-6 text-gray-600 group-hover:text-blue-400" />
            </a>
            <a href="#" class="p-3 bg-gray-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all group">
              <Youtube class="w-6 h-6 text-gray-600 group-hover:text-red-600" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast de confirmation -->
    <transition name="slide-up">
      <div 
        v-if="showSuccess"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3"
      >
        <CheckCircle class="w-6 h-6" />
        <div>
          <p class="font-semibold">Message envoyé !</p>
          <p class="text-sm opacity-90">Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  Mail,
  Phone,
  Headset,
  MessageCircle,
  Clock,
  HelpCircle,
  ChevronRight,
  CloudUpload,
  CheckCircle,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-vue-next'

const loading = ref(false)
const showSuccess = ref(false)

const form = reactive({
  subject: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  orderNumber: '',
  message: '',
  attachment: null
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Vérifier la taille du fichier (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximum: 10MB')
      return
    }
    form.attachment = file
  }
}

const submitForm = async () => {
  loading.value = true
  
  try {
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Réinitialiser le formulaire
    Object.assign(form, {
      subject: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      orderNumber: '',
      message: '',
      attachment: null
    })
    
    // Afficher le message de succès
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    alert('Une erreur est survenue. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>