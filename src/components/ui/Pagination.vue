<template>
  <div class="flex items-center justify-between">
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
        :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-white text-gray-700 hover:bg-gray-50'"
      >
        Précédent
      </button>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md"
        :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-white text-gray-700 hover:bg-gray-50'"
      >
        Suivant
      </button>
    </div>
    
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Affichage de <span class="font-medium">{{ rangeStart }}</span> à <span class="font-medium">{{ rangeEnd }}</span> sur <span class="font-medium">{{ totalItems }}</span> résultats
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium"
            :class="currentPage === 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-50'"
          >
            <span class="sr-only">Précédent</span>
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="typeof page === 'number'"
              @click="changePage(page)"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              :class="page === currentPage 
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              ...
            </span>
          </template>
          
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium"
            :class="currentPage === totalPages ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-50'"
          >
            <span class="sr-only">Suivant</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const rangeStart = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const rangeEnd = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = 1
  let end = props.totalPages

  if (props.totalPages > maxVisible) {
    start = Math.max(1, props.currentPage - 2)
    end = Math.min(props.totalPages, props.currentPage + 2)

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < props.totalPages) {
      if (end < props.totalPages - 1) pages.push('...')
      pages.push(props.totalPages)
    }
  } else {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  }

  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>