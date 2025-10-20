import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ToastPlugin)

const originalAddEventListener = EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener = function(type, listener, options) {
  if (type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
    if (typeof options === 'boolean') {
      options = { capture: options }
    }
    if (typeof options === 'undefined') {
      options = {}
    }
    options.passive = options.passive !== false
  }
  return originalAddEventListener.call(this, type, listener, options)
}

// Gestion globale des erreurs
app.config.errorHandler = (err, instance, info) => {
  console.error('Erreur Vue:', err, info)
}

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Promise rejetée non capturée:', event.reason)
  event.preventDefault()
})

window.addEventListener('error', (event) => {
  console.warn('Erreur globale détectée:', event.error)
})

app.mount('#app')