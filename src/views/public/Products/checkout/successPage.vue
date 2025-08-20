<template>
  <div class="checkout-success">
          <section class="text-center py-12">
            <div class="max-w-md mx-auto">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 class="text-2xl font-semibold text-gray-900 mb-2">Commande confirmée !</h2>
              <p class="text-lg text-blue-600 mb-4">N° de commande: 67777777+</p>
              <p class="text-gray-600 mb-6">Nous avons envoyé les détails à <strong>vfdvrf</strong></p>
              
              <div class="bg-gray-50 rounded-lg p-4 text-left space-y-3 mb-6">
                <div class="flex justify-between">
                  <span class="text-gray-600">Date estimée de livraison</span>
                  <span class="font-medium">25727</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Méthode de livraison</span>
                  <span class="font-medium">255205</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Adresse de livraison</span>
                  <span class="font-medium">58205210</span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Suivre ma commande
                </button>
                <button class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Continuer mes achats
                </button>
              </div>
            </div>
          </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CheckoutSuccess',
  data() {
    return {
      transactionId: null,
      order: null,
      loading: true,
      error: null
    }
  },
  created() {
    // Récupère l'ID de transaction depuis l'URL
    this.transactionId = this.$route.query.transaction_id;
    this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      try {
        const response = await axios.get(`/api/orders/${this.transactionId}`);
        this.order = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR');
    },
    downloadInvoice() {
      // Fonction pour télécharger la facture (à implémenter côté API)
      window.open(`/api/orders/${this.transactionId}/invoice`, '_blank');
    }
  }
}
</script>

<style scoped>
.checkout-success {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.success-header {
  margin-bottom: 2rem;
}

.success-header h1 {
  color: #4CAF50;
  font-size: 2rem;
}

.order-details {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: left;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
}

.btn-secondary {
  background: white;
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: #f44336;
}
</style>