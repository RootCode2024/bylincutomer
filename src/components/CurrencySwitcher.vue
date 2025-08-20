<template>
  <div class="relative inline-block text-left" ref="dropdownContainer">
    <button
      @click.stop="open = !open"
      type="button"
      class="flex items-center justify-between gap-2 w-40 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
      :class="{
        'bg-white text-gray-900 border border-gray-200 hover:border-indigo-300 shadow-xs': !open,
        'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs': open
      }"
      aria-haspopup="true"
      :aria-expanded="open"
    >
      <span class="flex items-center gap-2">
        <span class="text-indigo-600 font-medium">{{ selectedCurrency }}</span>
        <span class="text-gray-500">({{ symbols[selectedCurrency] }})</span>
      </span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="open"
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white border border-gray-100 backdrop-blur-sm bg-white/95 z-30"
      >
        <div class="py-2">
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-xs font-medium text-gray-500">Sélectionnez une devise</p>
          </div>
          <button
            v-for="(symbol, code) in symbols"
            :key="code"
            @click="selectCurrency(code)"
            class="flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors"
            :class="{
              'text-indigo-600 bg-indigo-50/50': code === selectedCurrency,
              'text-gray-700 hover:bg-gray-50': code !== selectedCurrency
            }"
          >
            <span>{{ code }}</span>
            <span class="text-gray-500">{{ symbol }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useCurrencyStore } from '@/stores/currency'

const currencyStore = useCurrencyStore()
const open = ref(false)
const dropdownContainer = ref(null)

const symbols = computed(() => currencyStore.symbols)
const selectedCurrency = computed(() => currencyStore.selectedCurrency)

function selectCurrency(code) {
  currencyStore.changeCurrency(code)
  open.value = false
}

// Gestion du click outside
const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    open.value = false
  }
}

// Gestion des événements
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animation personnalisée */
.v-enter-active,
.v-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}
</style>