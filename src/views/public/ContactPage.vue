<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-content">
        <h1>Nous contacter</h1>
        <p>Une question, un feedback ou une demande spéciale ? Nous sommes à votre écoute.</p>
      </div>
    </section>

    <div class="contact-container">
      <!-- Contact Info -->
      <section class="contact-info">
        <div class="info-card">
          <PhoneIcon :size="32" class="icon" />
          <h3>Téléphone</h3>
          <p>+33 1 23 45 67 89</p>
          <p class="hours">Lundi-Vendredi, 9h-18h</p>
        </div>

        <div class="info-card">
          <MailIcon :size="32" class="icon" />
          <h3>Email</h3>
          <p>contact@monshop.com</p>
          <p class="hours">Réponse sous 24h</p>
        </div>

        <div class="info-card">
          <MapPinIcon :size="32" class="icon" />
          <h3>Boutique physique</h3>
          <p>123 Rue du Commerce</p>
          <p>75001 Paris, France</p>
        </div>
      </section>

      <!-- Contact Form -->
      <section class="contact-form-section">
        <h2>Envoyez-nous un message</h2>
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label for="name">Nom complet *</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              required 
              placeholder="Votre nom"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required 
              placeholder="votre@email.com"
            />
          </div>

          <div class="form-group">
            <label for="subject">Sujet</label>
            <select id="subject" v-model="form.subject">
              <option value="question">Question sur un produit</option>
              <option value="order">Suivi de commande</option>
              <option value="return">Retour/Échange</option>
              <option value="other">Autre demande</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea 
              id="message" 
              v-model="form.message" 
              required 
              rows="5"
              placeholder="Décrivez votre demande en détails..."
            ></textarea>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Envoyer le message</span>
            <span v-else>Envoi en cours...</span>
          </button>

          <div v-if="submitStatus === 'success'" class="success-message">
            <CheckCircleIcon :size="20" />
            Merci ! Votre message a bien été envoyé.
          </div>
          <div v-if="submitStatus === 'error'" class="error-message">
            <AlertCircleIcon :size="20" />
            Une erreur est survenue. Veuillez réessayer.
          </div>
        </form>
      </section>

      <!-- Map Section -->
      <section class="map-section">
        <h2>Retrouvez-nous</h2>
        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937596!2d2.292292615509614!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1623251234567!5m2!1sfr!2sfr" 
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <h2>Questions fréquentes</h2>
        <div class="faq-list">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <button @click="toggleFaq(index)" class="faq-question">
              {{ faq.question }}
              <ChevronDownIcon :size="20" class="chevron" :class="{ rotated: activeFaq === index }" />
            </button>
            <div v-show="activeFaq === index" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  ChevronDownIcon
} from 'lucide-vue-next';

const form = ref({
  name: '',
  email: '',
  subject: 'question',
  message: ''
});

const isSubmitting = ref(false);
const submitStatus = ref(null);
const activeFaq = ref(0);

const faqs = ref([
  {
    question: "Quels sont vos délais de livraison ?",
    answer: "Nos livraisons standard prennent 2-5 jours ouvrés. Pour les livraisons express, comptez 24h."
  },
  {
    question: "Puis-je retourner un produit ?",
    answer: "Oui, vous avez 30 jours pour retourner un produit non utilisé, dans son emballage d'origine."
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Un email avec votre numéro de suivi vous sera envoyé dès l'expédition de votre colis."
  }
]);

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitStatus.value = null;
  
  try {
    // Ici vous ajouteriez votre logique d'envoi (API, email, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation d'envoi
    
    submitStatus.value = 'success';
    form.value = { name: '', email: '', subject: 'question', message: '' };
  } catch (error) {
    submitStatus.value = 'error';
    console.error('Erreur lors de l\'envoi:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-page {
  color: #333;
}

.contact-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
              url('@/assets/images/contact-hero.jpg');
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card .icon {
  color: #3b82f6;
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.info-card p {
  color: #64748b;
  margin-bottom: 0.3rem;
}

.hours {
  font-style: italic;
  font-size: 0.9rem;
  color: #94a3b8;
}

.contact-form-section {
  margin-bottom: 4rem;
}

.contact-form-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #1e293b;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.success-message,
.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-message {
  background-color: #ecfdf5;
  color: #059669;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
}

.map-section {
  margin-bottom: 4rem;
}

.map-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #1e293b;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.faq-section {
  margin-bottom: 4rem;
}

.faq-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #1e293b;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid #e2e8f0;
}

.faq-question {
  width: 100%;
  padding: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  text-align: left;
}

.faq-question:hover {
  color: #3b82f6;
}

.chevron {
  transition: transform 0.3s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding-bottom: 1.5rem;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contact-hero {
    height: 250px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>