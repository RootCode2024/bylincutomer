<template>
  <div class="bg-white shadow-xl rounded-2xl overflow-hidden divide-y divide-gray-200/60">
    <!-- Section Avatar et Info basique -->
    <div class="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div class="flex items-center space-x-6">
        <div class="relative">
          <img class="h-20 w-20 rounded-full ring-4 ring-white/80 shadow-md" :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.fullName" alt="Photo de profil">
          <button class="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user.profile.first_name }}</h2>
          <p class="text-gray-600 mt-1">{{ user.bio || 'Utilisateur standard' }}</p>
          <p class="text-sm text-gray-500 mt-1">Membre depuis le {{ formatDate(authStore.user.created_at) || '01 juin 2022' }}</p>
        </div>
      </div>
    </div>

    <PersonalInfoSection
        v-model:first_name="user.first_name"
        v-model:last_name="user.last_name"
        v-model:email="user.email"
        v-model:phone="user.phone"
        v-model:bio="user.bio"
        v-model:gender="user.gender"
        v-model:birth_date="user.birth_date"
    />
    <AddressSection @add-address="showAddressModal = true" />
    <SecuritySection 
      @change-password="showPasswordModal = true" 
      @enable-2fa="showTwoFAModal = true" 
    />
    <DangerZoneSection @delete-account="showDeleteConfirmation = true" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { formatDate } from '@/utils/dateUtils'
import { useAuthStore } from '@/stores/auth'
import PersonalInfoSection from './PersonalInfoSection.vue'
import AddressSection from './AddressSection.vue'
import SecuritySection from './SecuritySection.vue'
import DangerZoneSection from './DangerZoneSection.vue'

const authStore = useAuthStore()

const user = reactive({
  first_name: authStore.user.profile.first_name,
  last_name: authStore.user.profile.last_name,
  fullName: authStore.fullName,
  email: authStore.user.email,
  phone: authStore.user.profile.phone,
  avatar: authStore.user.profile.avatar,
  gender: authStore.user.profile.gender,
  birth_date: authStore.user.profile.birth_date,
  email_verified_at: authStore.user.email_verified_at,
  bio: authStore.user.profile.bio,
  created_at: authStore.user.created_at
})

const showAddressModal = ref(false)
const showPasswordModal = ref(false)
const showTwoFAModal = ref(false)
const showDeleteConfirmation = ref(false)
</script>