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
      <div v-if="currentStep === 0" class="p-8">
        <div class="flex items-start mb-8">
          <div class="bg-indigo-50 p-3 rounded-lg mr-4">
            <ShoppingCartIcon :size="24" class="text-indigo-600" />
          </div>
          <div>
            <h1 class="text-2xl font-light text-gray-800 tracking-tight">
              Votre panier
            </h1>
            <p class="text-gray-500 mt-1">
              {{ cartItems.length }} article{{ cartItems.length > 1 ? 's' : '' }} dans votre panier
            </p>
          </div>
        </div>

        <div class="space-y-6">
          <div v-for="item in cartItems" :key="item.id" class="flex border-b border-gray-100 pb-6">
            <div class="w-24 h-24 rounded-md bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover object-center">
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-gray-800">{{ item.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ item.variant }}</p>
              <div class="flex justify-between mt-3">
                <div class="flex items-center border rounded">
                  <span class="px-3">{{ item.quantity }}</span>
                </div>
                <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Sous-total</span>
            <span class="font-medium">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Livraison</span>
            <span class="font-medium text-green-600" v-if="deliveryCost === 0">Gratuite</span>
            <span v-else class="font-medium"> + {{formatPrice(deliveryCost)}}</span>
          </div>
          <div class="flex justify-between" v-if="cartStore.couponValue">
            <span class="">Reduction <strong>(COUPON)</strong></span>
            <span class="font-medium text-yellow-600"> - {{ formatPrice(cartStore.couponValue) }}</span>
          </div> 
          <hr>
          <div class="flex justify-between text-lg pt-3">
            <span class="font-medium">NET A PAYER</span>
            <span class="text-indigo-600 font-medium">{{ formatPrice(finalAmount()) }}</span>
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <button 
            @click="nextStep"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md"
          >
            Continuer
            <ArrowRightIcon :size="16" class="ml-2" />
          </button>
        </div>
      </div>

      <!-- Étape 2 - Options de livraison -->
      <div v-if="currentStep === 1" class="p-8">
        <div class="flex items-start mb-8">
          <div class="bg-indigo-50 p-3 rounded-lg mr-4">
            <TruckIcon :size="24" class="text-indigo-600" />
          </div>
          <div>
            <h1 class="text-2xl font-light text-gray-800 tracking-tight">
              Options de livraison
            </h1>
            <p class="text-gray-500 mt-1">
              Choisissez votre méthode et adresse de livraison
            </p>
          </div>
        </div>

        <div v-if="loading" class="text-center py-8">
          <Spinner class="mx-auto" />
          <p class="mt-4 text-gray-600">Chargement des options de livraison...</p>
        </div>

        <div v-else-if="deliveryError" class="text-center py-8">
          <TriangleAlert  class="mx-auto h-12 w-12 text-red-500" />
          <p class="mt-4 text-red-600">{{ deliveryError }}</p>
          <button 
            @click="loadCities"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>

        <div v-else class="grid md:grid-cols-3 gap-6">
          <!-- Colonne gauche - Adresse de livraison -->
          <div class="md:col-span-2 space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-800 mb-4">Adresse de livraison</h2>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <select 
                      v-model="deliveryForm.country"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      @change="loadCities"
                    >
                      <option v-for="country in countries" :value="country.code" :key="country.code">
                        {{ country.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <select 
                      v-model="deliveryForm.city"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      :disabled="!deliveryForm.country || loadingCities"
                      @change="loadDistricts"
                    >
                      <option value="">Sélectionnez une ville</option>
                      <option v-for="city in availableCities" :value="city.id" :key="city.id">
                        {{ city.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div v-if="availableDistricts.length > 0" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Quartier/District</label>
                    <select 
                      v-model="deliveryForm.district"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      :disabled="!deliveryForm.city || loadingDistricts"
                      @change="loadDeliveryOptions"
                    >
                      <option value="">Sélectionnez un quartier</option>
                      <option v-for="district in availableDistricts" :value="district.id" :key="district.id">
                        {{ district.name }} - {{ formatPrice(district.standard_price) }}
                      </option>
                    </select>
                </div>

                <div v-if="deliveryForm.district" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adresse détaillée</label>
                  <input 
                    v-model="deliveryForm.address"
                    type="text" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Rue, numéro, lieu-dit..."
                  >
                </div>

                <div class="flex items-center">
                  <input 
                    id="save-address"
                    type="checkbox" 
                    v-model="deliveryForm.saveAddress"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                  <label for="save-address" class="ml-2 block text-sm text-gray-700">
                    Enregistrer cette adresse pour mes prochaines commandes
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne droite - Options de livraison -->
          <div class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-800 mb-4">Méthode de livraison</h2>
              
              <div v-if="loadingDeliveryOptions" class="text-center py-4">
                <Spinner class="mx-auto" />
                <p class="mt-2 text-sm text-gray-600">Chargement...</p>
              </div>

              <div v-else-if="deliveryOptions.length === 0 && deliveryForm.district" class="text-center py-4">
                <p class="text-gray-500">Aucune option de livraison disponible</p>
              </div>

              <div v-else class="space-y-4">
                <div 
                  v-for="option in deliveryOptions" 
                  :key="option.id"
                  @click="selectDeliveryOption(option)"
                  :class="[
                    'border rounded-lg p-4 cursor-pointer transition',
                    selectedDeliveryOption?.id === option.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  ]"
                >
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input 
                        type="radio" 
                        :checked="selectedDeliveryOption?.id === option.id"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      >
                    </div>
                    <div class="ml-3">
                      <div class="flex justify-between">
                        <p><span class="block text-sm font-medium text-gray-700">{{ option.name }}</span></p>
                        <span class="text-sm font-medium">{{ formatPrice(getOptionPrice(option)) }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ option.delivery_time }}</p>
                      <p v-if="option.free_threshold" class="text-xs text-green-600 mt-1">
                        Livraison gratuite à partir de {{ formatPrice(option.free_threshold) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Résumé -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-800 mb-4">Résumé</h2>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Sous-total</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Livraison</span>
                  <span v-if="deliveryCost > 0">{{ formatPrice(deliveryCost) }}</span>
                  <span v-else class="text-green-600">Gratuite</span>
                </div>
                <div v-if="cartStore.couponValue" class="flex justify-between">
                  <span class="text-gray-600">Réduction</span>
                  <span class="text-yellow-600">-{{ formatPrice(cartStore.couponValue) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span class="text-indigo-600">{{ formatPrice(finalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-between">
          <button 
            @click="prevStep"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <ArrowLeftIcon :size="16" class="mr-2" />
            Retour
          </button>
          <button 
            @click="validateDelivery"
            :disabled="!isDeliveryFormValid"
            :class="[
              'px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md',
              !isDeliveryFormValid ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            Continuer
            <ArrowRightIcon :size="16" class="ml-2" />
          </button>
        </div>
      </div>

      <!-- Étape 3 - Informations du client -->
      <div v-if="currentStep === 2" class="p-8">
        <div class="flex items-start mb-8">
          <div class="bg-indigo-50 p-3 rounded-lg mr-4">
            <UserIcon :size="24" class="text-indigo-600" />
          </div>
          <div>
            <h1 class="text-2xl font-light text-gray-800 tracking-tight">
              Informations de livraison
            </h1>
            <p class="text-gray-500 mt-1">
              Renseignez les détails pour le partage du panier
            </p>
          </div>
        </div>

        <SharedCartForm 
          v-model="sharedCartForm"
          @validate="nextStep"
        />

        <div class="mt-8 flex justify-between">
          <button 
            @click="prevStep"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <ArrowLeftIcon :size="16" class="mr-2" />
            Retour
          </button>
          <button 
            @click="nextStep"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md"
          >
            Vérifier
            <ArrowRightIcon :size="16" class="ml-2" />
          </button>
        </div>
      </div>

      <!-- Étape 4 - Vérification -->
      <div v-if="currentStep === 3" class="p-8">
        <div class="flex items-start mb-8">
          <div class="bg-indigo-50 p-3 rounded-lg mr-4">
            <CheckCircleIcon :size="24" class="text-indigo-600" />
          </div>
          <div>
            <h1 class="text-2xl font-light text-gray-800 tracking-tight">
              Vérification
            </h1>
            <p class="text-gray-500 mt-1">
              Confirmez les détails avant partage du panier
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Colonne gauche - Détails du panier -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <ShoppingCartIcon :size="18" class="mr-2 text-indigo-500" />
              Votre panier
            </h2>
            
            <div class="bg-gray-50/50 p-4 rounded-lg border border-gray-200/70">
              <div class="space-y-4">
                <div v-for="item in cartItems" :key="item.id" class="flex">
                  <div class="w-16 h-16 rounded-md bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                    <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover object-center">
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-center text-xs bg-gray-200 object-cover object-center"
                    >
                      No Image
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-gray-800 text-sm">{{ item.name }}</h3>
                    <div class="flex justify-end mt-2 text-sm">
                      <span class="text-gray-600">× {{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-gray-200/70 space-y-2 text-sm">
                <div class="flex justify-between font-medium pt-2">
                  <span>NET A PAYER</span>
                  <span class="text-indigo-600">{{ formatPrice(finalPrice) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne droite - Détails de livraison -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <TruckIcon :size="18" class="mr-2 text-indigo-500" />
              Livraison
            </h2>
            
            <div class="bg-gray-50/50 p-4 rounded-lg border border-gray-200/70 space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Méthode de livraison</h3>
                <p class="text-gray-600">{{ selectedDeliveryOption?.name }}</p>
                <p class="text-xs text-gray-500">{{ selectedDeliveryOption?.delivery_time }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Adresse</h3>
                <p class="text-gray-600">{{ deliveryForm.address }}</p>
                <p class="text-gray-600">{{ selectedDistrict?.name }}, {{ selectedCity?.name }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Coût de livraison</h3>
                <p class="text-gray-600">{{ formatPrice(deliveryCost) }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Téléphone</h3>
                <p class="text-gray-600">{{ sharedCartForm.phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-between">
          <button 
            @click="prevStep"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <ArrowLeftIcon :size="16" class="mr-2" />
            Modifier
          </button>
          <button 
            @click="confirmAndShare"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md"
          >
            <SendIcon :size="16" class="mr-2" />
            Confirmer et partager
          </button>
        </div>
      </div>

      <!-- Étape 5 - Validation et partage -->
      <div v-if="currentStep === 4" class="p-8">
        <div class="flex items-start mb-8">
          <div class="bg-green-50 p-3 rounded-lg mr-4">
            <CheckCircleIcon :size="24" class="text-green-600" />
          </div>
          <div>
            <h1 class="text-2xl font-light text-gray-800 tracking-tight">
              Panier partagé avec succès !
            </h1>
            <p class="text-gray-500 mt-1">
              Voici les détails pour accéder à votre panier partagé
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Colonne gauche - Lien de partage -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <LinkIcon :size="18" class="mr-2 text-indigo-500" />
              Partagez ce lien
            </h2>
            
            <div class="bg-gray-50/50 p-4 rounded-lg border border-gray-200/70">
              <div class="relative">
                <input 
                  :value="shareLink"
                  readonly
                  class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white truncate pr-10"
                >
                <button 
                  @click="copyLink"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600 transition"
                >
                  <CopyIcon :size="16" v-if="!copied" />
                  <div v-else><CheckIcon :size="16" /> copié</div>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Ce lien permet d'accéder et de valider votre panier partagé
              </p>

              <div class="mt-4 space-y-2">
                <button 
                  @click="shareViaWhatsApp"
                  class="w-full flex items-center justify-center px-4 py-2.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
                >
                  <MessageSquareIcon :size="16" class="mr-2" />
                  Partager via WhatsApp
                </button>
                <button 
                  @click="shareViaEmail"
                  class="w-full flex items-center justify-center px-4 py-2.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition"
                >
                  <MailIcon :size="16" class="mr-2" />
                  Envoyer par email
                </button>
              </div>
            </div>
          </div>

          <!-- Colonne droite - Récapitulatif -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <InfoIcon :size="18" class="mr-2 text-indigo-500" />
              Récapitulatif
            </h2>
            
            <div class="bg-gray-50/50 p-4 rounded-lg border border-gray-200/70 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Statut</span>
                <span class="font-medium text-green-600">En attente de validation</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Date de création</span>
                <span>{{ formatDate(new Date()) }}</span>
              </div>
              <div v-if="sharedCartForm.closing_date" class="flex justify-between text-sm">
                <span class="text-gray-600">Date limite</span>
                <span>{{ formatDate(sharedCartForm.closing_date) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">NET A PAYER</span>
                <span class="font-medium">{{ formatPrice(cartStore.finalPrice) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Méthode de livraison</span>
                <span>{{ selectedDeliveryOption?.name }}</span>
              </div>
            </div>

            <div class="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div class="flex">
                <InfoIcon :size="16" class="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p class="text-sm text-blue-700">
                  Vous recevrez une notification lorsque le panier sera validé.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <router-link 
            to="/dashboard" 
            class="text-sm text-gray-600 hover:text-gray-800 transition flex items-center"
          >
            <ArrowLeftIcon :size="16" class="mr-1.5" />
            Retour à mon compte
          </router-link>
          <router-link 
            to="/shop" 
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm hover:shadow-md"
          >
            Continuer mes achats
            <ArrowRightIcon :size="16" class="ml-2" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ShoppingCartIcon,
  UserIcon,
  CheckCircleIcon,
  LinkIcon,
  CopyIcon,
  MessageSquareIcon,
  MailIcon,
  InfoIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  TruckIcon,
  SendIcon,
  TriangleAlert
} from 'lucide-vue-next';
import { ref, computed, onMounted, watch } from 'vue';
import SharedCartForm from '@/components/Product/SharedCartForm.vue';
import { useCartStore } from '@/stores/cart';
import router from '@/router';
import Spinner from '@/components/ui/LoadingSpinner.vue';
import axios from 'axios';
import api from '@/api/axiosConfig'

const cartStore = useCartStore();

// Configuration des étapes
const steps = [
  { name: 'Panier', icon: ShoppingCartIcon },
  { name: 'Livraison', icon: TruckIcon },
  { name: 'Informations', icon: UserIcon },
  { name: 'Vérification', icon: CheckCircleIcon },
  { name: 'Partage', icon: LinkIcon }
];

const currentStep = ref(0);
const loading = ref(false);
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
      // Déterminer le prix en fonction du type de livraison sélectionné
      if (selectedDeliveryOption.value.type === 'express') {
        return Number(district.express_price) || 0;
      } else {
        return Number(district.standard_price) || 0;
      }
    }
  }

  // Fallback au prix de l'option de livraison
  return Number(selectedDeliveryOption.value.price) || 0;
});

// Nouvelle méthode pour obtenir le prix d'une option
const getOptionPrice = (option) => {
  if (!deliveryForm.value.district) return option.price;
  
  const district = availableDistricts.value.find(
    (d) => d.id === deliveryForm.value.district
  );
  
  if (!district) return option.price;
  
  // Retourner le prix approprié selon le type d'option
  if (option.type === 'express') {
    return Number(district.express_price) || option.price;
  } else {
    return Number(district.standard_price) || option.price;
  }
};

// Prix final
const finalPrice = computed(() => {
  return cartStore.finalPrice + deliveryCost.value;
});

const finalAmount = () => finalPrice.value;

const shareLink = computed(() => {
  return `${window.location.origin}/shared-cart/${cartStore.sharedCartToken}`;
});

// Validation du formulaire
const isDeliveryFormValid = computed(() => {
  return deliveryForm.value.district && 
         deliveryForm.value.address && 
         selectedDeliveryOption.value;
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
  currentStep.value = index;
};

// Méthodes de chargement des données
const loadCities = async () => {
  try {
    loadingCities.value = true;
    deliveryError.value = null;
    deliveryForm.value.city = null;
    deliveryForm.value.district = null;
    
    const response = await api.get(`/countries/${deliveryForm.value.country}/cities`);
    availableCities.value = response;
  } catch (error) {
    deliveryError.value = "Impossible de charger les villes";
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
    
    // Trouver la ville sélectionnée
    selectedCity.value = availableCities.value.find(c => c.id === deliveryForm.value.city);
    
    if (!selectedCity.value) return;
    
    const response = await api.get(`/cities/${deliveryForm.value.city}/districts`);
    availableDistricts.value = response;
    
    // Charger les options de livraison
    await loadDeliveryOptions();
  } catch (error) {
    deliveryError.value = "Impossible de charger les quartiers";
    console.error("Erreur de chargement des quartiers:", error);
  } finally {
    loadingDistricts.value = false;
  }
};

const loadDeliveryOptions = async () => {
  try {
    loadingDeliveryOptions.value = true;
    deliveryError.value = null;

    const params = new URLSearchParams();
    params.append('city', deliveryForm.value.city);

    if (deliveryForm.value.district) {
      params.append('district', deliveryForm.value.district);
    }

    const response = await api.get(`/delivery/options?${params.toString()}`);
    deliveryOptions.value = response;

    // Sélectionner l'option par défaut
    if (deliveryOptions.value.length > 0) {
      selectedDeliveryOption.value = deliveryOptions.value[0];
    }
  } catch (error) {
    deliveryError.value = "Impossible de charger les options de livraison";
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
  
  // Préparer les données de livraison
  const deliveryInfoData = {
    firstName: deliveryForm.value.firstName || '',
    lastName: deliveryForm.value.lastName || '',
    email: deliveryForm.value.email || '',
    phone: deliveryForm.value.phone || '',
    address: deliveryForm.value.address || '',
    additionalAddress: deliveryForm.value.additionalAddress || '',
    postalCode: deliveryForm.value.postalCode || '',
    deliveryOption: selectedDeliveryOption.value,
    deliveryCost: deliveryCost.value,
    city: selectedCity.value?.name || '',
    district: selectedDistrict.value?.name || ''
  };
  
  // Enregistrer les infos de livraison dans le store
  cartStore.setDeliveryInfo(
    deliveryInfoData,
    selectedDeliveryOption.value,
    deliveryCost.value,
    selectedCity.value?.name || '',
    selectedDistrict.value?.name || ''
  );
  
  nextStep();
};

// Méthodes de partage
const copyLink = () => {
  try {
    navigator.clipboard.writeText(shareLink.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
};

const shareViaWhatsApp = () => {
  const message = `Bonjour, pourrais-tu valider ce panier pour moi ?\n\n${shareLink.value}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
};

const shareViaEmail = () => {
  const subject = `Validation du panier: ${sharedCartForm.value.title}`;
  const body = `Bonjour,\n\nPourrais-tu valider ce panier pour moi ?\n\nLien: ${shareLink.value}\n\nMerci !`;
  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
};

// Confirmer et partager le panier
const confirmAndShare = async () => {
  try {
    // Synchroniser le panier si nécessaire
    if (!cartStore.currentCartId) {
      await cartStore.syncCartWithServer(true);
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
    // TODO: Afficher un toast d'erreur
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
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Initialisation
onMounted(() => {
  // Charger les villes pour le pays par défaut
  loadCities();
  
  // Restaurer l'étape sauvegardée
  const savedStep = localStorage.getItem('sharedCartStep');
  if (savedStep !== null) {
    currentStep.value = parseInt(savedStep);
  }
  
  // Rediriger si panier vide
  if (cartItems.value.length === 0) {
    router.push('/shop');
  }
});

// Sauvegarder l'étape courante
watch(currentStep, (newStep) => {
  localStorage.setItem('sharedCartStep', newStep);
});
</script>