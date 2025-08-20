<template>
  <div class="collection-page">
    <!-- Hero Banner de la collection -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1 class="collection-title">{{ collection.title }}</h1>
        <p class="collection-description">{{ collection.description }}</p>
        <button class="cta-button">Découvrir la collection</button>
      </div>
      <img :src="collection.heroImage" alt="Collection BylInClothing" class="hero-image">
    </section>

    <!-- Filtres de collection -->
    <div class="collection-filters">
      <div class="filter-group">
        <label for="category-filter">Catégorie</label>
        <select id="category-filter" v-model="selectedCategory">
          <option value="all">Toutes</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="sort-by">Trier par</label>
        <select id="sort-by" v-model="sortBy">
          <option value="featured">En vedette</option>
          <option value="newest">Plus récent</option>
          <option value="price-asc">Prix (croissant)</option>
          <option value="price-desc">Prix (décroissant)</option>
        </select>
      </div>
    </div>

    <!-- Produits de la collection -->
    <div class="product-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        @click="navigateToProduct(product.id)"
      >
        <div class="product-image-container">
          <img :src="product.images[0]" :alt="product.name" class="product-image">
          <div class="product-badge" v-if="product.isNew">Nouveau</div>
          <button class="quick-view" @click.stop="openQuickView(product)">Aperçu rapide</button>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-price">{{ product.price }} €</p>
          <div class="color-options">
            <span 
              v-for="color in product.availableColors" 
              :key="color.code"
              :style="{ backgroundColor: color.code }"
              class="color-swatch"
              :title="color.name"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        v-for="page in totalPages" 
        :key="page" 
        :class="{ active: currentPage === page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <!-- Quick View Modal -->
    <QuickViewModal 
      v-if="showQuickView" 
      :product="selectedProduct" 
      @close="closeQuickView"
    />
  </div>
</template>

<script>
import QuickViewModal from '@/components/QuickViewModal.vue';
// import require for images

export default {
  name: 'CollectionPage',
  components: {
    QuickViewModal
  },
  data() {
    return {
      collection: {
        title: "Collection Printemps-Été 2023",
        description: "Des pièces élégantes et intemporelles pour votre garde-robe",
        heroImage: 'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D'
      },
      products: [], // Rempli via API call dans created()
      selectedCategory: 'all',
      categories: ['Robes', 'Hauts', 'Pantalons', 'Vestes', 'Accessoires'],
      sortBy: 'featured',
      currentPage: 1,
      itemsPerPage: 12,
      showQuickView: false,
      selectedProduct: null
    };
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products];
      
      // Filtre par catégorie
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.selectedCategory);
      }
      
      // Tri
      switch (this.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        default: // featured
          filtered.sort((a, b) => b.isFeatured - a.isFeatured);
      }
      
      // Pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    }
  },
  methods: {
    navigateToProduct(id) {
      this.$router.push({ name: 'product', params: { id } });
    },
    openQuickView(product) {
      this.selectedProduct = product;
      this.showQuickView = true;
      document.body.style.overflow = 'hidden';
    },
    closeQuickView() {
      this.showQuickView = false;
      document.body.style.overflow = 'auto';
    },
    goToPage(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  async created() {
    // Simuler un appel API
    try {
      // En production, vous utiliseriez quelque chose comme:
      // const response = await axios.get('/api/collection/spring-summer-2023');
      // this.products = response.data.products;
      
      // Données simulées pour l'exemple
      this.products = [
        {
          id: 1,
          name: "Robe longue en soie",
          price: 149.99,
          category: "Robes",
          isNew: true,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1630355734650-55fe91e1e5c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
            "https://images.unsplash.com/photo-1670955103117-73f5024bbf2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D"
          ],
          availableColors: [
            { code: '#5D4037', name: 'Marron' },
            { code: '#E53935', name: 'Rouge' }
          ],
          releaseDate: '2023-03-15'
        },
        // Ajouter d'autres produits ici...
      ];
    } catch (error) {
      console.error("Erreur lors du chargement de la collection", error);
    }
  }
};
</script>

<style scoped>
.collection-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  background-color: #f9f9f9;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 50%;
  z-index: 2;
}

.collection-title {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 20px;
  color: #333;
}

.collection-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #666;
}

.cta-button {
  background-color: #000;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #333;
}

.hero-image {
  max-width: 45%;
  height: auto;
  object-fit: cover;
}

.collection-filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-group label {
  margin-right: 10px;
  font-size: 0.9rem;
}

.filter-group select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.9rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #000;
  color: white;
  padding: 3px 8px;
  font-size: 0.8rem;
}

.quick-view {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  transition: bottom 0.3s ease;
  cursor: pointer;
}

.product-card:hover .quick-view {
  bottom: 0;
}

.product-info {
  text-align: center;
}

.product-name {
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 5px;
  color: #333;
}

.product-price {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.color-options {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.color-swatch {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #eee;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 40px 0;
}

.pagination button {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.pagination button.active {
  background-color: #000;
  color: white;
  border-color: #000;
}

@media (max-width: 768px) {
  .hero-banner {
    flex-direction: column;
    padding: 30px 20px;
  }
  
  .hero-content {
    max-width: 100%;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .hero-image {
    max-width: 100%;
  }
  
  .collection-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
}
</style>