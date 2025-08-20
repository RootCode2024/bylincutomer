<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">

    <!-- Hero section premium pour mode et vêtements -->
    <section class="relative bg-white overflow-hidden">
      <!-- Fond avec image de mode en flou -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1580418835996-7783da1c3c6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D" 
          alt="Nouvelle collection BylInClothing"
          class="w-full h-full object-cover filter blur-sm opacity-20"
        />
      </div>
      
      <!-- Contenu principal -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 py-32 sm:py-40 lg:px-8">
        <div class="text-center">
          <!-- Titre élégant avec effet de mode -->
          <h1 class="text-5xl sm:text-7xl font-light tracking-tight text-gray-900 mb-8">
            <span class="block font-serif italic">Collection</span>
            <span class="block font-bold mt-2">2025</span>
          </h1>
          
          <!-- Sous-titre adapté au climat béninois -->
          <p class="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-12">
            Élégance intemporelle pour votre quotidien, quel que soit le temps
          </p>
          
          <!-- Boutons d'action premium -->
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" class="px-8 py-4 bg-indigo-800 text-white font-medium rounded-sm hover:bg-indigo-700 transition duration-300 shadow-md">
              Découvrir la collection
            </a>
            <a href="#" class="px-8 py-4 border-2 border-indigo-800 text-indigo-800 font-medium rounded-sm hover:bg-indigo-50 transition duration-300">
              Inspiration styles
            </a>
          </div>
        </div>
      </div>
      
      <!-- Indicateur de défilement discret -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <svg class="w-8 h-8 text-indigo-800 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
      
      <!-- Overlay de dégradé subtil -->
      <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
    </section>

    <!-- Collections mises en avant avec hover amélioré -->
    <section class="container mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4 text-indigo-800">Nos collections</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Explorez nos gammes pour toute la famille</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CollectionCard 
          v-for="collection in collections"
          :key="collection.id"
          :collection="collection"
        />
      </div>
    </section>

    <!-- Nouveautés avec onglets -->
    <section class="bg-white py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-indigo-800">Nos nouveautés</h2>
          <div class="flex justify-center space-x-4">
            <button 
              v-for="(tab, index) in tabs"
              :key="index"
              @click="activeTab = index"
              :class="['px-6 py-2 rounded-full font-medium transition-all', 
                      activeTab === index ? 'bg-indigo-800 text-white' : 'text-indigo-800 hover:bg-indigo-100']"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div class="text-center mt-12">
          <button class="px-8 py-3 border-2 border-indigo-800 text-indigo-800 font-bold rounded-full hover:bg-indigo-800 hover:text-white transition-all">
            Voir toute la collection
          </button>
        </div>
      </div>
    </section>

    <!-- Bannière promotionnelle -->
    <div class="bg-indigo-800 text-white py-12 px-6">
      <div class="container mx-auto text-center">
        <h3 class="text-2xl sm:text-3xl font-bold mb-4">Soldes d'été : Jusqu'à -50%</h3>
        <p class="text-lg mb-6 max-w-2xl mx-auto">Profitez de nos meilleures offres jusqu'au 31 août</p>
        <button class="px-8 py-3 bg-white text-indigo-800 font-bold rounded-full hover:bg-gray-100 transition-all">
          Découvrir les promotions
        </button>
      </div>
    </div>

    <!-- Avantages avec icônes modernes -->
    <section class="bg-gray-50 py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-indigo-800">Pourquoi choisir Byl In ?</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Nous nous engageons pour votre satisfaction</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AdvantageItem 
            v-for="advantage in advantages"
            :key="advantage.title"
            :icon="advantage.icon"
            :title="advantage.title"
            :description="advantage.description"
          />
        </div>
      </div>
    </section>

    <!-- Témoignages -->
    <section class="bg-white py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-indigo-800">Ce que disent nos clients</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">Découvrez les avis de notre communauté</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            :testimonial="testimonial"
          />
        </div>
      </div>
    </section>

    <!-- Newsletter avec design moderne -->
    <section class="bg-gradient-to-r from-indigo-800 to-purple-700 py-20 px-6">
      <div class="container mx-auto max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/2 bg-indigo-800 p-12 text-white flex flex-col justify-center">
            <h3 class="text-3xl font-bold mb-4">Restez connectés</h3>
            <p class="text-lg mb-6 opacity-90">Recevez en exclusivité nos nouveautés, offres spéciales et conseils mode.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-white hover:text-indigo-300 transition">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-white hover:text-indigo-300 transition">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div class="md:w-1/2 p-12">
            <h3 class="text-2xl font-bold mb-6 text-indigo-800">Newsletter</h3>
            <p class="text-gray-600 mb-6">Abonnez-vous pour recevoir 10% de réduction sur votre première commande</p>
            <form @submit.prevent="subscribeNewsletter" class="space-y-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                v-model="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <button
                type="submit"
                class="w-full bg-indigo-800 hover:bg-indigo-500 transition px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '@/components/Product/ProductCard.vue'
import AdvantageItem from '@/components/AdvantageItem.vue'
import CollectionCard from '@/components/CollectionCard.vue'
import TestimonialCard from '@/components/TestimonialCard.vue'

// Onglets pour filtrer les produits
const tabs = ['Tous', 'Homme', 'Femme', 'Accessoires']
const activeTab = ref(0)

// Données des collections
const collections = ref([
  {
    id: 1,
    name: 'Homme',
    image: 'https://images.unsplash.com/photo-1594731487930-728235a414bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGhvbW1lJTIwbm9pciUyMHN0eWxlfGVufDB8fDB8fHww',
    description: 'Styles élégants et décontractés'
  },
  {
    id: 2,
    name: 'Femme',
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&q=80',
    description: 'Pièces tendances et confortables'
  },
  {
    id: 3,
    name: 'Enfants',
    image: 'https://images.unsplash.com/photo-1716217510947-4f2c70c7923e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGVuZmFudCUyMG5vaXIlMjBzdHlsZSUyMHR3aW58ZW58MHx8MHx8fDA%3D',
    description: 'Vêtements pratiques et ludiques'
  },
  {
    id: 4,
    name: 'Accessoires',
    image: 'https://images.unsplash.com/3/www.madebyvadim.com.jpg?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWNjZXNzb2lyZXN8ZW58MHx8MHx8fDA%3D',
    description: 'Complétez votre look'
  }
])

// Données des produits
const products = ref([
  {
    id: 1,
    name: 'Veste en cuir marron',
    price: 189.99,
    discountedPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
    category: 'Homme',
    isNew: true,
    rating: 4.5
  },
  {
    id: 2,
    name: 'Jean slim bleu',
    price: 89.5,
    discountedPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    category: 'Femme',
    isNew: true,
    rating: 4.2
  },
  {
    id: 3,
    name: 'Chemise blanche classique',
    price: 59.0,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
    category: 'Homme',
    isNew: false,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Sneakers blanches',
    price: 120.0,
    discountedPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=400&q=80',
    category: 'Accessoires',
    isNew: true,
    rating: 4.9
  },
  {
    id: 5,
    name: 'Robe d\'été fleurie',
    price: 75.0,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&q=80',
    category: 'Femme',
    isNew: true,
    rating: 4.3
  },
  {
    id: 6,
    name: 'Montre élégante',
    price: 199.99,
    discountedPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=80',
    category: 'Accessoires',
    isNew: false,
    rating: 4.8
  },
  {
    id: 7,
    name: 'Pull en cachemire',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=400&q=80',
    category: 'Homme',
    isNew: true,
    rating: 4.6
  },
  {
    id: 8,
    name: 'Sac à main cuir',
    price: 149.99,
    discountedPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80',
    category: 'Accessoires',
    isNew: true,
    rating: 4.4
  }
])

// Avantages
const advantages = ref([
  {
    icon: 'truck',
    title: 'Livraison rapide',
    description: 'Expédition sous 24h et livraison gratuite dès 50€'
  },
  {
    icon: 'refresh',
    title: 'Retours faciles',
    description: '30 jours pour changer d\'avis, sans frais'
  },
  {
    icon: 'shield-check',
    title: 'Paiement sécurisé',
    description: 'Cryptage SSL pour des transactions en toute sécurité'
  },
  {
    icon: 'leaf',
    title: 'Eco-responsable',
    description: 'Matériaux durables et processus de fabrication verts'
  }
])

// Témoignages
const testimonials = ref([
  {
    name: 'Marie D.',
    role: 'Client fidèle',
    content: 'Je commande régulièrement chez Byl In. La qualité est toujours au rendez-vous et le service client est exceptionnel !',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/43.jpg'
  },
  {
    name: 'Thomas L.',
    role: 'Nouveau client',
    content: 'Première commande et très agréablement surpris par la coupe des vêtements et la rapidité de livraison.',
    rating: 4,
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Sophie K.',
    role: 'Styliste',
    content: 'J\'adore les pièces uniques de Byl In que je recommande à mes clients pour un style à la fois tendance et intemporel.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/65.jpg'
  }
])

const email = ref('')

// Filtrer les produits selon l'onglet actif
const filteredProducts = computed(() => {
  if (activeTab.value === 0) return products.value
  return products.value.filter(product => 
    product.category === tabs[activeTab.value]
  )
})

function subscribeNewsletter() {
  alert(`Merci pour votre inscription, ${email.value}! Un code promo vous a été envoyé.`)
  email.value = ''
}
</script>

<style scoped>
/* Animations améliorées */
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  33% {
    transform: translate(50px, -30px) scale(1.2);
    opacity: 0.3;
  }
  66% {
    transform: translate(-30px, 40px) scale(0.8);
    opacity: 0.5;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blob {
  animation: blob 10s infinite ease-in-out;
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

/* Effet de survol pour les cartes */
.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>