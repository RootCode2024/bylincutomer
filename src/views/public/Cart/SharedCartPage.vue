<template>
  <div class="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
    <!-- Barre de progression -->
    <div class="max-w-5xl mx-auto mb-12">
      <nav class="flex items-center justify-center">
        <ol class="flex items-center space-x-8">
          <li v-for="(step, index) in steps" :key="index" class="flex items-center">
            <button 
              @click="currentStep > index ? goToStep(index) : null"
              :class="[
                'flex items-center',
                currentStep >= index ? 'cursor-pointer' : 'cursor-default'
              ]"
            >
              <span :class="[
                'flex h-9 w-9 items-center justify-center rounded-full border-2',
                currentStep > index ? 'border-indigo-600 bg-indigo-600' : '',
                currentStep === index ? 'border-indigo-600' : 'border-gray-300',
                currentStep < index ? 'border-gray-300 bg-white' : ''
              ]">
                <span v-if="currentStep > index">
                  <CheckIcon :size="16" class="text-white" />
                </span>
                <span v-else class="text-sm font-medium">
                  {{ index + 1 }}
                </span>
              </span>
              <span :class="[
                'ml-3 text-sm font-medium',
                currentStep >= index ? 'text-indigo-600' : 'text-gray-500'
              ]">
                {{ step.name }}
              </span>
            </button>
            <ChevronRightIcon 
              v-if="index < steps.length - 1" 
              :size="16" 
              class="ml-8 text-gray-300"
            />
          </li>
        </ol>
      </nav>
    </div>

    <!-- Contenu dynamique des étapes -->
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/80">
      
      <!-- Étape 1 - Récapitulatif du panier -->
      <CartSummaryStep 
        v-if="currentStep === 0"
        :cart-items="cartItems"
        :subtotal="subtotal"
        :final-amount="finalAmount"
        @next-step="nextStep"
        @prev-step="prevStep"
      />

      <!-- Étape 2 - Options de livraison -->
      <DeliveryStep 
        v-if="currentStep === 1"
        :loading="uiStore.loading"
        :delivery-error="deliveryError"
        :countries="countries"
        :available-cities="availableCities"
        :available-districts="availableDistricts"
        :delivery-options="deliveryOptions"
        :selected-delivery-option="selectedDeliveryOption"
        :delivery-form="deliveryForm"
        :subtotal="subtotal"
        :delivery-cost="deliveryCost"
        :final-price="finalPrice"
        :loading-cities="loadingCities"
        :loading-districts="loadingDistricts"
        :loading-delivery-options="loadingDeliveryOptions"
        :is-delivery-form-valid="isDeliveryFormValid"
        @load-cities="loadCities"
        @load-districts="loadDistricts"
        @load-delivery-options="loadDeliveryOptions"
        @select-delivery-option="selectDeliveryOption"
        @validate-delivery="validateDelivery"
        @prev-step="prevStep"
      />

      <!-- Étape 3 - Informations du client -->
      <CustomerInfoStep 
        v-if="currentStep === 2"
        :shared-cart-form="sharedCartForm"
        @update:shared-cart-form="sharedCartForm = $event"
        @validate="nextStep"
        @prev-step="prevStep"
      />

      <!-- Étape 4 - Vérification -->
      <VerificationStep 
        v-if="currentStep === 3"
        :cart-items="cartItems"
        :final-price="finalPrice"
        :selected-delivery-option="selectedDeliveryOption"
        :delivery-form="deliveryForm"
        :selected-city="selectedCity"
        :selected-district="selectedDistrict"
        :delivery-cost="deliveryCost"
        :shared-cart-form="sharedCartForm"
        :loading-conf-and-share="loadingConfAndShare"
        @prev-step="prevStep"
        @confirm-and-share="confirmAndShare"
      />

      <!-- Étape 5 - Validation et partage -->
      <ShareStep 
        v-if="currentStep === 4"
        :share-link="shareLink"
        :copied="copied"
        :shared-cart-form="sharedCartForm"
        :final-price="finalPrice"
        :selected-delivery-option="selectedDeliveryOption"
        @copy-link="copyLink"
        @share-via-whatsapp="shareViaWhatsApp"
        @share-via-email="shareViaEmail"
      />
    </div>
  </div>
</template>

<script setup>
import { 
  ChevronRightIcon,
  CheckIcon
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useUIStore } from '@/stores/ui';
import router from '@/router';

// Composants d'étapes
import CartSummaryStep from '@/components/Checkout/steps/CartSummaryStep.vue';
import DeliveryStep from '@/components/Checkout/steps/DeliveryStep.vue';
import CustomerInfoStep from '@/components/Checkout/steps/CustomerInfoStep.vue';
import VerificationStep from '@/components/Checkout/steps/VerificationStep.vue';
import ShareStep from '@/components/Checkout/steps/ShareStep.vue';

const cartStore = useCartStore();
const uiStore = useUIStore();

// Configuration des étapes
const steps = [
  { name: 'Panier', icon: 'ShoppingCartIcon' },
  { name: 'Livraison', icon: 'TruckIcon' },
  { name: 'Informations', icon: 'UserIcon' },
  { name: 'Vérification', icon: 'CheckCircleIcon' },
  { name: 'Partage', icon: 'LinkIcon' }
];

const currentStep = ref(0);
const loadingConfAndShare = ref(false);
const deliveryError = ref(null);
const copied = ref(false);
const loadingCities = ref(false);
const loadingDistricts = ref(false);
const loadingDeliveryOptions = ref(false);

// Données du panier
const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.totalPrice);

// Données de livraison
const countries = ref([
  { code: 'BJ', name: 'Bénin' },
  { code: 'TG', name: 'Togo' }
]);

const availableCities = ref([]);
const availableDistricts = ref([]);
const deliveryOptions = ref([]);
const selectedDeliveryOption = ref(null);
const selectedCity = ref(null);
const selectedDistrict = ref(null);

const deliveryForm = ref({
  country: 'BJ',
  city: null,
  district: null,
  address: '',
  saveAddress: true
});

const sharedCartForm = ref({
  title: '',
  description: '',
  phone: '',
  closing_date: '',
  allow_edits: true
});

// Calcul des prix
const deliveryCost = computed(() => {
  if (!selectedDeliveryOption.value) return 0;

  // Livraison gratuite si seuil atteint
  if (
    selectedDeliveryOption.value.free_threshold &&
    subtotal.value >= selectedDeliveryOption.value.free_threshold
  ) {
    return 0;
  }

  // Utiliser le prix approprié selon le type de livraison
  if (deliveryForm.value.district) {
    const district = availableDistricts.value.find(
      (d) => d.id === deliveryForm.value.district
    );
    
    if (district) {
      if (selectedDeliveryOption.value.type === 'express') {
        return Number(district.express_price) || 0;
      } else {
        return Number(district.standard_price) || 0;
      }
    }
  }

  return Number(selectedDeliveryOption.value.price) || 0;
});

const getOptionPrice = (option) => {
  if (!deliveryForm.value.district) return option.price;
  
  const district = availableDistricts.value.find(
    (d) => d.id === deliveryForm.value.district
  );
  
  if (!district) return option.price;
  
  if (option.type === 'express') {
    return Number(district.express_price) || option.price;
  } else {
    return Number(district.standard_price) || option.price;
  }
};

// Prix final
const finalPrice = computed(() => {
  const basePrice = cartStore.finalPrice;
  return basePrice + deliveryCost.value;
});

const finalAmount = computed(() => finalPrice.value);

const shareLink = computed(() => {
  return cartStore.sharedCartToken 
    ? `${window.location.origin}/shared-cart/${cartStore.sharedCartToken}`
    : '';
});

// Validation du formulaire
const isDeliveryFormValid = computed(() => {
  return deliveryForm.value.district && 
         deliveryForm.value.address && 
         selectedDeliveryOption.value &&
         deliveryForm.value.address.trim().length > 0;
});

// Méthodes de navigation
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  } else {
    router.push('/cart');
  }
};

const goToStep = (index) => {
  if (index >= 0 && index < steps.length && index <= currentStep.value) {
    currentStep.value = index;
  }
};

// Méthodes de chargement des données
const loadCities = async () => {
  try {
    loadingCities.value = true;
    deliveryError.value = null;
    deliveryForm.value.city = null;
    deliveryForm.value.district = null;
    availableDistricts.value = [];
    deliveryOptions.value = [];
    selectedDeliveryOption.value = null;
    
    const response = await uiStore.getCitiesByCountry(deliveryForm.value.country);
    availableCities.value = response;
  } catch (error) {
    deliveryError.value = uiStore.error || "Impossible de charger les villes";
    console.error("Erreur de chargement des villes:", error);
  } finally {
    loadingCities.value = false;
  }
};

const loadDistricts = async () => {
  try {
    loadingDistricts.value = true;
    deliveryError.value = null;
    deliveryForm.value.district = null;
    availableDistricts.value = [];
    deliveryOptions.value = [];
    selectedDeliveryOption.value = null;
    
    // Trouver la ville sélectionnée
    selectedCity.value = availableCities.value.find(c => c.id === deliveryForm.value.city);
    
    if (!selectedCity.value) return;
    
    const response = await uiStore.getDistrictsByCity(deliveryForm.value.city);
    availableDistricts.value = response;
  } catch (error) {
    deliveryError.value = uiStore.error || "Impossible de charger les quartiers";
    console.error("Erreur de chargement des quartiers:", error);
  } finally {
    loadingDistricts.value = false;
  }
};

const loadDeliveryOptions = async () => {
  try {
    loadingDeliveryOptions.value = true;
    deliveryError.value = null;

    if (!deliveryForm.value.city) {
      deliveryOptions.value = [];
      return;
    }

    const response = await uiStore.getDeliveryOptions([
      deliveryForm.value.city, 
      deliveryForm.value.district
    ]);
    
    deliveryOptions.value = response;

    // Sélectionner l'option par défaut
    if (deliveryOptions.value.length > 0) {
      selectedDeliveryOption.value = deliveryOptions.value[0];
    }
  } catch (error) {
    deliveryError.value = uiStore.error || "Impossible de charger les options de livraison";
    console.error("Erreur de chargement des options:", error);
  } finally {
    loadingDeliveryOptions.value = false;
  }
};

const selectDeliveryOption = (option) => {
  selectedDeliveryOption.value = option;
};

const validateDelivery = () => {
  // Trouver le district sélectionné
  selectedDistrict.value = availableDistricts.value.find(d => d.id === deliveryForm.value.district);
  
  // Enregistrer les infos de livraison dans le store
  cartStore.setDeliveryInfo(
    {
      address: deliveryForm.value.address,
      city: selectedCity.value?.name || '',
      district: selectedDistrict.value?.name || '',
      country: deliveryForm.value.country
    },
    selectedDeliveryOption.value,
    deliveryCost.value
  );
  
  nextStep();
};

// Méthodes de partage
const copyLink = () => {
  if (!shareLink.value) return;
  
  try {
    navigator.clipboard.writeText(shareLink.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
    // Fallback pour les anciens navigateurs
    const textArea = document.createElement('textarea');
    textArea.value = shareLink.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
};

const shareViaWhatsApp = () => {
  if (!shareLink.value) return;
  
  const message = `Bonjour, pourrais-tu valider ce panier pour moi ?\n\n${shareLink.value}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
};

const shareViaEmail = () => {
  if (!shareLink.value) return;
  
  const subject = `Validation du panier: ${sharedCartForm.value.title || 'Mon panier'}`;
  const body = `Bonjour,\n\nPourrais-tu valider ce panier pour moi ?\n\nLien: ${shareLink.value}\n\nMerci !`;
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
};

// Confirmer et partager le panier
const confirmAndShare = async () => {
  try {
    loadingConfAndShare.value = true;

    // Valider les données requises
    if (!sharedCartForm.value.phone) {
      throw new Error('Le numéro de téléphone est requis');
    }

    // Stocker le panier partagé
    await cartStore.storeSharedCart(
      sharedCartForm.value, 
      finalPrice.value
    );

    // Nettoyer le localStorage
    localStorage.removeItem('sharedCartStep');

    // Passer à l'étape suivante
    nextStep();
  } catch (error) {
    console.error('Erreur lors du partage du panier :', error);
    deliveryError.value = error.message || 'Erreur lors du partage du panier';
    // TODO: Afficher un toast d'erreur
  } finally {
    loadingConfAndShare.value = false;
  }
};

// Formatage
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Exposer les méthodes de formatage pour les composants enfants
defineExpose({
  formatPrice,
  formatDate
});

// Initialisation
onMounted(async () => {
  // Charger les villes pour le pays par défaut
  await loadCities();
  
  // Restaurer l'étape sauvegardée
  const savedStep = localStorage.getItem('sharedCartStep');
  if (savedStep !== null) {
    const step = parseInt(savedStep);
    if (step >= 0 && step < steps.length) {
      currentStep.value = step;
    }
  }
  
  // Rediriger si panier vide
  if (cartItems.value.length === 0) {
    router.push('/shop');
  }
});

// Sauvegarder l'étape courante
watch(currentStep, (newStep) => {
  localStorage.setItem('sharedCartStep', newStep.toString());
});

// Charger les options de livraison quand le district change
watch(() => deliveryForm.value.district, (newDistrict) => {
  if (newDistrict) {
    selectedDistrict.value = availableDistricts.value.find(d => d.id === newDistrict);
    loadDeliveryOptions();
  }
});

onUnmounted(() => {
  if(cartStore.sharedCartToken != null) {
    cartStore.clearCart()
  }
})
</script>