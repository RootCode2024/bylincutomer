<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group relative">
    <!-- Image du produit -->
    <div class="relative overflow-hidden aspect-square rounded-xl bg-gray-50">
      <img
        :src="product.main_image_url || 'https://placehold.co/80?text=bylin'"
        :alt="product.name"
        class="w-full h-full object-contain transition duration-300 group-hover:scale-105"
      />

      <!-- Badges -->
      <div class="absolute top-2 left-2 flex flex-col gap-2">
        <!-- Badge Promo -->
        <transition name="fade">
          <div
            v-if="product.is_trending"
            class="backdrop-blur-sm bg-rose-500/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-fade-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 8c-.825 0-1.5.675-1.5 1.5S11.175 11 12 11s1.5-.675 1.5-1.5S12.825 8 12 8zm0 0V6m0 8v2m-6-2v2m12-2v2m-9-4H7m10 0h-2" />
            </svg>
            Promo
          </div>
        </transition>

        <!-- Badge Nouveau -->
        <transition name="fade">
          <div
            v-if="product.is_featured"
            class="backdrop-blur-sm bg-indigo-600/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-fade-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
            </svg>
            Nouveau
          </div>
        </transition>
      </div>
    </div>

    <!-- Contenu texte -->
    <div class="p-4">
      <!-- Titre et prix -->
      <router-link :to="`/product/${product.slug}`" class="block mb-2">
        <h2 class="text-gray-800 font-medium text-xl truncate">{{ product.name }}</h2>
        <h3 class="text-gray-500 font-thin truncate my-3">{{ product?.category.name }}</h3>
        <p class="text-indigo-800 font-bold text-xl">{{ formattedPrice }}</p>
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
  const fromXOF = basePrice / currencyStore.rates['XOF'] * rate
  const finalPrice = fromXOF

  return currencyStore.selectedCurrency === 'XOF'
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>