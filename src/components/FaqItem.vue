<template>
  <div class="border border-gray-200 rounded-lg">
    <button
      @click="isOpen = !isOpen"
      class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
    >
      <span class="font-semibold text-gray-900">{{ question }}</span>
      <ChevronDown class="w-5 h-5 text-gray-500 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>
    <div v-show="isOpen" class="px-6 pb-4">
      <p class="text-gray-600 leading-relaxed">{{ answer }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

defineProps({
  question: String,
  answer: String
})

const isOpen = ref(false)
</script>