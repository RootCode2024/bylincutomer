<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900 font-sans antialiased overflow-x-hidden">
    <!-- Loading state amélioré -->
    <div v-if="loading" class="w-full py-16">
      <div class="animate-pulse space-y-12">
        <!-- 1) Grille full width (skeleton cartes produits/collections) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-6 px-6 max-w-7xl mx-auto">
          <div
            v-for="n in 1"
            :key="'card-' + n"
            class="bg-gray-200 h-72 rounded-2xl shadow-sm"
          ></div>
        </div>

        <!-- 2) Sous-grille de 6 blocs texte -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-6 max-w-7xl mx-auto">
          <div
            v-for="n in 6"
            :key="'text-' + n"
            class="flex flex-col space-y-3"
          >
            <div class="h-24 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>


    <!-- Main content -->
    <div v-else>
      <!-- Hero section premium redesigné -->
      <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- Fond avec motifs géométriques animés -->
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
          <!-- Motifs géométriques flottants -->
          <div class="absolute top-0 left-0 w-full h-full">
            <div class="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float"></div>
            <div class="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-lg animate-float-delayed"></div>
            <div class="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
        </div>
        
        <!-- Contenu principal centré -->
        <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <!-- Logo/Nom de marque stylisé -->
          <div class="mb-8 animate-fade-in-up">
            <h1 class="text-6xl sm:text-8xl font-extralight tracking-wider text-white mb-4">
              <span class="font-serif italic bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                BylIn
              </span>
            </h1>
            <div class="w-24 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto mb-2"></div>
            <p class="text-purple-200 font-light tracking-widest text-sm uppercase">
              Clothing
            </p>
          </div>
          
          <!-- Collection mise en avant -->
          <div class="mb-12 animate-fade-in-up animation-delay-200">
            <h2 class="text-3xl sm:text-5xl font-light text-white mb-6 leading-relaxed">
              {{ latestCollection?.name || 'Collection Automne' }}
              <span class="text-2xl sm:text-3xl text-purple-300 block font-serif italic mt-2">
                2024
              </span>
            </h2>
            <p class="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 leading-relaxed">
              {{ latestCollection?.description || 'Élégance moderne et sophistication intemporelle pour sublimer votre style unique' }}
            </p>
          </div>
          
          <!-- Boutons d'action redesignés -->
          <div class="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up animation-delay-400">
            <a href="#collections" class="group relative px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-2xl hover:bg-white/20 transition-all duration-500 border border-white/20 hover:border-white/40 hover:scale-105 transform">
              <span class="relative z-10">Découvrir la collection</span>
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
            <a href="#products" class="group px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transform">
              Voir les produits
            </a>
          </div>
        </div>
        
        <!-- Indicateur de défilement redesigné -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div class="w-6 h-10 border-2 border-white/50 rounded-full relative">
            <div class="w-1 h-2 bg-white rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-scroll"></div>
          </div>
        </div>
      </section>

      <!-- Collections mises en avant avec design amélioré -->
      <section id="collections" class="py-24 bg-white relative">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-20">
            <span class="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">
              Nos créations
            </span>
            <h2 class="text-4xl sm:text-5xl font-light mb-6 text-gray-900">
              Collections <span class="font-serif italic text-indigo-600">exclusives</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Découvrez nos dernières créations alliant modernité et élégance
            </p>
          </div>
          
          <div v-if="collections.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(collection, index) in collections" 
              :key="collection.id"
              class="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 animate-fade-in-up"
              :style="{ 'animation-delay': `${index * 200}ms` }"
            >
              <!-- Image placeholder avec dégradé -->
              <div class="h-72 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30 transition-all duration-700"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <h3 class="text-3xl font-light text-gray-800 text-center px-4">
                    {{ collection.name }}
                  </h3>
                </div>
                <!-- Effet de survol -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              <div class="p-8">
                <p class="text-gray-600 mb-6 leading-relaxed">{{ collection.description }}</p>
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {{ collection.products?.length || 0 }} produits
                    </span>
                  </div>
                  <button class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
                    Explorer
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <p class="text-xl text-gray-500">Nos collections arrivent bientôt...</p>
          </div>
        </div>
      </section>

      <!-- Section produits redesignée -->
      <section id="products" class="py-24 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-20">
            <span class="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              Notre sélection
            </span>
            <h2 class="text-4xl sm:text-5xl font-light mb-6 text-gray-900">
              Produits <span class="font-serif italic text-purple-600">tendance</span>
            </h2>
            
            <!-- Filtres redesignés -->
            <div class="flex flex-wrap justify-center gap-3 mt-12">
              <button 
                @click="selectedCategory = null"
                :class="[
                  'px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105',
                  selectedCategory === null 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                ]"
              >
                Tous les produits
              </button>
              <button 
                v-for="category in categories"
                :key="category.id"
                @click="selectedCategory = category.id"
                :class="[
                  'px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105',
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                ]"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
          
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <ProductCard 
              v-for="(product, index) in filteredProducts.slice(0, 8)"
              :key="product.id"
              :product="product"
              @add-to-cart="addToCart"
              @add-to-wishlist="addToWishlist"
              class="animate-fade-in-up"
              :style="{ 'animation-delay': `${index * 100}ms` }"
            />
          </div>
          
          <div v-else class="text-center py-16">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <p class="text-xl text-gray-500">Aucun produit trouvé dans cette catégorie</p>
          </div>
        </div>
      </section>

      <!-- Bannière promotionnelle redesignée -->
      <section class="relative py-20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22white%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m0 40l40-40h-40v40zm40 0v-40h-40l40 40z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div class="relative container mx-auto px-6 text-center">
          <div class="max-w-4xl mx-auto">
            <span class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
              Offre limitée
            </span>
            <h3 class="text-4xl sm:text-6xl font-light text-white mb-6 leading-tight">
              Soldes d'automne
              <span class="block text-3xl sm:text-4xl text-yellow-300 font-bold mt-2">
                Jusqu'à -50%
              </span>
            </h3>
            <p class="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Découvrez notre sélection exclusive de pièces intemporelles à prix exceptionnels
            </p>
            <button class="px-10 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
              Découvrir les promotions
            </button>
          </div>
        </div>
      </section>

      <!-- Section avantages redesignée -->
      <section class="py-24 bg-white">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-20">
            <span class="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              Nos engagements
            </span>
            <h2 class="text-4xl sm:text-5xl font-light mb-6 text-gray-900">
              Pourquoi <span class="font-serif italic text-green-600">BylIn</span> ?
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Une expérience shopping unique avec des services premium
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              v-for="(advantage, index) in advantages"
              :key="advantage.title"
              class="text-center group animate-fade-in-up"
              :style="{ 'animation-delay': `${index * 150}ms` }"
            >
              <div class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span class="text-3xl">{{ advantage.icon }}</span>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                {{ advantage.title }}
              </h3>
              <p class="text-gray-600 leading-relaxed">{{ advantage.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter redesignée -->
      <section class="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22white%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30v-2l-8-2-8 2v2l8 2 8-2z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        <div class="container mx-auto px-6 max-w-4xl relative">
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div class="md:flex">
              <div class="md:w-1/2 p-12 text-white">
                <div class="h-full flex flex-col justify-center">
                  <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-6 w-fit">
                    Newsletter exclusive
                  </span>
                  <h3 class="text-3xl sm:text-4xl font-light mb-6 leading-tight">
                    Restez à la <span class="font-serif italic">mode</span>
                  </h3>
                  <p class="text-lg text-gray-200 leading-relaxed">
                    Recevez en avant-première nos nouveautés, conseils stylisme et offres exclusives directement dans votre boîte mail.
                  </p>
                </div>
              </div>
              
              <div class="md:w-1/2 p-12 bg-white">
                <div class="h-full flex flex-col justify-center">
                  <h3 class="text-2xl sm:text-3xl font-light mb-6 text-gray-900">
                    Abonnez-vous
                  </h3>
                  <p class="text-gray-600 mb-8 leading-relaxed">
                    <span class="font-semibold text-indigo-600">-15%</span> sur votre première commande + livraison offerte
                  </p>
                  
                  <form @submit.prevent="subscribeNewsletter" class="space-y-6">
                    <div class="relative">
                      <input
                        type="email"
                        placeholder="Votre adresse email"
                        v-model="email"
                        required
                        class="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      :disabled="subscribing"
                      :class="[
                        'w-full px-6 py-4 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 transform',
                        subscribing 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                      ]"
                    >
                      {{ subscribing ? 'Inscription en cours...' : "S'abonner maintenant" }}
                    </button>
                  </form>
                  
                  <p class="text-xs text-gray-500 mt-4 text-center">
                    Pas de spam, promis. Désabonnement en un clic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axiosConfig'
import ProductCard from '@/components/Product/ProductCard.vue'

// État de chargement
const loading = ref(true)
const subscribing = ref(false)

// Données de l'API
const collections = ref([])
const latestCollection = ref(null)
const allProducts = ref([])
const categories = ref([])

// Filtres
const selectedCategory = ref(null)

// Formulaire newsletter
const email = ref('')

// Données statiques pour les avantages
const advantages = ref([
  {
    icon: '🚀',
    title: 'Livraison Express',
    description: 'Expédition sous 24h partout en France et livraison gratuite dès 75€ d\'achat'
  },
  {
    icon: '🔄',
    title: 'Retours Gratuits',
    description: '30 jours pour changer d\'avis avec retour gratuit et remboursement immédiat'
  },
  {
    icon: '🛡️',
    title: 'Paiement Sécurisé',
    description: 'Transactions cryptées SSL et protection bancaire pour acheter en toute sérénité'
  },
  {
    icon: '🌿',
    title: 'Mode Durable',
    description: 'Matériaux éco-responsables et production éthique pour un fashion conscient'
  }
])

// Fonction pour récupérer les collections
async function fetchCollections() {
  try {
    const response = await api.get('/home/collections')
    console.log('Collections response:', response)
    
    // Vérification de la structure de response
    const data = response.data || response
    collections.value = Array.isArray(data) ? data : []
    
    // Extraire tous les produits et catégories
    const productsSet = new Set()
    const categoriesMap = new Map()
    
    collections.value.forEach(collection => {
      if (collection.products && Array.isArray(collection.products)) {
        collection.products.forEach(product => {
          // Ajouter l'ID de collection au produit pour référence
          const enrichedProduct = {
            ...product,
            collection_id: collection.id,
            collection_name: collection.name
          }
          
          productsSet.add(JSON.stringify(enrichedProduct))
          
          // Gestion des catégories avec Map pour éviter les doublons
          if (product.category && product.category.id) {
            categoriesMap.set(product.category.id, product.category)
          }
        })
      }
    })
    
    // Convertir les Sets/Maps en Arrays
    allProducts.value = Array.from(productsSet).map(item => JSON.parse(item))
    categories.value = Array.from(categoriesMap.values())
    
  } catch (error) {
    console.error('Erreur lors de la récupération des collections:', error)
    // Utiliser des données par défaut en cas d'erreur
    collections.value = []
    allProducts.value = []
    categories.value = []
  }
}

// Fonction pour récupérer la dernière collection
async function fetchLatestCollection() {
  try {
    const response = await api.get('/home/collections/latest')
    console.log('Latest collection response:', response)
    
    const data = response.data || response
    latestCollection.value = data
  } catch (error) {
    console.error('Erreur lors de la récupération de la dernière collection:', error)
    latestCollection.value = null
  }
}

// Fonctions d'action
const addToCart = (product) => {
  console.log('Ajouter au panier:', product)
  // TODO: Implémenter la logique d'ajout au panier
  // Vous pouvez ajouter ici un toast de confirmation
}

const addToWishlist = (product) => {
  console.log('Ajouter à la wishlist:', product)
  // TODO: Implémenter la logique d'ajout à la wishlist
  // Vous pouvez ajouter ici un toast de confirmation
}

// Produits filtrés par catégorie
const filteredProducts = computed(() => {
  if (!Array.isArray(allProducts.value)) return []
  
  if (selectedCategory.value === null) {
    return allProducts.value
  }
  
  return allProducts.value.filter(product => 
    product.category && product.category.id === selectedCategory.value
  )
})

// Fonction pour s'abonner à la newsletter
async function subscribeNewsletter() {
  if (!email.value || subscribing.value) return
  
  subscribing.value = true
  
  try {
    // TODO: Remplacer par votre endpoint d'API réel
    // const response = await api.post('/newsletter/subscribe', {
    //   email: email.value
    // })
    
    // Simulation d'une inscription réussie
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // TODO: Remplacer par un système de toast plus élégant
    alert(`Merci pour votre inscription, ${email.value}! Votre code promo -15% vous sera envoyé par email.`)
    email.value = ''
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error)
    alert('Erreur lors de l\'inscription. Veuillez réessayer plus tard.')
  } finally {
    subscribing.value = false
  }
}

// Charger les données au montage du composant
onMounted(async () => {
  try {
    // Charger les données en parallèle pour optimiser la performance
    await Promise.allSettled([
      fetchCollections(),
      fetchLatestCollection()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement initial des données:', error)
  } finally {
    // S'assurer que le loading est désactivé même en cas d'erreur
    setTimeout(() => {
      loading.value = false
    }, 500) // Délai minimum pour une meilleure UX
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes scroll {
  0% {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(10px) translateX(-50%);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-scroll {
  animation: scroll 2s infinite;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

/* Styles de base améliorés */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

/* Effets de survol améliorés */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive amélioré */
@media (max-width: 640px) {
  .animate-fade-in-up {
    animation-delay: 0 !important;
  }
}

/* Performance optimizations
* {
  box-sizing: border-box;
}

img {
  loading: lazy;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus states accessibles */
button:focus,
input:focus,
a:focus {
  outline: 2px solid theme('colors.indigo.500');
  outline-offset: 2px;
}

/* États de chargement optimisés */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Optimisations pour mobile */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  /* Réduction des animations sur mobile pour les performances */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

/* Print styles */
@media print {
  .animate-spin,
  .animate-bounce,
  .animate-pulse,
  .animate-float,
  .animate-float-delayed {
    animation: none !important;
  }
}

/* Dark mode support (optionnel) */
@media (prefers-color-scheme: dark) {
  /* Vous pouvez ajouter ici des styles pour le mode sombre si nécessaire */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gradient-to-r,
  .bg-gradient-to-br,
  .bg-gradient-to-t {
    background: theme('colors.indigo.600') !important;
  }
  
  .text-gray-600 {
    color: theme('colors.gray.900') !important;
  }
}

/* Styles pour les composants manquants ou améliorés */
.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Styles pour les notifications/toasts (à implémenter) */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-left: 4px solid theme('colors.green.500');
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Styles pour les modales (à implémenter) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Améliorations de l'état de chargement */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.5rem;
}

/* Styles pour les badges et étiquettes */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-new {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.badge-sale {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.badge-trending {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

/* Styles pour les cartes produits améliorées */
.product-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
}

.product-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-image-overlay {
  opacity: 1;
}

.product-quick-actions {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  gap: 0.5rem;
}

.product-card:hover .product-quick-actions {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* Styles pour les filtres avancés */
.filter-dropdown {
  position: relative;
}

.filter-dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

/* Styles pour la recherche */
.search-container {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 0.75rem 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 20;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-top: none;
}

/* Amélioration des transitions pour les performances */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

/* Styles pour les images responsive */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.responsive-image:hover {
  transform: scale(1.05);
}

/* Styles pour les boutons avec états de chargement */
.btn-loading {
  position: relative;
  color: transparent !important;
}

.btn-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  margin-top: -0.5rem;
  margin-left: -0.5rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Styles pour les tooltips */
.tooltip {
  position: relative;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.tooltip:hover::before {
  opacity: 1;
}

/* Styles pour les breadcrumbs */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: theme('colors.gray.600');
}

.breadcrumb-separator {
  color: theme('colors.gray.400');
}

/* Styles pour le panier flottant */
.floating-cart {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background: theme('colors.indigo.600');
  color: white;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.floating-cart:hover {
  background: theme('colors.indigo.700');
  transform: scale(1.1);
}

/* Styles pour les alertes/messages */
.alert {
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-success {
  background: theme('colors.green.50');
  border-color: theme('colors.green.200');
  color: theme('colors.green.800');
}

.alert-error {
  background: theme('colors.red.50');
  border-color: theme('colors.red.200');
  color: theme('colors.red.800');
}

.alert-warning {
  background: theme('colors.yellow.50');
  border-color: theme('colors.yellow.200');
  color: theme('colors.yellow.800');
}

.alert-info {
  background: theme('colors.blue.50');
  border-color: theme('colors.blue.200');
  color: theme('colors.blue.800');
}
</style>