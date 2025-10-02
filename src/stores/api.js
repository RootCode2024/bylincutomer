import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://stagging.bylin-style.com/api/customer'
  return { apiUrl }
})
