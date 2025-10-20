<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">FAQ</h1>
          <p class="text-xl text-gray-600">Trouvez rapidement des réponses à vos questions</p>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="space-y-8">
        <!-- Commandes -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ShoppingCart class="w-6 h-6 text-blue-600 mr-3" />
            Commandes & Paiements
          </h2>
          <div class="space-y-4">
            <FaqItem 
              question="Comment passer commande ?"
              answer="Ajoutez les articles à votre panier, puis suivez les étapes de paiement sécurisé."
            />
            <FaqItem 
              question="Quels modes de paiement acceptez-vous ?"
              answer="Nous acceptons les cartes bancaires, PayPal, et virements bancaires."
            />
            <FaqItem 
              question="Puis-je modifier ma commande ?"
              answer="Oui, tant que la commande n'est pas expédiée. Contactez notre service client."
            />
          </div>
        </section>

        <!-- Livraison -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Truck class="w-6 h-6 text-green-600 mr-3" />
            Livraison
          </h2>
          <div class="space-y-4">
            <FaqItem 
              question="Quels sont les délais de livraison ?"
              answer="2-5 jours ouvrés selon votre localisation."
            />
            <FaqItem 
              question="Proposez-vous la livraison express ?"
              answer="Oui, livraison en 24h disponible pour 10€ de supplément."
            />
            <FaqItem 
              question="Puis-je suivre ma commande ?"
              answer="Oui, vous recevrez un email de suivi avec numéro de tracking."
            />
          </div>
        </section>

        <!-- Retours -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <RefreshCw class="w-6 h-6 text-orange-600 mr-3" />
            Retours & Remboursements
          </h2>
          <div class="space-y-4">
            <FaqItem 
              question="Quelle est votre politique de retour ?"
              answer="30 jours pour les retours, articles non utilisés avec étiquettes."
            />
            <FaqItem 
              question="Combien de temps pour le remboursement ?"
              answer="5-10 jours après réception de l'article retourné."
            />
          </div>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <HelpCircle class="w-6 h-6 text-purple-600 mr-3" />
            Autres Questions
          </h2>
          <div class="space-y-4">
            <FaqItem 
              question="Comment créer un compte ?"
              answer="Cliquez sur 'Mon compte' et suivez l'inscription par email."
            />
            <FaqItem 
              question="Proposez-vous des réductions ?"
              answer="Oui, inscrivez-vous à notre newsletter pour recevoir nos offres."
            />
          </div>
        </section>
      </div>

      <!-- CTA Contact -->
      <div class="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Vous ne trouvez pas votre réponse ?</h3>
        <p class="text-gray-600 mb-6">Notre équipe support est là pour vous aider</p>
        <router-link to="/contact" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Nous contacter
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ShoppingCart, Truck, RefreshCw, HelpCircle } from 'lucide-vue-next'
import FaqItem from '@/components/FaqItem.vue'
</script>