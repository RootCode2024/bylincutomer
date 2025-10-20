<template>
  <div class="p-8">
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
              @click="$emit('copyLink')"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600 transition"
            >
              <CopyIcon :size="16" v-if="!copied" />
              <div v-else class="flex items-center text-green-600">
                <CheckIcon :size="16" class="mr-1" /> copié
              </div>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Ce lien permet d'accéder et de valider votre panier partagé
          </p>

          <div class="mt-4 space-y-2">
            <button 
              @click="$emit('shareViaWhatsApp')"
              class="w-full flex items-center justify-center px-4 py-2.5 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
            >
              <MessageSquareIcon :size="16" class="mr-2" />
              Partager via WhatsApp
            </button>
            <button 
              @click="$emit('shareViaEmail')"
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
            <span class="font-medium">{{ formatPrice(finalPrice) }}</span>
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

        <div class="mt-6 flex space-x-4">
          <router-link 
            to="/dashboard" 
            class="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Mon compte
          </router-link>
          <router-link 
            to="/shop" 
            class="flex-1 text-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Continuer mes achats
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CheckCircleIcon, 
  LinkIcon, 
  CopyIcon, 
  MessageSquareIcon, 
  MailIcon, 
  InfoIcon, 
  CheckIcon 
} from 'lucide-vue-next';

defineProps({
  shareLink: String,
  copied: Boolean,
  sharedCartForm: Object,
  finalPrice: Number,
  selectedDeliveryOption: Object
});

defineEmits(['copyLink', 'shareViaWhatsApp', 'shareViaEmail']);

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
</script>