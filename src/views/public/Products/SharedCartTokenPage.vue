<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
    <!-- Header avec navigation -->
    <div class="max-w-7xl mx-auto mb-2">
      <div class="flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.093a3.5 3.5 0 00-2.672 3.406 1 1 0 102 0 1.5 1.5 0 111.5 1.5v1a1 1 0 102 0v-1a3.5 3.5 0 00-3.5-3.5V5z"/>
          </svg>
          <span class="text-xl font-bold">E-Shop</span>
        </router-link>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Besoin d'aide ?</span>
          <span class="text-sm text-indigo-600 font-medium">+229 61 27 15 21</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <!-- En-tête amélioré -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <ShoppingCartIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">
          Panier Partagé
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Vous avez été invité à participer à ce panier. Choisissez le montant que vous souhaitez contribuer.
        </p>
        <div class="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <ShieldIcon class="w-4 h-4" />
          <span>Paiement 100% sécurisé</span>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-if="loading" class="text-center py-12">
        <Spinner class="mx-auto" />
        <p class="mt-4 text-gray-600">Chargement du panier...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <TriangleAlert class="mx-auto h-12 w-12 text-red-500" />
        <p class="mt-4 text-red-600">{{ error }}</p>
        <button 
          @click="fetchSharedCart"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Réessayer
        </button>
      </div>

      <div v-else-if="!sharedCartData" class="text-center py-12">
        <TriangleAlert class="mx-auto h-12 w-12 text-yellow-500" />
        <p class="mt-4 text-yellow-600">Aucune donnée de panier disponible</p>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Carte du panier -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <!-- En-tête de la carte -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <UserIcon class="w-5 h-5 mr-2 text-indigo-600" />
                Panier de {{ sharedCartData.creator?.name || 'Utilisateur' }}
              </h2>
            </div>

            <div class="p-6">
              <!-- Métadonnées -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs text-gray-500 uppercase">Créé le</p>
                  <p class="font-medium text-gray-900">{{ formatDate(sharedCartData.created_at) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <p class="text-xs text-gray-500 uppercase">Expire le</p>
                  <p class="font-medium text-gray-900">{{ formatDate(sharedCartData.expires_at) }}</p>
                </div>
              </div>

              <!-- Articles du panier -->
              <div class="space-y-4 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Articles dans le panier</h3>
                
                <div v-for="item in cartItems" :key="item.id" class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div class="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img 
                      v-if="item.product?.main_image_url" 
                      :src="item.product.main_image_url" 
                      :alt="item.product.name" 
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                      <ImageIcon class="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  
                  <div class="ml-4 flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 truncate">{{ item.product?.name || 'Produit sans nom' }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ item.product?.short_description }}</p>
                    
                    <div class="flex items-center justify-between mt-3">
                      <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">Quantité: {{ item.quantity }}</span>
                        <span class="text-sm font-medium text-indigo-600">{{ formatPrice(item.price) }}/unité</span>
                      </div>
                      <span class="font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Résumé financier -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Résumé</h4>
                
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Sous-total</span>
                    <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
                  </div>
                  
                  <div v-if="sharedCartData.total_paid > 0" class="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span class="text-green-600">Déjà payé</span>
                    <span class="font-medium text-green-600">-{{ formatPrice(sharedCartData.total_paid) }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span class="text-lg font-semibold text-gray-900">Reste à payer</span>
                    <span class="text-2xl font-bold text-indigo-600">{{ formatPrice(remainingAmount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carte de paiement -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-8">
            <!-- En-tête de la carte -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCardIcon class="w-5 h-5 mr-2 text-green-600" />
                Options de paiement
              </h2>
            </div>

            <div class="p-6">
              <!-- Sélecteur de méthode -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">Choisissez votre contribution</label>
                
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="activeTab = 'full'"
                    :class="[
                      'p-3 rounded-lg border-2 transition-all duration-200',
                      activeTab === 'full' 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                    ]"
                  >
                    <div class="text-center">
                      <div class="font-semibold">Total</div>
                      <div class="text-sm mt-1">{{ formatPrice(remainingAmount) }}</div>
                    </div>
                  </button>
                  
                  <button 
                    @click="activeTab = 'percentage'"
                    :class="[
                      'p-3 rounded-lg border-2 transition-all duration-200',
                      activeTab === 'percentage' 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                    ]"
                  >
                    <div class="text-center">
                      <div class="font-semibold">Pourcentage</div>
                      <div class="text-sm mt-1">Personnalisé</div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Contenu des onglets -->
              <div v-if="activeTab === 'full'" class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center">
                    <CheckCircleIcon class="w-5 h-5 text-blue-600 mr-2" />
                    <span class="text-sm text-blue-700">Vous payez la totalité du montant restant</span>
                  </div>
                </div>
                
                <div class="text-center py-4">
                  <div class="text-3xl font-bold text-indigo-600">{{ formatPrice(remainingAmount) }}</div>
                  <p class="text-sm text-gray-600 mt-1">Montant total de votre contribution</p>
                </div>
                
                <button 
                  @click="processPayment(remainingAmount, 100)"
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Payer maintenant
                </button>
              </div>

              <div v-else class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Pourcentage à contribuer
                  </label>
                  <div class="relative">
                    <input 
                      type="range" 
                      v-model="percentage"
                      min="5" 
                      max="100"
                      step="5"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      @input="updatePercentageAmount"
                    >
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div class="mt-4 grid grid-cols-4 gap-2">
                    <button 
                      v-for="p in [25, 50, 75, 100]" 
                      :key="p"
                      @click="percentage = p"
                      :class="[
                        'py-2 px-3 rounded-lg border text-sm font-medium transition',
                        percentage === p 
                          ? 'border-indigo-500 bg-indigo-100 text-indigo-700' 
                          : 'border-gray-300 text-gray-700 hover:border-indigo-300'
                      ]"
                    >
                      {{ p }}%
                    </button>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Votre contribution</span>
                    <span class="text-xl font-bold text-indigo-600">{{ formatPrice(percentageAmount) }}</span>
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ percentage }}% du montant restant
                  </div>
                </div>

                <button 
                  @click="processPayment(percentageAmount, percentage)"
                  :disabled="percentageAmount > remainingAmount || percentageAmount <= 0"
                  :class="[
                    'w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl',
                    (percentageAmount > remainingAmount || percentageAmount <= 0) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:from-indigo-700 hover:to-purple-700'
                  ]"
                >
                  Contribuer {{ percentage }}%
                </button>
              </div>

              <!-- Sécurité -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex items-center justify-center space-x-4">
                  <ShieldIcon class="w-5 h-5 text-green-600" />
                  <span class="text-sm text-gray-600">Paiement sécurisé SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section d'information -->
      <div v-if="sharedCartData" class="mt-12 grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 text-center">
          <ShieldIcon class="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <h3 class="font-semibold text-gray-900 mb-2">100% Sécurisé</h3>
          <p class="text-sm text-gray-600">Vos données sont cryptées et protégées</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 text-center">
          <RefreshCwIcon class="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <h3 class="font-semibold text-gray-900 mb-2">Simple et Rapide</h3>
          <p class="text-sm text-gray-600">Processus de paiement simplifié</p>
        </div>
        
        <div class="bg-white rounded-xl p-6 text-center">
          <HelpCircleIcon class="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <h3 class="font-semibold text-gray-900 mb-2">Besoin d'aide ?</h3>
          <p class="text-sm text-gray-600">Contactez-nous au +229 01 52 01 04 42</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ShoppingCartIcon, 
  TriangleAlert, 
  UserIcon, 
  CreditCardIcon, 
  ShieldIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  HelpCircleIcon,
  ImageIcon
} from 'lucide-vue-next'
import Spinner from '@/components/ui/LoadingSpinner.vue'
import api from '@/api/axiosConfig'

const route = useRoute()
const token = ref('')
const loading = ref(true)
const error = ref('')
const sharedCartData = ref(null)
const activeTab = ref('full')
const percentage = ref(50)
const percentageAmount = ref(0)

// Récupérer le token depuis l'URL
token.value = route.params.token

// Articles du panier
const cartItems = computed(() => {
  return sharedCartData.value?.cart?.items || []
})

// Calculer le sous-total
const subtotal = computed(() => {
  if (!cartItems.value.length) return 0
  
  return cartItems.value.reduce((total, item) => {
    const price = Number(item.price) || 0
    const quantity = Number(item.quantity) || 0
    return total + (price * quantity)
  }, 0)
})

// Montant restant à payer
const remainingAmount = computed(() => {
  const totalPaid = Number(sharedCartData.value?.total_paid) || 0
  return Math.max(0, subtotal.value - totalPaid)
})

// Formater les prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price)
}

// Formater les dates
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

// Mettre à jour le montant correspondant au pourcentage
const updatePercentageAmount = () => {
  percentageAmount.value = (remainingAmount.value * percentage.value) / 100
}

// Traiter le paiement
const processPayment = async (amount, percentage) => {
  try {
    loading.value = true
    
    // Appel API pour traiter le paiement
    const response = await api.post(`/customer/shared-carts/${token.value}/payment`, {
      amount: amount,
      payment_method: 'card',
      percentage: percentage
    })
    
    if (response.data.success) {
      alert(`Paiement de ${formatPrice(amount)} (${percentage}%) effectué avec succès!`)
      await fetchSharedCart()
    } else {
      alert('Erreur lors du paiement: ' + response.data.message)
    }
  } catch (err) {
    console.error('Erreur lors du paiement:', err)
    alert('Une erreur est survenue lors du paiement')
  } finally {
    loading.value = false
  }
}

// Récupérer les informations du panier partagé
const fetchSharedCart = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await api.get(`/shared-carts/${token.value}`)
    console.log('Données du panier partagé:', response.data)

    if (response.success) {
      sharedCartData.value = response.data
      updatePercentageAmount()
    } else {
      error.value = response.message || 'Impossible de charger le panier'
    }
  } catch (err) {
    console.error('Erreur lors du chargement du panier:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Panier non trouvé. Le lien est peut-être invalide.'
    } else if (err.response?.status === 410) {
      error.value = 'Ce panier partagé a expiré.'
    } else {
      error.value = 'Une erreur est survenue lors du chargement du panier.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSharedCart()
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>