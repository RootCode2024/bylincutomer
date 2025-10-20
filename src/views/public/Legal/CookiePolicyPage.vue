<template>
  <LegalLayout>
    <template #title>Conditions Générales d'Utilisation</template>
    <template #last-updated>15 Décembre 2024</template>
    
    <template #content>
      <div class="space-y-6">
        <section>
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant le site web <strong>{{ appName }}</strong>, vous acceptez d'être lié par 
            ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
          </p>
        </section>

        <section>
          <h2>2. Compte utilisateur</h2>
          <h3>2.1. Création de compte</h3>
          <p>Pour passer des commandes, vous devez créer un compte en fournissant des informations exactes et complètes.</p>
          
          <h3>2.2. Sécurité du compte</h3>
          <p>Vous êtes responsable de :</p>
          <ul>
            <li>La confidentialité de votre mot de passe</li>
            <li>Toutes les activités effectuées depuis votre compte</li>
            <li>La mise à jour de vos informations personnelles</li>
          </ul>
        </section>

        <section>
          <h2>3. Commandes et paiements</h2>
          <h3>3.1. Processus de commande</h3>
          <p>
            La passation d'une commande implique l'acceptation des prix, descriptions et conditions de livraison 
            affichés au moment de la commande.
          </p>

          <h3>3.2. Prix et taxes</h3>
          <p>
            Tous les prix sont en euros (€) et incluent la TVA. Les frais de livraison sont calculés 
            lors de la commande et confirmés avant le paiement.
          </p>

          <h3>3.3. Paiement</h3>
          <p>
            Les paiements sont sécurisés via nos prestataires agréés. Nous acceptons les cartes bancaires 
            principales et PayPal.
          </p>
        </section>

        <section>
          <h2>4. Livraison</h2>
          <h3>4.1. Délais de livraison</h3>
          <p>
            Les délais de livraison sont indicatifs et commencent à courir à partir de la confirmation 
            de paiement. Nous ne sommes pas responsables des retards dus aux transporteurs.
          </p>

          <h3>4.2. Zone de livraison</h3>
          <p>Nous livrons actuellement en France métropolitaine et dans les DOM-TOM.</p>
        </section>

        <section>
          <h2>5. Retours et remboursements</h2>
          <h3>5.1. Droit de rétractation</h3>
          <p>
            Conformément à la loi, vous disposez d'un délai de 14 jours à partir de la réception 
            des produits pour exercer votre droit de rétractation.
          </p>

          <h3>5.2. Conditions de retour</h3>
          <ul>
            <li>Les produits doivent être retournés dans leur état d'origine</li>
            <li>Les emballages d'origine doivent être conservés</li>
            <li>Les étiquettes ne doivent pas être retirées</li>
          </ul>

          <h3>5.3. Produits non remboursables</h3>
          <p>Certains produits ne peuvent être retournés pour des raisons d'hygiène :</p>
          <ul>
            <li>Sous-vêtements</li>
            <li>Produits personnalisés</li>
            <li>Produits de beauté ouverts</li>
          </ul>
        </section>

        <section>
          <h2>6. Propriété intellectuelle</h2>
          <p>
            Tout le contenu du site (textes, images, logos, design) est la propriété exclusive de 
            <strong>{{ appName }}</strong> et est protégé par les lois sur la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2>7. Limitations de responsabilité</h2>
          <p>
            <strong>{{ appName }}</strong> ne peut être tenu responsable :
          </p>
          <ul>
            <li>Des interruptions temporaires du site pour maintenance</li>
            <li>Des dommages résultant d'une mauvaise utilisation du site</li>
            <li>Des pertes commerciales ou pertes de données indirectes</li>
            <li>Du contenu des sites tiers liés depuis notre plateforme</li>
          </ul>
        </section>

        <section>
          <h2>8. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
            prendront effet dès leur publication sur le site.
          </p>
        </section>

        <section>
          <h2>9. Loi applicable</h2>
          <p>
            Ces conditions sont régies par la loi française. Tout litige relèvera de la compétence 
            des tribunaux français.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p><strong>Email :</strong> {{ contactEmail }}</p>
            <p><strong>Téléphone :</strong> {{ companyPhone }}</p>
            <p><strong>Horaires :</strong> Du lundi au vendredi, 9h-18h</p>
          </div>
        </section>
      </div>
    </template>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '@/components/layouts/LegalLayout.vue'

const appName = import.meta.env.VITE_APP_NAME || 'Votre Marque'
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'legal@votresite.com'
const companyPhone = import.meta.env.VITE_COMPANY_PHONE || '+33 1 23 45 67 89'
</script>