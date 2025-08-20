<template>
  <div class="privacy-policy">
    <h1>Politique de confidentialité</h1>
    
    <section class="policy-section">
      <h2>1. Introduction</h2>
      <p>
        Nous nous engageons à protéger votre vie privée. Cette politique explique comment nous collectons, 
        utilisons et protégeons vos informations personnelles.
      </p>
    </section>

    <section class="policy-section">
      <h2>2. Collecte des informations</h2>
      <p>
        Nous pouvons collecter les informations suivantes :
      </p>
      <ul>
        <li>Nom et coordonnées</li>
        <li>Informations démographiques</li>
        <li>Autres informations pertinentes pour les enquêtes et offres</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>3. Utilisation des informations</h2>
      <p>
        Nous utilisons ces informations pour comprendre vos besoins et vous fournir un meilleur service, 
        notamment pour :
      </p>
      <ul>
        <li>Amélioration de nos produits et services</li>
        <li>Envoi périodique d'emails promotionnels</li>
        <li>Contact à des fins de recherche de marché</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>4. Sécurité</h2>
      <p>
        Nous nous engageons à assurer la sécurité de vos informations. Des mesures appropriées sont en place 
        pour protéger contre l'accès non autorisé ou la divulgation.
      </p>
    </section>

    <section class="policy-section">
      <h2>5. Cookies</h2>
      <p>
        Notre site peut utiliser des cookies pour améliorer l'expérience utilisateur. Vous pouvez choisir 
        d'accepter ou de refuser les cookies.
      </p>
    </section>

    <section class="policy-section">
      <h2>6. Liens vers d'autres sites</h2>
      <p>
        Notre site peut contenir des liens vers d'autres sites. Nous ne sommes pas responsables des pratiques 
        de confidentialité de ces sites.
      </p>
    </section>

    <section class="policy-section">
      <h2>7. Modifications de cette politique</h2>
      <p>
        Nous pouvons mettre à jour cette politique occasionnellement. Nous vous encourageons à la consulter 
        régulièrement.
      </p>
    </section>

    <section class="policy-section">
      <h2>8. Contact</h2>
      <p>
        Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à :
        <a href="mailto:contact@exemple.com">contact@exemple.com</a>
      </p>
    </section>

    <p class="last-updated">Dernière mise à jour : {{ lastUpdated }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const lastUpdated = ref('1er janvier 2023');
</script>

<style scoped>
.privacy-policy {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #34495e;
  margin: 1.5rem 0 1rem 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.policy-section {
  margin-bottom: 2rem;
}

ul {
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

.last-updated {
  font-style: italic;
  color: #7f8c8d;
  text-align: right;
  margin-top: 2rem;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>