import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Fonction pour nettoyer le localStorage corrompu au démarrage
function cleanupCorruptedStorage() {
  try {
    const keysToCheck = ['user', 'roles', 'permissions', 'token', 'cart-items', 'favorite-items']
    
    keysToCheck.forEach(key => {
      const value = localStorage.getItem(key)
      if (value === 'undefined' || value === 'null' || value === '') {
        console.warn(`Nettoyage de la clé corrompue: ${key}`)
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Erreur lors du nettoyage du localStorage:', error)
    // En cas d'erreur critique, vider complètement le localStorage
    try {
      localStorage.clear()
    } catch (clearError) {
      console.error('Impossible de vider le localStorage:', clearError)
    }
  }
}

// Gestion globale des erreurs
window.addEventListener('error', (event) => {
  if (event.error?.message?.includes('JSON') || 
      event.error?.message?.includes('undefined')) {
    console.warn('Erreur JSON détectée, nettoyage du localStorage')
    cleanupCorruptedStorage()
  }
})

// Gestion des erreurs non capturées dans les Promises
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('JSON') || 
      event.reason?.message?.includes('undefined')) {
    console.warn('Promise rejetée avec erreur JSON, nettoyage du localStorage')
    cleanupCorruptedStorage()
  }
})

// Nettoyer au démarrage
cleanupCorruptedStorage()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Gestion des erreurs Vue
app.config.errorHandler = (err, instance, info) => {
  console.error('Erreur Vue:', err, info)
  
  // Si c'est une erreur JSON, nettoyer le localStorage
  if (err.message?.includes('JSON') || err.message?.includes('undefined')) {
    cleanupCorruptedStorage()
    // Optionnel: recharger la page après nettoyage
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}

app.mount('#app')