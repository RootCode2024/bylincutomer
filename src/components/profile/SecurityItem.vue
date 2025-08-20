<template>
  <div class="flex items-start p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors">
    <div class="flex-shrink-0">
      <div :class="statusClasses" class="h-10 w-10 rounded-full flex items-center justify-center">
        <slot name="icon">
          <svg class="h-5 w-5" :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </slot>
      </div>
    </div>
    <div class="ml-4 flex-1">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900">
          <slot name="title">{{ title }}</slot>
        </h3>
        <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
          {{ statusText }}
        </span>
      </div>
      <p class="mt-1 text-sm text-gray-500">
        <slot name="description">{{ description }}</slot>
      </p>
      <div class="mt-3">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  status: {
    type: String,
    default: 'inactive',
    validator: (value) => ['secure', 'medium', 'inactive', 'unverified'].includes(value)
  }
})

const statusConfig = {
  secure: {
    text: 'Sécurisé',
    bg: 'bg-green-100',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  },
  medium: {
    text: 'Moyen',
    bg: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  inactive: {
    text: 'Non activé',
    bg: 'bg-red-100',
    textColor: 'text-red-800',
    iconColor: 'text-red-600'
  },
  unverified: {
    text: 'Non vérifié',
    bg: 'bg-gray-100',
    textColor: 'text-gray-800',
    iconColor: 'text-gray-600'
  }
}

const statusText = computed(() => statusConfig[props.status]?.text || '')
const badgeClasses = computed(() => `${statusConfig[props.status]?.bg} ${statusConfig[props.status]?.textColor}`)
const statusClasses = computed(() => statusConfig[props.status]?.bg || 'bg-gray-100')
const iconClasses = computed(() => statusConfig[props.status]?.iconColor || 'text-gray-600')
</script>