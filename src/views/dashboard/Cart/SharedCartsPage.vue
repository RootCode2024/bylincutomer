<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8 w-full mx-auto">
    <!-- Breadcrumb Navigation -->
    <nav class="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 mb-2">
      <div class="max-w-full mx-auto">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <RouterLink to="/dashboard" class="text-indigo-800 hover:text-indigo-700">Accueil</RouterLink>
          </li>
          <li>
            <span class="text-gray-400">/</span>
          </li>
          <li class="text-gray-500 truncate max-w-xs">Mes paniers cadeaux</li>
        </ol>
      </div>
    </nav>

    <!-- Stats -->
    <div v-if="!loading && !error && sharedCarts.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Paniers actifs</p>
        <p class="text-2xl font-bold">{{ sharedCarts.length }}/5</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Cadeaux souhaités</p>
        <p class="text-2xl font-bold text-indigo-600">{{ totalGifts }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Montant collecté</p>
        <p class="text-2xl font-bold text-green-600">{{ currencyStore.formatCurrency(totalPaid) }}</p>
      </div>
      <div class="bg-white px-4 py-4 space-y-2 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500">Participants</p>
        <p class="text-2xl font-bold">{{ totalContributors }}</p>
      </div>
    </div>
    
    <!-- État de chargement -->
    <LoadingSpinner v-if="loading" message="Chargement de vos paniers cadeaux..." />
    
    <!-- Gestion des erreurs -->
    <ErrorMessage 
      v-else-if="error" 
      :message="error" 
      :retryable="true"
      @retry="loadSharedCarts"
    />
    
    <!-- Contenu principal -->
     <template v-else>
      <div class="mb-6 flex justify-end relative">
        <PrimaryButton
          :disabled="!canCreateNewCart"
          @click="createNewCart"
          @mouseenter="showTooltipIfLimited"
          @mouseleave="hideTooltip"
          @focus="showTooltipIfLimited"
          @blur="hideTooltip"
          icon="plus"
          label="Créer un panier cadeau"
        />
        <div 
          v-if="showTooltip && !canCreateNewCart"
          class="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg tooltip-box"
          style="top: 100%; right: 0;"
        >
          Vous avez atteint la limite de 5 paniers cadeaux actifs.
          <div class="absolute w-4 h-4 transform rotate-45 -mt-2 bg-gray-800 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
      
      <!-- État vide amélioré -->
      <div v-if="sharedCarts.length === 0" class="empty-state-container">
        <div class="empty-state-content">
          <!-- Illustration avec icônes cadeaux -->
          <div class="empty-state-illustration">
            <div class="lucide-icon-wrapper">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5"
                class="lucide-gift-icon"
              >
                <rect x="3" y="8" width="18" height="4" rx="1"/>
                <path d="M12 8v13"/>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
              </svg>
            </div>
            <div class="floating-shapes">
              <div class="shape shape-1">🎁</div>
              <div class="shape shape-2">🎂</div>
              <div class="shape shape-3">🎉</div>
            </div>
          </div>

          <!-- Contenu texte -->
          <div class="empty-state-text">
            <h2 class="empty-state-title">Créez votre première liste de souhaits !</h2>
            <p class="empty-state-description">
              Un anniversaire, un mariage, ou juste une occasion spéciale ? Créez votre liste de cadeaux 
              et partagez-la avec vos proches pour qu'ils participent aux cadeaux que vous avez choisis.
            </p>
          </div>

          <!-- Scénarios d'utilisation -->
          <div class="use-cases-grid">
            <div class="use-case-item">
              <div class="use-case-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
                </svg>
              </div>
              <div class="use-case-content">
                <h4>Anniversaire</h4>
                <p>Liste de cadeaux pour votre fête</p>
              </div>
            </div>
            <div class="use-case-item">
              <div class="use-case-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="m8 13 2.5 2.5L8 18"/>
                  <path d="m16 13-2.5 2.5L16 18"/>
                </svg>
              </div>
              <div class="use-case-content">
                <h4>Mariage</h4>
                <p>Liste de mariage collaborative</p>
              </div>
            </div>
            <div class="use-case-item">
              <div class="use-case-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <div class="use-case-content">
                <h4>Événement</h4>
                <p>Cadeaux pour une occasion spéciale</p>
              </div>
            </div>
          </div>

          <!-- Fonctionnalités principales -->
          <div class="features-section">
            <h3 class="features-title">Comment ça marche ?</h3>
            <div class="features-grid">
              <div class="feature-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Créez votre liste</h4>
                  <p>Ajoutez les articles que vous souhaitez recevoir</p>
                </div>
              </div>
              <div class="feature-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Partagez le lien</h4>
                  <p>Envoyez le lien à vos amis et famille</p>
                </div>
              </div>
              <div class="feature-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Ils participent</h4>
                  <p>Chacun contribue au cadeau de son choix</p>
                </div>
              </div>
              <div class="feature-step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Recevez tout</h4>
                  <p>Une fois le montant total collecté, vous recevez vos articles</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="empty-state-actions">
            <PrimaryButton
              @click="createNewCart"
              icon="gift"
              label="Créer ma liste de souhaits"
              class="create-button"
            />
            <button 
              @click="$router.push('/dashboard/orders')"
              class="secondary-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <span>Voir mes commandes</span>
            </button>
          </div>

          <!-- Note informative -->
          <div class="info-note">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
            <p>Invitez autant de personnes que vous souhaitez ! Partagez le lien avec tous vos proches.</p>
          </div>
        </div>
      </div>
      
      <!-- Liste des paniers -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SharedCartCard
          v-for="cart in cartStore.sharedCarts?.data" 
          :key="cart.shared_cart_id || cart.id"
          :cart="cart"
          @click="viewCartDetails(cart.shared_cart_id || cart.id)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'

// Composants UI
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import SharedCartCard from '@/components/cart/SharedCartCard.vue'

const router = useRouter()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

// États
const loading = ref(true)
const error = ref(null)
const showTooltip = ref(false)
const hasLoaded = ref(false)

// Computed properties pour les données du store
const sharedCarts = computed(() => cartStore.sharedCarts?.data || [])
const totalAmount = computed(() => cartStore.sharedCarts?.total || 0)

// Calculer les totaux à partir des paniers
const totalPaid = computed(() => {
  return sharedCarts.value.reduce((sum, cart) => {
    return sum + (parseFloat(cart.total_paid_by_contributors) || 0)
  }, 0)
})

const totalContributors = computed(() => {
  return sharedCarts.value.reduce((sum, cart) => {
    return sum + (parseInt(cart.total_contributors) || 0)
  }, 0)
})

const totalGifts = computed(() => {
  return sharedCarts.value.reduce((sum, cart) => {
    return sum + (parseInt(cart.total_items) || 0)
  }, 0)
})

// Vérification de la limite de paniers
const canCreateNewCart = computed(() => {
  return sharedCarts.value.length < 3
})

// Méthodes
const loadSharedCarts = async () => {
  if (hasLoaded.value && !error.value) return
  
  try {
    loading.value = true
    error.value = null

    console.log('Chargement des paniers partagés...')
    await cartStore.fetchSharedCarts()
    console.log('Paniers partagés chargés:', sharedCarts.value)
    
    hasLoaded.value = true
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Échec du chargement des paniers'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

const viewCartDetails = (cartId) => {
  if (!cartId) {
    console.error('No cart ID provided')
    return
  }
  console.log('Navigation vers le panier:', cartId)
  router.push({ 
    name: 'dashboard.shared.carts.details', 
    params: { id: cartId.toString() } 
  })
}

const createNewCart = () => {
  if (!canCreateNewCart.value) {
    return
  }
  router.push({ name: 'CreateSharedCart' })
}

const showTooltipIfLimited = () => {
  if (!canCreateNewCart.value) {
    showTooltip.value = true
  }
}

const hideTooltip = () => {
  showTooltip.value = false
}

// Cycle de vie
onMounted(() => {
  console.log('Composant SharedCarts monté')
  loadSharedCarts()
})

// SUPPRIMER le watcher problématique qui cause la boucle infinie
// watch(() => router.currentRoute.value.name, async (newRouteName) => {
//   if (newRouteName === 'dashboard.shared.carts') {
//     await nextTick()
//     if (!loading.value) {
//       await loadSharedCarts()
//     }
//   }
// })

// Watchers pour le débogage uniquement - optionnel
// watch(sharedCarts, (newCarts, oldCarts) => {
//   console.log('🔄 sharedCarts a changé:', {
//     ancien: oldCarts?.length || 0,
//     nouveau: newCarts?.length || 0
//   })
// }, { deep: true })

watch(loading, (newLoading) => {
  console.log('⏳ Loading state:', newLoading)
})

watch(error, (newError) => {
  console.log('❌ Error state:', newError)
})
</script>

<style scoped>
.empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 0;
}

.empty-state-content {
  text-align: center;
  width: 100%;
}

.empty-state-illustration {
  position: relative;
  margin-bottom: 3rem;
}

.lucide-icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #0065cb82 0%, #0066bf 100%);
  border-radius: 50%;
  margin: 0 auto 2rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 20px 40px #0066bf;
}

.lucide-gift-icon {
  color: white;
  width: 60px;
  height: 60px;
}

.floating-shapes {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
}

.shape {
  position: absolute;
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px #0066bf64);
}

.shape-1 {
  top: 0;
  left: 20px;
  animation-delay: 0s;
}

.shape-2 {
  top: 10px;
  right: 10px;
  animation-delay: 1s;
}

.shape-3 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.empty-state-text {
  margin-bottom: 3rem;
}

.empty-state-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #0066bf 0%, #0066bf64 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state-description {
  font-size: 1.25rem;
  color: #6b7280;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;
}

.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.use-case-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  border: 2px solid #f3f4f6;
  transition: all 0.3s ease;
  text-align: left;
}

.use-case-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0066bf;
}

.use-case-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
  border-radius: 12px;
  flex-shrink: 0;
  color: #0066bf;
}

.use-case-content h4 {
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 1.125rem;
}

.use-case-content p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.features-section {
  margin-bottom: 3rem;
}

.features-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0066bf64 0%, #0066bf 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.step-content h4 {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.empty-state-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.create-button {
  min-width: 220px;
  background: linear-gradient(135deg, #0066bf64 0%, #0066bf 100%);
  border: none;
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #0066bf64;
}

.secondary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.secondary-button:hover {
  background: #f9fafb;
  border-color: #0066bf;
  transform: translateY(-1px);
}

.info-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  color: #0066bf;
  font-size: 0.875rem;
  font-weight: 500;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .empty-state-title {
    font-size: 1.75rem;
  }
  
  .empty-state-description {
    font-size: 1.125rem;
  }
  
  .use-cases-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .empty-state-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .create-button,
  .secondary-button {
    width: 100%;
    justify-content: center;
  }
  
  .lucide-icon-wrapper {
    width: 120px;
    height: 120px;
  }
  
  .lucide-gift-icon {
    width: 50px;
    height: 50px;
  }
}
</style>