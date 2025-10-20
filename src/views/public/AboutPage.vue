<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-900 to-purple-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl font-bold mb-6">Notre Histoire</h1>
        <p class="text-xl opacity-90 max-w-3xl mx-auto">
          Bylin - Redéfinir l'excellence à travers des produits soigneusement sélectionnés 
          et un service exceptionnel.
        </p>
      </div>
    </section>

    <!-- Notre Mission -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p class="text-lg text-gray-600 mb-6">
              Chez Bylin, nous croyons que chaque produit raconte une histoire. 
              Notre mission est de vous offrir des articles qui allient qualité, 
              design et durabilité.
            </p>
            <p class="text-lg text-gray-600">
              Nous sélectionnons méticuleusement chaque produit pour vous garantir 
              une expérience d'achat exceptionnelle et des articles qui durent dans le temps.
            </p>
          </div>
          <div class="bg-gray-100 rounded-2xl p-8">
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div class="text-gray-600">Clients satisfaits</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div class="text-gray-600">Produits disponibles</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-600 mb-2">24h</div>
                <div class="text-gray-600">Support réactif</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-orange-600 mb-2">30j</div>
                <div class="text-gray-600">Retours faciles</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nos Valeurs -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
          <p class="text-lg text-gray-600">Les principes qui guident chaque décision</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Qualité</h3>
            <p class="text-gray-600">Des produits rigoureusement sélectionnés pour leur excellence</p>
          </div>
          <div class="text-center p-6">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Service Client</h3>
            <p class="text-gray-600">Une équipe dédiée à votre satisfaction</p>
          </div>
          <div class="text-center p-6">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
            <p class="text-gray-600">Toujours à la recherche des meilleures solutions</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Award, Heart, Sparkles } from 'lucide-vue-next'
</script>