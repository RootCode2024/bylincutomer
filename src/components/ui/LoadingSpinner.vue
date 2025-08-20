<template>
  <div 
    class="text-center py-2"
    :class="{'min-h-[100px]': fullHeight}"
    aria-live="polite"
    aria-busy="true"
  >
    <!-- Spinner personnalisable -->
    <div 
      class="animate-spin rounded-full mx-auto"
      :class="spinnerClasses"
      :style="{
        'border-width': thickness + 'px',
        width: size + 'px',
        height: size + 'px'
      }"
      role="status"
    >
      <span class="sr-only">Chargement en cours...</span>
    </div>

    <!-- Message -->
    <p 
      v-if="message"
      class="mt-3 text-gray-600"
      :class="textSizeClass"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Options principales
  message: {
    type: String,
    default: ''
  },
  
  // Personnalisation visuelle
  color: {
    type: String,
    default: 'primary', // 'primary'|'secondary'|'success'|'danger'
    validator: (value) => ['primary', 'secondary', 'success', 'danger'].includes(value)
  },
  
  size: {
    type: Number,
    default: 14,
    validator: (value) => value >= 16 && value <= 64
  },
  
  thickness: {
    type: Number,
    default: 3,
    validator: (value) => value >= 1 && value <= 6
  },
  
  fullHeight: {
    type: Boolean,
    default: false
  },
  
  textSize: {
    type: String,
    default: 'base', // 'sm'|'base'|'lg'
    validator: (value) => ['sm', 'base', 'lg'].includes(value)
  }
})

// Classes dynamiques
const spinnerClasses = computed(() => {
  const colors = {
    primary: 'border-indigo-600 border-t-indigo-100',
    secondary: 'border-gray-600 border-t-gray-100',
    success: 'border-green-600 border-t-green-100',
    danger: 'border-red-600 border-t-red-100'
  }
  return colors[props.color]
})

const textSizeClass = computed(() => {
  return {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  }[props.textSize]
})
</script>