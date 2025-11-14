<template>
  <div class="min-h-screen font-poppins bg-white text-gray-900 antialiased overflow-x-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="w-full py-16">
      <div class="animate-pulse space-y-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
          <div
            v-for="n in 3"
            :key="'card-' + n"
            class="bg-gray-200 h-80 rounded-2xl"
          ></div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <main v-else role="main">
      
      <!-- Hero Section avec H1 principal -->
      <section class="py-5 bg-white text-black" aria-labelledby="main-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h1 id="main-heading" class="text-4xl sm:text-5xl font-light mb-4">
              bylin - <span class="italic text-indigo-700">Mode Premium</span> au Bénin
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection exclusive de vêtements premium et collections signature à Cotonou
            </p>
          </div>

          <!-- ✅ Si une seule collection -->
          <div v-if="homeData.latest_collections.length === 1">
            <div 
              v-for="collection in homeData.latest_collections" 
              :key="collection.id"
              class="relative rounded-3xl overflow-hidden shadow-2xl h-[600px] group"
            >
              <!-- Image principale avec alt optimisé -->
              <img 
                :src="collection.banner_image || collection.cover_image || 'https://placehold.co/80?text=bylin+collection'" 
                :alt="`Collection ${collection.name} - bylin Mode Bénin`"
                class="absolute inset-0 w-full h-full object-contain object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              <!-- Overlay dégradé -->
              <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
                <div class="px-10 md:px-20 max-w-2xl text-left text-white space-y-6">
                  <h2 class="text-5xl font-semibold">{{ collection.name }}</h2>
                  <p class="text-lg text-gray-200 leading-relaxed">{{ collection.description }}</p>
                  <button class="px-8 py-3 bg-white text-black rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    Explorer la collection
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Si plusieurs collections -->
          <div 
            v-else
            class="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div 
              v-for="(collection, index) in homeData.latest_collections"
              :key="collection.id"
              class="group relative overflow-hidden rounded-2xl bg-gray-900 h-96 shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <img 
                :src="collection.cover_image || 'https://placehold.co/80?text=bylin'" 
                :alt="`Collection ${collection.name} - Vêtements bylin Bénin`"
                class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                <div class="p-8 w-full">
                  <h2 class="text-2xl font-light mb-2 text-white">{{ collection.name }}</h2>
                  <p class="text-gray-300 mb-4 line-clamp-2">{{ collection.description }}</p>
                  <button class="px-6 py-2 bg-indigo-800 text-white rounded-lg hover:bg-gray-7 transition-all duration-300 font-medium">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Populaires -->
      <section class="py-20 bg-black text-white" aria-labelledby="categories-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 id="categories-heading" class="text-4xl sm:text-5xl font-light mb-4 text-white">
              Catégories Populaires au Bénin
            </h2>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">
              Explorez nos univers les plus appréciés à Cotonou
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div 
              v-for="(category, index) in homeData.root_categories"
              :key="category.id"
              class="group text-center cursor-pointer"
              @click="$router.push(`/shop/category/${category.slug}`)"
            >
              <div class="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 group-hover:scale-110 transition-transform duration-300">
                <img 
                  :src="category.icon_url || 'https://placehold.co/80?text=bylin'" 
                  :alt="`Catégorie ${category.name} - bylin Bénin`"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 class="font-medium text-white group-hover:text-gray-300 transition-colors duration-300">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">{{ category.children?.length || 0 }} sous-catégories</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Seasonal Picks -->
      <section class="py-20 bg-gray-50" aria-labelledby="seasonal-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 id="seasonal-heading" class="text-4xl sm:text-5xl font-light mb-4 text-black">
              Sélections Saisonnières
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Les essentiels de la saison pour rester élégant au Bénin
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article 
              v-for="(product, index) in homeData.seasonal_articles"
              :key="product.id"
              class="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div class="h-64 overflow-hidden">
                <img 
                  :src="product.main_image_url || 'https://placehold.co/80?text=bylin'" 
                  :alt="`${product.name} - Vêtement bylin Bénin`"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div v-if="product.discounted_percent > 0" class="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  -{{ product.discounted_percent }}%
                </div>
              </div>
              <div class="p-6">
                <h3 class="font-semibold text-black mb-2 line-clamp-1">{{ product.name }}</h3>
                <p class="text-gray-600 text-sm mb-2 capitalize">{{ product.season }}</p>
                <div class="flex justify-between items-center">
                  <div class="">
                    <p class="text-lg font-bold text-black">{{ currencyStore.formatCurrency(product.final_price) }}</p>
                    <p v-if="product.discounted_percent > 0" class="text-sm text-gray-500 line-through">{{ currencyStore.formatCurrency(product.price) }}</p>
                  </div>
                  <router-link 
                    :to="`/product/${product.slug}`" 
                    class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 text-sm"
                    :aria-label="`Voir les détails de ${product.name}`"
                  >
                    voir
                  </router-link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Best Sellers for Month -->
      <section class="py-20 bg-black text-white" aria-labelledby="bestsellers-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 id="bestsellers-heading" class="text-4xl sm:text-5xl font-light mb-4">
              Best Sellers du Mois au Bénin
            </h2>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">
              Les produits les plus plébiscités par notre communauté à Cotonou
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article 
              v-for="(product, index) in homeData.best_sellers"
              :key="product.id"
              class="bg-gray-900 rounded-2xl overflow-hidden group hover:bg-gray-800 transition-all duration-300"
            >
              <div class="relative">
                <div class="h-64 overflow-hidden">
                  <img 
                    :src="product.main_image_url || 'https://placehold.co/80?text=bylin'" 
                    :alt="`${product.name} - Best Seller bylin Bénin`"
                    class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div class="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm font-bold">
                  #{{ index + 1 }}
                </div>
                <div v-if="product.total_sold > 0" class="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  {{ product.total_sold }} vendus
                </div>
              </div>
              <div class="p-6">
                <h3 class="font-semibold mb-2 line-clamp-1">{{ product.name }}</h3>
                <div class="flex justify-between items-center mb-4">
                  <span class="text-lg font-bold">{{ currencyStore.formatCurrency(product.final_price) }}</span>
                  <div v-if="product.discounted_percent > 0" class="text-red-400 text-sm font-bold">
                    -{{ product.discounted_percent }}%
                  </div>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-300">
                  <span>Best Seller</span>
                  <router-link 
                    :to="`/product/${product.slug}`" 
                    class="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm"
                    :aria-label="`Voir le best seller ${product.name}`"
                  >
                    voir
                  </router-link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Our Best Offer for Today -->
      <section v-if="homeData.biggest_discount" class="py-20 bg-gradient-to-r from-gray-900 to-black text-white" aria-labelledby="offer-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                Offre Flash Bénin
              </span>
              <h2 id="offer-heading" class="text-4xl sm:text-5xl font-light mb-6">
                Jusqu'à <span class="text-red-500 font-bold">-{{ homeData.biggest_discount.discounted_percent }}%</span><br>sur cette pièce exclusive
              </h2>
              <p class="text-xl text-gray-300 mb-8 leading-relaxed">
                Profitez de notre plus grosse réduction du moment au Bénin. Offre limitée dans le temps.
              </p>
              <div class="flex items-center gap-6 mb-8" role="timer" aria-label="Temps restant pour l'offre">
                <div class="text-center">
                  <div class="bg-white/20 rounded-lg p-3 w-16">
                    <span class="text-2xl font-bold">24</span>
                  </div>
                  <span class="text-sm text-gray-300 mt-2">Heures</span>
                </div>
                <div class="text-center">
                  <div class="bg-white/20 rounded-lg p-3 w-16">
                    <span class="text-2xl font-bold">59</span>
                  </div>
                  <span class="text-sm text-gray-300 mt-2">Minutes</span>
                </div>
                <div class="text-center">
                  <div class="bg-white/20 rounded-lg p-3 w-16">
                    <span class="text-2xl font-bold">45</span>
                  </div>
                  <span class="text-sm text-gray-300 mt-2">Secondes</span>
                </div>
              </div>
              <button 
                @click="$router.push(`/product/${homeData.biggest_discount.slug}`)"
                class="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                :aria-label="`Voir l'offre spéciale sur ${homeData.biggest_discount.name}`"
              >
                Voir l'offre
              </button>
            </div>
            
            <div class="relative">
              <div class="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  :src="homeData.biggest_discount.main_image_url || 'https://placehold.co/80?text=bylin'"
                  :alt="`${homeData.biggest_discount.name} - Offre spéciale bylin Bénin`"
                  class="w-full h-96 object-contain"
                  loading="lazy"
                />
              </div>
              <div class="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg">
                -{{ homeData.biggest_discount.discounted_percent }}%
              </div>
              <div class="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-xl">
                <h3 class="font-bold text-lg">{{ homeData.biggest_discount.name }}</h3>
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-lg font-bold">{{ currencyStore.formatCurrency(homeData.biggest_discount.final_price) }}</span>
                  <span class="text-sm text-gray-300 line-through">{{ currencyStore.formatCurrency(homeData.biggest_discount.price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- What Our Clients Say - Carousel -->
      <section v-if="homeData.top_bylin_reviews && homeData.top_bylin_reviews.length > 0" class="py-20 bg-gray-50" aria-labelledby="reviews-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 id="reviews-heading" class="text-4xl sm:text-5xl font-light mb-4 text-black">
              Avis Clients Bénin
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce que nos clients pensent de bylin à Cotonou
            </p>
          </div>
          
          <div class="relative">
            <!-- Carousel Container -->
            <div class="overflow-hidden">
              <div 
                class="flex transition-transform duration-500 ease-out"
                :style="{ transform: `translateX(-${currentReviewSlide * 100}%)` }"
              >
                <div 
                  v-for="(review, index) in homeData.top_bylin_reviews"
                  :key="review.id"
                  class="w-full flex-shrink-0 px-4"
                >
                  <article class="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-4xl mx-auto">
                    <div class="flex items-center mb-6">
                      <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mr-4">
                        <span class="text-white font-bold text-2xl">
                          {{ getInitials(review.author_name) }}
                        </span>
                      </div>
                      <div>
                        <h4 class="font-semibold text-black text-xl">{{ review.author_name }}</h4>
                        <p class="text-gray-500 text-sm capitalize">{{ review.service_type }}</p>
                      </div>
                    </div>
                    <div class="flex mb-6" aria-label="Note : {{ review.rating }} sur 5 étoiles">
                      <span v-for="star in 5" :key="star" 
                        :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                        class="text-2xl"
                      >
                        ★
                      </span>
                    </div>
                    <blockquote class="text-gray-700 text-lg italic mb-6 leading-relaxed">
                      "{{ review.comment }}"
                    </blockquote>
                    <p class="text-gray-400 text-sm text-right">{{ formatDate(review.created_at) }}</p>
                  </article>
                </div>
              </div>
            </div>

            <!-- Navigation Arrows -->
            <button 
              v-if="homeData.top_bylin_reviews.length > 1"
              @click="prevReview"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 z-10"
              :disabled="currentReviewSlide === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentReviewSlide === 0 }"
              aria-label="Avis précédent"
            >
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <button 
              v-if="homeData.top_bylin_reviews.length > 1"
              @click="nextReview"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 z-10"
              :disabled="currentReviewSlide === homeData.top_bylin_reviews.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentReviewSlide === homeData.top_bylin_reviews.length - 1 }"
              aria-label="Avis suivant"
            >
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Dots Indicator -->
            <div v-if="homeData.top_bylin_reviews.length > 1" class="flex justify-center mt-8 gap-2">
              <button
                v-for="(review, index) in homeData.top_bylin_reviews"
                :key="'dot-' + index"
                @click="currentReviewSlide = index"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="currentReviewSlide === index ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400'"
                :aria-label="`Aller à l'avis ${index + 1}`"
                :aria-current="currentReviewSlide === index ? 'true' : 'false'"
              ></button>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="py-20 bg-white" aria-labelledby="why-choose-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 id="why-choose-heading" class="text-4xl sm:text-5xl font-light mb-4 text-black">
              Pourquoi Choisir bylin au Bénin ?
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              L'excellence au service de votre style à Cotonou
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article 
              v-for="(reason, index) in whyChooseUs"
              :key="reason.title"
              class="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <div class="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck v-if="reason.icon === 'truck'" class="text-white" />
                <Clock3 v-if="reason.icon === 'quality'" />
                <Undo2 v-if="reason.icon === 'return'" />
                <Sprout v-if="reason.icon === 'eco'" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-black">{{ reason.title }}</h3>
              <p class="text-gray-600 leading-relaxed">{{ reason.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- Connect With Us (Instagram) -->
      <section class="py-20 bg-black text-white" aria-labelledby="instagram-heading">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-16">
            <h2 id="instagram-heading" class="text-4xl sm:text-5xl font-light mb-4">
              Connectez-vous avec bylin Bénin
            </h2>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">
              Suivez-nous sur Instagram @bylin_ex_bylcompany
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div
              v-for="(url, i) in instagramUrls"
              :key="i"
              class="rounded-xl overflow-hidden"
            >
              <blockquote
                class="instagram-media"
                :data-instgrm-permalink="url"
                data-instgrm-version="14"
                style="max-width: 350px; margin:auto;"
              ></blockquote>
            </div>
          </div>
          
          <div class="text-center mt-12">
            <router-link 
              to="https://www.instagram.com/bylin_ex_bylcompany?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              class="px-8 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              aria-label="Suivre bylin sur Instagram"
            >
              Suivre sur Instagram
            </router-link>
          </div>
        </div>
      </section>

      <!-- Section SEO textuelle cachée -->
      <div class="sr-only" aria-hidden="true">
        <h2>bylin - Marque de Mode Premium au Bénin</h2>
        <p>
          bylin est la référence en matière de mode premium au Bénin, spécialisée dans les vêtements tendance 
          et les collections exclusives disponibles à Cotonou. Découvrez notre gamme de vêtements pour homme 
          et femme, alliant qualité exceptionnelle et style unique. Livraison rapide dans tout le Bénin, 
          retours faciles et service client dédié. bylin incarne l'excellence de la mode africaine contemporaine.
        </p>
        <h3>Nos services au Bénin :</h3>
        <ul>
          <li>Vêtements premium pour homme et femme</li>
          <li>Collections exclusives et pièces limitées</li>
          <li>Livraison express à Cotonou</li>
          <li>Service client personnalisé</li>
          <li>Retours gratuits sous 30 jours</li>
        </ul>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axiosConfig'
import { useCurrencyStore } from '@/stores/currency'
import { useUIStore } from '@/stores/ui'
import {
  Truck,
  Clock3,
  Undo2,
  Sprout
} from 'lucide-vue-next'

// État de chargement
const loading = ref(true)
const homeData = ref({})

const currencyStore = useCurrencyStore()
const uiStore = useUIStore()

// État du carousel d'avis
const currentReviewSlide = ref(0)

// Fonctions de navigation du carousel
const nextReview = () => {
  if (currentReviewSlide.value < homeData.value.top_bylin_reviews.length - 1) {
    currentReviewSlide.value++
  }
}

const prevReview = () => {
  if (currentReviewSlide.value > 0) {
    currentReviewSlide.value--
  }
}

// Données statiques optimisées pour le SEO Bénin
const whyChooseUs = ref([
  {
    icon: "truck",
    title: "Livraison Rapide au Bénin",
    description: "Expédition sous 24h et livraison offerte dans Cotonou dès 60 000 Franc d'achat. Service de livraison dans tout le Bénin."
  },
  {
    icon: "quality",
    title: "Qualité Premium Garantie",
    description: "Matériaux sélectionnés et savoir-faire artisanal pour des vêtements bylin durables et élégants."
  },
  {
    icon: "return",
    title: "Retours Faciles à Cotonou",
    description: "30 jours pour retourner vos articles, satisfait ou remboursé. Processus simplifié au Bénin."
  },
  {
    icon: "eco",
    title: "Mode Éco-responsable",
    description: "Engagés pour une mode durable et éthique. bylin s'engage pour l'environnement au Bénin."
  }
])

const instagramUrls = ref([
  'https://www.instagram.com/p/DJrbhSACERa/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DNtw3g5UI91/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  'https://www.instagram.com/p/DJoTrr3taLF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

// Chargement des données depuis l'API
onMounted(async () => {
  try {
    loading.value = true
    
    const response = await uiStore.getHomePageDatas()
    
    console.log(response)
    
    if (response) {
      homeData.value = response
    } else {
      console.error('API returned error:', response.message)
      // Initialiser avec des données vides pour éviter les erreurs
      homeData.value = {
        latest_collections: [],
        root_categories: [],
        seasonal_articles: [],
        best_sellers: [],
        biggest_discount: null,
        top_bylin_reviews: []
      }
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    // En cas d'erreur, initialiser avec des données vides
    homeData.value = {
      latest_collections: [],
      root_categories: [],
      seasonal_articles: [],
      best_sellers: [],
      biggest_discount: null,
      top_bylin_reviews: []
    }
  } finally {
    loading.value = false
  }


  if (!document.getElementById('instagram-embed-script')) {
    const script = document.createElement('script')
    script.id = 'instagram-embed-script'
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)
  } else {
    if (window.instgrm?.Embeds) window.instgrm.Embeds.process()
  }
})
</script>

<style scoped>
/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Styles pour les transitions de groupe */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Utilitaires pour le texte */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Optimisations pour mobile */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Styles pour les images responsive */
img {
  transition: transform 0.5s ease;
}

/* Effets de survol améliorés */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px);
}
</style>