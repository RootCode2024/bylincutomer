<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="[variantClasses, sizeClasses, extraClasses]"
  >
    <span v-if="iconPosition === 'left'" class="mr-1.5">
      <component :is="iconComponent" class="h-3 w-3" />
    </span>
    
    {{ label }}
    
    <span v-if="iconPosition === 'right'" class="ml-1.5">
      <component :is="iconComponent" class="h-3 w-3" />
    </span>
  </span>
</template>

<script setup>
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/vue/20/solid'
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  status: {
    type: String,
    default: 'neutral',
    validator: (value) => [
      'neutral', 'success', 'error', 
      'warning', 'info', 'pending'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: { type: [String, Object], default: null },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right', 'none'].includes(value)
  },
  extraClasses: String
})

// Configuration des icônes par statut
const statusIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  pending: ClockIcon,
  neutral: null
}

const iconComponent = computed(() => {
  if (props.icon) {
    return typeof props.icon === 'string' 
      ? statusIcons[props.icon] || null 
      : props.icon
  }
  return statusIcons[props.status]
})

// Classes dynamiques
const variantClasses = computed(() => ({
  neutral: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  pending: 'bg-purple-100 text-purple-800'
}[props.status]))

const sizeClasses = computed(() => ({
  sm: 'text-xs py-0.5 px-2',
  md: 'text-sm py-0.5 px-2.5',
  lg: 'text-base py-1 px-3'
}[props.size]))
</script>