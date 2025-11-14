<script setup>
import { useRoute } from 'vue-router'
import { watchEffect, computed } from 'vue'

const route = useRoute()

const baseUrl = 'https://bylin-style.com'
const defaultImage = '/images/og-bylin-benin.jpg'

// Métadonnées par défaut optimisées pour le Bénin
const defaultMetadata = computed(() => ({
  title: 'bylin - Mode Premium & Vêtements Tendances au Bénin | Collection Exclusive',
  description: 'bylin : marque de mode premium au Bénin. Découvrez nos collections exclusives de vêtements tendance à Cotonou. Livraison rapide et qualité exceptionnelle.',
  image: defaultImage,
  keywords: 'bylin, mode bénin, vêtements cotonou, fashion afrique, collection exclusive, marque béninoise'
}))

watchEffect(() => {
  const title = route.meta.title || defaultMetadata.value.title
  const description = route.meta.description || defaultMetadata.value.description
  const image = route.meta.image || defaultMetadata.value.image
  const url = baseUrl + route.fullPath
  const keywords = route.meta.keywords || defaultMetadata.value.keywords

  // Titre de la page
  document.title = title

  // Meta Description
  updateMeta('meta[name="description"]', { name: 'description', content: description })

  // Keywords
  updateMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })

  // Canonical URL
  updateMeta('link[rel="canonical"]', { rel: 'canonical', href: url })

  // Open Graph
  setOG('og:title', title)
  setOG('og:description', description)
  setOG('og:image', image)
  setOG('og:url', url)
  setOG('og:type', 'website')
  setOG('og:locale', 'fr_BJ')
  setOG('og:site_name', 'bylin')

  // Twitter Card
  setTwitter('twitter:card', 'summary_large_image')
  setTwitter('twitter:title', title)
  setTwitter('twitter:description', description)
  setTwitter('twitter:image', image)
  setTwitter('twitter:site', '@bylin_ex_bylcompany')

  // Géolocalisation
  updateMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'BJ' })
  updateMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Cotonou' })

  // Structured Data dynamique selon la page
  updateStructuredData(route)
})

function setOG(property, content) {
  updateMeta(`meta[property="${property}"]`, { property, content })
}

function setTwitter(name, content) {
  updateMeta(`meta[name="${name}"]`, { name, content })
}

function updateMeta(selector, attributes) {
  let tag = document.querySelector(selector)

  if (!tag) {
    tag = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    Object.keys(attributes).forEach(k => tag.setAttribute(k, attributes[k]))
    document.head.appendChild(tag)
  } else {
    Object.keys(attributes).forEach(k => tag.setAttribute(k, attributes[k]))
  }
}

function updateStructuredData(route) {
  // Supprimer l'ancien structured data
  const oldScript = document.querySelector('script[type="application/ld+json"]')
  if (oldScript) {
    oldScript.remove()
  }

  let structuredData = {}

  if (route.name === 'home') {
    structuredData = getHomeStructuredData()
  } else if (route.name === 'product.details') {
    structuredData = getProductStructuredData(route.params.slug)
  } else if (route.name === 'shop') {
    structuredData = getShopStructuredData()
  }

  if (Object.keys(structuredData).length > 0) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
  }
}

function getHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "bylin",
    "description": "Marque de mode premium au Bénin - Vêtements tendance et collections exclusives",
    "url": "https://bylin-style.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bylin-style.com/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "fr-BJ",
    "areaServed": "BJ"
  }
}

function getShopStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Boutique bylin - Vêtements au Bénin",
    "description": "Collection complète de vêtements bylin disponibles au Bénin",
    "url": "https://bylin-style.com/shop",
    "numberOfItems": 50,
    "itemListOrder": "https://schema.org/ItemListOrderDescending"
  }
}

function getProductStructuredData(productSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Produit bylin",
    "description": "Vêtement premium de la marque bylin au Bénin",
    "url": `https://bylin-style.com/product/${productSlug}`,
    "brand": {
      "@type": "Brand",
      "name": "bylin"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "XOF",
      "price": "0",
      "areaServed": "BJ",
      "availableDeliveryMethod": "https://schema.org/ParcelDelivery"
    }
  }
}
</script>

<template>
  <!-- Ce composant gère dynamiquement le SEO -->
</template>