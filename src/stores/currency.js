// stores/currency.js
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selectedCurrency: 'XAF', // Par défaut XAF car c’est la base
    rates: {
      EUR: 1 / 655.957,   // 1 XAF = 0.00152 EUR
      USD: 1 / 600,       // Exemple : 1 XAF = 0.00167 USD
      XAF: 1,             // Pas de conversion nécessaire
    },
    symbols: {
      EUR: '€',
      USD: '$',
      XAF: 'F CFA',
    }
  }),

  getters: {
    symbol: (state) => state.symbols[state.selectedCurrency],
    rate: (state) => state.rates[state.selectedCurrency],
  },

  actions: {
    changeCurrency(newCurrency) {
      this.selectedCurrency = newCurrency
    },

    async fetchRates() {
      // Exemple de taux simulés (à remplacer par appel réel à une API)
      this.rates = {
        EUR: 1 / 655.957,
        USD: 1 / 600,
        XAF: 1,
      }
    },

    formatCurrency(amountInCFA) {
      const currency = this.selectedCurrency
      const rate = this.rates[currency]

      if (currency === 'XAF') {
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
