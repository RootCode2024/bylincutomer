<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Bannière de la wishlist -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Ma liste de souhaits</h1>
            <p class="mt-2 text-indigo-100">Retrouvez tous vos produits favoris au même endroit</p>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="shareWishlist"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Partager
            </button>
            <button 
              v-if="wishlistItems.length > 0"
              @click="addAllToCart"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Tout ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Liste vide -->
      <div v-if="wishlistItems.length === 0" class="text-center py-16">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Votre liste de souhaits est vide</h3>
        <p class="mt-1 text-sm text-gray-500">Commencez par ajouter des produits que vous aimez à votre liste.</p>
        <div class="mt-6">
          <router-link 
            to="/products"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Parcourir la boutique
          </router-link>
        </div>
      </div>

      <!-- Liste des produits -->
      <div v-else>
        <!-- Filtres et tris -->
        <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="flex-1">
            <div class="relative rounded-md shadow-sm max-w-xs">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                v-model="searchQuery"
                type="text" 
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Rechercher dans la liste..."
              >
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <label for="sort" class="mr-2 text-sm text-gray-600">Trier par :</label>
              <select 
                id="sort" 
                v-model="sortOption"
                class="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="date-desc">Plus récent</option>
                <option value="date-asc">Plus ancien</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
              </select>
            </div>
            <button 
              @click="toggleViewMode"
              class="p-2 text-gray-400 hover:text-indigo-500"
              :title="viewMode === 'grid' ? 'Passer en vue liste' : 'Passer en vue grille'"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="viewMode === 'grid'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Vue Grille -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="(item, index) in filteredItems" 
            :key="item.id"
            class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div class="relative">
              <!-- Image du produit -->
              <router-link :to="'/product/' + item.slug" class="block aspect-w-4 aspect-h-3">
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="object-cover w-full h-64"
                >
              </router-link>
              
              <!-- Badge de réduction -->
              <div v-if="item.discount" class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{{ item.discount }}%
              </div>
              
              <!-- Bouton de suppression -->
              <button 
                @click="removeFromWishlist(index)"
                class="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-red-500 hover:bg-white transition-colors duration-200"
                title="Retirer de la liste"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <!-- Détails du produit -->
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-1">
                    <router-link :to="'/product/' + item.slug" class="hover:text-indigo-600">{{ item.name }}</router-link>
                  </h3>
                  <p class="text-sm text-gray-500">{{ item.category }}</p>
                </div>
                <button 
                  @click="toggleFavorite(index)"
                  class="text-red-500 hover:text-red-600"
                  :title="item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="item.favorite" fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656zM10 15l.707-.707a1 1 0 00-1.414 0L10 15z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div class="mt-3 flex items-center justify-between">
                <div>
                  <span class="text-lg font-bold text-gray-900">{{ item.price }}€</span>
                  <span v-if="item.originalPrice" class="ml-2 text-sm text-gray-500 line-through">{{ item.originalPrice }}€</span>
                </div>
                <button 
                  @click="addToCart(item)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter
                </button>
              </div>
              
              <!-- Disponibilité -->
              <div class="mt-3 flex items-center">
                <span 
                  v-if="item.inStock"
                  class="inline-flex items-center text-sm text-green-600"
                >
                  <svg class="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  En stock
                </span>
                <span v-else class="text-sm text-red-600">Rupture de stock</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Liste -->
        <div v-else class="space-y-4">
          <div 
            v-for="(item, index) in filteredItems" 
            :key="item.id"
            class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Image du produit -->
              <div class="md:w-1/4">
                <router-link :to="'/product/' + item.slug" class="block">
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="object-cover w-full h-48 md:h-full"
                  >
                </router-link>
              </div>
              
              <!-- Détails du produit -->
              <div class="p-4 md:w-3/4 flex flex-col">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">
                      <router-link :to="'/product/' + item.slug" class="hover:text-indigo-600">{{ item.name }}</router-link>
                    </h3>
                    <p class="text-sm text-gray-500">{{ item.category }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click="toggleFavorite(index)"
                      class="text-red-500 hover:text-red-600"
                      :title="item.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    >
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="item.favorite" fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                        <path v-else fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656zM10 15l.707-.707a1 1 0 00-1.414 0L10 15z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      @click="removeFromWishlist(index)"
                      class="text-gray-400 hover:text-red-500"
                      title="Retirer de la liste"
                    >
                      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p class="mt-2 text-gray-600 text-sm">{{ item.description }}</p>
                
                <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <span class="text-xl font-bold text-gray-900">{{ item.price }}€</span>
                    <span v-if="item.originalPrice" class="ml-2 text-sm text-gray-500 line-through">{{ item.originalPrice }}€</span>
                    <div class="mt-1">
                      <span 
                        v-if="item.inStock"
                        class="inline-flex items-center text-sm text-green-600"
                      >
                        <svg class="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        En stock
                      </span>
                      <span v-else class="text-sm text-red-600">Rupture de stock</span>
                    </div>
                  </div>
                  <button 
                    @click="addToCart(item)"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredItems.length > 0" class="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Précédent
            </button>
            <button 
              @click="currentPage++"
              :disabled="currentPage * itemsPerPage >= filteredItems.length"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> à <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }}</span> sur <span class="font-medium">{{ filteredItems.length }}</span> résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  <span class="sr-only">Précédent</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                  :class="page === currentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
                <button 
                  @click="currentPage++"
                  :disabled="currentPage * itemsPerPage >= filteredItems.length"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage * itemsPerPage >= filteredItems.length }"
                >
                  <span class="sr-only">Suivant</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Partage de la wishlist (modal) -->
    <Modal v-if="showShareModal" @close="showShareModal = false">
      <div class="bg-white px-6 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-5">Partager votre liste de souhaits</h3>
        
        <div class="space-y-4">
          <div>
            <label for="share-link" class="block text-sm font-medium text-gray-700">Lien de partage</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input 
                id="share-link"
                type="text" 
                readonly
                :value="shareableLink"
                class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 py-2 px-3"
              >
              <button 
                @click="copyToClipboard"
                class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Copier
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Partager via</label>
            <div class="flex space-x-3">
              <button 
                @click="shareOnSocial('facebook')"
                class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                title="Partager sur Facebook"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button 
                @click="shareOnSocial('twitter')"
                class="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500"
                title="Partager sur Twitter"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button 
                @click="shareOnSocial('whatsapp')"
                class="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                title="Partager sur WhatsApp"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
              <button 
                @click="shareOnSocial('email')"
                class="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700"
                title="Partager par email"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            @click="showShareModal = false"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Modal from '@/components/ui/ModalUi.vue'
import api from '@/api/axiosConfig'

import { useWishlistStore } from '@/stores/wishlist'

// Données de la wishlist
const wishlistItems = ref([])

// États pour les filtres et tris
const searchQuery = ref('')
const sortOption = ref('date-desc')
const viewMode = ref('grid') // 'grid' ou 'list'
const showShareModal = ref(false)
const shareableLink = ref('https://monshop.com/wishlist/12345')

const wishlistStore = useWishlistStore()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(8)

// Filtrer et trier les éléments
const filteredItems = computed(() => {
  let items = [...wishlistItems.value]
  
  // Filtre de recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
)}
  
  // Tri
  switch (sortOption.value) {
    case 'date-desc':
      items.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
      break
    case 'date-asc':
      items.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate))
      break
    case 'price-asc':
      items.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      items.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      items.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      items.sort((a, b) => b.name.localeCompare(a.name))
      break
  }
  
  return items
})

// Pagination calculée
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
})

// Méthodes
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const toggleFavorite = (index) => {
  wishlistItems.value[index].favorite = !wishlistItems.value[index].favorite
}

const removeFromWishlist = (index) => {
  wishlistItems.value.splice(index, 1)
}

const addToCart = (item) => {
  console.log('Ajout au panier:', item)
  // Implémentez la logique d'ajout au panier
}

const addAllToCart = () => {
  wishlistItems.value.forEach(item => addToCart(item))
}

const shareWishlist = () => {
  showShareModal.value = true
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareableLink.value)
  // Afficher une notification de succès
}

const shareOnSocial = (platform) => {
  let url = ''
  switch (platform) {
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink.value)}`
      break
    case 'twitter':
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink.value)}&text=Regardez%20ma%20liste%20de%20souhaits!`
      break
    case 'whatsapp':
      url = `https://wa.me/?text=Regardez%20ma%20liste%20de%20souhaits:%20${encodeURIComponent(shareableLink.value)}`
      break
    case 'email':
      url = `mailto:?subject=Ma%20liste%20de%20souhaits&body=Regardez%20ma%20liste%20de%20souhaits:%20${encodeURIComponent(shareableLink.value)}`
      break
  }
  window.open(url, '_blank')
}

// const fetchWishlist = async () => {
//   try {
//     const response = await api.get(`/wishlists`)
//     wishlistItems.value = response
//     console.log('Response fetched:', response)
    
//   } catch (error) {
//     console.error('Error fetching wishlists:', error)
//   }
// }

// Chargement initial
onMounted(() => {
  // fetchWishlist()
  wishlistItems.value = wishlistStore.items
  console.log('OKANA : ', wishlistStore.items)
})
</script>