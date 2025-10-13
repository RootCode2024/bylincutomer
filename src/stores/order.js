import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { useApiStore } from './api'
import { useAuthStore } from './auth'
import { useCartStore } from './cart'

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = useStorage('orders', [])
  const currentOrder = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  const urlPayment = ref([])
  
  // Other stores
  const apiStore = useApiStore()
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  // Getters
  const sortedOrders = computed(() => [...orders.value].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)))
  
  const pendingOrders = computed(() => 
    orders.value.filter(order => order.status === 'pending'))
  
  const completedOrders = computed(() => 
    orders.value.filter(order => order.status === 'completed'))
  
  const cancelledOrders = computed(() => 
    orders.value.filter(order => order.status === 'cancelled'))

  // Actions
  async function createOrder(addressId, paymentMethod, phoneNumber, subtotal, shippingCost) {
    loading.value = true
    error.value = null
    
    try {
      const payload = {
        cart_id: cartStore.currentCartId,
        payment_method: paymentMethod,
        shipping_address_id: addressId,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        phone: phoneNumber
      }

      const response = await axios.post(`${apiStore.apiUrl}/orders`, payload, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      urlPayment.value = response.data
      successMessage.value = 'Order created successfully!'
      currentOrder.value = response.data.data
      orders.value.unshift(currentOrder.value)
      cartStore.clearCart()
      
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create order'
      console.error('Order creation error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserOrders() {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${apiStore.apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      orders.value = response.data.data
      
      return orders.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      console.error('Fetch orders error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(orderId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${apiStore.apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      currentOrder.value = response.data.data
      return currentOrder.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch order details'
      console.error('Fetch order error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(orderId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.patch(`${apiStore.apiUrl}/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      // Update local state
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index].status = 'cancelled'
      }
      
      if (currentOrder.value?.id === orderId) {
        currentOrder.value.status = 'cancelled'
      }
      
      successMessage.value = 'Order cancelled successfully'
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to cancel order'
      console.error('Cancel order error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateOrderShipping(orderId, trackingInfo) {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.patch(`${apiStore.apiUrl}/orders/${orderId}/shipping`, trackingInfo, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      // Update local state
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response.data.data }
      }
      
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = { ...currentOrder.value, ...response.data.data }
      }
      
      successMessage.value = 'Shipping information updated'
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update shipping info'
      console.error('Update shipping error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    successMessage.value = null
    error.value = null
  }

  async function verifyPayment(transactionId) {
      const response = await axios.get(`https://api.bylin-style.com/api/payments/verify`, {
        params: { transaction_id: transactionId }
      })
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Échec de la vérification')
      }
      
      return response.data
    }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    successMessage,
    urlPayment,
    
    // Getters,
    sortedOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    
    // Actions
    createOrder,
    fetchUserOrders,
    fetchOrderById,
    cancelOrder,
    updateOrderShipping,
    clearMessages,
    verifyPayment
  }
})