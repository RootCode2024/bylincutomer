<template>
  <div 
    class="text-center py-10 px-4 rounded-lg"
    :class="[
      backgroundClasses,
      { 'cursor-pointer': clickable },
      extraClasses
    ]"
    @click="handleClick"
  >
    <!-- Icône dynamique -->
    <div class="mx-auto" :class="iconContainerClasses">
      <component 
        :is="iconComponent" 
        class="mx-auto"
        :class="iconClasses"
        aria-hidden="true"
      />
    </div>

    <!-- Titre et description -->
    <div class="mt-4">
      <h3 
        v-if="title"
        class="font-medium"
        :class="textSizeClasses.title"
      >
        {{ title }}
      </h3>
      <p 
        v-if="message"
        class="mt-1"
        :class="textSizeClasses.message"
      >
        {{ message }}
      </p>
    </div>

    <!-- Actions -->
    <div 
      v-if="primaryAction || secondaryActions.length > 0"
      class="mt-6 flex justify-center gap-3"
    >
      <PrimaryButton
        v-if="primaryAction"
        :label="primaryAction.label"
        :icon="primaryAction.icon"
        @click="primaryAction.handler"
      />
      
      <SecondaryButton
        v-for="(action, index) in secondaryActions"
        :key="index"
        :label="action.label"
        :icon="action.icon"
        @click="action.handler"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FolderIcon,
  FaceFrownIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import PrimaryButton from './PrimaryButton.vue'
import SecondaryButton from './SecondaryButton.vue'

const props = defineProps({
  // Contenu
  title: String,
  message: { type: String, required: true },
  
  // Variantes
  variant: {
    type: String,
    default: 'default', // 'default'|'success'|'warning'|'error'|'custom'
    validator: (value) => ['default', 'success', 'warning', 'error', 'custom'].includes(value)
  },
  
  // Icône
  icon: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'search', 'document', 'folder', 
      'error', 'success', 'custom'
    ].includes(value)
  },
  customIcon: [Object, Function],
  
  // Apparence
  size: {
    type: String,
    default: 'md', // 'sm'|'md'|'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  background: {
    type: String,
    default: 'light', // 'light'|'darker'|'none'
  },
  clickable: Boolean,
  
  // Actions
  primaryAction: {
    type: Object,
    validator: (action) => action.label && typeof action.handler === 'function'
  },
  secondaryActions: {
    type: Array,
    default: () => [],
    validator: (actions) => actions.every(action => 
      action.label && 
      typeof action.handler === 'function'
    )
  },
  
  // Personnalisation
  extraClasses: String
})

const emit = defineEmits(['click'])

// Configuration des icônes
const iconComponents = {
  default: ShoppingCartIcon,
  search: MagnifyingGlassIcon,
  document: DocumentTextIcon,
  folder: FolderIcon,
  error: FaceFrownIcon,
  success: CheckCircleIcon,
  custom: props.customIcon || ShoppingCartIcon
}

// Configuration des variantes
const variantConfig = {
  default: {
    iconColor: 'text-gray-400',
    textColor: 'text-gray-600'
  },
  success: {
    iconColor: 'text-green-500',
    textColor: 'text-green-700'
  },
  warning: {
    iconColor: 'text-amber-500',
    textColor: 'text-amber-700'
  },
  error: {
    iconColor: 'text-red-500',
    textColor: 'text-red-700'
  },
  custom: {
    iconColor: '',
    textColor: ''
  }
}

// Classes dynamiques
const iconComponent = computed(() => iconComponents[props.icon])
const currentVariant = computed(() => variantConfig[props.variant])

const backgroundClasses = computed(() => ({
  light: 'bg-gray-50',
  darker: 'bg-gray-100',
  none: ''
}[props.background]))

const iconContainerClasses = computed(() => ({
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14'
}[props.size]))

const iconClasses = computed(() => [
  currentVariant.value.iconColor,
  {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }[props.size]
])

const textSizeClasses = computed(() => ({
  title: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  },
  message: {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
}[props.size]))

// Gestion des clics
const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>