<template>
  <div class="tuto-details">
    <!-- Bouton retour -->
    <router-link to="/tutos" class="back-button">
      &larr; Retour aux astuces
    </router-link>

    <!-- En-tête -->
    <header class="header">
      <h1>{{ combo.title }}</h1>
      <div class="meta">
        <span class="occasion">{{ combo.event }}</span>
        <span class="style">{{ combo.style }}</span>
        <div class="rating">
          <span v-for="star in 5" :key="star" 
                :class="{ 'filled': star <= combo.rating }">★</span>
          <span class="rating-count">({{ combo.ratingCount }})</span>
        </div>
      </div>
    </header>

    <!-- Galerie d'images -->
    <div class="gallery">
      <div class="main-combo">
        <img :src="combo.topImage" alt="Haut" class="main-img">
        <img :src="combo.bottomImage" alt="Bas" class="main-img">
      </div>
      <div class="alternative-items" v-if="combo.alternatives && combo.alternatives.length > 0">
        <h3>Alternatives possibles :</h3>
        <div class="alternatives-grid">
          <div v-for="(alt, index) in combo.alternatives" :key="index" class="alternative">
            <img :src="alt.image" :alt="alt.type" class="alt-img">
            <span class="alt-type">{{ alt.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Description détaillée -->
    <section class="detailed-description">
      <h2>Pourquoi cette combinaison fonctionne</h2>
      <p>{{ combo.detailedDescription }}</p>
      
      <div class="pro-tips" v-if="combo.tips && combo.tips.length > 0">
        <h3>Conseils de pro :</h3>
        <ul>
          <li v-for="(tip, index) in combo.tips" :key="index">{{ tip }}</li>
        </ul>
      </div>
    </section>

    <!-- Accessoires recommandés -->
    <section class="accessories" v-if="combo.accessories && combo.accessories.length > 0">
      <h2>Accessoires qui complètent le look</h2>
      <div class="accessories-grid">
        <div v-for="accessory in combo.accessories" :key="accessory.id" class="accessory">
          <img :src="accessory.image" :alt="accessory.name" class="accessory-img">
          <div class="accessory-info">
            <h4>{{ accessory.name }}</h4>
            <p>{{ accessory.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section d'achat -->
    <section class="purchase-section" v-if="combo.isPremium">
      <div class="price-card">
        <h3>Accédez à cette astuce premium</h3>
        <div class="price">{{ combo.price }} €</div>
        <p class="includes">Ceci inclut :</p>
        <ul class="benefits">
          <li>Guide détaillé pas à pas</li>
          <li>Liste de magasins où trouver ces pièces</li>
          <li>5 alternatives à différents budgets</li>
          <li>Conseils d'entretien pour ces vêtements</li>
        </ul>
        <button @click="purchase" class="purchase-btn">Acheter maintenant</button>
      </div>
    </section>

    <!-- Section gratuite avec CTA -->
    <section class="free-section" v-else>
      <h3>Vous aimez cette astuce ?</h3>
      <p>Abonnez-vous pour recevoir des astuces comme celle-ci chaque semaine !</p>
      <div class="newsletter-form">
        <input type="email" placeholder="Votre email" v-model="email">
        <button @click="subscribe">S'abonner gratuitement</button>
      </div>
    </section>

    <!-- Commentaires -->
    <section class="comments" v-if="combo.comments && combo.comments.length > 0">
      <h2>Commentaires</h2>
      <div class="comment" v-for="comment in combo.comments" :key="comment.id">
        <div class="comment-header">
          <span class="user">{{ comment.user }}</span>
          <span class="date">{{ comment.date }}</span>
        </div>
        <p class="comment-text">{{ comment.text }}</p>
      </div>
      <div class="add-comment">
        <textarea placeholder="Ajoutez un commentaire..." v-model="newComment"></textarea>
        <button @click="postComment">Poster</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      combo: {
        id: 1,
        title: 'Élégance urbaine',
        slug: 'elegance-urbaine',
        topImage: 'https://images.unsplash.com/photo-1670955107412-577b4da66a49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
        bottomImage: 'https://images.unsplash.com/photo-1670955107412-577b4da66a49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
        event: 'Soirée',
        style: 'Streetwear',
        detailedDescription: 'Cette combinaison fonctionne parce que le contraste entre le t-shirt blanc propre et le jean noir élégant crée une silhouette équilibrée. Le blanc illumine le visage tandis que le noir affine la silhouette. Cette combinaison est polyvalente et peut être habillée avec des chaussures élégantes ou rendue plus décontractée avec des baskets.',
        isPremium: true,
        price: 4.99,
        rating: 4,
        ratingCount: 128,
        tips: [
          'Choisissez un t-shirt en coton épais pour un look plus structuré',
          'Le jean doit être bien ajusté mais pas trop serré',
          'Ajoutez une ceinture mince pour une transition élégante',
          'Roulez légèrement les manches pour un look plus décontracté'
        ],
        alternatives: [
          { type: 'T-shirt', image: 'https://images.unsplash.com/photo-1688355761990-f99a15569960?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D' },
          { type: 'T-shirt', image: 'https://images.unsplash.com/photo-1688355761990-f99a15569960?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D' },
          { type: 'Jean', image: 'https://images.unsplash.com/photo-1688355761990-f99a15569960?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D' },
          { type: 'Jean', image: 'https://images.unsplash.com/photo-1688355761990-f99a15569960?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D' }
        ],
        accessories: [
          {
            id: 1,
            name: 'Montre minimaliste',
            image: 'https://images.unsplash.com/photo-1660983414551-b3758336be15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
            description: 'Une montre fine en métal argenté ajoute une touche sophistiquée sans surcharger le look.'
          },
          {
            id: 2,
            name: 'Baskets blanches',
            image: 'https://images.unsplash.com/photo-1660983414551-b3758336be15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhhdXQlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
            description: 'Pour un look décontracté-chic, des baskets blanches propres complètent parfaitement cet ensemble.'
          }
        ],
        comments: [
          {
            id: 1,
            user: 'Marie D.',
            date: '15/03/2023',
            text: 'J\'ai testé cette combinaison pour un dîner et j\'ai reçu plein de compliments ! Merci pour l\'astuce.'
          },
          {
            id: 2,
            user: 'Jean P.',
            date: '22/03/2023',
            text: 'Je porte ça au bureau le vendredi, avec une veste en jean par-dessus. Très confortable et stylé.'
          }
        ]
      },
      email: '',
      newComment: ''
    }
  },
  methods: {
    purchase() {
      // Logique d'achat
      alert(`Achat de "${this.combo.title}" effectué!`);
    },
    subscribe() {
      if (this.email) {
        alert(`Merci pour votre inscription: ${this.email}`);
        this.email = '';
      }
    },
    postComment() {
      if (this.newComment.trim()) {
        this.combo.comments.push({
          id: this.combo.comments.length + 1,
          user: 'Vous',
          date: new Date().toLocaleDateString(),
          text: this.newComment
        });
        this.newComment = '';
      }
    }
  }
}
</script>

<style scoped>
.tuto-details {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-button:hover {
  color: #333;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
  color: #222;
}

.meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
}

.occasion, .style {
  padding: 5px 10px;
  border-radius: 15px;
  background: #f0f0f0;
}

.rating {
  color: #FFD700;
  font-size: 1rem;
}

.rating .filled {
  color: #FFA500;
}

.rating-count {
  color: #666;
  font-size: 0.8rem;
  margin-left: 5px;
}

.gallery {
  margin-bottom: 40px;
}

.main-combo {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
}

.main-img {
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.alternatives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.alternative {
  text-align: center;
}

.alt-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

.alt-type {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
}

.detailed-description {
  margin-bottom: 40px;
  line-height: 1.6;
}

.detailed-description h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #222;
}

.pro-tips {
  margin-top: 25px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.pro-tips h3 {
  margin-top: 0;
  font-size: 1.2rem;
}

.pro-tips ul {
  padding-left: 20px;
}

.pro-tips li {
  margin-bottom: 8px;
}

.accessories {
  margin-bottom: 40px;
}

.accessories h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.accessories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.accessory {
  display: flex;
  gap: 15px;
  align-items: center;
}

.accessory-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.accessory-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.accessory-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.purchase-section {
  margin: 50px 0;
  display: flex;
  justify-content: center;
}

.price-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 30px;
  max-width: 400px;
  text-align: center;
  background: #fafafa;
}

.price-card h3 {
  margin-top: 0;
  font-size: 1.3rem;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 20px 0;
  color: #4CAF50;
}

.includes {
  font-weight: bold;
  margin-bottom: 10px;
}

.benefits {
  text-align: left;
  padding-left: 20px;
  margin-bottom: 25px;
}

.benefits li {
  margin-bottom: 8px;
}

.purchase-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.purchase-btn:hover {
  background: #45a049;
}

.free-section {
  text-align: center;
  margin: 50px 0;
  padding: 30px;
  background: #f5f5f5;
  border-radius: 10px;
}

.free-section h3 {
  margin-top: 0;
}

.newsletter-form {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.newsletter-form input {
  padding: 10px 15px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.newsletter-form button {
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.comments {
  margin-top: 50px;
  border-top: 1px solid #eee;
  padding-top: 30px;
}

.comments h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.comment {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.user {
  font-weight: bold;
}

.date {
  color: #666;
}

.comment-text {
  margin: 0;
  line-height: 1.5;
}

.add-comment {
  margin-top: 30px;
}

.add-comment textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 100px;
  margin-bottom: 10px;
  font-family: inherit;
}

.add-comment button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .main-combo {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .main-img {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 3/4;
  }
  
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }
  
  .newsletter-form input {
    width: 100%;
  }
}
</style>