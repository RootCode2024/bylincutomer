<template>
  <Transition name="modal">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="$emit('close')"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-6 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900 mb-5">
              Changer le mot de passe
            </h3>
            
            <div class="space-y-4">
              <PasswordInput 
                v-model="passwordForm.current"
                label="Mot de passe actuel"
                :show-password="showCurrentPassword"
                @toggle-visibility="showCurrentPassword = !showCurrentPassword"
              />
              
              <PasswordInput 
                v-model="passwordForm.new"
                label="Nouveau mot de passe"
                :show-password="showNewPassword"
                @toggle-visibility="showNewPassword = !showNewPassword"
              >
                <template #hint>
                  <p class="mt-1 text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial.
                  </p>
                </template>
              </PasswordInput>
              
              <PasswordInput 
                v-model="passwordForm.confirm"
                label="Confirmer le nouveau mot de passe"
                :show-password="showConfirmPassword"
                @toggle-visibility="showConfirmPassword = !showConfirmPassword"
              />
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button 
                @click="$emit('close')"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button 
                @click="changePassword"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PasswordInput from '@/components/ui/PasswordInput.vue'

const emit = defineEmits(['close'])

const authStore = useAuthStore()

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const changePassword = async () => {
  try {
    await authStore.changePassword(passwordForm.value)
    emit('close')
    passwordForm.value = { current: '', new: '', confirm: '' }
  } catch (error) {
    console.error("Error changing password:", error)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>