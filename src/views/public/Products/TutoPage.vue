<template>
  <div class="tuto-page">
    <!-- En-tête -->
    <header class="header">
      <h1>Astuces Mode: Assembler comme un Pro</h1>
      <p>Découvrez les meilleures combinaisons pour chaque occasion</p>
    </header>

    <!-- Filtres -->
    <div class="filters">
      <select v-model="selectedEvent" @change="filterCombinations">
        <option value="">Toutes les occasions</option>
        <option v-for="event in events" :key="event" :value="event">{{ event }}</option>
      </select>
      
      <select v-model="selectedStyle" @change="filterCombinations">
        <option value="">Tous les styles</option>
        <option v-for="style in styles" :key="style" :value="style">{{ style }}</option>
      </select>
    </div>

    <!-- Liste des combinaisons -->
    <div class="combinations-grid">
      <div v-for="combo in filteredCombinations" :key="combo.id" class="combo-card">
        <div class="combo-images">
          <img :src="combo.topImage" alt="Haut" class="clothing-img">
          <span class="plus-icon">+</span>
          <img :src="combo.bottomImage" alt="Bas" class="clothing-img">
        </div>
        <div class="combo-details">
          <router-link :to="`/tuto/${combo.slug}`"><h3>{{ combo.title }}</h3></router-link>
          <p class="occasion">{{ combo.event }}</p>
          <p class="description">{{ combo.description }}</p>
          <div class="price-section" v-if="combo.isPremium">
            <span class="price">{{ combo.price }} €</span>
            <button @click="purchaseCombo(combo.id)" class="buy-btn">Acheter</button>
          </div>
          <div v-else>
            <button class="free-btn">Gratuit</button>
          </div>
          <div class="rating">
            <span v-for="star in 5" :key="star" 
                  @click="rateCombo(combo.id, star)"
                  :class="{ 'filled': star <= combo.rating }">★</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section newsletter -->
    <div class="newsletter">
      <h3>Abonnez-vous pour plus d'astuces</h3>
      <input type="email" placeholder="Votre email" v-model="email">
      <button @click="subscribe">S'abonner</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedEvent: '',
      selectedStyle: '',
      email: '',
      events: ['Mariage', 'Soirée', 'Bureau', 'Décontracté', 'Date'],
      styles: ['Classique', 'Bohème', 'Streetwear', 'Chic', 'Sportswear'],
      combinations: [
        {
          id: 1,
          title: 'Élégance urbaine',
          slug: 'elegance-urbaine',
          topImage: 'https://images.unsplash.com/photo-1666358085449-a10a39f33942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
          bottomImage: 'https://images.unsplash.com/photo-1648536426233-29776d89d6f3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          event: 'Soirée',
          style: 'Streetwear',
          description: 'Un t-shirt blanc basique avec un jean noir slim pour un look urbain et élégant.',
          isPremium: true,
          price: 4.99,
          rating: 4
        },
        {
          id: 3,
          title: 'Élégance urbainee',
          slug: 'elegance-urbainee',
          topImage: 'https://images.unsplash.com/photo-1666358085449-a10a39f33942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
          bottomImage: 'https://images.unsplash.com/photo-1648536426233-29776d89d6f3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          event: 'Soirée',
          style: 'Streetwear',
          description: 'Un t-shirt blanc basique avec un jean noir slim pour un look urbain et élégant.',
          isPremium: true,
          price: 4.99,
          rating: 4
        },
        {
          id: 2,
          title: 'Chic décontracté',
          slug: 'chic-decontracte',
          topImage: '/images/chemise-beige.jpg',
          bottomImage: '/images/chino-marron.jpg',
          event: 'Bureau',
          style: 'Classique',
          description: 'Chemise beige et chino marron pour un style professionnel mais décontracté.',
          isPremium: false,
          rating: 5
        },
        // Ajoutez plus de combinaisons ici
      ],
      filteredCombinations: []
    }
  },
  created() {
    this.filteredCombinations = this.combinations
  },
  methods: {
    filterCombinations() {
      this.filteredCombinations = this.combinations.filter(combo => {
        return (this.selectedEvent === '' || combo.event === this.selectedEvent) &&
               (this.selectedStyle === '' || combo.style === this.selectedStyle)
      })
    },
    purchaseCombo(id) {
      // Logique d'achat
      alert(`Achat de la combinaison ${id} effectué!`)
    },
    rateCombo(id, rating) {
      const combo = this.combinations.find(c => c.id === id)
      if (combo) {
        combo.rating = rating
      }
    },
    subscribe() {
      if (this.email) {
        alert(`Merci pour votre inscription: ${this.email}`)
        this.email = ''
      }
    }
  }
}
</script>

<style scoped>
.tuto-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #333;
  font-size: 2.5rem;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.filters select {
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.combinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.combo-card {
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}

.combo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.combo-images {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
}

.clothing-img {
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
}

.plus-icon {
  margin: 0 15px;
  font-size: 24px;
  color: #666;
}

.combo-details {
  padding: 20px;
}

.combo-details h3 {
  margin-top: 0;
  color: #222;
}

.occasion {
  color: #666;
  font-style: italic;
  margin: 5px 0;
}

.description {
  color: #444;
  line-height: 1.5;
  margin: 15px 0;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.price {
  font-weight: bold;
  font-size: 1.2rem;
}

.buy-btn, .free-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.buy-btn {
  background: #4CAF50;
  color: white;
}

.free-btn {
  background: #eee;
  color: #333;
}

.rating {
  margin-top: 15px;
  color: #FFD700;
  font-size: 1.2rem;
}

.rating span {
  cursor: pointer;
}

.rating .filled {
  color: #FFA500;
}

.newsletter {
  margin-top: 50px;
  text-align: center;
  padding: 30px;
  background: #f5f5f5;
  border-radius: 10px;
}

.newsletter input {
  padding: 10px 15px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.newsletter button {
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>