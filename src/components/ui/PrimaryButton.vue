<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :aria-disabled="disabled"
    :class="[
      baseClasses,
      sizeClasses,
      variantClasses,
      fullWidth ? 'w-full justify-center' : '',
      extraClasses
    ]"
    @click="handleClick"
  >
    <!-- Contenu du bouton -->
    <span class="inline-flex items-center gap-2">
      <!-- Icône de chargement -->
      <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <!-- Icône principale -->
      <component
        :is="iconComponent"
        v-if="icon && !loading"
        class="flex-shrink-0"
        :class="iconSizeClasses"
        aria-hidden="true"
      />

      <!-- Label -->
      <span :class="{ 'opacity-0': loading && !icon }">
        {{ label }}
      </span>

      <!-- Icône de suffixe -->
      <component
        :is="suffixIconComponent"
        v-if="suffixIcon && !loading"
        class="flex-shrink-0"
        :class="iconSizeClasses"
        aria-hidden="true"
      />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowPathIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // Contenu
  label: { type: String, required: true },
  
  // Icônes
  icon: { type: [String, Object], default: null },
  suffixIcon: { type: [String, Object], default: null },
  
  // Comportement
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  fullWidth: Boolean,
  
  // Variantes
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'outline'].includes(value)
  },
  
  // Tailles
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  // Personnalisation
  extraClasses: String
})

const emit = defineEmits(['click'])

// Configuration des icônes
const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    return {
      'refresh': ArrowPathIcon,
      'arrow-right': ChevronRightIcon
    }[props.icon] || null
  }
  return props.icon
})

const suffixIconComponent = computed(() => {
  if (typeof props.suffixIcon === 'string') {
    return {
      'arrow-right': ChevronRightIcon
    }[props.suffixIcon] || null
  }
  return props.suffixIcon
})

// Classes dynamiques
const baseClasses = computed(() => [
  'font-medium rounded-md transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed'
])

const sizeClasses = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}[props.size]))

const variantClasses = computed(() => ({
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'
}[props.variant]))

const iconSizeClasses = computed(() => ({
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
}[props.size]))

// Gestion des clics
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>