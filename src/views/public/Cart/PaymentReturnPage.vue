<template>
  <div class="payment-callback">
    <div v-if="loading" class="loading-spinner">
      <p>Vérification de votre paiement...</p>
    </div>
    
    <payment-result 
      v-else 
      :status="paymentStatus"
      :order="order"
      @retry="handleRetry"
    />
  </div>
</template>

<script>
import PaymentResult from '@/components/PaymentResult.vue';

export default {
  components: { PaymentResult },
  
  data() {
    return {
      loading: true,
      paymentStatus: null,
      order: null
    }
  },
  
  async created() {
    await this.processPaymentCallback();
  },
  
  methods: {
    async processPaymentCallback() {
      try {
        const { status, reference, transaction_id } = this.$route.query;
        
        const response = await this.$api.get('/api/payment/verify', {
          params: { status, reference, transaction_id }
        });
        
        this.paymentStatus = status;
        this.order = response.data.order;
        
      } catch (error) {
        this.paymentStatus = 'error';
        console.error('Payment processing error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    handleRetry() {
      this.$router.push('/checkout/payment');
    }
  }
}
</script>