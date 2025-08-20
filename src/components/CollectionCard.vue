<template>
  <div 
    class="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover-scale transition-all duration-300"
    @click="$emit('select', collection)"
  >
    <img
      :src="collection.image"
      :alt="collection.name"
      class="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6"
    >
      <h3 class="text-2xl font-bold text-white mb-1">
        {{ collection.name }}
      </h3>
      <p class="text-gray-200 text-sm">
        {{ collection.description }}
      </p>
      <button
        class="mt-4 self-start bg-white text-gray-900 hover:bg-gray-100 px-5 py-2 rounded-full font-medium text-sm transition-all opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 duration-300"
      >
        Voir la collection
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  collection: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['id', 'name', 'image', 'description'].every(
        (key) => key in value
      )
    }
  }
})

defineEmits(['select'])
</script>

<style scoped>
.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>