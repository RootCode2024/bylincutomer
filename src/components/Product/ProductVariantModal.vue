<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Choisir les options</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Image du produit -->
        <div class="flex items-center space-x-4 mb-6">
          <img 
            :src="product.main_image_url" 
            :alt="product.name"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h4 class="font-medium text-gray-900">{{ product.name }}</h4>
            <p class="text-indigo-600 font-semibold">{{ formattedPrice }}</p>
          </div>
        </div>

        <!-- Sélection de la couleur -->
        <div class="mb-6" v-if="availableColors.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-3">Couleur</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in availableColors"
              :key="color.id"
              @click="selectColor(color)"
              :class="[
                'flex items-center space-x-2 px-3 py-2 rounded-lg border transition',
                selectedColor?.id === color.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <div 
                class="w-4 h-4 rounded-full border border-gray-300"
                :style="{ backgroundColor: color.hex_code }"
              ></div>
              <span class="text-sm">{{ color.name }}</span>
            </button>
          </div>
        </div>

        <!-- Sélection de la taille -->
        <div class="mb-6" v-if="availableSizes.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-3">Taille</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="size in availableSizes"
              :key="size.id"
              @click="selectSize(size)"
              :disabled="!isSizeAvailable(size)"
              :class="[
                'px-4 py-2 rounded-lg border transition text-sm font-medium',
                selectedSize?.id === size.id
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : isSizeAvailable(size)
                    ? 'border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-700'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              {{ size.name }}
              <span v-if="!isSizeAvailable(size)" class="text-xs">(Épuisé)</span>
            </button>
          </div>
        </div>

        <!-- Quantité -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Quantité</label>
          <div class="flex items-center space-x-3">
            <button
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon class="h-4 w-4" />
            </button>
            <span class="w-8 text-center font-medium">{{ quantity }}</span>
            <button
              @click="increaseQuantity"
              :disabled="quantity >= maxQuantity"
              class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
            <span class="text-sm text-gray-500 ml-2">Max: {{ maxQuantity }}</span>
          </div>
        </div>

        <!-- Bouton d'ajout -->
        <button
          @click="addToCart"
          :disabled="!canAddToCart || isAdding"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <div v-if="isAdding" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          {{ isAdding ? 'Ajout...' : `Ajouter au panier - ${formattedPrice}` }}
        </button>

        <!-- Message d'erreur -->
        <div v-if="error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { XIcon, PlusIcon, MinusIcon } from 'lucide-vue-next'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'added'])

const currencyStore = useCurrencyStore()
const cartStore = useCartStore()

const selectedColor = ref(null)
const selectedSize = ref(null)
const quantity = ref(1)
const isAdding = ref(false)
const error = ref('')

// Formater le prix
const formattedPrice = computed(() => {
  const basePrice = props.product.final_price || props.product.price || 0
  const symbol = currencyStore.symbol
  const rate = currencyStore.rate
  const fromXOF = basePrice / currencyStore.rates['XOF'] * rate
  const finalPrice = fromXOF * quantity.value

  return currencyStore.selectedCurrency === 'XOF'
    ? `${finalPrice.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} ${symbol}`
    : `${symbol}${finalPrice.toFixed(2)}`
})

// Extraire les couleurs disponibles
const availableColors = computed(() => {
  const colors = new Map()
  props.product.variants?.forEach(variant => {
    if (variant.color && !colors.has(variant.color.id)) {
      colors.set(variant.color.id, variant.color)
    }
  })
  return Array.from(colors.values())
})

// Extraire les tailles disponibles pour la couleur sélectionnée
const availableSizes = computed(() => {
  const sizes = new Map()
  props.product.variants?.forEach(variant => {
    if (variant.size && 
        (!selectedColor.value || variant.color.id === selectedColor.value.id)) {
      sizes.set(variant.size.id, {
        ...variant.size,
        stock: variant.stock_quantity
      })
    }
  })
  return Array.from(sizes.values())
})

// Quantité maximale disponible
const maxQuantity = computed(() => {
  if (!selectedColor.value || !selectedSize.value) return 0
  
  const variant = props.product.variants?.find(v => 
    v.color.id === selectedColor.value.id && 
    v.size.id === selectedSize.value.id
  )
  return variant?.stock_quantity || 0
})

// Vérifier si on peut ajouter au panier
const canAddToCart = computed(() => {
  return selectedColor.value && selectedSize.value && maxQuantity.value > 0
})

// Vérifier si une taille est disponible
const isSizeAvailable = (size) => {
  if (!selectedColor.value) return false
  
  const variant = props.product.variants?.find(v => 
    v.color.id === selectedColor.value.id && 
    v.size.id === size.id
  )
  return variant && variant.stock_quantity > 0
}

// Méthodes
const selectColor = (color) => {
  selectedColor.value = color
  // Réinitialiser la taille si elle n'est plus disponible
  if (selectedSize.value && !isSizeAvailable(selectedSize.value)) {
    selectedSize.value = null
  }
}

const selectSize = (size) => {
  if (isSizeAvailable(size)) {
    selectedSize.value = size
  }
}

const increaseQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const closeModal = () => {
  emit('close')
  resetModal()
}

const resetModal = () => {
  selectedColor.value = null
  selectedSize.value = null
  quantity.value = 1
  error.value = ''
}

const addToCart = async () => {
  if (!canAddToCart.value) return
  
  try {
    isAdding.value = true
    error.value = ''

    // Trouver le variant sélectionné
    const selectedVariant = props.product.variants?.find(v => 
      v.color.id === selectedColor.value.id && 
      v.size.id === selectedSize.value.id
    )

    console.log('Variant sélectionné:', selectedVariant)

    if (!selectedVariant) {
      throw new Error('Variant non trouvé')
    }

    const cartItem = {
      product_id: props.product.id,
      variant_id: selectedVariant.id,
      name: props.product.name,
      price: props.product.final_price || props.product.price,
      quantity: quantity.value,
      maxQuantity: selectedVariant.stock_quantity || 99,
      image: props.product.main_image_url,
      selectedColor: selectedColor.value,
      selectedSize: selectedSize.value,
      barcode: selectedVariant.barcode,
      stock_quantity: selectedVariant.stock_quantity
    }

    // Ajouter au panier
    cartStore.addItem(cartItem)
    
    // Émettre l'événement
    emit('added', cartItem)
    
    // Fermer la modal
    closeModal()
    
  } catch (err) {
    console.error('Erreur:', err)
    error.value = 'Erreur lors de l\'ajout au panier'
  } finally {
    isAdding.value = false
  }
}

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Auto-sélectionner la première couleur disponible
    if (availableColors.value.length > 0 && !selectedColor.value) {
      selectColor(availableColors.value[0])
    }
  }
})

watch([selectedColor, selectedSize], () => {
  // Réinitialiser la quantité si elle dépasse le nouveau max
  if (quantity.value > maxQuantity.value) {
    quantity.value = Math.max(1, maxQuantity.value)
  }
})
</script>