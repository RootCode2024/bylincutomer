<template>
  <button
    class="flex items-center gap-2 p-2 rounded-full transition-colors duration-200"
    :class="{
      'text-rose-600 hover:bg-rose-100': isFavorited,
      'text-gray-600 hover:text-rose-500 hover:bg-rose-50': !isFavorited
    }"
    @click="handleClick"
    :aria-label="isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    :disabled="!product"
  >
    <component 
      :is="isFavorited ? HeartFilled : HeartOutline" 
      class="h-5 w-5 flex-shrink-0"
      :class="{'fill-current': isFavorited}"
    />
    <span v-if="text" class="text-sm whitespace-nowrap">{{ text }}</span>
  </button>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Heart as HeartOutline } from 'lucide-vue-next'
import { Heart as HeartFilled } from 'lucide-vue-next'
import { useWishlistStore } from '@/stores/wishlist'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  product: {
    type: Object,
    default: () => ({}), // Valeur par défaut vide
    validator: (product) => {
      // Seulement valider si l'objet n'est pas vide
      return Object.keys(product).length === 0 || 'id' in product
    }
  }
})

const emit = defineEmits(['toggle'])

const wishlistStore = useWishlistStore()

const isFavorited = computed(() => {
  if (!props.product || !props.product.id) return false
  return wishlistStore.items.some(item => item.id === props.product.id)
})

function handleClick() {
  if (!props.product?.id) return
  wishlistStore.toggleFavorite(props.product)
  emit('toggle', !isFavorited.value)
}

onMounted(() => {
  console.log('wishlistStore.items')
  // console.log(wishlistStore.items)
})
</script>