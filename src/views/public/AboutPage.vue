<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1>Notre histoire</h1>
        <p class="subtitle">Plus qu'une boutique, une passion</p>
      </div>
    </section>

    <div class="container">
      <section class="about-section">
        <div class="about-content">
          <h2>Qui sommes-nous ?</h2>
          <p>
            Fondé en {{ foundingYear }}, <strong>{{ shopName }}</strong> est né de la passion pour offrir des produits de qualité à des prix accessibles. 
            Ce qui a commencé comme un petit projet est rapidement devenu une référence dans notre domaine.
          </p>
          <p>
            Nous croyons en un commerce éthique et durable. Chaque produit que nous proposons est soigneusement 
            sélectionné pour sa qualité, son origine et son impact environnemental.
          </p>
        </div>
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1598015132635-131afe3ba07f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFib3V0JTIwdGVhbXxlbnwwfHwwfHx8MA%3D%3D" alt="Notre équipe" />
        </div>
      </section>

      <section class="values-section">
        <h2>Nos valeurs</h2>
        <div class="values-grid">
          <div class="value-card" v-for="value in values" :key="value.title">
            <div class="value-icon">
              <component :is="value.icon" />
            </div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </section>

      <section class="team-section">
        <h2>Rencontrez notre équipe</h2>
        <div class="team-grid">
          <div class="team-member" v-for="member in team" :key="member.name">
            <img :src="member.image" :alt="member.name" />
            <h3>{{ member.name }}</h3>
            <p class="position">{{ member.position }}</p>
            <p class="bio">{{ member.bio }}</p>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <h2>En chiffres</h2>
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <h2>Prêt à faire du shopping ?</h2>
        <p>Découvrez notre collection soigneusement sélectionnée pour vous.</p>
        <button class="cta-button" @click="navigateToShop">Voir nos produits</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ShieldCheck, Leaf, HeartHandshake, Sparkles } from 'lucide-vue-next';

const router = useRouter();

const shopName = ref('MonShop');
const foundingYear = ref(2015);

const values = ref([
  {
    icon: ShieldCheck,
    title: 'Qualité garantie',
    description: 'Tous nos produits passent un contrôle qualité strict avant expédition.'
  },
  {
    icon: Leaf,
    title: 'Développement durable',
    description: 'Nous privilégions les matériaux écologiques et les producteurs locaux.'
  },
  {
    icon: HeartHandshake,
    title: 'Service client',
    description: 'Une équipe dédiée disponible pour répondre à vos questions.'
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Nous cherchons constamment à améliorer votre expérience d\'achat.'
  }
]);

const team = ref([
  {
    name: 'Jean Dupont',
    position: 'Fondateur & CEO',
    bio: 'Passionné par le commerce équitable depuis plus de 15 ans.',
    image: '@/assets/images/team/jean.jpg'
  },
  {
    name: 'Marie Martin',
    position: 'Responsable achats',
    bio: 'Sélectionne avec soin chaque produit de notre catalogue.',
    image: '@/assets/images/team/marie.jpg'
  },
  {
    name: 'Thomas Leroy',
    position: 'Responsable clientèle',
    bio: 'Toujours à l\'écoute pour répondre à vos besoins.',
    image: '@/assets/images/team/thomas.jpg'
  }
]);

const stats = ref([
  { value: '10 000+', label: 'Clients satisfaits' },
  { value: '500+', label: 'Produits disponibles' },
  { value: '50+', label: 'Marques partenaires' },
  { value: '24h', label: 'Livraison express' }
]);

const navigateToShop = () => {
  router.push('/products');
};
</script>

<style scoped>
.about-page {
  color: #333;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('@/assets/images/collection-hero.jpg');
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 300;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.about-section {
  display: flex;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: center;
}

.about-content {
  flex: 1;
}

.about-image {
  flex: 1;
}

.about-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s;
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-icon {
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #34495e;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.team-member {
  text-align: center;
}

.team-member img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #3498db;
}

.position {
  color: #7f8c8d;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.bio {
  font-style: italic;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.cta-section {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.cta-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .about-section {
    flex-direction: column;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
}
</style>