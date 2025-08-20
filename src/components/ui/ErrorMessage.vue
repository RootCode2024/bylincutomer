<template>
  <div 
    role="alert"
    class="rounded-lg border p-4"
    :class="[
      variantClasses,
      {'cursor-pointer': dismissible},
      extraClasses
    ]"
    @click="dismissible ? handleDismiss() : null"
  >
    <div class="flex items-start gap-3">
      <!-- Icône dynamique -->
      <component 
        :is="iconComponent" 
        class="flex-shrink-0 mt-0.5 h-5 w-5"
        aria-hidden="true"
      />

      <div class="flex-1">
        <!-- Titre optionnel -->
        <h3 
          v-if="title" 
          class="font-semibold"
          :class="textSizeClass.heading"
        >
          {{ title }}
        </h3>

        <!-- Message principal -->
        <p :class="textSizeClass.message">
          {{ message }}
        </p>

        <!-- Détails supplémentaires -->
        <div 
          v-if="details"
          class="mt-2 text-sm opacity-90"
        >
          {{ details }}
        </div>
      </div>

      <!-- Bouton de fermeture -->
      <button
        v-if="dismissible"
        type="button"
        class="ml-auto -mt-1 -mr-1 p-1 rounded-full focus:outline-none focus:ring-2"
        :class="closeButtonClasses"
        @click.stop="handleDismiss"
        aria-label="Fermer"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Actions optionnelles -->
    <div 
      v-if="actions && actions.length > 0"
      class="mt-3 flex flex-wrap gap-2"
    >
      <template v-for="(action, index) in actions" :key="index">
        <button
          :type="action.type || 'button'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="action.variant === 'outline' ? actionOutlineClasses : actionPrimaryClasses"
          @click.stop="action.handler"
        >
          {{ action.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // Contenu
  title: String,
  message: { type: String, required: true },
  details: String,
  
  // Variantes
  variant: {
    type: String,
    default: 'danger',
    validator: (value) => ['danger', 'warning', 'info', 'success'].includes(value)
  },
  
  // Comportement
  dismissible: Boolean,
  autoDismiss: { type: Boolean, default: false },
  dismissTimeout: { type: Number, default: 5000 }, // ms
  
  // Personnalisation
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  actions: {
    type: Array,
    default: () => [],
    validator: (actions) => {
      return actions.every(action => 
        action.label && 
        typeof action.handler === 'function'
      )
    }
  },
  
  extraClasses: String
})

const emit = defineEmits(['dismiss'])

// Configuration des variantes
const variantConfig = {
  danger: {
    icon: XCircleIcon,
    classes: 'bg-red-50 border-red-200 text-red-800',
    closeButtonClasses: 'text-red-600 hover:bg-red-100 focus:ring-red-600'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    classes: 'bg-amber-50 border-amber-200 text-amber-800',
    closeButtonClasses: 'text-amber-600 hover:bg-amber-100 focus:ring-amber-600'
  },
  info: {
    icon: InformationCircleIcon,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    closeButtonClasses: 'text-blue-600 hover:bg-blue-100 focus:ring-blue-600'
  },
  success: {
    icon: CheckCircleIcon,
    classes: 'bg-green-50 border-green-200 text-green-800',
    closeButtonClasses: 'text-green-600 hover:bg-green-100 focus:ring-green-600'
  }
}

// Classes dynamiques
const variantClasses = computed(() => variantConfig[props.variant].classes)
const closeButtonClasses = computed(() => variantConfig[props.variant].closeButtonClasses)
const iconComponent = computed(() => variantConfig[props.variant].icon)

const textSizeClass = computed(() => ({
  heading: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[props.size],
  message: {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base'
  }[props.size]
}))

const actionPrimaryClasses = computed(() => ({
  'danger': 'bg-red-600 text-white hover:bg-red-700',
  'warning': 'bg-amber-600 text-white hover:bg-amber-700',
  'info': 'bg-blue-600 text-white hover:bg-blue-700',
  'success': 'bg-green-600 text-white hover:bg-green-700'
}[props.variant]))

const actionOutlineClasses = computed(() => ({
  'danger': 'border border-red-600 text-red-600 hover:bg-red-50',
  'warning': 'border border-amber-600 text-amber-600 hover:bg-amber-50',
  'info': 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  'success': 'border border-green-600 text-green-600 hover:bg-green-50'
}[props.variant]))

// Gestion de la fermeture
const handleDismiss = () => {
  emit('dismiss')
}

// Auto-dismiss
if (props.autoDismiss) {
  setTimeout(() => {
    handleDismiss()
  }, props.dismissTimeout)
}
</script>