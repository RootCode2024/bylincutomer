<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Support Client</h1>
        <p class="text-lg text-gray-600">Nous sommes là pour vous aider avec votre commande</p>
      </div>

      <!-- Order Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Informations de la commande</h2>
          <span class="px-3 py-1 rounded-full text-sm font-medium" 
                :class="statusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Détails de la commande</h3>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-gray-600">Numéro de commande</dt>
                <dd class="font-medium text-gray-900">{{ order.order_number }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Date</dt>
                <dd class="font-medium text-gray-900">{{ formatDate(order.created_at) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Total</dt>
                <dd class="font-medium text-gray-900">{{ formatCurrency(order.total) }}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Adresse de livraison</h3>
            <div class="text-gray-900" v-if="order.shipping_address">
              <p class="font-medium">{{ order.shipping_address.street_line }}</p>
              <p v-if="order.shipping_address.landmark">{{ order.shipping_address.landmark }}</p>
              <p>{{ order.shipping_address.city }}, {{ getCountryName(order.shipping_address.country_code) }}</p>
              <p class="text-gray-600">{{ order.shipping_address.phone }}</p>
            </div>
            <p v-else class="text-gray-500">Adresse non disponible</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button @click="showSection('download')" 
                class="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors text-left">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Télécharger la facture</h3>
          <p class="text-sm text-gray-600">Obtenir votre reçu de commande</p>
        </button>

        <button @click="showSection('tracking')" 
                class="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors text-left">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Suivi de commande</h3>
          <p class="text-sm text-gray-600">Statut et localisation de votre colis</p>
        </button>

        <button @click="showSection('contact')" 
                class="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors text-left">
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Contacter le support</h3>
          <p class="text-sm text-gray-600">Assistance personnalisée</p>
        </button>
      </div>

      <!-- Dynamic Content Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <!-- Download Invoice Section -->
        <div v-if="activeSection === 'download'" class="space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Télécharger la facture</h2>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              <div>
                <p class="text-blue-800 text-sm">
                  Votre facture contient tous les détails de votre commande, y compris les articles, 
                  les quantités, les prix et les informations de livraison.
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="downloadInvoice" 
                    :disabled="!order.invoice_path || downloading"
                    class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              <svg v-if="!downloading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ downloading ? 'Téléchargement...' : 'Télécharger la facture' }}
            </button>

            <button v-if="!order.invoice_path" @click="regenerateInvoice"
                    class="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Générer la facture
            </button>
          </div>

          <div v-if="!order.invoice_path" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center gap-2 text-yellow-800">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium">Facture non encore générée</span>
            </div>
          </div>
        </div>

        <!-- Tracking Section -->
        <div v-if="activeSection === 'tracking'" class="space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Suivi de commande</h2>
          </div>

          <!-- Order Status Timeline -->
          <div class="space-y-4">
            <div v-for="(step, index) in trackingSteps" :key="step.status"
                 class="flex items-start gap-4">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 rounded-full flex items-center justify-center border-2"
                     :class="getStepClass(step.status)">
                  <svg v-if="step.completed" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span v-else class="text-xs font-medium">{{ index + 1 }}</span>
                </div>
                <div v-if="index < trackingSteps.length - 1" 
                     class="w-0.5 h-12 bg-gray-200 mt-1"></div>
              </div>
              <div class="flex-1 pb-6">
                <p class="font-medium text-gray-900">{{ step.label }}</p>
                <p class="text-sm text-gray-600">{{ step.description }}</p>
                <p v-if="step.date" class="text-xs text-gray-500 mt-1">{{ step.date }}</p>
              </div>
            </div>
          </div>

          <!-- Estimated Delivery -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              <div>
                <p class="text-green-800 font-medium">Livraison estimée</p>
                <p class="text-green-700 text-sm">{{ estimatedDelivery }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Support Section -->
        <div v-if="activeSection === 'contact'" class="space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Contacter le support</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contact Methods -->
            <div class="space-y-4">
              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Téléphone</p>
                  <p class="text-gray-600">+229 52 01 04 42</p>
                  <p class="text-xs text-gray-500">Lun - Sam: 8h - 22h</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Email</p>
                  <p class="text-gray-600">support@bylin-style.com</p>
                  <p class="text-xs text-gray-500">Réponse sous 24h</p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Chat en direct</p>
                  <p class="text-gray-600">Disponible maintenant</p>
                  <p class="text-xs text-gray-500">7j/7, 8h - 23h</p>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="font-medium text-gray-900 mb-4">Envoyer un message</h3>
              <form @submit.prevent="submitSupportRequest" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <select v-model="supportForm.subject" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Choisir un sujet</option>
                    <option value="delivery">Problème de livraison</option>
                    <option value="product">Produit manquant ou endommagé</option>
                    <option value="payment">Problème de paiement</option>
                    <option value="invoice">Facture</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea v-model="supportForm.message" rows="4" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Décrivez votre problème en détail..."></textarea>
                </div>

                <button type="submit" 
                        :disabled="!supportForm.subject || !supportForm.message"
                        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/order'
import { useUIStore } from '@/stores/ui'
import api from '@/api/axiosConfig'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrdersStore()
const uiStore = useUIStore()

const order = ref({})
const activeSection = ref('download')
const downloading = ref(false)
const loading = ref(false)

const supportForm = reactive({
  subject: '',
  message: ''
})

// Computed
const trackingSteps = computed(() => {
  const steps = [
    { status: 'confirmed', label: 'Commande confirmée', description: 'Votre commande a été confirmée et est en cours de traitement', completed: true },
    { status: 'preparing', label: 'En préparation', description: 'Vos articles sont en cours de préparation', completed: order.value.status !== 'pending' },
    { status: 'shipped', label: 'Expédiée', description: 'Votre colis a été expédié', completed: ['shipped', 'delivered', 'paid'].includes(order.value.status) },
    { status: 'delivered', label: 'Livrée', description: 'Votre colis a été livré', completed: ['delivered', 'paid'].includes(order.value.status) }
  ]
  return steps
})

const estimatedDelivery = computed(() => {
  const date = new Date(order.value.created_at)
  date.setDate(date.getDate() + 3) // +3 jours
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Methods
const showSection = (section) => {
  activeSection.value = section
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'En attente',
    'confirmed': 'Confirmée',
    'paid': 'Payée',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'cancelled': 'Annulée'
  }
  return statusMap[status] || status
}

const statusClass = (status) => {
  const classMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'paid': 'bg-green-100 text-green-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const getStepClass = (status) => {
  const step = trackingSteps.value.find(s => s.status === status)
  if (step?.completed) {
    return 'bg-green-500 border-green-500 text-white'
  }
  return 'bg-white border-gray-300 text-gray-500'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getCountryName = (countryCode) => {
  if (!uiStore.countries || !countryCode) return ''
  const country = uiStore.countries.find(c => c.code === countryCode)
  return country?.name || countryCode
}

const downloadInvoice = async () => {
  try {
    downloading.value = true
    const response = await api.get(`/orders/${order.value.id}/invoice/download`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    })

    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `facture-commande-${order.value.id}.pdf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Erreur téléchargement facture:', error)
    alert('Erreur lors du téléchargement de la facture')
  } finally {
    downloading.value = false
  }
}

const regenerateInvoice = async () => {
  try {
    const response = await api.post(`/orders/${order.value.id}/regenerate-invoice`)
    if (response.data.success) {
      alert('Facture regénérée avec succès!')
      await loadOrderData()
    }
  } catch (error) {
    alert('Erreur lors de la regénération de la facture')
  }
}

const submitSupportRequest = async () => {
  try {
    const response = await api.post('/support/request', {
      order_id: order.value.id,
      subject: supportForm.subject,
      message: supportForm.message
    })

    if (response.data.success) {
      alert('Votre message a été envoyé avec succès!')
      supportForm.subject = ''
      supportForm.message = ''
    }
  } catch (error) {
    alert('Erreur lors de l\'envoi du message')
  }
}

const loadOrderData = async () => {
  try {
    loading.value = true
    const orderNumber = route.params.orderNumber
    if (orderNumber) {
      const response = await orderStore.fetchOrderById(orderNumber)
      order.value = response.order
    }
  } catch (error) {
    console.error('Erreur chargement commande:', error)
    alert('Erreur lors du chargement de la commande')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadOrderData()
  // Charger les pays si nécessaire
  if (uiStore.getCountries) {
    await uiStore.getCountries()
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>