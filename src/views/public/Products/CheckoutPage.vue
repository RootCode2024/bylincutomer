<template>
  <div class="max-w-6xl mx-auto p-5 mt-12 mb-12">
    <!-- Progress Bar -->
    <div class="mb-10">
      <div class="flex justify-between relative">
        <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-10"></div>
        
        <div 
          v-for="(step, index) in steps" 
          :key="step.id" 
          class="flex flex-col items-center relative z-20 cursor-pointer"
          @click="navigateToStep(index)"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 transition-all duration-300"
            :class="{
              'bg-blue-500 text-white': currentStep === index,
              'bg-green-500 text-white': currentStep > index,
              'bg-gray-200 text-gray-600': currentStep < index
            }"
          >
            {{ index + 1 }}
          </div>
          <div 
            class="text-sm font-medium transition-colors duration-300"
            :class="{
              'text-blue-500 font-semibold': currentStep === index,
              'text-green-500': currentStep > index,
              'text-gray-500': currentStep < index
            }"
          >
            {{ step.label }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Form Sections -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
          
          <!-- Shipping Address -->
          <section v-show="currentStep === 0" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Adresse de livraison</h2>
            
            <div v-if="normalizedUserAddresses" class="mb-3">
              <label class="block text-xs text-gray-500 mb-2">
                Choisir parmi vos adresses enregistrées : 
              </label>
              <select
                v-model="selectedAddress"
                @change="onAddressSelect"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition text-sm"
              >
                <option value="">-- Sélectionnez une adresse --</option>
                <option
                  v-for="(address, index) in normalizedUserAddresses"
                  :key="index"
                  :value="address.id"
                >
                  {{ address.address_line }}
                </option>
                <option value="new">Nouvelle Adresse</option>
              </select>
            </div>
            
            <div v-if="selectedAddress === 'new' || !normalizedUserAddresses" class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type d'adresse *</label>
                <select 
                  v-model="shipping.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Domicile">Domicile</option>
                  <option value="Bureau">Bureau</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <input 
                  type="text" 
                  v-model="shipping.address_line" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <input 
                  type="text" 
                  v-model="shipping.city" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Etat</label>
                <input 
                  type="text" 
                  v-model="shipping.state" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                <select 
                  v-model="shipping.country_id" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option v-for="(country, index) in countries" :key="index" :value="country.id">{{ country.name }}</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Shipping Method -->
          <section v-show="currentStep === 1" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Méthode de livraison</h2>
            
            <div class="space-y-3">
              <!-- BENIN Local Options -->
              <template v-if="shipping.country_id === 4">
                <!-- Standard - Paiement à la livraison -->
                <div 
                  class="flex items-center p-4 border rounded-lg cursor-pointer transition-all"
                  :class="{ 
                    'border-blue-500 bg-blue-50': shipping.method === 'local_standard',
                    'border-gray-200': shipping.method !== 'local_standard'
                  }"
                  @click="shipping.method = 'local_standard'"
                >
                  <input 
                    type="radio" 
                    :checked="shipping.method === 'local_standard'"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  >
                  <div class="flex-1 ml-4">
                    <div class="font-medium text-gray-900">{{ shippingMethods[1].name }}</div>
                    <div class="text-sm text-gray-600">{{ shippingMethods[1].details }}</div>
                  </div>
                  <div class="font-semibold"></div>
                </div>

                <!-- Express -->
                <div 
                  class="flex items-center p-4 border rounded-lg cursor-pointer transition-all"
                  :class="{ 
                    'border-blue-500 bg-blue-50': shipping.method === 'local_express',
                    'border-gray-200': shipping.method !== 'local_express'
                  }"
                  @click="shipping.method = 'local_express'"
                >
                  <input 
                    type="radio" 
                    :checked="shipping.method === 'local_express'"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  >
                  <div class="flex-1 ml-4">
                    <div class="font-medium text-gray-900">{{ shippingMethods[0].name }}</div>
                    <div class="text-sm text-gray-600">{{ shippingMethods[0].details }}</div>
                  </div>
                  <div class="font-semibold">{{ currencyStore.formatCurrency(shippingMethods[0].price) }}</div>
                </div>
              </template>

              <!-- INTERNATIONAL Options -->
              <template v-else>
                <!-- DHL Express -->
                <div 
                  class="flex items-center p-4 border rounded-lg cursor-pointer transition-all"
                  :class="{ 
                    'border-blue-500 bg-blue-50': shipping.method === 'dhl_express',
                    'border-gray-200': shipping.method !== 'dhl_express'
                  }"
                  @click="shipping.method = 'dhl_express'"
                >
                  <input 
                    type="radio" 
                    :checked="shipping.method === 'dhl_express'"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  >
                  <div class="flex-1 ml-4">
                    <div class="font-medium text-gray-900">{{ shippingMethods[2].name }}</div>
                    <div class="text-sm text-gray-600">{{ shippingMethods[2].details }}</div>
                  </div>
                  <div class="font-semibold">{{ currencyStore.formatCurrency(shippingMethods[2].price) }}</div>
                </div>
              </template>
            </div>

            <!-- Payment Notice -->
            <div v-if="shipping.method === 'local_standard'" class="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg">
              💵 Paiement en espèces à la livraison uniquement
            </div>
          </section>

          <!-- Payment -->
          <section v-show="currentStep === 2" class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Paiement</h2>
            
            <div class="flex border-b border-gray-200">
              <button 
                v-for="tab in paymentTabs" 
                :key="tab.id" 
                class="px-5 py-3 font-medium text-sm border-b-2 transition-colors duration-200"
                :class="{ 
                  'text-blue-600 border-blue-600': paymentMethod === tab.id,
                  'text-gray-500 border-transparent hover:text-gray-700': paymentMethod !== tab.id
                }"
                @click="paymentMethod = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Mobile Money Options -->
            <div v-if="paymentMethod === 'mobile_money'" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  v-for="method in mobileMoneyMethods" 
                  :key="method.id"
                  class="p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 hover:border-blue-300"
                  :class="{ 'border-blue-500 bg-blue-50': selectedMobileMoney === method.id, 'border-gray-200': selectedMobileMoney !== method.id }"
                  @click="selectMobileMoney(method.id)"
                >
                  <div class="mb-3">
                    <div class="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                  </div>
                  <div class="text-sm font-medium">{{ method.name }}</div>
                </div>
              </div>

              <div v-if="selectedMobileMoney" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</label>
                <input 
                  type="tel" 
                  v-model="mobilePayment.phone" 
                  placeholder="229XXXXXXXX"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
              </div>
            </div>

            <!-- Credit Card Form -->
            <div v-if="paymentMethod === 'credit_card'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de carte *</label>
                <input 
                  type="text" 
                  v-model="payment.cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom sur la carte *</label>
                <input 
                  type="text" 
                  v-model="payment.cardName" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">MM/AA *</label>
                  <input 
                    type="text" 
                    v-model="payment.expiryDate" 
                    placeholder="12/25"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                  <input 
                    type="text" 
                    v-model="payment.cvv" 
                    placeholder="123"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                </div>
              </div>
            </div>

            <!-- PayPal -->
            <div v-if="paymentMethod === 'paypal'" class="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <div class="mb-4">
                <div class="w-16 h-8 bg-blue-600 rounded mx-auto flex items-center justify-center text-white font-bold text-xs">
                  PayPal
                </div>
              </div>
              <p class="text-gray-600">Vous serez redirigé vers PayPal pour finaliser votre paiement</p>
            </div>
          </section>

          <!-- Confirmation
          <section v-show="currentStep === 3" class="text-center py-12">
            <div class="max-w-md mx-auto">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 class="text-2xl font-semibold text-gray-900 mb-2">Commande confirmée !</h2>
              <p class="text-lg text-blue-600 mb-4">N° de commande: {{ orderNumber }}</p>
              <p class="text-gray-600 mb-6">Nous avons envoyé les détails à <strong>{{ shipping.email }}</strong></p>
              
              <div class="bg-gray-50 rounded-lg p-4 text-left space-y-3 mb-6">
                <div class="flex justify-between">
                  <span class="text-gray-600">Date estimée de livraison</span>
                  <span class="font-medium">{{ estimatedDelivery }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Méthode de livraison</span>
                  <span class="font-medium">{{ selectedShippingMethod.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Adresse de livraison</span>
                  <span class="font-medium">{{ shipping.address }}, {{ shipping.city }}</span>
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
          </section> -->

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button 
              v-if="currentStep > 0"
              @click="currentStep--"
              class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Retour
            </button>
            <div v-else></div>

            <button 
              v-if="currentStep < 3"
              @click="nextStep"
              class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              :disabled="!canProceed"
              :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
            >
              {{ currentStep === 2 ? 'Finaliser la commande' : 'Continuer' }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column - Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Votre commande</h3>
          
          <div class="space-y-3 mb-4">
            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
              <span>{{ item.name }} (x{{ item.quantity }})</span>
              <span>{{ currencyStore.formatCurrency(item.price * item.quantity) }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-3 space-y-2">
            <div class="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{{ currencyStore.formatCurrency(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Livraison</span>
              <span>{{ currencyStore.formatCurrency(shippingCost) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>{{ currencyStore.formatCurrency(orderTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useOrdersStore } from '@/stores/order';
import { useCurrencyStore } from '@/stores/currency';
import { useUIStore } from '@/stores/ui';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const orderStore = useOrdersStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const currencyStore = useCurrencyStore();

// Steps configuration
const steps = ref([
  { id: 'shipping', label: 'Livraison' },
  { id: 'method', label: 'Expédition' },
  { id: 'payment', label: 'Paiement' },
  { id: 'confirmation', label: 'Confirmation' }
]);

const currentStep = ref(0);
const selectedAddress = ref(null);

// Shipping form
const shipping = reactive({
  type: '',
  address_line: '',
  city: '',
  state: '',
  country_id: 4, // Bénin par défaut
  email: authStore.user.email || 'user@example.com',
  method: ''
});

// Payment form
const payment = reactive({
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: ''
});

const paymentMethod = ref('mobile_money');
const selectedMobileMoney = ref(null);

const paymentTabs = ref([
  { id: 'mobile_money', label: 'Mobile Money' },
  { id: 'credit_card', label: 'Carte de crédit' },
  { id: 'paypal', label: 'PayPal' }
]);

const mobileMoneyMethods = ref([
  { id: 'mtn', name: 'MTN Mobile Money' },
  { id: 'moov', name: 'Moov Money' },
  { id: 'orange', name: 'Orange Money' }
]);

const mobilePayment = reactive({
  phone: '',
  provider: ''
});

const shippingMethods = ref([
  {
    id: 'local_express',
    name: 'Express (Cotonou)',
    details: '3000 FCFA - Livraison en moins de 2h dans Cotonou',
    price: 3000,
    availableCountries: [4], // ID du Bénin
    paymentType: 'cash_on_delivery'
  },
  {
    id: 'local_standard',
    name: 'Standard (Bénin)',
    details: 'Prix et paiement négocié à la livraison - Moins de 24h',
    price: 0, // à ajuster dynamiquement si besoin
    availableCountries: [4],
    paymentType: 'cash_on_delivery'
  },
  {
    id: 'dhl_express',
    name: 'Livraison Internationale DHL',
    details: '25000 FCFA - Livraison internationale par DHL',
    price: 25000,
    availableCountries: [76, 84], // Ex : France, Côte d’Ivoire
    paymentType: 'online'
  }
]);


const cartItems = cartStore.items;

const orderNumber = ref(`CMD-${Math.floor(Math.random() * 1000000)}`);
const estimatedDelivery = computed(() => {
  const date = new Date();
  if (shipping.method === 'local_standard') date.setDate(date.getDate() + 2);
  else if (shipping.method === 'local_express') date.setHours(date.getHours() + 5);
  else if (shipping.method === 'dhl_express') date.setDate(date.getDate() + 4);
  else date.setDate(date.getDate() + 3);
  
  return date.toLocaleDateString('fr-FR');
});

// Computed properties
const selectedShippingMethod = computed(() => {
  return shippingMethods.value.find(method => method.id === shipping.method) || {};
});

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shippingCost = computed(() => {
  return selectedShippingMethod.value.price || 0;
});

const orderTotal = computed(() => {
  return cartStore.totalPrice + shippingCost.value;
});

const canProceed = computed(() => {
  switch(currentStep.value) {
    case 0:
      if (selectedAddress.value && selectedAddress.value !== 'new') return true;
      return shipping.type && shipping.address_line && 
             shipping.city && shipping.state && shipping.country_id;
    case 1:
      return shipping.method;
    case 2:
      if (paymentMethod.value === 'mobile_money') {
        return selectedMobileMoney.value && mobilePayment.phone;
      } else if (paymentMethod.value === 'credit_card') {
        return payment.cardNumber && payment.cardName && payment.expiryDate && payment.cvv;
      }
      return true;
    default:
      return true;
  }
});

const userAddresses = ref(authStore.user.addresses);
const normalizedUserAddresses = computed(() => {
  const value = userAddresses.value;
  if (Array.isArray(value)) {
    return value;
  } else if (value && typeof value === 'object') {
    return [value];
  } else {
    return [];
  }
});

// Methods

function navigateToStep(index) {
  if (index < currentStep.value) {
    currentStep.value = index;
  }
}

function selectMobileMoney(method) {
  selectedMobileMoney.value = method;
  mobilePayment.provider = method;
}

function nextStep() {
  if (canProceed.value) {
    if (currentStep.value === 2) {
      console.log('poursuivre : ', shipping, selectedAddress.value, mobilePayment);
      // Soumettre la commande
      submitOrder(shipping, selectedAddress.value, mobilePayment);
    }
    currentStep.value++;
  }
}

function onAddressSelect() {
  if (selectedAddress.value && selectedAddress.value !== 'new') {
    const address = normalizedUserAddresses.value.find(a => a.id === selectedAddress.value);
    if (address) {
      Object.assign(shipping, {
        type: address.type || 'Domicile',
        address_line: address.address_line || '',
        city: address.city || '',
        state: address.state || '',
        country_id: address.country_id || 4
      });
    }
  }
}

async function submitOrder(shipping, selectedAddress) {
    // 1. Sauvegarde du panier (s'il n'existe pas déjà côté serveur)
    if (!cartStore.currentCartId) {
        await cartStore.syncCartWithServer(false);
    }

    // Si le panier n'a toujours pas d'ID, on ne peut pas continuer
    if (!cartStore.currentCartId) {
        return;
    } else {
        console.log('cartStore.currentCartId', cartStore.currentCartId);
    }
    

    // 2. Sauvegarde de l'adresse si c'est une nouvelle adresse
    let addressId = selectedAddress;
    if (selectedAddress === 'new') {
        const newAddress = {
            type: shipping.type,
            address_line: shipping.address_line,
            city: shipping.city,
            state: shipping.state,
            country_id: shipping.country_id,
        };
        const response = await userStore.updateAddress(true, newAddress);
        addressId = response.data.id;
    }


    // 3. On définit le prix final dans le store
    cartStore.finalPrice = orderTotal.value;

    // // 4. Envoi de la commande avec :
    // // - L'ID de l'adresse
    // // - Le mode de paiement
    // // - Les données (gérées automatiquement par les stores)
    // // - L'ID du panier (géré automatiquement par cartStore)
    const datas = ref({});
    // if (paymentMethod.value === 'mobile_money') {
    //   datas.value = {
    //     mobilePayment.phone
    //   }
    // }
    // console.log('orderStore.createOrder', addressId, paymentMethod.value, datas.value);
    const response = await orderStore.createOrder(addressId, paymentMethod.value, mobilePayment.phone);

        // DÉBOGAGE - Affiche la structure complète
    console.log('🔵 2/3 - Réponse brute:', response);
    console.log('🔵 2/3 - Données utiles:', {
      message: response.message,
      token: response.token
    });

    // Vérification cruciale
   if (!response?.token?.url) {
     throw new Error('URL de paiement manquante dans la réponse');
    }

    console.log('🟢 3/3 - Redirection vers:', response);
    
    // Redirection vers le paiement
    window.location.href = response.token.url;

}

const countries = ref([]);

onMounted(async () => {
  await uiStore.getCountries();
  userAddresses.value = authStore.user.addresses;
  if (authStore.user.addresses) {
    onAddressSelect();
  }
  countries.value = uiStore.countries;
  console.log('countries', uiStore.countries);
});
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>