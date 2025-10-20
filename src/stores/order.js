import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axiosConfig'
import { useCartStore } from './cart'
import { API_ROUTES } from '@/utils/apiRoute'

export const useOrderStore = defineStore('order', () => {
  // ----- STATE -----
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  const urlPayment = ref(null)

  const cartStore = useCartStore()

  // ----- GETTERS -----
  const sortedOrders = computed(() => [...orders.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
  const completedOrders = computed(() => orders.value.filter(o => o.status === 'completed'))
  const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'))

  // ----- ACTIONS -----
  async function createOrder(orderData) {
    loading.value = true
    error.value = null
    urlPayment.value = null // Reset à chaque nouvelle commande
    
    try {
      console.log('🔄 Création de commande avec données:', orderData)
      
      const response = await api.post(API_ROUTES.orders.place, orderData)
      console.log('✅ Réponse création commande:', response)

      // Gestion de la réponse FedaPay
      if (response.success) {
        // Stocker l'URL de paiement pour une utilisation immédiate
        const paymentUrl = response.data.redirect_url || 
                          response.data.payment_token?.payment_url ||
                          response.data.payment_token?.url;
        
        if (paymentUrl) {
          urlPayment.value = paymentUrl
          console.log('✅ URL FedaPay générée:', urlPayment.value)
        }
        
        currentOrder.value = response.data.order
        orders.value.unshift(currentOrder.value)
        successMessage.value = response.message || 'Commande créée avec succès'
        
        // Vider le panier seulement si la commande est réussie
        cartStore.clearCart()
        
        // Retourner la réponse complète pour le composant
        return {
          ...response,
          requiresRedirect: !!paymentUrl,
          redirectUrl: paymentUrl
        }
      } else {
        throw new Error(response.message || 'Erreur lors de la création de la commande')
      }
    } catch (err) {
      console.error('❌ Erreur création commande:', err.response)
      error.value = handleApiError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserOrders() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.orders.base)

      console.log(response)
      orders.value = response
      return orders.value
    } catch (err) {
      error.value = handleApiError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(orderId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(API_ROUTES.orders.single(orderId))
      console.log('Détails de la commande chargés:', response)
      currentOrder.value = response.data.order
      return response.data
    } catch (err) {
      error.value = handleApiError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function processDownloadInvoice(order) {
    try {

      const response = await api.get(API_ROUTES.orders.downloadInvoice(order.id), { responseType: 'blob' });

      // Vérifier que c'est bien un Blob
      if (!(response instanceof Blob)) {
        throw new Error('Format de réponse invalide');
      }

      // Créer l'URL directement depuis response.data (qui est déjà un Blob)
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-commande-${order.value.id}.pdf`;
      
      // Ajouter des styles pour s'assurer que le lien est visible (pour le debug)
      link.style.display = 'none';
      
      document.body.appendChild(link);
      
      // Déclencher le téléchargement
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true
      
    } catch (error) {
      
      if (error.response?.status === 404) {
        alert('Facture non trouvée pour cette commande.');
      } else if (error.response?.status === 403) {
        alert('Vous n\'êtes pas autorisé à télécharger cette facture.');
      } else {
        alert('Erreur lors du téléchargement: ' + error.message);
      }
    }
  };

  function clearMessages() {
    successMessage.value = null
    error.value = null
  }

  function handleApiError(err) {
    if (!err.response) return err.message || 'Erreur réseau'
    const { status, data } = err.response
    switch (status) {
      case 400: return data.message || 'Requête invalide'
      case 401: return data.message || 'Non authentifié'
      case 403: return 'Accès refusé'
      case 404: return 'Ressource introuvable'
      case 422: return data.errors ? Object.values(data.errors).flat().join(', ') : 'Validation échouée'
      case 429: return 'Trop de tentatives'
      case 500: return 'Erreur serveur'
      default: return data.message || `Erreur inconnue (${status})`
    }
  }

  return {
    // STATE
    orders, currentOrder, loading, error, successMessage, urlPayment,
    // GETTERS
    sortedOrders, pendingOrders, completedOrders, cancelledOrders,
    // ACTIONS
    createOrder, fetchUserOrders, fetchOrderById, processDownloadInvoice, clearMessages
  }
})
