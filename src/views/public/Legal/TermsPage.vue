<template>
  <LegalLayout>
    <template #title>Conditions Générales de Vente Internationales</template>
    <template #description>
      Contrat régissant les relations entre BYLIN International et sa clientèle mondiale. 
      Conformité aux législations des pays de livraison.
    </template>
    <template #last-updated>20 Octobre 2025</template>
    
    <template #content>
      <div class="space-y-8">
        <!-- Section 1 -->
        <section id="section-1">
          <h2>1. Champ d'Application et Acceptation</h2>
          
          <div class="highlight">
            <strong>BYLIN International</strong> - Société immatriculée au RCCM Bénin sous le numéro RB/COT/2020/B/1001, 
            TVA intracommunautaire FR12345678901, capital social de 500,000,000 FCFA.
          </div>

          <h3>1.1. Territorialité</h3>
          <p>
            Ces CGV s'appliquent à toutes les ventes effectuées sur les territoires suivants :
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <span class="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm text-center">🇧🇯 Bénin & UEMOA</span>
            <span class="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm text-center">🇫🇷 Union Européenne</span>
            <span class="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm text-center">🇺🇸 Amérique du Nord</span>
            <span class="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm text-center">🌍 Reste du Monde</span>
          </div>

          <h3>1.2. Langues Contractuelles</h3>
          <p>
            Le présent contrat est rédigé en français, version faisant foi. Des traductions en anglais, 
            espagnol et portugais sont disponibles sur demande.
          </p>
        </section>

        <!-- Section 2 -->
        <section id="section-2">
          <h2>2. Produits et Prix</h2>
          
          <h3>2.1. Gamme BYLIN & Marques Partenaires</h3>
          <ul>
            <li><strong>BYLIN Collection :</strong> Vêtements premium conçus et produits sous notre marque</li>
            <li><strong>Marques Partenaires :</strong> Sélection de créateurs internationaux (Gucci, Balenciaga, Dior, etc.)</li>
            <li><strong>Éditions Limitées :</strong> Pièces exclusives numérotées</li>
            <li><strong>Sur Mesure :</strong> Service de personnalisation haut de gamme</li>
          </ul>

          <h3>2.2. Politique Tarifaire Internationale</h3>
          <div class="note">
            <strong>Transparence des prix :</strong> Tous les prix affichés incluent la TVA applicable et les éventuels droits de douane.
          </div>
          
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-3 text-left">Devise</th>
                  <th class="border border-gray-300 px-4 py-3 text-left">Paiement Accepté</th>
                  <th class="border border-gray-300 px-4 py-3 text-left">TVA/Douanes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-3">FCFA (XOF)</td>
                  <td class="border border-gray-300 px-4 py-3">Mobile Money, Carte, Virement</td>
                  <td class="border border-gray-300 px-4 py-3">TVA 18% incluse</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 px-4 py-3">EUR (€)</td>
                  <td class="border border-gray-300 px-4 py-3">Carte, PayPal, Virement SEPA</td>
                  <td class="border border-gray-300 px-4 py-3">TVA 20% incluse</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-3">USD ($)</td>
                  <td class="border border-gray-300 px-4 py-3">Carte, PayPal, Apple Pay</td>
                  <td class="border border-gray-300 px-4 py-3">Sales tax selon état</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Section 3 -->
        <section id="section-3">
          <h2>3. Commandes et Paiement</h2>
          
          <h3>3.1. Processus de Commande</h3>
          <ol class="list-decimal pl-6 space-y-2">
            <li>Sélection des articles avec visualisation 360°</li>
            <li>Configuration de la personnalisation (si applicable)</li>
            <li>Vérification automatique de la disponibilité en temps réel</li>
            <li>Calcul des frais de livraison et droits de douane</li>
            <li>Paiement sécurisé multicanal</li>
            <li>Confirmation immédiate avec numéro de suivi</li>
          </ol>

          <h3>3.2. Méthodes de Paiement Internationales</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="text-2xl mb-2">💳</div>
              <div class="font-semibold text-sm">Cartes Bancaires</div>
              <div class="text-xs text-gray-600 mt-1">Visa, Mastercard, Amex</div>
            </div>
            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="text-2xl mb-2">📱</div>
              <div class="font-semibold text-sm">Mobile Money</div>
              <div class="text-xs text-gray-600 mt-1">MTN, Moov, Flooz</div>
            </div>
            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="text-2xl mb-2">🌐</div>
              <div class="font-semibold text-sm">FedaPay</div>
              <div class="text-xs text-gray-600 mt-1">Paiement Africain</div>
            </div>
            <div class="text-center p-4 border border-gray-200 rounded-lg">
              <div class="text-2xl mb-2">🔗</div>
              <div class="font-semibold text-sm">Cryptomonnaies</div>
              <div class="text-xs text-gray-600 mt-1">Bitcoin, Ethereum</div>
            </div>
          </div>
        </section>

        <!-- Section 4 -->
        <section id="section-4">
          <h2>4. Livraison Internationale</h2>
          
          <h3>4.1. Délais et Coûts</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-3 text-left">Zone</th>
                  <th class="border border-gray-300 px-4 py-3 text-left">Délai</th>
                  <th class="border border-gray-300 px-4 py-3 text-left">Coût</th>
                  <th class="border border-gray-300 px-4 py-3 text-left">Transporteur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-3">Bénin (Cotonou)</td>
                  <td class="border border-gray-300 px-4 py-3">24h</td>
                  <td class="border border-gray-300 px-4 py-3">Gratuit >100k FCFA</td>
                  <td class="border border-gray-300 px-4 py-3">BYLIN Express</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 px-4 py-3">Afrique de l'Ouest</td>
                  <td class="border border-gray-300 px-4 py-3">2-3 jours</td>
                  <td class="border border-gray-300 px-4 py-3">15,000 FCFA</td>
                  <td class="border border-gray-300 px-4 py-3">DHL Express</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-3">Europe</td>
                  <td class="border border-gray-300 px-4 py-3">3-5 jours</td>
                  <td class="border border-gray-300 px-4 py-3">35€</td>
                  <td class="border border-gray-300 px-4 py-3">FedEx Priority</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 px-4 py-3">Amérique du Nord</td>
                  <td class="border border-gray-300 px-4 py-3">5-7 jours</td>
                  <td class="border border-gray-300 px-4 py-3">65$</td>
                  <td class="border border-gray-300 px-4 py-3">UPS Worldwide</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>4.2. Procédures Douanières</h3>
          <p>
            BYLIN International prend en charge l'ensemble des formalités douanières pour nos clients. 
            Les droits et taxes sont calculés automatiquement lors de la commande.
          </p>
        </section>

        <!-- Section 5 -->
        <section id="section-5">
          <h2>5. Retours et Échanges Internationalux</h2>
          
          <h3>5.1. Droit de Rétractation</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="border border-green-200 bg-green-50 rounded-lg p-4">
              <h4 class="font-semibold text-green-900 mb-2">🇪🇺 Union Européenne</h4>
              <p class="text-sm text-green-800">14 jours calendaires</p>
            </div>
            <div class="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h4 class="font-semibold text-blue-900 mb-2">🇧🇯 Bénin & Afrique</h4>
              <p class="text-sm text-blue-800">7 jours ouvrables</p>
            </div>
            <div class="border border-purple-200 bg-purple-50 rounded-lg p-4">
              <h4 class="font-semibold text-purple-900 mb-2">🇺🇸 Amérique du Nord</h4>
              <p class="text-sm text-purple-800">30 jours calendaires</p>
            </div>
          </div>

          <h3>5.2. Conditions de Retour</h3>
          <ul>
            <li>Articles non portés, non lavés, avec étiquettes d'origine</li>
            <li>Emballage d'origine intact</li>
            <li>Bon de retour généré depuis l'espace client</li>
            <li>Frais de retour offerts pour les articles défectueux</li>
          </ul>

          <h3>5.3. Exceptions</h3>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <strong>Non remboursables :</strong> Sous-vêtements, maillots de bain, produits personnalisés, 
            articles soldés, produits cosmétiques ouverts.
          </div>
        </section>

        <!-- Section 6 -->
        <section id="section-6">
          <h2>6. Garanties Internationales</h2>
          
          <h3>6.1. Garantie Constructeur</h3>
          <ul>
            <li><strong>BYLIN Collection :</strong> 2 ans contre les défauts de fabrication</li>
            <li><strong>Marques Partenaires :</strong> Selon la politique du fabricant</li>
            <li><strong>Cuir et Fourrure :</strong> Certificat d'authenticité inclus</li>
          </ul>

          <h3>6.2. Service Après-Vente Global</h3>
          <p>
            Notre service client est disponible 7j/7 en plusieurs langues :
          </p>
          <div class="flex flex-wrap gap-2 mt-3">
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">🇫🇷 Français</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">🇬🇧 English</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">🇪🇸 Español</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">🇵🇹 Português</span>
          </div>
        </section>

        <!-- Section 7 -->
        <section id="section-7">
          <h2>7. Litiges et Médiation</h2>
          
          <h3>7.1. Règlement Amiable</h3>
          <p>
            En cas de litige, contactez notre médiateur interne : 
            <a href="mailto:mediateur@bylin-style.com" class="text-blue-600 hover:underline">
              mediateur@bylin-style.com
            </a>
          </p>

          <h3>7.2. Médiation Conventionnelle</h3>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <strong>Union Européenne :</strong> Plateforme de Règlement en Ligne des Litiges (RLL) - 
            <a href="https://ec.europa.eu/consumers/odr" class="text-blue-600 hover:underline">
              https://ec.europa.eu/consumers/odr
            </a>
          </div>

          <h3>7.3. Compétence Juridictionnelle</h3>
          <p>
            En cas d'échec de la médiation, les tribunaux de Cotonou (Bénin) sont seuls compétents, 
            conformément à la Convention de Bruxelles.
          </p>
        </section>

        <!-- Section 8 -->
        <section id="section-8">
          <h2>8. Contact Commercial International</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="border border-gray-200 rounded-xl p-6">
              <h4 class="font-semibold text-gray-900 mb-4">📞 Support Client Global</h4>
              <div class="space-y-2 text-sm">
                <p><strong>Email :</strong> support@bylin-style.com</p>
                <p><strong>Téléphone :</strong> +229 01 51 01 04 42</p>
                <p><strong>WhatsApp :</strong> +229 01 51 01 04 42</p>
                <p><strong>Horaires :</strong> 24h/24, 7j/7</p>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-xl p-6">
              <h4 class="font-semibold text-gray-900 mb-4">🏢 Siège Social</h4>
              <div class="space-y-2 text-sm">
                <p><strong>BYLIN International SARL</strong></p>
                <p>Rue des Ministères, Immeuble Diamond</p>
                <p>01 BP 1234 Cotonou, Bénin</p>
                <p><strong>RCCM :</strong> RB/COT/2020/B/1001</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '@/components/layouts/LegalLayout.vue'
</script>