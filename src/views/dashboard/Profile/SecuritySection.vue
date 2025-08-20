<template>
  <div class="px-8 py-6">
    <h2 class="text-xl font-semibold text-gray-900 flex items-center">
      <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Sécurité du compte
    </h2>
    
    <div class="mt-6 space-y-5">
      <SecurityItem 
        title="Email vérifié"
        :status="authStore.user.email_verified_at ? 'secure' : 'unverified'"
        description="Votre adresse email est vérifiée et protégée."
      />
      
      <SecurityItem 
        title="Mot de passe"
        status="medium"
        description="Dernière modification il y a 3 mois. Pour votre sécurité, nous recommandons de le changer régulièrement."
      >
        <button 
          @click="$emit('change-password')"
          type="button"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Changer le mot de passe
        </button>
      </SecurityItem>
      
      <SecurityItem 
        title="Authentification à deux facteurs"
        status="inactive"
        description="Ajoutez une couche de sécurité supplémentaire à votre compte."
      >
        <button 
          @click="$emit('enable-2fa')"
          type="button"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Activer la 2FA
        </button>
      </SecurityItem>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import SecurityItem from '@/components/profile/SecurityItem.vue'

const authStore = useAuthStore()
defineEmits(['change-password', 'enable-2fa'])
</script>