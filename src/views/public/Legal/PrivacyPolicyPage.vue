<template>
  <LegalLayout>
    <template #title>Politique de Confidentialité Internationale</template>
    <template #description>
      Protection de vos données personnelles conformément au RGPD, à la Loi Béninoise sur la Protection des Données, 
      et aux réglementations internationales.
    </template>
    <template #last-updated>20 Octobre 2025</template>
    
    <template #content>
      <div class="space-y-8">
        <!-- Section 1 -->
        <section id="section-1">
          <h2>1. Définitions et Champ d'Application</h2>
          
          <div class="note">
            <strong>bylin International</strong> - Société holding basée à Cotonou, Bénin, opérant globalement 
            via ses entités locales et partenaires de distribution.
          </div>

          <h3>1.1. Application Territoriale</h3>
          <p>
            Cette politique s'applique à tous nos clients worldwide, avec des dispositions spécifiques pour :
          </p>
          <ul>
            <li><strong>Union Européenne :</strong> Conformité RGPD (Règlement Général sur la Protection des Données)</li>
            <li><strong>Bénin et Afrique de l'Ouest :</strong> Loi n°2009-07 du 22 mai 2009 sur la protection des données</li>
            <li><strong>États-Unis :</strong> CCPA (California Consumer Privacy Act) et autres lois fédérales</li>
            <li><strong>Royaume-Uni :</strong> UK GDPR et Data Protection Act 2018</li>
            <li><strong>Canada :</strong> Loi sur la protection des renseignements personnels (PIPEDA)</li>
          </ul>
        </section>

        <!-- Section 2 -->
        <section id="section-2">
          <h2>2. Collecte des Données</h2>
          
          <h3>2.1. Données Clients Internationales</h3>
          <ul>
            <li><strong>Identité :</strong> Nom complet, date de naissance, nationalité</li>
            <li><strong>Coordonnées :</strong> Adresses (livraison/facturation), emails, téléphones internationaux</li>
            <li><strong>Préférences :</strong> Taille vêtements, style, marques préférées, budget</li>
            <li><strong>Paiement :</strong> Données cryptées via FedaPay, Mobile Money, cartes internationales</li>
            <li><strong>Douanes :</strong> Numéro de passeport/CNI pour les livraisons internationales</li>
          </ul>

          <h3>2.2. Données Techniques Globales</h3>
          <ul>
            <li><strong>Géolocalisation :</strong> Pays, région, fuseau horaire, devise préférée</li>
            <li><strong>Appareil :</strong> Type device, OS, navigateur, résolution écran</li>
            <li><strong>Analytics :</strong> Comportement navigation, temps de session, parcours d'achat</li>
            <li><strong>Réseaux sociaux :</strong> Données de connexion via Facebook, Instagram, Google</li>
          </ul>
        </section>

        <!-- Section 3 -->
        <section id="section-3">
          <h2>3. Finalités du Traitement</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">🎯 Expérience Client</h4>
              <ul class="text-sm space-y-1">
                <li>Recommandations personnalisées</li>
                <li>Support client multilingue</li>
                <li>Alertes stock & promotions</li>
                <li>Programme fidélité VIP</li>
              </ul>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-2">⚖️ Obligations Légales</h4>
              <ul class="text-sm space-y-1">
                <li>Facturation internationale</li>
                <li>Conformité douanière</li>
                <li>Prévention fraude</li>
                <li>Archivage légal</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 4 -->
        <section id="section-4">
          <h2>4. Partage International des Données</h2>
          
          <div class="highlight">
            <strong>bylin International</strong> applique les Clauses Contractuelles Types de la Commission Européenne 
            pour tous transferts de données hors UE/EEE.
          </div>

          <h3>4.1. Partenaires Stratégiques</h3>
          <ul>
            <li><strong>Logistique :</strong> DHL, FedEx, Chronopost, transporteurs locaux</li>
            <li><strong>Paiement :</strong> FedaPay, Stripe, PayPal, processeurs Mobile Money</li>
            <li><strong>Marketing :</strong> Google, Meta, TikTok, agences locales</li>
            <li><strong>Support :</strong> Zendesk, centres d'appels régionaux</li>
          </ul>

          <h3>4.2. Sécurité des Transferts</h3>
          <p>
            Tous nos partenaires sont certifiés selon les standards internationaux (ISO 27001, PCI DSS) 
            et signent des accords de traitement stricts.
          </p>
        </section>

        <!-- Section 5 -->
        <section id="section-5">
          <h2>5. Droits Internationaux</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-semibold text-blue-900 mb-2">🇪🇺 Union Européenne</h4>
              <p class="text-sm text-blue-800">
                Droit à l'effacement, portabilité, opposition. DPO : 
                <a href="mailto:dpo@bylin-style.com" class="underline">dpo@bylin-style.com</a>
              </p>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-green-900 mb-2">🇧🇯 Bénin & Afrique</h4>
              <p class="text-sm text-green-800">
                Droit d'accès, rectification. ARCEP conformité.
              </p>
            </div>
            
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 class="font-semibold text-purple-900 mb-2">🇺🇸 Amérique du Nord</h4>
              <p class="text-sm text-purple-800">
                Opt-out vente données, non-discrimination (CCPA)
              </p>
            </div>
          </div>
        </section>

        <!-- Section 6 -->
        <section id="section-6">
          <h2>6. Sécurité et Conformité</h2>
          
          <h3>6.1. Certifications Internationales</h3>
          <ul>
            <li><strong>ISO 27001 :</strong> Management de la sécurité de l'information</li>
            <li><strong>PCI DSS Level 1 :</strong> Sécurité des paiements</li>
            <li><strong>RGPD :</strong> Data Protection Officer certifié</li>
            <li><strong>SOC 2 :</strong> Contrôles de sécurité cloud</li>
          </ul>

          <h3>6.2. Mesures Techniques</h3>
          <ul>
            <li>Chiffrement AES-256 pour les données au repos</li>
            <li>TLS 1.3 pour les données en transit</li>
            <li>Stockage géo-répliqué avec centres en UE et Afrique</li>
            <li>Audits de sécurité trimestriels</li>
          </ul>
        </section>

        <!-- Section 7 -->
        <section id="section-7">
          <h2>7. Conservation des Données</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left">Type de Données</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Durée</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Base Légale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">Données de commande</td>
                  <td class="border border-gray-300 px-4 py-2">10 ans</td>
                  <td class="border border-gray-300 px-4 py-2">Obligation comptable</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">Données de paiement</td>
                  <td class="border border-gray-300 px-4 py-2">13 mois</td>
                  <td class="border border-gray-300 px-4 py-2">RGPD/PSD2</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">Données de prospect</td>
                  <td class="border border-gray-300 px-4 py-2">3 ans</td>
                  <td class="border border-gray-300 px-4 py-2">Consentement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Section 8 -->
        <section id="section-8">
          <h2>8. Contact et DPO International</h2>
          
          <div class="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">🌍 DPO Global</h4>
                <p class="text-sm text-gray-600 mb-2">
                  <strong>Email :</strong> 
                  <a href="mailto:dpo@bylin-style.com" class="text-blue-600 hover:underline">
                    dpo@bylin-style.com
                  </a>
                </p>
                <p class="text-sm text-gray-600 mb-2">
                  <strong>Téléphone :</strong> +229 01 51 01 04 42
                </p>
                <p class="text-sm text-gray-600">
                  <strong>Adresse :</strong> Siège Social, Cotonou, Bénin
                </p>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">⚖️ Autorités de Contrôle</h4>
                <p class="text-sm text-gray-600 mb-2">
                  <strong>UE :</strong> CNIL France - 
                  <a href="https://www.cnil.fr" class="text-blue-600 hover:underline">www.cnil.fr</a>
                </p>
                <p class="text-sm text-gray-600 mb-2">
                  <strong>Bénin :</strong> ARCEP - 
                  <a href="https://www.arcep.bj" class="text-blue-600 hover:underline">www.arcep.bj</a>
                </p>
                <p class="text-sm text-gray-600">
                  <strong>UK :</strong> ICO - 
                  <a href="https://ico.org.uk" class="text-blue-600 hover:underline">ico.org.uk</a>
                </p>
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