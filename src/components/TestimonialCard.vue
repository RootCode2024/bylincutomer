<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover-scale transition-all duration-300 h-full">
    <div class="p-6 flex flex-col h-full">
      <!-- Note -->
      <div class="flex mb-4">
        <template v-for="(star, index) in 5" :key="index" class="mr-1">
          <svg
            class="h-5 w-5"
            :class="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </template>
      </div>

      <!-- Témoignage -->
      <p class="text-gray-600 italic mb-6 flex-grow">
        "{{ testimonial.content }}"
      </p>

      <!-- Auteur -->
      <div class="flex items-center">
        <img
          :src="testimonial.image"
          :alt="'Photo de ' + testimonial.name"
          class="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
          <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  testimonial: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['name', 'role', 'content', 'rating', 'image'].every(
        (key) => key in value
      )
    }
  }
})
</script>

<style scoped>
.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>