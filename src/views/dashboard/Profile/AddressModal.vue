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
              {{ isEditing ? 'Modifier une adresse' : 'Ajouter une adresse' }}
            </h3>
            
            <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              <div class="sm:col-span-2">
                <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                <select 
                  v-model="localAddress.type"
                  id="type"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                >
                  <option value="Domicile">Domicile</option>
                  <option value="Bureau">Bureau</option>
                </select>
              </div>
              
              <div class="sm:col-span-2">
                <label for="address_line" class="block text-sm font-medium text-gray-700">Adresse</label>
                <input 
                  v-model="localAddress.address_line"
                  type="text"
                  id="address_line"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  placeholder="123 Rue de l'Exemple"
                >
              </div>
              
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
                <input 
                  v-model="localAddress.city"
                  type="text"
                  id="city"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  placeholder="Paris"
                >
              </div>
              
              <div>
                <label for="postalCode" class="block text-sm font-medium text-gray-700">Etat</label>
                <input 
                  v-model="localAddress.state"
                  type="text"
                  id="postalCode"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  placeholder="75000"
                >
              </div>
              
              <div class="sm:col-span-2">
                <label for="country" class="block text-sm font-medium text-gray-700">Pays</label>
                <select 
                  v-model="localAddress.country_id"
                  id="country_id"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                >
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              
              <div class="sm:col-span-2">
                <div class="flex items-center">
                  <input 
                    v-model="localAddress.is_default"
                    id="default-address"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <label for="default-address" class="ml-2 block text-sm text-gray-700">
                    Définir comme adresse principale
                  </label>
                </div>
              </div>
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
                @click="saveAddress"
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
import { ref, computed, watch } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  address: {
    type: Object,
    default: () => ({
      type: 'Domicile',
      address_line: '',
      city: '',
      state: '',
      country_id: 4,
      is_default: false
    })
  },
  isEditing: Boolean
})

const emit = defineEmits(['save', 'close'])

const uiStore = useUIStore()
const userStore = useUserStore()

const localAddress = ref({...props.address})
const countries = computed(() => uiStore.countries)

watch(() => props.address, (newVal) => {
  localAddress.value = {...newVal}
})

const saveAddress = async () => {
  try {
    if (props.isEditing) {
      await userStore.updateAddress(localAddress.value)
    } else {
      await userStore.addAddress(localAddress.value)
    }
    emit('save', localAddress.value)
    emit('close')
  } catch (error) {
    console.error("Error saving address:", error)
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