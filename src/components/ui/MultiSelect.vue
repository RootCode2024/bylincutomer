<template>
  <div class="relative" ref="dropdown">
    <button
      type="button"
      @click="toggleDropdown"
      class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      <span class="flex items-center">
        <span class="block truncate">
          {{ selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder }}
        </span>
      </span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <i class="fas fa-chevron-down text-gray-400"></i>
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto"
      >
        <div class="px-2 py-1 border-b">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher..."
            class="w-full px-2 py-1 text-sm border rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
        
        <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500">
          Aucun résultat trouvé
        </div>
        
        <template v-else>
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
            :class="{ 'bg-indigo-100': isSelected(option.value) }"
            @click="toggleOption(option.value)"
          >
            <div class="flex items-center">
              <span class="block truncate" :class="{ 'font-medium': isSelected(option.value) }">
                {{ option.label }}
              </span>
            </div>
            
            <span
              v-if="isSelected(option.value)"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
            >
              <i class="fas fa-check"></i>
            </span>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
    validator: value => value.every(opt => opt.value && opt.label)
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Sélectionnez...'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdown = ref(null)

const selectedLabels = computed(() => {
  return props.options
    .filter(opt => props.modelValue.includes(opt.value))
    .map(opt => opt.label)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query)
  )
})

const isSelected = (value) => {
  return props.modelValue.includes(value)
}

const toggleOption = (value) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  
  if (index === -1) {
    newValue.push(value)
  } else {
    newValue.splice(index, 1)
  }
  
  emit('update:modelValue', newValue)
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>