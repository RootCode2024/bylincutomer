<template>
  <div class="relative" ref="datepicker">
    <div class="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <input
        type="text"
        :value="formattedStartDate"
        @click="openPicker"
        placeholder="Date de début"
        class="flex-1 px-3 py-2 text-sm border-none focus:ring-0"
        readonly
      >
      <span class="text-gray-400 px-1">→</span>
      <input
        type="text"
        :value="formattedEndDate"
        @click="openPicker"
        placeholder="Date de fin"
        class="flex-1 px-3 py-2 text-sm border-none focus:ring-0"
        readonly
      >
      <button
        type="button"
        @click="clearDates"
        class="px-2 text-gray-400 hover:text-gray-600"
        v-if="modelValue"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div 
      v-if="showPicker"
      class="absolute z-10 mt-1 bg-white shadow-lg rounded-md p-4 border border-gray-200"
      style="width: 580px;"
    >
      <div class="flex justify-between items-center mb-4">
        <button
          type="button"
          @click="previousMonth"
          class="p-1 rounded-full hover:bg-gray-100"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <h3 class="text-lg font-medium text-gray-900">
          {{ currentMonthName }} {{ currentYear }}
        </h3>
        <button
          type="button"
          @click="nextMonth"
          class="p-1 rounded-full hover:bg-gray-100"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-2">
        <div 
          v-for="day in ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']"
          :key="day"
          class="text-center text-xs font-medium text-gray-500"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div 
          v-for="day in daysInMonth"
          :key="day.date"
          @click="selectDate(day.date)"
          class="text-center p-2 rounded-full cursor-pointer text-sm"
          :class="getDayClasses(day)"
        >
          {{ day.day }}
        </div>
      </div>

      <div class="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          @click="applyDates"
          class="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
        >
          Appliquer
        </button>
        <button
          type="button"
          @click="cancelPicker"
          class="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const currentDate = ref(new Date())
const tempStartDate = ref(null)
const tempEndDate = ref(null)

const formattedStartDate = computed(() => {
  if (!props.modelValue?.[0]) return ''
  return formatDate(props.modelValue[0])
})

const formattedEndDate = computed(() => {
  if (!props.modelValue?.[1]) return ''
  return formatDate(props.modelValue[1])
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})

const currentMonth = computed(() => {
  return currentDate.value.getMonth()
})

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('fr-FR', { month: 'long' })
})

const daysInMonth = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Add days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i + 1)
    days.push({
      day: date.getDate(),
      date,
      isCurrentMonth: false,
      isSelected: isDateSelected(date),
      isInRange: isDateInRange(date)
    })
  }
  
  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      day: date.getDate(),
      date,
      isCurrentMonth: true,
      isSelected: isDateSelected(date),
      isInRange: isDateInRange(date)
    })
  }
  
  // Add days from next month
  const daysToAdd = 42 - days.length // 6 weeks
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      day: date.getDate(),
      date,
      isCurrentMonth: false,
      isSelected: isDateSelected(date),
      isInRange: isDateInRange(date)
    })
  }
  
  return days
})

const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const isDateSelected = (date) => {
  if (!tempStartDate.value && !tempEndDate.value) {
    return props.modelValue?.some(d => isSameDate(d, date))
  }
  return isSameDate(tempStartDate.value, date) || isSameDate(tempEndDate.value, date)
}

const isDateInRange = (date) => {
  if (tempStartDate.value && tempEndDate.value) {
    return date >= tempStartDate.value && date <= tempEndDate.value
  }
  if (props.modelValue?.[0] && props.modelValue?.[1]) {
    return date >= props.modelValue[0] && date <= props.modelValue[1]
  }
  return false
}

const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

const getDayClasses = (day) => {
  const classes = []
  
  if (!day.isCurrentMonth) {
    classes.push('text-gray-400')
  }
  
  if (day.isSelected) {
    classes.push('bg-indigo-600 text-white')
  } else if (day.isInRange) {
    classes.push('bg-indigo-100')
  } else {
    classes.push('hover:bg-gray-100')
  }
  
  return classes.join(' ')
}

const openPicker = () => {
  showPicker.value = true
  tempStartDate.value = props.modelValue?.[0] || null
  tempEndDate.value = props.modelValue?.[1] || null
}

const closePicker = () => {
  showPicker.value = false
}

const cancelPicker = () => {
  tempStartDate.value = null
  tempEndDate.value = null
  closePicker()
}

const applyDates = () => {
  if (tempStartDate.value && tempEndDate.value) {
    emit('update:modelValue', [tempStartDate.value, tempEndDate.value])
  }
  closePicker()
}

const clearDates = () => {
  emit('update:modelValue', null)
}

const selectDate = (date) => {
  if (!tempStartDate.value || (tempStartDate.value && tempEndDate.value)) {
    tempStartDate.value = date
    tempEndDate.value = null
  } else if (date < tempStartDate.value) {
    tempEndDate.value = tempStartDate.value
    tempStartDate.value = date
  } else {
    tempEndDate.value = date
  }
}

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const datepicker = ref(null)

const handleClickOutside = (event) => {
  if (datepicker.value && !datepicker.value.contains(event.target)) {
    cancelPicker()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>