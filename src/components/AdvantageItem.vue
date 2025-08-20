<template>
  <div class="flex flex-col items-center space-y-4">
    <component
      :is="iconComponent"
      class="w-10 h-10 text-indigo-600"
    />
    <h3 class="font-semibold text-lg">{{ title }}</h3>
    <p class="text-sm text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup>
import { Truck, RefreshCcw, ShieldCheck, Leaf } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

// Dictionnaire d'icônes
const icons = {
  truck: Truck,
  refresh: RefreshCcw,
  'shield-check': ShieldCheck,
  leaf: Leaf
}

const iconComponent = computed(() => icons[props.icon])
</script>
