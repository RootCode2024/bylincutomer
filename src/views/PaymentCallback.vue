<template>
  <div v-if="loading" class="loading">Traitement en cours...</div>
  
  <div v-else>
    <div v-if="result.success">
      <h2 v-if="result.payment_status === 'approved'">Paiement réussi!</h2>
      <h2 v-else-if="result.payment_status === 'declined'">Paiement échoué</h2>
      <h2 v-else>Paiement en attente</h2>
      
      <OrderSummary :order="result.order" />
    </div>
    
    <div v-else class="error">
      {{ result.message }}
      <button @click="retryPayment">Réessayer</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      result: {}
    }
  },
  async created() {
    await this.handlePaymentCallback();
  },
  methods: {
    async handlePaymentCallback() {
      try {
        // Récupérer les paramètres de l'URL
        const queryParams = new URLSearchParams(window.location.search);
        const response = await axios.get('/api/payment/callback', {
          params: {
            transaction_id: queryParams.get('transaction_id'),
            status: queryParams.get('status'),
            reference: queryParams.get('reference')
          }
        });
        
        this.result = response.data;
      } catch (error) {
        this.result = {
          success: false,
          message: 'Erreur lors du traitement du paiement'
        };
      } finally {
        this.loading = false;
      }
    },
    retryPayment() {
      this.$router.push('/checkout');
    }
  }
}
</script>