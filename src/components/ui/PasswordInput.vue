<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input 
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        v-model="modelValue"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border pr-10"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button 
          @click="$emit('toggle-visibility')"
          type="button"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
    <slot name="hint"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  showPassword: Boolean,
  id: {
    type: String,
    default: () => `password-input-${Math.random().toString(36).substring(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue', 'toggle-visibility'])

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>