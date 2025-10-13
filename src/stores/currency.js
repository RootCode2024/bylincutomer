// stores/currency.js
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selectedCurrency: 'XOF',
    rates: {
      XOF: 1,
      EUR: 1 / 655.957,
      USD: 1 / 600,
    },
    symbols: {
      XOF: 'F CFA',
      EUR: '€',
      USD: '$',
    },
    lastUpdated: null,
    isLoading: false,
    error: null
  }),

  getters: {
    symbol: (state) => state.symbols[state.selectedCurrency],
    rate: (state) => state.rates[state.selectedCurrency],
    isStale: (state) => {
      if (!state.lastUpdated) return true
      // Considérer les taux comme périmés après 24h
      return Date.now() - state.lastUpdated > 24 * 60 * 60 * 1000
    }
  },

  actions: {
    changeCurrency(newCurrency) {
      this.selectedCurrency = newCurrency
    },

    async fetchRates() {
      this.isLoading = true
      this.error = null
      
      try {
        // Récupérer les taux USD et EUR vers XOF
        const [usdResponse, eurResponse] = await Promise.all([
          fetch('https://api.exchangerate-api.com/v4/latest/USD'),
          fetch('https://api.exchangerate-api.com/v4/latest/EUR')
        ])

        if (!usdResponse.ok || !eurResponse.ok) {
          throw new Error('Erreur lors de la récupération des taux de change')
        }

        const usdData = await usdResponse.json()
        const eurData = await eurResponse.json()

        // Vérifier que les données XOF sont disponibles
        if (!usdData.rates.XOF || !eurData.rates.XOF) {
          throw new Error('Taux XOF non disponible')
        }

        // Mettre à jour les taux
        // Note: ExchangeRate-API donne 1 USD = X XOF, donc pour avoir 1 XOF = Y USD on fait 1 / X
        this.rates = {
          XOF: 1,
          USD: 1 / usdData.rates.XOF,
          EUR: 1 / eurData.rates.XOF,
        }

        this.lastUpdated = Date.now()
        
        console.log('Taux mis à jour:', {
          'USD vers XOF': usdData.rates.XOF,
          'EUR vers XOF': eurData.rates.XOF,
          '1 XOF en USD': this.rates.USD,
          '1 XOF en EUR': this.rates.EUR
        })

      } catch (error) {
        console.error('Erreur fetchRates:', error)
        this.error = error.message
        // Garder les anciens taux en cas d'erreur
      } finally {
        this.isLoading = false
      }
    },

    async ensureFreshRates() {
      // Ne rafraîchir que si les données sont périmées ou manquantes
      if (this.isStale || !this.lastUpdated) {
        await this.fetchRates()
      }
    },

    formatCurrency(amountInCFA) {
      const currency = this.selectedCurrency
      const rate = this.rates[currency]

      if (currency === 'XOF') {
        return `${Math.round(amountInCFA).toLocaleString('fr-FR')} ${this.symbol}`
      }

      const converted = amountInCFA * rate

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(converted)
    }
  }
})