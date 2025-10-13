<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="close">
      <div class="quick-view-modal">
        <!-- Bouton de fermeture -->
        <button class="close-button" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Contenu du modal -->
        <div class="modal-content">
          <!-- Galerie d'images -->
          <div class="product-gallery">
            <div class="main-image">
              <img :src="selectedImage || product.images[0]" :alt="product.name" />
            </div>
            <div class="thumbnail-grid">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImage === image }"
                @click="selectedImage = image"
              >
                <img :src="image" :alt="`${product.name} - vue ${index + 1}`" />
              </div>
            </div>
          </div>

          <!-- Détails du produit -->
          <div class="product-details">
            <div class="product-header">
              <h2 class="product-name">{{ product.name }}</h2>
              <p class="product-price">{{ formattedPrice }}</p>
              <div v-if="product.isNew" class="new-badge">Nouveau</div>
              <div v-if="product.isBestSeller" class="best-seller-badge">Best-seller</div>
            </div>

            <div class="product-meta">
              <div class="rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                            :fill="i <= product.rating ? '#FFD700' : '#E0E0E0'"/>
                    </svg>
                  </span>
                </div>
                <span class="review-count">{{ product.reviewCount }} avis</span>
              </div>

              <div class="availability" :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
                {{ product.inStock ? 'En stock' : 'Rupture de stock' }}
              </div>
            </div>

            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>

            <!-- Sélection de couleur -->
            <div class="color-selection">
              <h3 class="section-title">Couleur: <span>{{ selectedColor.name }}</span></h3>
              <div class="color-options" v-if="product.availableColors">
                <div 
                  v-for="color in product?.availableColors" 
                  :key="color.code"
                  class="color-option"
                  :class="{ active: selectedColor.code === color.code }"
                  :style="{ backgroundColor: color.code }"
                  @click="selectedColor = color"
                  :title="color.name"
                ></div>
              </div>
            </div>

            <!-- Sélection de taille -->
            <div class="size-selection" v-if="product.availableSizes">
              <h3 class="section-title">Taille</h3>
              <div class="size-options">
                <div 
                  v-for="size in product.availableSizes" 
                  :key="size"
                  class="size-option"
                  :class="{ 
                    active: selectedSize === size,
                    unavailable: !product.availableSizes.includes(size)
                  }"
                  @click="selectSize(size)"
                >
                  {{ size }}
                </div>
              </div>
              <a href="#" class="size-guide-link">Guide des tailles</a>
            </div>

            <!-- Actions -->
            <div class="product-actions">
              <div class="quantity-selector">
                <button class="quantity-btn" @click="decreaseQuantity">-</button>
                <span class="quantity">{{ quantity }}</span>
                <button class="quantity-btn" @click="increaseQuantity">+</button>
              </div>
              <button 
                class="add-to-cart"
                :disabled="!product.inStock || !selectedSize"
                @click="addToCart"
              >
                {{ product.inStock ? 'Ajouter au panier' : 'Rupture de stock' }}
              </button>
            </div>

            <!-- Livraison et retours -->
            <div class="delivery-info">
              <div class="delivery-option">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13H19M5 13V5H19V13M5 13L2 16V19H5M19 13V19H22V16L19 13M5 19H19" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Livraison gratuite et retours sous 30 jours</span>
              </div>
              <div class="delivery-option">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Expédition sous 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'QuickViewModal',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedImage: null,
      selectedColor: this.product?.availableColors[0],
      selectedSize: null,
      quantity: 1
    };
  },
  computed: {
    formattedPrice() {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(this.product.price);
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    selectSize(size) {
      if (this.product.availableSizes.includes(size)) {
        this.selectedSize = size;
      }
    },
    increaseQuantity() {
      if (this.quantity < 10) {
        this.quantity++;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      if (!this.selectedSize) return;
      
      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        color: this.selectedColor,
        size: this.selectedSize,
        quantity: this.quantity,
        image: this.product.images[0]
      };
      
      // Ici vous pourriez dispatcher une action Vuex ou émettre un événement
      this.$emit('add-to-cart', item);
      
      // Optionnel: fermer le modal après ajout
      setTimeout(() => {
        this.close();
      }, 1000);
    }
  },
  mounted() {
    // Empêcher le défilement de la page en arrière-plan
    document.body.style.overflow = 'hidden';
  },
  beforeDestroy() {
    // Rétablir le défilement
    document.body.style.overflow = 'auto';
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.quick-view-modal {
  background-color: white;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  z-index: 10;
}

.close-button svg {
  transition: transform 0.3s ease;
}

.close-button:hover svg {
  transform: rotate(90deg);
}

.modal-content {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.product-gallery {
  margin-bottom: 30px;
}

.main-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin-bottom: 15px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.thumbnail {
  height: 80px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  border-color: #333;
}

.thumbnail.active {
  border-color: #000;
  border-width: 2px;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-header {
  margin-bottom: 20px;
  position: relative;
}

.product-name {
  font-size: 1.8rem;
  font-weight: 400;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 15px;
}

.new-badge, .best-seller-badge {
  display: inline-block;
  padding: 3px 10px;
  font-size: 0.8rem;
  margin-right: 8px;
  border-radius: 3px;
}

.new-badge {
  background-color: #000;
  color: white;
}

.best-seller-badge {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.rating {
  display: flex;
  align-items: center;
}

.stars {
  margin-right: 10px;
}

.review-count {
  font-size: 0.9rem;
  color: #666;
}

.availability {
  font-size: 0.9rem;
  font-weight: 500;
}

.in-stock {
  color: #388e3c;
}

.out-of-stock {
  color: #d32f2f;
}

.product-description {
  margin-bottom: 25px;
  line-height: 1.6;
  color: #666;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.section-title span {
  font-weight: 400;
  text-transform: none;
}

.color-selection {
  margin-bottom: 25px;
}

.color-options {
  display: flex;
  gap: 10px;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #eee;
  position: relative;
}

.color-option.active {
  border-color: #000;
}

.color-option.active::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 1px solid #000;
  border-radius: 50%;
}

.size-selection {
  margin-bottom: 30px;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.size-option {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 0.9rem;
}

.size-option.active {
  background-color: #000;
  color: white;
  border-color: #000;
}

.size-option.unavailable {
  color: #ccc;
  text-decoration: line-through;
  cursor: not-allowed;
}

.size-guide-link {
  font-size: 0.9rem;
  color: #666;
  text-decoration: underline;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity {
  width: 40px;
  text-align: center;
}

.add-to-cart {
  flex: 1;
  height: 40px;
  background-color: #000;
  color: white;
  border: none;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart:hover {
  background-color: #333;
}

.add-to-cart:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delivery-info {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (min-width: 992px) {
  .modal-content {
    flex-direction: row;
    gap: 40px;
  }
  
  .product-gallery {
    width: 55%;
    margin-bottom: 0;
  }
  
  .product-details {
    width: 45%;
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
  }
  
  .main-image {
    height: 300px;
  }
  
  .product-name {
    font-size: 1.5rem;
  }
  
  .product-price {
    font-size: 1.3rem;
  }
}
</style>