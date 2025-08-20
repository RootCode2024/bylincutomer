<template>
  <component :is="iconComponent" class="w-4 h-4" aria-hidden="true" />
</template>

<script setup>
import { computed } from 'vue'
import {Eye} from 'lucide-vue-next';
import {EyeOff} from 'lucide-vue-next'; // nom selon la librairie utilisée

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const iconComponent = computed(() => {
  switch (props.name) {
    case 'eye':
      return Eye
    case 'eye-off':
      return EyeOff
    default:
      return null
  }
})
</script>
