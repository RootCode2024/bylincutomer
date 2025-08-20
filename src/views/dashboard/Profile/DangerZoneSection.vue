<template>
  <div class="px-8 py-6 bg-red-50/70 rounded-b-2xl">
    <h2 class="text-xl font-semibold text-red-800 flex items-center">
      <svg class="w-5 h-5 mr-2 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Zone dangereuse
    </h2>
    <p class="mt-2 text-sm text-red-700">
      La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
      Cette action ne peut pas être annulée.
    </p>
    <div class="mt-4">
      <button 
        @click="$emit('delete-account')"
        type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Supprimer mon compte
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['delete-account'])
</script>