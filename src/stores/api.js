import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/customer'
  return { apiUrl }
})
