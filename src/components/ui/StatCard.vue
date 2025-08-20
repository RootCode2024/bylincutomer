<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-medium text-gray-500 truncate">{{ label }}</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">{{ value }}</p>
      </div>
      <div 
        class="p-3 rounded-full"
        :class="iconBgColor"
      >
        <component 
          :is="lucideIcon" 
          class="w-5 h-5"
          :class="iconTextColor"
        />
      </div>
    </div>
    <div v-if="trend" class="mt-2 flex items-center gap-1">
      <component 
        :is="trendIconComponent" 
        class="w-4 h-4"
        :class="trendIconColor"
      />
      <span class="text-xs" :class="trendTextColor">{{ trendLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  ShoppingBag, Clock, Truck, CheckCircle2, Euro,
  ArrowUp, ArrowDown, Minus 
} from 'lucide-vue-next'

const props = defineProps({
  value: [String, Number],
  label: String,
  icon: {
    type: String,
    validator: value => ['shopping-bag', 'clock', 'truck', 'check-circle', 'euro'].includes(value)
  },
  trend: {
    type: String,
    validator: value => ['up', 'down', 'neutral'].includes(value)
  }
})

const iconComponents = {
  'shopping-bag': ShoppingBag,
  'clock': Clock,
  'truck': Truck,
  'check-circle': CheckCircle2,
  'euro': Euro
}

const trendComponents = {
  'up': ArrowUp,
  'down': ArrowDown,
  'neutral': Minus
}

const lucideIcon = computed(() => iconComponents[props.icon])
const trendIconComponent = computed(() => trendComponents[props.trend])

const iconBgColor = computed(() => {
  const colors = {
    'shopping-bag': 'bg-indigo-100',
    'clock': 'bg-yellow-100',
    'truck': 'bg-purple-100',
    'check-circle': 'bg-green-100',
    'euro': 'bg-blue-100'
  }
  return colors[props.icon] || 'bg-gray-100'
})

const iconTextColor = computed(() => {
  const colors = {
    'shopping-bag': 'text-indigo-600',
    'clock': 'text-yellow-600',
    'truck': 'text-purple-600',
    'check-circle': 'text-green-600',
    'euro': 'text-blue-600'
  }
  return colors[props.icon] || 'text-gray-600'
})

const trendIconColor = computed(() => {
  return {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  }[props.trend]
})

const trendTextColor = computed(() => {
  return {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }[props.trend]
})

const trendLabel = computed(() => {
  return {
    up: 'Augmentation',
    down: 'Diminution',
    neutral: 'Stable'
  }[props.trend]
})
</script>