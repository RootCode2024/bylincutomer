<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Informations personnelles
      </h2>
    </div>
    
    <div class="mt-6 grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-8">
      <!-- Prénom -->
        <EditableField 
        v-model="user.first_name" 
        label="Prénom" 
        field="first_name" 
        placeholder="Jean"
        :error="errorRefs.first_name"
        :success="successFeedback.first_name"
        :is-updating="isUpdating.first_name"
        @save="() => updateField('first_name')"
        />
      
      <!-- Nom -->
      <EditableField 
        v-model="user.last_name" 
        label="Nom" 
        field="last_name" 
        placeholder="Dupont"
        :error="last_nameError"
        :success="successFeedback.last_name"
        :is-updating="isUpdating.last_name"
        @update="updateField"
      />
      
      <!-- Date de naissance -->
      <EditableField 
        v-model="user.birth_date" 
        label="Date de naissance" 
        field="birth_date" 
        type="date"
        :error="birth_dateError"
        :success="successFeedback.birth_date"
        :is-updating="isUpdating.birth_date"
        @update="updateField"
      />
      
      <!-- Genre -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Genre</label>
        <div class="relative flex items-center">
          <select 
            v-model="user.gender"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
            @change="updateField('gender')"
          >
            <option disabled value="">Choisir un genre</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
          <LoadingSpinner v-if="isUpdating.gender" class="ml-2" />
        </div>
        <p v-if="genderError" class="mt-1 text-sm text-red-600">{{ genderError }}</p>
      </div>
      
      <!-- Bio -->
      <EditableTextarea 
        v-model="user.bio" 
        label="Biographie" 
        field="bio"
        placeholder="Parle-nous un peu de toi..."
        :error="bioError"
        :success="successFeedback.bio"
        :is-updating="isUpdating.bio"
        @update="updateField"
        class="sm:col-span-2"
      />
      
      <!-- Téléphone -->
      <EditableField 
        v-model="user.phone" 
        label="Téléphone" 
        field="phone" 
        type="tel"
        placeholder="+33 6 12 34 56 78"
        :error="phoneError"
        :success="successFeedback.phone"
        :is-updating="isUpdating.phone"
        @update="updateField"
      />
      
      <!-- Email -->
      <EditableField 
        v-model="user.email" 
        label="Email" 
        field="email" 
        type="email"
        placeholder="example@gmail.com"
        :error="emailError"
        :success="successFeedback.email"
        :is-updating="isUpdating.email"
        @update="updateField"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import EditableField from '@/components/ui/EditableField.vue'
import EditableTextarea from '@/components/ui/EditableTextarea.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const userStore = useUserStore()

const props = defineProps({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  bio: String,
  gender: String,
  birth_date: String
})

const user = reactive({
  first_name: props.first_name,
  last_name: props.last_name,
  email: props.email,
  phone: props.phone,
  bio: props.bio,
  gender: props.gender,
  birth_date: props.birth_date
})

const emit = defineEmits([
  'update:first_name',
  'update:last_name',
  'update:email',
  'update:phone',
  'update:bio',
  'update:gender',
  'update:birth_date'
])

const errorRefs = reactive({
  first_name: ref(null),
  last_name: ref(null),
  email: ref(null),
  phone: ref(null),
  bio: ref(null),
  gender: ref(null),
  birth_date: ref(null)
})

const getErrorRef = (field) => {
  if (!(field in errorRefs)) {
    throw new Error(`Champ non reconnu : ${field}`)
  }
  return errorRefs[field]
}

const successFeedback = reactive({})
const isUpdating = reactive({
  first_name: false,
  last_name: false,
  email: false,
  phone: false,
  bio: false,
  gender: false,
  birth_date: false
})

const updateField = async (field, value) => {
  isUpdating[field] = true
  getErrorRef(field).value = null
  try {
    await userStore.updateProfile({ [field]: user[field] })

    emit(`update:${field}`, user[field])

    successFeedback[field] = true
    setTimeout(() => successFeedback[field] = false, 2000)
  } catch (error) {
    getErrorRef(field).value = error.message || "Erreur inattendue"
  } finally {
    isUpdating[field] = false
  }
}
</script>
