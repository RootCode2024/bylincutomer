<template>
  <div class="bg-white mt-8">
    <!-- Breadcrumb Navigation -->
    <nav class="bg-gray-100 px-4 sm:px-6 lg:px-8 py-4">
      <div class="max-w-7xl mx-auto">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <RouterLink to="/" class="text-indigo-600 hover:text-indigo-500">Accueil</RouterLink>
          </li>
          <li>
            <span class="text-gray-400">/</span>
          </li>
          <li>
            <RouterLink 
              :to="`/shop/category/${product.category?.slug || ''}`"
              class="text-indigo-600 hover:text-indigo-500 capitalize"
            >
              {{ product.category?.name || 'Catégorie' }}
            </RouterLink>
          </li>
          <li>
            <span class="text-gray-400">/</span>
          </li>
          <li class="text-gray-500 truncate max-w-xs">{{ product.name || 'Produit' }}</li>
        </ol>
      </div>
    </nav>

    <!-- Main Product Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div class="bg-gray-200 aspect-square rounded-lg"></div>
          <div class="mt-10 lg:mt-0 space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-6 bg-gray-200 rounded w-1/2"></div>
            <div class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Product Content -->
      <div v-else class="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <!-- Product Gallery -->
        <div class="flex flex-col-reverse sm:flex-row gap-4">
          <!-- Thumbnails -->
          <div class="hidden sm:flex flex-col space-y-4 w-20 flex-shrink-0" v-if="productImages.length > 1">
            <button
              v-for="(image, index) in productImages"
              :key="index"
              @click="selectedImage = index"
              class="w-full h-20 rounded-md overflow-hidden border-2 transition-all"
              :class="{'border-indigo-500': selectedImage === index, 'border-transparent': selectedImage !== index}"
            >
              <img 
                :src="getImageUrl(image.url)"
                :alt="`Vue ${index + 1} de ${product.name}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </button>
          </div>
          
          <!-- Main Image -->
          <div class="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              v-if="productImages.length === 1"
              :src="product?.main_image_url"
              :alt="product.name"
              class="w-full h-full object-cover object-center"
              @error="handleImageError"
            />
            <img
              v-if="productImages.length > 1"
              :src="getImageUrl(productImages[selectedImage].url)"
              :alt="product.name"
              class="w-full h-full object-contain object-center"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200"
            >
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-500 text-sm mt-2">Aucune image disponible</span>
              </div>
            </div>    
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col space-y-2">
              <span 
                v-if="product.is_new"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                Nouveau
              </span>
              <span 
                v-if="product.is_trending"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
              >
                Tendance
              </span>
              <span 
                v-if="product.is_flash_sale"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                Flash Sale
              </span>
              <span 
                v-if="product.discounted_percent && product.discounted_percent > 0"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                -{{ Math.round(product.discounted_percent) }}%
              </span>
              <span 
                v-if="product.type === 'vintage'"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                Vintage {{ product.vintage_year }}
              </span>
            </div>
            
            <!-- Image Navigation (Mobile) -->
            <div class="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" v-if="productImages.length > 1">
              <button
                v-for="(_, index) in productImages"
                :key="index"
                @click="selectedImage = index"
                class="w-3 h-3 rounded-full"
                :class="{'bg-indigo-600': selectedImage === index, 'bg-gray-300': selectedImage !== index}"
                :aria-label="`Aller à l'image ${index + 1}`"
              />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">{{ product.name || 'Nom du produit' }}</h1>

          <!-- Brand -->
          <div class="mt-2" v-if="product.brand">
            <p class="text-sm text-indigo-600 font-medium">{{ product.brand.name }}</p>
          </div>

          <div class="mt-3">
            <h2 class="sr-only">Informations produit</h2>
            <div class="mt-1">
              <p class="text-sm text-gray-500 line-through" v-if="product.discounted_price && parseFloat(product.discounted_price) > 0">
                {{ currencyStore.formatCurrency(product.price) }}
              </p>
              <p class="text-2xl font-bold text-gray-900">
                {{ currencyStore.formatCurrency(product.final_price || product.price) }}
              </p>
              <p class="text-sm text-red-600" v-if="product.discounted_price && parseFloat(product.discounted_price) > 0">
                Économisez {{ currencyStore.formatCurrency(parseFloat(product.price) - parseFloat(product.discounted_price)) }} 
                ({{ product.discounted_percent }}%)
              </p>
            </div>
          </div>

          <!-- Reviews -->
          <div class="mt-3">
            <div class="flex items-center">
              <div class="flex items-center">
                <template v-for="i in 5" :key="i">
                  <component
                    :is="Star"
                    :class="[
                      getStarColor(i, parseFloat(product.average_rating || 0)),
                      'h-5 w-5 flex-shrink-0'
                    ]"
                  />
                </template>
              </div>
              <div class="flex items-center ml-3">
                <span class="text-yellow-800 font-semibold">
                  {{ parseFloat(product.average_rating || 0).toFixed(1) }} sur 5
                </span>
                <p class="ml-2 text-sm text-gray-500">
                  ({{ product.ratings_count || 0 }} avis)
                </p>
              </div>
            </div>
          </div>

          <!-- Stock Status -->
          <!-- <div class="mt-4">
            <p 
              v-if="(product.stock_quantity || 0) > 10"
              class="text-sm text-green-600 flex items-center"
            >
              <CheckCircle2 class="h-5 w-5 mr-1" />
              En stock ({{ product.stock_quantity }} disponibles)
            </p>
            <p 
              v-else-if="(product.stock_quantity || 0) > 0"
              class="text-sm text-amber-600 flex items-center"
            >
              <AlertCircle class="h-5 w-5 mr-1" />
              Plus que {{ product.stock_quantity }} en stock - Commandez vite !
            </p>
            <p 
              v-else
              class="text-sm text-red-600 flex items-center"
            >
              <XCircle class="h-5 w-5 mr-1" />
              Rupture de stock
            </p>
          </div> -->

          <!-- Description -->
          <div class="mt-6">
            <h3 class="sr-only">Description</h3>
            <div class="prose prose-sm text-gray-500 max-w-none">
              <p>{{ product.short_description || 'Aucune description disponible' }}</p>
            </div>
          </div>

          <!-- Variants (Color & Size) -->
          <div class="mt-8 space-y-6">
            <!-- Color Selector -->
            <div v-if="colorVariants.length > 0">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">
                  Couleur
                  <span v-if="selectedColor" class="text-gray-500 font-normal">
                    - {{ colorVariants.find(c => c.id === selectedColor)?.name }}
                  </span>
                </h3>
                <span
                  class="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
                  @click="showColorGuide = true"
                >
                  Guide des couleurs
                </span>
              </div>

              <fieldset class="mt-2">
                <legend class="sr-only">Choisir une couleur</legend>
                <div class="flex items-center space-x-3">
                  <label
                    v-for="color in colorVariants"
                    :key="color.id"
                    class="relative flex cursor-pointer items-center justify-center rounded-full focus:outline-none"
                  >
                    <input
                      type="radio"
                      name="color-choice"
                      :value="color.id"
                      v-model="selectedColor"
                      class="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      class="h-8 w-8 rounded-full border border-black border-opacity-10"
                      :style="{ backgroundColor: color.hex_code || '#CCCCCC' }"
                      :title="color.name"
                    />
                    <span
                      :class="{
                        'ring-indigo-500': selectedColor === color.id,
                        'ring-transparent': selectedColor !== color.id
                      }"
                      class="pointer-events-none absolute inset-0 rounded-full ring-2 ring-offset-2"
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            <!-- Size Selector -->
            <div v-if="sizeVariants.length > 0">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">
                  Taille
                  <span v-if="selectedSize" class="text-gray-500 font-normal">
                    - {{ sizeVariants.find(s => s.id === selectedSize)?.name }}
                  </span>
                </h3>
                <span class="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500" @click="showSizeGuide = true">
                  Guide des tailles
                </span>
              </div>

              <fieldset class="mt-2">
                <legend class="sr-only">Choisir une taille</legend>
                <div class="grid grid-cols-4 gap-3 sm:grid-cols-6">
                  <label
                    v-for="size in sizeVariants"
                    :key="size.id"
                    :class="[
                      'group relative flex items-center justify-center cursor-pointer rounded border py-2 px-1 text-xs font-medium uppercase focus:outline-none',
                      selectedSize === size.id 
                        ? 'border-gray-400 bg-gray-50 text-gray-900' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300',
                      !isSizeAvailable(size.id) ? 'opacity-40 cursor-not-allowed' : ''
                    ]"
                  >
                    <input 
                      type="radio" 
                      name="size-choice" 
                      :value="size.id"
                      v-model="selectedSize"
                      :disabled="!isSizeAvailable(size.id)"
                      class="sr-only"
                    />
                    <span>{{ size.name }}</span>
                    <span 
                      v-if="!isSizeAvailable(size.id)"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg width="30px" height="30px" class="" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.44"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7071 4.69719C19.0976 4.30667 19.7308 4.30667 20.1213 4.69719L28.6066 13.1825C28.9971 13.573 28.9971 14.2062 28.6066 14.5967C28.216 14.9872 27.5829 14.9872 27.1924 14.5967L18.7071 6.1114C18.3166 5.72088 18.3166 5.08771 18.7071 4.69719Z" fill="#333333"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M28.7071 4.7068C29.0976 5.09733 29.0976 5.73049 28.7071 6.12102L20.2218 14.6063C19.8313 14.9968 19.1981 14.9968 18.8076 14.6063C18.4171 14.2158 18.4171 13.5826 18.8076 13.1921L27.2929 4.7068C27.6834 4.31628 28.3166 4.31628 28.7071 4.7068Z" fill="#333333"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3162 15.0513C24.111 14.9829 23.8891 14.9829 23.6838 15.0513L8.86851 19.9889C8.64603 20.063 8.463 20.2102 8.34247 20.3985L4.39805 25.4613C4.1985 25.7175 4.13573 26.0545 4.2297 26.3653C4.32367 26.6761 4.56269 26.922 4.87072 27.0246L8.19325 28.1319L8.19595 36.7634C8.19636 38.0544 9.02257 39.2003 10.2473 39.6085L23.6291 44.0691C23.7475 44.1164 23.8738 44.1406 24.0009 44.1405C24.1293 44.141 24.2569 44.1168 24.3765 44.069L37.7577 39.6086C38.9827 39.2003 39.8089 38.054 39.809 36.7628L39.8096 28.1328L43.1346 27.0246C43.4427 26.922 43.6817 26.6761 43.7757 26.3653C43.8696 26.0545 43.8069 25.7175 43.6073 25.4613L39.6117 20.3327C39.4927 20.176 39.3274 20.0542 39.1315 19.9889L24.3162 15.0513ZM9.54341 22.1112L22.346 26.378L19.6478 29.8413L6.8452 25.5745L9.54341 22.1112ZM24.0025 24.8203L35.6526 20.9376L24 17.0541L12.35 20.9367L24.0025 24.8203ZM10.196 36.7628L10.1935 28.7986L19.686 31.9622C20.088 32.0962 20.5307 31.9623 20.7911 31.6281L23.0003 28.7924L23.0001 41.7513L10.8797 37.7112C10.4715 37.5751 10.1961 37.1931 10.196 36.7628ZM37.8095 28.7993L28.3193 31.9622C27.9174 32.0962 27.4747 31.9623 27.2143 31.6281L25.0013 28.7876L25.0049 41.7514L37.1252 37.7113C37.5336 37.5752 37.809 37.1931 37.809 36.7627L37.8095 28.7993ZM28.3576 29.8413L25.6583 26.3767L38.4609 22.1099L41.1602 25.5745L28.3576 29.8413Z" fill="#333333"></path> </g></svg>
                    </span>
                  </label>
                </div>
              </fieldset>
              
              <!-- Stock info for selected variant -->
              <div class="mt-2" v-if="selectedColor && selectedSize">
                <p class="text-sm text-gray-600">
                  <span v-if="currentVariantStock > 5" class="text-green-600">
                    ✓ {{ currentVariantStock }} en stock
                  </span>
                  <span v-else-if="currentVariantStock > 0" class="text-amber-600">
                    ⚠ Plus que {{ currentVariantStock }} en stock
                  </span>
                  <span v-else class="text-red-600">
                    ✗ Rupture de stock pour cette combinaison
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="mt-8">
            <label for="quantity" class="text-sm font-medium text-gray-900">Quantité</label>
            <div class="mt-2 flex">
              <button 
                @click="decreaseQuantity"
                type="button" 
                class="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center text-gray-500 hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="quantity <= 1"
              >
                <Minus class="h-4 w-4" />
              </button>
              <input 
                v-model.number="quantity"
                type="number" 
                id="quantity" 
                min="1" 
                :max="getMaxQuantity()"
                class="w-16 h-10 border-t border-b border-gray-300 text-center focus:ring-indigo-500 focus:border-indigo-500 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                @input="validateQuantity"
              />
              <button 
                @click="increaseQuantity"
                type="button" 
                class="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center text-gray-500 hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="quantity >= getMaxQuantity()"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Maximum {{ getMaxQuantity() }} articles
              <span v-if="selectedColor && selectedSize">
                pour cette combinaison
              </span>
            </p>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex flex-wrap gap-3">
            <button
              @click="addToCart"
              type="button"
              :disabled="isOutOfStock || isAddingToCart"
              :title="getAddToCartTitle()"
              class="flex-1 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart class="h-5 w-5 mr-2" />
              {{ isAddingToCart ? 'Ajout...' : 'Ajouter au panier' }}
            </button>

            <FavoriteButton 
              @click="toggleWishlist"
              :product="product" 
              :is-favorited="isFavorited"
              class="px-4 py-3"
            />
          </div>

          <!-- Shipping Info -->
          <div class="mt-8 border-t border-gray-200 pt-8">
            <h3 class="text-sm font-medium text-gray-900">Livraison et retours</h3>
            <div class="mt-4 prose prose-sm text-gray-500 max-w-none">
              <ul>
                <li>Livraison gratuite à partir de {{ currencyStore.formatCurrency(60000) }}</li>
                <li>Retours gratuits sous 30 jours</li>
                <li>Livraison express disponible</li>
                <li>Emballage cadeau optionnel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="my-24 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <div class="pt-24">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-10">Détails du produit</h2>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Description -->
            <section>
              <h3 class="text-xl font-semibold text-gray-800 border-b border-indigo-500 pb-2 mb-6">Description</h3>
              <div class="prose prose-base text-gray-700 max-w-none leading-relaxed">
                <p>{{ product.full_description || product.short_description || 'Aucune description complète disponible' }}</p>
              </div>
            </section>

            <!-- Specifications -->
            <section>
              <h3 class="text-xl font-semibold text-gray-800 border-b border-indigo-500 pb-2 mb-6">Spécifications</h3>
              <ul class="space-y-4 text-gray-700">
                <!-- Reference & SKU -->
                <li class="flex items-center" v-if="product.reference">
                  <Tag class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Référence :</strong> {{ product.reference }}</span>
                </li>

                <!-- Material -->
                <li class="flex items-center" v-if="product.material">
                  <Package class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Matériau :</strong> {{ product.material }}</span>
                </li>

                <!-- Care Instructions -->
                <li class="flex items-center" v-if="product.care_instructions">
                  <Shirt class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Entretien :</strong> {{ product.care_instructions }}</span>
                </li>

                <!-- Weight -->
                <li class="flex items-center" v-if="product.weight_grams">
                  <Scale class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Poids :</strong> {{ (product.weight_grams / 1000).toFixed(2) }} kg</span>
                </li>

                <!-- Dimensions -->
                <li class="flex items-center" v-if="product.dimensions">
                  <Move3D class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Dimensions :</strong> 
                    {{ product.dimensions.height }}cm × {{ product.dimensions.width }}cm
                    × {{ product.dimensions.depth }}cm
                  </span>
                </li>

                <!-- Season -->
                <li class="flex items-center" v-if="product.season">
                  <Calendar class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Saison :</strong> {{ product.season }}</span>
                </li>

                <!-- Gender -->
                <li class="flex items-center" v-if="product.gender">
                  <Users class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Genre :</strong> {{ getGenderLabel(product.gender) }}</span>
                </li>

                <!-- Country of Origin -->
                <li class="flex items-center" v-if="product.country_of_origin">
                  <Globe class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Origine :</strong> {{ product.country_of_origin }}</span>
                </li>

                <!-- Brand -->
                <li class="flex items-center" v-if="product.brand">
                  <Award class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Marque :</strong> {{ product.brand.name }}</span>
                </li>

                <!-- Additional specifications with more Lucide icons -->

                <!-- Color -->
                <li class="flex items-center" v-if="product.color">
                  <Palette class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Couleur :</strong> {{ product.color }}</span>
                </li>

                <!-- Size -->
                <li class="flex items-center" v-if="product.size">
                  <Ruler class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Taille :</strong> {{ product.size }}</span>
                </li>

                <!-- Warranty -->
                <li class="flex items-center" v-if="product.warranty_months">
                  <Shield class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Garantie :</strong> {{ product.warranty_months }} mois</span>
                </li>

                <!-- Availability -->
                <!-- <li class="flex items-center" v-if="product.stock_quantity !== undefined">
                  <PackageCheck class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Stock :</strong> {{ product.stock_quantity }} unité(s)</span>
                </li> -->

                <!-- Manufacturing Date -->
                <li class="flex items-center" v-if="product.manufacturing_date">
                  <CalendarDays class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Date de fabrication :</strong> {{ formatDate(product.manufacturing_date) }}</span>
                </li>

                <!-- Expiration Date -->
                <li class="flex items-center" v-if="product.expiration_date">
                  <CalendarX class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Date d'expiration :</strong> {{ formatDate(product.expiration_date) }}</span>
                </li>

                <!-- Barcode -->
                <li class="flex items-center" v-if="product.barcode">
                  <Barcode class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Code-barres :</strong> {{ product.barcode }}</span>
                </li>

                <!-- Certification -->
                <li class="flex items-center" v-if="product.certification">
                  <BadgeCheck class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Certification :</strong> {{ product.certification }}</span>
                </li>

                <!-- Energy Rating -->
                <li class="flex items-center" v-if="product.energy_rating">
                  <Battery class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Classe énergétique :</strong> {{ product.energy_rating }}</span>
                </li>

                <!-- Volume -->
                <li class="flex items-center" v-if="product.volume_liters">
                  <Droplets class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Volume :</strong> {{ product.volume_liters }} L</span>
                </li>

                <!-- Power -->
                <li class="flex items-center" v-if="product.power_watts">
                  <Zap class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Puissance :</strong> {{ product.power_watts }} W</span>
                </li>

                <!-- Connectivity -->
                <li class="flex items-center" v-if="product.connectivity">
                  <Wifi class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Connectivité :</strong> {{ product.connectivity }}</span>
                </li>

                <!-- Compatibility -->
                <li class="flex items-center" v-if="product.compatibility">
                  <Cpu class="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0" />
                  <span><strong>Compatibilité :</strong> {{ product.compatibility }}</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div class="border-t border-gray-200 pt-16">
          <h2 class="text-2xl font-bold text-gray-900">Avis clients</h2>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            <!-- Review Summary -->
            <div>
              <div class="flex items-center">
                <p class="text-3xl font-medium text-gray-900">{{ parseFloat(product.average_rating || 0).toFixed(1) }}</p>
                <div class="ml-4">
                  <div class="flex items-center">
                    <template v-for="i in 5" :key="i">
                      <component
                        :is="Star"
                        :class="[
                          getStarColor(i, parseFloat(product.average_rating || 0)),
                          'h-5 w-5 flex-shrink-0'
                        ]"
                      />
                    </template>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">Basé sur {{ product.ratings_count || 0 }} avis</p>
                </div>
              </div>

              <div class="mt-10">
                <h3 class="text-lg font-medium text-gray-900">Partagez votre avis</h3>
                <p class="mt-1 text-sm text-gray-500">Si vous avez acheté ce produit, partagez votre expérience.</p>

                <button
                  v-if="authStore.isAuthenticated"
                  readonly
                  class="mt-6 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Laisser un avis
                </button>

                <router-link
                  v-else
                  to="/login"
                  class="mt-6 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Veuillez vous connecter pour laisser un avis
                </router-link>
              </div>
            </div>

            <!-- Review Filters -->
            <div class="md:col-span-2">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Avis récents</h3>
                <div class="relative">
                  <select
                    v-model="reviewSort"
                    class="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="recent">Plus récents</option>
                    <option value="positive">Plus positifs</option>
                    <option value="critical">Plus critiques</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div class="mt-6 space-y-10 divide-y divide-gray-200">
                <div v-for="review in sortedReviews" :key="review.id" class="pt-10">
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      <span class="text-gray-500 text-sm font-medium">{{ getInitials(review.user?.name || 'Anonyme') }}</span>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-sm font-bold text-gray-900">{{ review.user?.name ?? 'Anonyme' }}</h4>
                      <div class="mt-1 flex items-center">
                        <template v-for="i in 5" :key="i">
                          <component
                            :is="Star"
                            :class="[
                              getStarColor(i, Number(review.rating ?? 0)),
                              'h-4 w-4 flex-shrink-0'
                            ]"
                          />
                        </template>
                      </div>
                      <p class="sr-only">{{ review.rating }} sur 5 étoiles</p>
                    </div>
                  </div>

                  <div class="mt-4 space-y-4">
                    <div class="prose prose-sm text-gray-500 max-w-none">
                      <p>{{ review.comment }}</p>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <time :datetime="review.created_at">{{ formatDate(review.created_at) }}</time>
                    </div>
                    <div v-if="review.admin_response" class="prose prose-sm text-blue-500 max-w-none ml-10">
                      <h2>Bylin Team</h2>
                      <p v-for="admin_response in review.admin_response">{{ admin_response }}</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <!-- <time :datetime="admin_response.created_at">{{ formatDate(admin_response.created_at) }}</time> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty Reviews State -->
              <div v-if="reviews.length === 0" class="text-center py-8">
                <p class="text-gray-500">Aucun avis pour ce produit.</p>
                <p class="text-sm text-gray-400 mt-2">Soyez le premier à laisser un avis !</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="bg-gray-100" v-if="product.related_products && product.related_products.length > 0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h2 class="text-2xl font-bold text-gray-900">Produits similaires</h2>
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard 
              v-for="relatedProduct in product.related_products"
              :key="relatedProduct.id"
              :product="relatedProduct"
              class="bg-white"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Size Guide Modal -->
    <Modal :open="showSizeGuide" @close="showSizeGuide = false">
      <div class="p-6 max-w-2xl">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Guide des tailles vestimentaires</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour de poitrine (cm)</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour de taille (cm)</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour de hanches (cm)</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longueur (cm)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900">XS</td>
                <td class="px-4 py-2 text-sm text-gray-500">82-86</td>
                <td class="px-4 py-2 text-sm text-gray-500">62-66</td>
                <td class="px-4 py-2 text-sm text-gray-500">88-92</td>
                <td class="px-4 py-2 text-sm text-gray-500">60-62</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900">S</td>
                <td class="px-4 py-2 text-sm text-gray-500">86-90</td>
                <td class="px-4 py-2 text-sm text-gray-500">66-70</td>
                <td class="px-4 py-2 text-sm text-gray-500">92-96</td>
                <td class="px-4 py-2 text-sm text-gray-500">62-64</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900">M</td>
                <td class="px-4 py-2 text-sm text-gray-500">90-94</td>
                <td class="px-4 py-2 text-sm text-gray-500">70-74</td>
                <td class="px-4 py-2 text-sm text-gray-500">96-100</td>
                <td class="px-4 py-2 text-sm text-gray-500">64-66</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900">L</td>
                <td class="px-4 py-2 text-sm text-gray-500">94-98</td>
                <td class="px-4 py-2 text-sm text-gray-500">74-78</td>
                <td class="px-4 py-2 text-sm text-gray-500">100-104</td>
                <td class="px-4 py-2 text-sm text-gray-500">66-68</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900">XL</td>
                <td class="px-4 py-2 text-sm text-gray-500">98-102</td>
                <td class="px-4 py-2 text-sm text-gray-500">78-82</td>
                <td class="px-4 py-2 text-sm text-gray-500">104-108</td>
                <td class="px-4 py-2 text-sm text-gray-500">68-70</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 text-sm text-gray-500">
          <p class="font-medium">Comment mesurer :</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Poitrine : Mesurez autour de la partie la plus large</li>
            <li>Taille : Mesurez au niveau du nombril</li>
            <li>Hanches : Mesurez autour de la partie la plus large des hanches</li>
            <li>Longueur : Depuis l'encolure jusqu'à l'ourlet</li>
          </ul>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            @click="showSizeGuide = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
    
    <!-- Color Guide Modal -->
    <Modal :open="showColorGuide" @close="showColorGuide = false">
      <div class="p-6 max-w-3xl">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Guide des couleurs</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <!-- Color Samples -->
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-black border border-gray-300 mr-2"></div>
            <span class="text-sm">Noir</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-white border border-gray-300 mr-2"></div>
            <span class="text-sm">Blanc</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-500 border border-gray-300 mr-2"></div>
            <span class="text-sm">Gris</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-blue-600 border border-gray-300 mr-2"></div>
            <span class="text-sm">Bleu marine</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-red-600 border border-gray-300 mr-2"></div>
            <span class="text-sm">Rouge</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-green-600 border border-gray-300 mr-2"></div>
            <span class="text-sm">Vert</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-yellow-400 border border-gray-300 mr-2"></div>
            <span class="text-sm">Jaune</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-pink-500 border border-gray-300 mr-2"></div>
            <span class="text-sm">Rose</span>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-purple-600 border border-gray-300 mr-2"></div>
            <span class="text-sm">Violet</span>
          </div>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900">Notes importantes :</h4>
          <ul class="mt-2 text-sm text-gray-600 space-y-1">
            <li>• Les couleurs peuvent légèrement varier selon votre écran</li>
            <li>• Nous recommandons de consulter plusieurs appareils pour comparaison</li>
            <li>• Toutes nos photos sont prises sous lumière naturelle</li>
          </ul>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            @click="showColorGuide = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Star,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Minus,
  Plus,
  ChevronDown,
   Tag,
  Package,
  Shirt,
  Scale,
  Move3D,
  Calendar,
  Users,
  Globe,
  Award,
  Palette,
  Ruler,
  Shield,
  PackageCheck,
  CalendarDays,
  CalendarX,
  Barcode,
  BadgeCheck,
  Battery,
  Droplets,
  Zap,
  Wifi,
  Cpu
} from 'lucide-vue-next'
import ProductCard from '@/components/Product/ProductCard.vue'
import Modal from '@/components/ui/ModalUi.vue'
import FavoriteButton from '@/components/ui/FavoriteButton.vue'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()
const currencyStore = useCurrencyStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const route = useRoute()

// State
const product = ref({})
const reviews = ref([])
const loading = ref(true)
const selectedImage = ref(0)
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const showSizeGuide = ref(false)
const showColorGuide = ref(false)
const isFavorited = ref(false)
const isAddingToCart = ref(false)
const isSubmittingReview = ref(false)

// Pour le debug direct
const seenColors = ref([])
const seenSizes = ref([])

const reviewSort = ref('recent')
const newReview = ref({
  rating: 0,
  comment: ''
})

// Computed properties
const productImages = computed(() => {
  console.log('Computed Images : ', product.value.images)
  return product.value.images || []
})

const colorVariants = computed(() => {
  if (!product.value.variants || !Array.isArray(product.value.variants)) {
    // console.log('No variants found:', product.value.variants)
    return []
  }
  
  // console.log('Processing variants for colors:', product.value.variants)
  
  // Extraire les couleurs uniques des variants
  const uniqueColors = new Map()
  product.value.variants.forEach(variant => {
    // console.log('Variant color:', variant.color)
    if (variant.color && !uniqueColors.has(variant.color.id)) {
      uniqueColors.set(variant.color.id, variant.color)
    }
  })
  
  const colors = Array.from(uniqueColors.values())
  // console.log('Unique colors extracted:', colors)
  return colors
})

const sizeVariants = computed(() => {
  if (!product.value.variants || !Array.isArray(product.value.variants)) {
    // console.log('No variants found:', product.value.variants)
    return []
  }
  
  // console.log('Processing variants for sizes:', product.value.variants)
  
  // Extraire les tailles uniques des variants
  const uniqueSizes = new Map()
  product.value.variants.forEach(variant => {
    // console.log('Variant size:', variant.size)
    if (variant.size && !uniqueSizes.has(variant.size.id)) {
      uniqueSizes.set(variant.size.id, variant.size)
    }
  })
  
  const sizes = Array.from(uniqueSizes.values()).sort((a, b) => {
    // Ordre des tailles : XS, S, M, L, XL, XXL
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const indexA = sizeOrder.indexOf(a.name.toUpperCase())
    const indexB = sizeOrder.indexOf(b.name.toUpperCase())
    
    if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
  
  // console.log('Unique sizes extracted:', sizes)
  return sizes
})

const availableVariants = computed(() => {
  if (!product.value.variants) return []
  
  return product.value.variants.filter(variant => {
    // Filtrer selon la couleur et taille sélectionnées
    const colorMatch = !selectedColor.value || variant.color?.id === selectedColor.value
    const sizeMatch = !selectedSize.value || variant.size?.id === selectedSize.value
    return colorMatch && sizeMatch && variant.stock_quantity > 0
  })
})

const currentVariantStock = computed(() => {
  if (!selectedColor.value || !selectedSize.value) return product.value.stock_quantity || 0
  
  const variant = product.value.variants?.find(v => 
    v.color?.id === selectedColor.value && v.size?.id === selectedSize.value
  )
  
  return variant?.stock_quantity || 0
})

const isOutOfStock = computed(() => {
  if (selectedColor.value && selectedSize.value) {
    return currentVariantStock.value === 0
  }
  return (product.value.stock_quantity || 0) === 0
})

const sortedReviews = computed(() => {
  const sorted = [...reviews.value]
  switch (reviewSort.value) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'positive':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'critical':
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    default:
      return sorted
  }
})

// Methods
const fetchProduct = async () => {
  try {
    loading.value = true
    await productStore.fetchProduct(route.params.slug)
    
    product.value = productStore.singleProduct || {}
    reviews.value = productStore.allReviews || []
    
    // Test direct des variants
    if (product.value.variants && Array.isArray(product.value.variants)) {
      
      // Test des couleurs
      const testColors = new Map()
      product.value.variants.forEach((variant, index) => {
        
        if (variant.color) {
          testColors.set(variant.color.id, variant.color)
        }
      })
    } else {
      console.log('❌ No variants array found or empty')
    }
    
    // Attendre que les computed soient calculés
    await nextTick()
    
    // Auto-select first available options
    if (colorVariants.value.length > 0) {
      selectedColor.value = colorVariants.value[0].id
    }
    if (sizeVariants.value.length > 0) {
      selectedSize.value = sizeVariants.value[0].id
    }
    
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

const getImageUrl = (imagePath) => {
  return import.meta.env.VITE_API_BASE_URL + imagePath
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.jpg'
}

const getColorHex = (meta) => {
  try {
    if (typeof meta === 'string') {
      const parsed = JSON.parse(meta)
      return parsed.hex ? `#${parsed.hex}` : '#CCCCCC'
    }
    return meta?.hex ? `#${meta.hex}` : '#CCCCCC'
  } catch (e) {
    return '#CCCCCC'
  }
}

const isSizeAvailable = (sizeId) => {
  if (!selectedColor.value) return true
  
  return product.value.variants?.some(variant => 
    variant.color?.id === selectedColor.value && 
    variant.size?.id === sizeId && 
    variant.stock_quantity > 0
  ) || false
}

const getMaxQuantity = () => {
  if (selectedColor.value && selectedSize.value) {
    return currentVariantStock.value
  }
  return product.value.stock_quantity || 999
}

const getStarColor = (index, rating) => {
  const value = parseFloat(rating) || 0
  if (value >= index) return 'text-yellow-400'
  if (value >= index - 0.5) return 'text-yellow-300'
  return 'text-gray-300'
}

const getGenderLabel = (gender) => {
  const labels = {
    'man': 'Homme',
    'female': 'Femme',
    'unisex': 'Unisexe',
    'kids': 'Enfant'
  }
  console.log(gender, labels)
  return labels[gender] || gender
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  const maxQty = getMaxQuantity()
  if (quantity.value < maxQty) {
    quantity.value++
  }
}

const validateQuantity = () => {
  const maxQty = getMaxQuantity()
  if (quantity.value < 1) quantity.value = 1
  if (quantity.value > maxQty) quantity.value = maxQty
}

const getAddToCartTitle = () => {
  if (isOutOfStock.value) return 'Produit en rupture de stock'
  if (colorVariants.value.length > 0 && !selectedColor.value) return 'Veuillez sélectionner une couleur'
  if (sizeVariants.value.length > 0 && !selectedSize.value) return 'Veuillez sélectionner une taille'
  if (selectedColor.value && selectedSize.value && currentVariantStock.value === 0) {
    return 'Cette combinaison couleur/taille n\'est pas disponible'
  }
  return 'Ajouter au panier'
}

const addToCart = async () => {
  if (isOutOfStock.value || isAddingToCart.value) return
  
  // Validation des sélections requises
  if (colorVariants.value.length > 0 && !selectedColor.value) {
    alert('Veuillez sélectionner une couleur')
    return
  }
  
  if (sizeVariants.value.length > 0 && !selectedSize.value) {
    alert('Veuillez sélectionner une taille')
    return
  }
  
  try {
    isAddingToCart.value = true
    
    // Trouver le variant sélectionné
    let selectedVariant = null
    if (selectedColor.value && selectedSize.value) {
      selectedVariant = product.value.variants?.find(v => 
        v.color?.id === selectedColor.value && v.size?.id === selectedSize.value
      )
      
      if (!selectedVariant || selectedVariant.stock_quantity === 0) {
        alert('Cette combinaison couleur/taille n\'est pas disponible')
        return
      }
    }
    
    const cartItem = {
      ...product.value,
      variant_id: selectedVariant?.id,
      quantity: quantity.value,
      price: selectedVariant?.price || product.value.final_price || product.value.price,
      image: product.value.main_image_url,
      selectedColor: selectedColor.value ? colorVariants.value.find(c => c.id === selectedColor.value) : null,
      selectedSize: selectedSize.value ? sizeVariants.value.find(s => s.id === selectedSize.value) : null,
      available_stock: selectedVariant?.stock_quantity || product.value.stock_quantity
    }
    
    cartStore.addItem(cartItem)
    
    // Show success notification
    console.log('Product added to cart successfully')
    
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Erreur lors de l\'ajout au panier')
  } finally {
    isAddingToCart.value = false
  }
}

const addToSeenColors = (colorId) => {
  if (!seenColors.value.includes(colorId)) {
    seenColors.value.push(colorId)
  }
}

const addToSeenSizes = (sizeId) => {
  if (!seenSizes.value.includes(sizeId)) {
    seenSizes.value.push(sizeId)
  }
}

const toggleWishlist = async () => {
  try {
    if (isFavorited.value) {
     cartStore.removeFromFavorite(product.value.id)
    } else {
     cartStore.addToFavorite(product.value)
    }
    isFavorited.value = !isFavorited.value
  } catch (error) {
    console.error('Error toggling wishlist:', error)
  }
}


// Lifecycle
onMounted(async () => {
  await fetchProduct()
  console.log('Product data loaded:', product.value)
})
</script>

<style scoped>
.prose ul {
  @apply list-disc pl-5 space-y-1;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>