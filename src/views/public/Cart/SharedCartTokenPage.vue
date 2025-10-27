<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
    <!-- Header avec navigation -->
    <div class="max-w-7xl mx-auto mb-2">
      <div class="flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.093a3.5 3.5 0 00-2.672 3.406 1 1 0 102 0 1.5 1.5 0 111.5 1.5v1a1 1 0 102 0v-1a3.5 3.5 0 00-3.5-3.5V5z"/>
          </svg>
          <span class="text-xl font-bold">bylin</span>
        </router-link>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Besoin d'aide ?</span>
          <span class="text-sm text-indigo-600 font-medium">+229 01 52 01 04 42</span>
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
          <span>Paiement  sécurisé</span>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-if="loading" class="text-center py-12">
        <Spinner :size="14" class="mx-auto" />
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
              <!-- Sélecteur de méthode de paiement -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">Méthode de paiement</label>
                
                <!-- Tabs de méthodes de paiement -->
                <div class="flex border-b border-gray-200 bg-gray-50 rounded-t-lg overflow-hidden mb-4">
                  <button 
                    v-for="tab in paymentTabs" 
                    :key="tab.id" 
                    class="flex-1 px-4 py-3 font-medium text-sm transition-colors duration-200 relative"
                    :class="{ 
                      'bg-white text-indigo-600 shadow-sm': paymentMethod === tab.id,
                      'text-gray-500 hover:text-gray-700 hover:bg-gray-100': paymentMethod !== tab.id
                    }"
                    @click="paymentMethod = tab.id"
                  >
                    {{ tab.label }}
                    <div v-if="paymentMethod === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                  </button>
                </div>

                <!-- Sélecteur de contribution -->
                <div class="grid grid-cols-2 gap-3 mt-4">
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

              <!-- Contenu des onglets de contribution -->
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
              </div>

              <!-- Options de paiement selon la méthode choisie -->
              <div class="mt-6 space-y-6">
                <!-- Mobile Money -->
                <div v-if="paymentMethod === 'mobile_money'" class="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div 
                      v-for="method in mobileMoneyMethods" 
                      :key="method.id"
                      class="p-3 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 hover:border-indigo-300 hover:shadow-sm"
                      :class="{ 
                        'border-indigo-500 bg-indigo-50': selectedMobileMoney === method.id, 
                        'border-gray-200': selectedMobileMoney !== method.id 
                      }"
                      @click="selectMobileMoney(method.id)"
                    >
                      <div class="mb-2">
                        <div class="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mx-auto flex items-center justify-center">
                          <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                      <div class="text-xs font-medium text-gray-900">{{ method.name }}</div>
                    </div>
                  </div>

                  <div v-if="selectedMobileMoney" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">+229</span>
                        </div>
                        <input 
                          type="tel" 
                          v-model="mobilePayment.phone" 
                          placeholder="XX XX XX XX"
                          class="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                          required
                        >
                      </div>
                      <p class="mt-2 text-xs text-gray-600">Entrez votre numéro sans l'indicatif pays</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bouton de paiement -->
              <button 
                @click="processPayment"
                :disabled="!canProcessPayment"
                :class="[
                  'w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform shadow-lg hover:shadow-xl mt-6',
                  canProcessPayment 
                    ? 'hover:from-indigo-700 hover:to-purple-700 hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'
                ]"
              >
                {{ getPaymentButtonText() }}
              </button>

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
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const route = useRoute()
const token = ref('')
const loading = ref(true)
const error = ref('')
const sharedCartData = ref(null)
const activeTab = ref('full')
const percentage = ref(50)
const percentageAmount = ref(0)

// Options de paiement
const paymentMethod = ref('mobile_money')
const selectedMobileMoney = ref('')
const mobilePayment = ref({
  phone: ''
})
const payment = ref({
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: ''
})

const isAuthenticated = ref(false) // À définir selon votre système d'auth
const userName = ref('')
const userEmail = ref('')

const paymentTabs = ref([
  { id: 'mobile_money', label: '📱 Mobile Money' }
])

const mobileMoneyMethods = ref([
  { id: 'mtn', name: 'MTN Mobile Money' },
  { id: 'moov', name: 'Moov Money' },
  { id: 'celtiis', name: 'Celtiis cash' }
])

// Récupérer le token depuis l'URL
token.value = route.params.token

// 1. Correction de l'affichage des données
const cartItems = computed(() => {
  // S'assurer que les données existent
  if (!sharedCartData.value?.cart?.items) return []
  
  return sharedCartData.value.cart.items.filter(item => item && item.product)
})

// 2. Correction du calcul du sous-total
const subtotal = computed(() => {
  if (!cartItems.value.length) return 0
  
  return cartItems.value.reduce((total, item) => {
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity) || 0
    return total + (price * quantity)
  }, 0)
})

// 3. Correction du montant restant - utiliser les données du serveur
const remainingAmount = computed(() => {
  // Utiliser les données calculées côté serveur
  if (sharedCartData.value?.remaining_amount !== undefined) {
    return parseFloat(sharedCartData.value.remaining_amount) || 0
  }
  
  // Fallback au calcul local si nécessaire
  const totalPaid = parseFloat(sharedCartData.value?.total_paid) || 0
  const totalAmount = parseFloat(sharedCartData.value?.total_amount) || subtotal.value
  return Math.max(0, totalAmount - totalPaid)
})

// 4. Correction de la validation du paiement
const canProcessPayment = computed(() => {
  const amount = currentAmount.value
  const remaining = remainingAmount.value
  
  // Vérifications de base
  if (amount <= 0 || amount > remaining) {
    return false
  }

  // Montant minimum (100 FCFA)
  if (amount < 100) {
    return false
  }

  // Vérification selon la méthode de paiement
  switch (paymentMethod.value) {
    case 'mobile_money':
      return selectedMobileMoney.value && 
             mobilePayment.value.phone &&
             mobilePayment.value.phone.replace(/\s/g, '').length >= 8
    default:
      return false
  }
})

// Montant actuel sélectionné
const currentAmount = computed(() => {
  return activeTab.value === 'full' ? remainingAmount.value : percentageAmount.value
})

// Formater les prix
const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice)
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

// Sélectionner une méthode mobile money
const selectMobileMoney = (method) => {
  selectedMobileMoney.value = method
}

// Texte du bouton de paiement
const getPaymentButtonText = () => {
  const amount = formatPrice(currentAmount.value)
  const percentageText = activeTab.value === 'percentage' ? ` (${percentage.value}%)` : ''
  
  if (paymentMethod.value === 'mobile_money') {
    return `Payer ${amount}${percentageText} par Mobile Money`
  }
  
  return `Payer ${amount}${percentageText}`
}

// 5. Correction de la fonction de traitement du paiement
const processPayment = async () => {
  if (!canProcessPayment.value) {
    alert('Veuillez vérifier les informations de paiement')
    return
  }

  try {
    loading.value = true
    
    // Préparer les données de paiement
    const paymentData = {
      amount: currentAmount.value,
      payment_method: paymentMethod.value,
      percentage: activeTab.value === 'percentage' ? percentage.value : null,
    }

    // Ajouter les données spécifiques selon la méthode
    if (paymentMethod.value === 'mobile_money') {
      paymentData.mobile_money_provider = selectedMobileMoney.value
      paymentData.phone = mobilePayment.value.phone.replace(/\s/g, '')
    }

    // Ajouter les infos utilisateur si non authentifié
    if (!isAuthenticated.value) {
      paymentData.user_name = userName.value || 'Contributeur anonyme'
      paymentData.user_email = userEmail.value || `guest_${Date.now()}@shared-cart.com`
    }

    console.log('Données de paiement envoyées:', paymentData)

    const response = await cartStore.sharedCartProccessPayment(token.value, paymentData)
    
    if (response.success) {
      const responseData = response.data
      
      // Mettre à jour les données du panier
      if (responseData.shared_cart) {
        sharedCartData.value = responseData.shared_cart
        updatePercentageAmount()
      }
      
      // Gérer la redirection si nécessaire
      if (responseData.requires_redirect && responseData.redirect_url) {
        alert('Vous allez être redirigé vers la page de paiement...')
        window.open(responseData.redirect_url, '_blank')
      } else {
        alert(`Paiement de ${formatPrice(currentAmount.value)} effectué avec succès!`)
        
        // Recharger les données
        await fetchSharedCart()
      }
    } else {
      throw new Error(response.data.message || 'Erreur lors du paiement')
    }
  } catch (err) {
    console.error('Erreur lors du paiement:', err)
    
    let errorMessage = 'Une erreur est survenue lors du paiement'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    }
    
    alert('Erreur: ' + errorMessage)
  } finally {
    loading.value = false
  }
}

// 6. Correction de la récupération des données du panier
const fetchSharedCart = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await cartStore.fetchSharedCartByToken(token.value)
    console.log('Données du panier partagé reçues:', response)

    if (response.success) {
      sharedCartData.value = response.data
      updatePercentageAmount()
      
      // Vérifier l'état du panier
      if (sharedCartData.value.is_expired) {
        error.value = 'Ce panier partagé a expiré.'
      } else if (sharedCartData.value.is_fully_paid) {
        // Afficher un message de succès mais permettre de voir le panier
        console.log('Le panier est entièrement payé!')
      }
    } else {
      error.value = response.data.message || 'Impossible de charger le panier'
    }
  } catch (err) {
    console.error('Erreur lors du chargement du panier:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Panier non trouvé. Le lien est peut-être invalide.'
    } else if (err.response?.status === 410) {
      error.value = 'Ce panier partagé a expiré.'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Une erreur est survenue lors du chargement du panier.'
    }
  } finally {
    loading.value = false
  }
}

const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    return 'Pas de connexion internet. Vérifiez votre connexion.'
  }
  
  if (error.code === 'ECONNABORTED') {
    return 'La requête a pris trop de temps. Veuillez réessayer.'
  }
  
  return 'Erreur de connexion. Veuillez réessayer.'
}

onMounted(() => {
  fetchSharedCart()
  updatePercentageAmount()
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