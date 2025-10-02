<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group relative">
    <!-- Image du produit -->
    <div class="relative overflow-hidden aspect-square">
      <img
        v-if="product.main_image_url"
        :src="`${product.main_image_url}`"
        :alt="product.name"
        class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-200"
      >
        No Image
      </div>

      <!-- Badge promo/nouveau -->
      <div
        v-if="product.discount || product.isNew"
        class="absolute top-2 left-2 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full"
      >
        {{ product.discount ? 'Promo' : 'New' }}
      </div>
    </div>

    <!-- Contenu texte -->
    <div class="p-4">
      <!-- Titre et prix -->
      <router-link :to="`/product/${product.slug}`" class="block mb-2">
        <h3 class="text-gray-800 font-medium truncate">{{ product.name }}</h3>
        <p class="text-indigo-600 font-semibold">{{ formattedPrice }}</p>
      </router-link>

      <!-- Actions -->
      <div class="flex justify-between items-center mt-2">
        <!-- Bouton ajout panier -->
        <button
          @click="openVariantModal"
          :disabled="isAddingToCart"
          class="p-2 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Ajouter au panier"
        >
          <div v-if="isAddingToCart" class="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          <PlusIcon v-else class="h-5 w-5" />
        </button>

        <FavoriteButton 
          :product="product || undefined"
        />
      </div>
    </div>
    <ProductVariantModal
      :product="product"
      :is-open="showVariantModal"
      @close="showVariantModal = false"
      @added="onProductAdded"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'
import { PlusIcon } from 'lucide-vue-next'
import FavoriteButton from '@/components/ui/FavoriteButton.vue'
import ProductVariantModal from '@/components/Product/ProductVariantModal.vue'
import { max } from 'lodash'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const currencyStore = useCurrencyStore()
const cartStore = useCartStore()
const isAddingToCart = ref(false)

const showVariantModal = ref(false)

const openVariantModal = () => {
  showVariantModal.value = true
}

const onProductAdded = (cartItem) => {
  console.log('Produit ajouté:', cartItem)
  // Optionnel: afficher une notification toast
}

const formattedPrice = computed(() => {
  // Utiliser final_price ou price selon ce qui est disponible
  const basePrice = props.product.final_price || props.product.price || 0
  
  const symbol = currencyStore.symbol
  const rate = currencyStore.rate
  const fromXAF = basePrice / currencyStore.rates['XAF'] * rate
  const finalPrice = fromXAF

  return currencyStore.selectedCurrency === 'XAF'
    ? `${finalPrice.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} ${symbol}`
    : `${symbol}${finalPrice.toFixed(2)}`
})

const addToCart = async () => {
  if (isAddingToCart.value) return
  
  try {
    isAddingToCart.value = true
    
    // Récupérer les variants du produit
    const colorVariants = props.product.variants?.filter(variant => variant.type === 'color') || []
    const sizeVariants = props.product.variants?.filter(variant => variant.type === 'size') || []
    
    // Auto-sélectionner les premières options disponibles
    let selectedColor = null
    let selectedSize = null
    let selectedVariantId = null
    
    if (colorVariants.length > 0) {
      selectedColor = colorVariants[0]
      selectedVariantId = colorVariants[0].id
    }
    
    if (sizeVariants.length > 0) {
      selectedSize = sizeVariants[0]
      // Si on a déjà une couleur, combiner, sinon utiliser la taille
      selectedVariantId = sizeVariants[0].id
    }

    // Créer l'objet à ajouter au panier adapté à votre structure
    const cartItem = {
      product_id: props.product.id,
      name: props.product.name,
      price: props.product.final_price || props.product.price,
      quantity: 1,
      maxQuantity: props.product.available_stock || 99,
      image: props.product.main_image_url,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      variant_id: selectedVariantId // Pour la DB
    }

    // Ajouter au store local
    cartStore.addItem(cartItem)
    
    // Optionnel: afficher un message de succès
    console.log('Produit ajouté au panier:', cartItem)
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    // Optionnel: afficher un message d'erreur à l'utilisateur
  } finally {
    isAddingToCart.value = false
  }
}
</script>