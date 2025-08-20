<template>
  <div :class="containerClass">
    <label :for="field" class="block text-sm font-medium text-gray-500 mb-1">{{ label }}</label>
    <div class="relative">
      <!-- Mode édition -->
      <textarea 
        v-if="isEditing"
        :id="field"
        v-model="localValue"
        :rows="rows"
        :class="[
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border resize-none',
          error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'
        ]"
        :placeholder="placeholder"
        :aria-label="`Modifier ${label.toLowerCase()}`"
        :disabled="isUpdating"
        @keyup.enter="handleSave"
        @blur="handleSave"
      ></textarea>
      
      <!-- Mode lecture -->
      <p v-else class="text-sm text-gray-900 bg-gray-50 rounded-md py-2 px-3 whitespace-pre-wrap min-h-[60px]">
        {{ displayValue || placeholder || 'Non renseignée' }}
      </p>

      <!-- Bouton d'action -->
      <button 
        @click="isEditing ? handleSave() : isEditing = true"
        class="absolute top-0 right-0 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
        :class="{ 
          'text-blue-600': isEditing,
          'cursor-not-allowed opacity-50': isUpdating
        }"
        :disabled="isUpdating"
        :aria-label="`Modifier ${label.toLowerCase()}`"
      >
        <LoadingSpinner v-if="isUpdating" class="w-4 h-4" />
        <template v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isEditing" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </template>
      </button>
    </div>

    <!-- Message d'erreur -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  modelValue: String,
  label: String,
  field: String,
  placeholder: String,
  error: String,
  success: Boolean,
  isUpdating: Boolean,
  rows: {
    type: Number,
    default: 4
  },
  containerClass: {
    type: String,
    default: ''
  },
  format: Function
})

const emit = defineEmits(['update:modelValue', 'save'])

const isEditing = ref(false)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const displayValue = computed(() => {
  return props.format ? props.format(props.modelValue) : props.modelValue
})

const handleSave = () => {
  if (!isEditing.value) {
    isEditing.value = true
    return
  }

  emit('update:modelValue', localValue.value)
  emit('save', localValue.value)
  isEditing.value = false
}
</script>