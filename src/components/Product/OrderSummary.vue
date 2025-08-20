<template>
  <div class="order-summary">
    <h2 class="summary-title">Order Summary</h2>
    
    <div class="order-items">
      <div v-for="item in items" :key="item.id" class="order-item">
        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-quantity">x{{ item.quantity }}</span>
        </div>
        <span class="item-price">{{ formatPrice(item.price * item.quantity) }}</span>
      </div>
    </div>

    <div class="order-totals">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="total-row">
        <span>Shipping:</span>
        <span>{{ formatPrice(5.99) }}</span>
      </div>
      <div class="total-row">
        <span>Tax:</span>
        <span>{{ formatPrice(tax) }}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total:</span>
        <span>{{ formatPrice(grandTotal) }}</span>
      </div>
    </div>

    <button class="checkout-button" @click="proceedToCheckout">
      Proceed to Checkout
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { id: 1, name: 'Product 1', price: 25.99, quantity: 2 },
      { id: 2, name: 'Product 2', price: 15.50, quantity: 1 }
    ]
  },
  shipping: {
    type: Number,
    default: 5.99
  },
  taxRate: {
    type: Number,
    default: 0.08
  }
});

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const tax = computed(() => {
  return subtotal.value * props.taxRate;
});

const grandTotal = computed(() => {
  return subtotal.value + tax.value + props.shipping;
});

const formatPrice = (value) => {
  return value;
};

const emit = defineEmits(['checkout']);

const proceedToCheckout = () => {
  emit('checkout', {
    subtotal: subtotal.value,
    tax: tax.value,
    shipping: props.shipping,
    total: grandTotal.value
  });
};
</script>

<style scoped>
.order-summary {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
}

.summary-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}

.item-info {
  display: flex;
  gap: 10px;
}

.item-name {
  font-weight: 500;
}

.item-quantity {
  color: #666;
}

.item-price {
  font-weight: 600;
}

.order-totals {
  margin: 25px 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.grand-total {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.checkout-button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-button:hover {
  background-color: #45a049;
}
</style>