<template>
  <div class="flex items-center" :class="textSizeClass">
    <component 
      :is="iconComponent" 
      class="flex-shrink-0 mr-1.5 w-5 h-5"
      :class="iconColorClass"
      aria-hidden="true"
    />
    <slot>{{ text }}</slot>
  </div>
</template>

<script setup>
import {
  UserIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) => [
      'user', 'shopping-bag', 'calendar',
      'currency', 'location', 'time', 'check-circle', 'clock-icon'
    ].includes(value)
  },
  text: String,
  color: {
    type: String,
    default: 'gray',
    validator: (value) => [
      'gray', 'primary', 'success',
      'warning', 'error', 'info'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

// Configuration des icônes
const iconComponent = computed(() => ({
  'user': UserIcon,
  'shopping-bag': ShoppingBagIcon,
  'calendar': CalendarIcon,
  'currency': CurrencyDollarIcon,
  'location': MapPinIcon,
  'time': ClockIcon
}[props.icon]))

// Classes dynamiques
const iconColorClass = computed(() => ({
  gray: 'text-gray-500',
  primary: 'text-indigo-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500'
}[props.color]))

const textSizeClass = computed(() => ({
  xs: 'w-4 h-4',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}[props.size]))
</script>