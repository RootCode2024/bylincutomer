import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false);
  const isMobileSidebarOpen = ref(false);
  const countries = ref([]);
  
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };
  
  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  };
  
  const closeMobileSidebar = () => {
    isMobileSidebarOpen.value = false;
  };

  const getCountries = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/countries');
    countries.value = response.data.data;
    console.log('Countries:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}
  
  return {
    countries,
    getCountries,
    sidebarCollapsed,
    isMobileSidebarOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar
  };
});