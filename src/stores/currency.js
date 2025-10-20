import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY = 'currencyRates'

export const useCurrencyStore = defineStore('currency', () => {
  // ----- STATE -----
  const selectedCurrency = ref('XOF')
  const rates = ref({ XOF: 1, EUR: 1 / 655.957, USD: 1 / 600 })
  const symbols = ref({ XOF: 'F CFA', EUR: '€', USD: '$' })
  const lastUpdated = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // ----- GETTERS -----
  const symbol = computed(() => symbols.value[selectedCurrency.value])
  const rate = computed(() => rates.value[selectedCurrency.value])
  const isStale = computed(() => {
    if (!lastUpdated.value) return true
    return Date.now() - lastUpdated.value > 24 * 60 * 60 * 1000
  })

  // ----- ACTIONS -----
  function changeCurrency(newCurrency) {
    if (rates.value[newCurrency]) selectedCurrency.value = newCurrency
  }

  function getRateFor(currency) {
    return rates.value[currency] || 1
  }

  function formatCurrency(amountInCFA) {
    const currency = selectedCurrency.value
    const converted = amountInCFA * getRateFor(currency)

    if (currency === 'XOF') {
      return `${Math.round(converted).toLocaleString('fr-FR')} ${symbol.value}`
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(converted)
  }

  async function fetchRates() {
    isLoading.value = true
    error.value = null

    try {
      // Vérifier les taux stockés localement
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.lastUpdated && Date.now() - data.lastUpdated < 24 * 60 * 60 * 1000) {
          rates.value = data.rates
          lastUpdated.value = data.lastUpdated
          isLoading.value = false
          return
        }
      }

      // Récupérer les taux depuis l'API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/XOF')
      if (!response.ok) throw new Error('Impossible de récupérer les taux')

      const data = await response.json()
      rates.value = {
        XOF: 1,
        USD: 1 / data.rates.USD,
        EUR: 1 / data.rates.EUR
      }
      lastUpdated.value = Date.now()

      // Sauvegarde locale
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        rates: rates.value,
        lastUpdated: lastUpdated.value
      }))

      console.log('Taux mis à jour:', rates.value)
    } catch (err) {
      console.error('Erreur fetchRates:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function ensureFreshRates() {
    if (isStale.value || !lastUpdated.value) {
      await fetchRates()
    }
  }

  // ----- RETURN -----
  return {
    // state
    selectedCurrency,
    rates,
    symbols,
    lastUpdated,
    isLoading,
    error,
    // getters
    symbol,
    rate,
    isStale,
    // actions
    changeCurrency,
    getRateFor,
    formatCurrency,
    fetchRates,
    ensureFreshRates
  }
})
