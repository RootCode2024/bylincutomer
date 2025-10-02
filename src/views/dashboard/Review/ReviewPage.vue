<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- En-tête -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Donnez votre avis
        </h1>
        <p class="text-gray-600">
          Commandé le {{ formatDate(order.created_at) }} • 
          Livré le {{ formatDate(order.delivered_at) }}
        </p>
      </div>

      <!-- Liste des produits -->
      <div v-for="product in products" :key="product.id" 
           class="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div class="flex space-x-4">
          <!-- Image du produit -->
          <img :src="product.image" :alt="product.name" 
               class="w-20 h-20 object-cover rounded-lg">
          
          <div class="flex-1">
            <!-- Nom du produit -->
            <h3 class="font-semibold text-gray-900 mb-1">
              {{ product.name }}
            </h3>
            
            <!-- Variants -->
            <p v-if="product.variant" class="text-sm text-gray-500 mb-3">
              {{ [product.variant.color, product.variant.size].filter(Boolean).join(' • ') }}
            </p>

            <!-- Évaluation par étoiles -->
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-2">
                Notez ce produit :
              </p>
              <div class="flex space-x-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="setRating(product, star)"
                  class="text-2xl focus:outline-none"
                  :class="product.currentRating >= star ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {{ getRatingText(product.currentRating) }}
              </p>
            </div>

            <!-- Commentaire -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Votre commentaire (optionnel)
              </label>
              <textarea
                v-model="product.currentComment"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Partagez votre expérience avec ce produit..."
              ></textarea>
            </div>

            <!-- Avis existant -->
            <div v-if="product.existing_review" 
                 class="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p class="text-sm text-green-800">
                ✅ Vous avez déjà donné votre avis le 
                {{ formatDate(product.existing_review.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center">
          <button
            @click="submitAllReviews"
            :disabled="!hasRatings || loading"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Envoi en cours...' : `Envoyer ${selectedRatingsCount} avis` }}
          </button>
          
          <button
            @click="skipReview"
            class="px-6 py-3 text-gray-600 hover:text-gray-800"
          >
            Passer pour l'instant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axiosConfig'

const route = useRoute()
const order = ref({})
const products = ref([])
const loading = ref(false)

// Initialiser les données des produits
const initializeProducts = (productsData) => {
  products.value = productsData.map(product => ({
    ...product,
    currentRating: product.existing_review?.rating || 0,
    currentComment: product.existing_review?.comment || ''
  }))
}

// Computed properties
const hasRatings = computed(() => {
  return products.value.some(product => product.currentRating > 0)
})

const selectedRatingsCount = computed(() => {
  return products.value.filter(product => product.currentRating > 0).length
})

// Méthodes
const setRating = (product, rating) => {
  product.currentRating = rating
}

const getRatingText = (rating) => {
  const texts = {
    1: 'Médiocre',
    2: 'Passable',
    3: 'Bien',
    4: 'Très bien',
    5: 'Excellent'
  }
  return texts[rating] || 'Non noté'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const submitAllReviews = async () => {
  loading.value = true
  
  try {
    const reviewsToSubmit = products.value
      .filter(product => product.currentRating > 0)
      .map(product => ({
        product_id: product.id,
        rating: product.currentRating,
        comment: product.currentComment
      }))

    const response = await api.post('/reviews/submit-batch', {
        order_id: order.value.id,
        reviews: reviewsToSubmit
    })

    const data = response

    console.log('Réponse de la soumission des avis : ', data)

    if (data.success) {
      alert('Merci pour vos avis ! Ils seront publiés après modération.')
      // Rediriger vers une page de remerciement ou l'accueil
      window.location.href = '/'
    } else {
      alert('Erreur: ' + data.message)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Une erreur est survenue')
  } finally {
    loading.value = false
  }
}

const skipReview = () => {
  if (confirm('Êtes-vous sûr de vouloir passer ? Vous pourrez donner votre avis plus tard.')) {
    window.location.href = '/'
  }
}

// Chargement initial
onMounted(async () => {
  const orderId = route.params.orderId
  const token = route.query.token

  try {
    const response = await api.get(`/reviews/order/${orderId}?token=${token}`)
    const data = response

    console.log('Lorsque la page reviews est monté : ', data)

    if (data.success) {
      order.value = data.data.order
      initializeProducts(data.data.products)
    } else {
      alert('Lien invalide ou expiré')
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Impossible de charger la page')
  }
})
</script>