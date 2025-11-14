import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout.vue'
import DashboardLayout from '@/components/layouts/DashboardLayout.vue'

// Vues publiques
import HomePage from '@/views/public/HomePage.vue'
import AboutPage from '@/views/public/AboutPage.vue'
import ContactPage from '@/views/public/ContactPage.vue'
import FaqPage from '@/views/public/FaqPage.vue'

// Shop
import ShopPage from '@/views/public/Product/ProductsPage.vue'
import CollectionPage from '@/views/public/Product/CollectionsPage.vue'
import CollectionDetailsPage from '@/views/public/Product/CollectionDetailsPage.vue'
import ProductCategoryPage from '@/views/public/Category/CategoryPage.vue'
import ProductCategoriesPage from '@/views/public/Category/CategoriesPage.vue'
import ProductDetailsPage from '@/views/public/Product/ProductDetailsPage.vue'

// Panier / Checkout
import CartPage from '@/views/public/Cart/CartPage.vue'
import SharedCartPage from '@/views/public/Cart/SharedCartPage.vue'
import SharedCartTokenPage from '@/views/public/Cart/SharedCartTokenPage.vue'
import CheckoutPage from '@/views/public/Cart/Checkout/CheckoutPage.vue'
import CheckoutSuccessPage from '@/views/public/Cart/Checkout/successPage.vue'
import WishListPage from '@/views/public/Cart/WishListPage.vue'

// Divers
import NotFoundPage from '@/views/public/NotFoundPage.vue'

// Auth
import LoginPage from '@/views/public/Auth/LoginPage.vue'
import RegisterPage from '@/views/public/Auth/RegisterPage.vue'
import ForgotPasswordPage from '@/views/public/Auth/ForgotPasswordPage.vue'
import ResetPasswordPage from '@/views/public/Auth/ResetPasswordPage.vue'
import GoogleCallbackPage from '@/views/public/Auth/GoogleCallbackPage.vue'

// Dashboard
import CustomerDashboardHome from '@/views/dashboard/MainPage.vue'
import CustomerOrders from '@/views/dashboard/OrdersPage.vue'
import CustomerOrderDetails from '@/views/dashboard/OrderDetailsPage.vue'
import CustomerAddresses from '@/views/dashboard/AddressesPage.vue'
import CustomerAccount from '@/views/dashboard/AccountPage.vue'
import CustomerSecurity from '@/views/dashboard/SecurityPage.vue'
import SharedCartsPage from '@/views/dashboard/Cart/SharedCartsPage.vue'
import SharedCartDetailsPage from '@/views/dashboard/Cart/SharedCartDetailsPage.vue'
import DashboardWishListPage from '@/views/dashboard/WishListPage.vue'
import ReviewsPage from '@/views/dashboard/Review/ReviewPage.vue'
import ActivitiesLogPage from '@/views/dashboard/ActivitiesLogPage.vue'
import SupportOrderDetails from '@/views/dashboard/SupportOrderPage.vue'

const routes = [
  // 🌐 Public
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: {
          title: 'bylin - Mode Premium & Vêtements Tendances au Bénin | Collection Exclusive',
          description: 'bylin : marque de mode premium au Bénin. Découvrez nos collections exclusives de vêtements tendance à Cotonou. Livraison rapide, qualité exceptionnelle et style unique.',
          keywords: 'bylin, mode bénin, vêtements cotonou, fashion afrique, collection exclusive, marque béninoise, vêtements premium, boutique en ligne bénin'
        }
      },
      {
        path: 'about',
        name: 'about',
        component: AboutPage,
        meta: {
          title: 'À propos de bylin - Marque de Mode Béninoise | Notre Histoire',
          description: 'Découvrez l\'histoire de bylin, marque de mode premium au Bénin. Notre vision, nos valeurs et notre engagement pour une mode africaine de qualité à Cotonou.',
          keywords: 'histoire bylin, marque béninoise, mode africaine, valeurs bylin, création cotonou'
        }
      },
      {
        path: 'contact',
        name: 'contact',
        component: ContactPage,
        meta: {
          title: 'Contact bylin - Boutique Mode à Cotonou, Bénin | Service Client',
          description: 'Contactez bylin au Bénin pour toute question. Service client disponible à Cotonou. Livraison dans tout le Bénin. Réponses rapides et personnalisées.',
          keywords: 'contact bylin, service client bénin, boutique cotonou, livraison bénin, support bylin'
        }
      },
      {
        path: 'faq',
        name: 'faq',
        component: FaqPage,
        meta: {
          title: 'FAQ bylin - Questions Fréquentes Mode Bénin | Aide & Support',
          description: 'Trouvez toutes les réponses à vos questions sur bylin Bénin : commandes, livraison à Cotonou, tailles, paiements et retours. Support client dédié.',
          keywords: 'faq bylin, questions mode bénin, livraison cotonou, tailles vêtements, paiement sécurisé'
        }
      },

      { path: 'auth/google/callback', name: 'auth.google.callback', component: GoogleCallbackPage },

      // 🛍 Shop
      {
        path: 'shop',
        name: 'shop',
        component: ShopPage,
        meta: {
          title: 'Boutique bylin - Vêtements Premium au Bénin | Collection Complète',
          description: 'Parcourez la boutique bylin : vêtements premium, accessoires tendance et pièces exclusives au Bénin. Large choix disponible à Cotonou avec livraison rapide.',
          keywords: 'boutique bylin, vêtements bénin, shopping en ligne cotonou, mode africaine, collection vêtements'
        }
      },
      {
        path: 'collections',
        name: 'collections',
        component: CollectionPage,
        meta: {
          title: 'Collections bylin - Mode Exclusive Bénin | Nouvelles Tendances',
          description: 'Découvrez toutes les collections exclusives bylin au Bénin. Pièces uniques, nouvelles tendances et créations limitées disponibles à Cotonou.',
          keywords: 'collections bylin, mode exclusive bénin, tendances africaines, pièces limitées, nouvelle collection'
        }
      },
      {
        path: 'collections/:slug',
        name: 'collection',
        component: CollectionDetailsPage,
        meta: {
          title: 'Collection bylin - Pièces Exclusives | Mode Béninoise',
          description: 'Explorez la collection bylin : pièces exclusives et créations uniques de la marque béninoise. Qualité premium et style authentique à Cotonou.',
          keywords: 'collection exclusive, pièces uniques, mode béninoise, vêtements premium, création bylin'
        }
      },
      {
        path: 'product/:slug',
        name: 'product.details',
        component: ProductDetailsPage,
        meta: {
          title: 'Produit bylin - Vêtement Premium Bénin | Détails & Avis',
          description: 'Découvrez ce produit bylin : détails complets, photos, tailles disponibles et avis clients. Livraison rapide à Cotonou et dans tout le Bénin.',
          keywords: 'produit bylin, détail vêtement, avis clients, tailles disponibles, livraison bénin'
        }
      },
      {
        path: 'shop/category/:slug',
        name: 'product.category',
        component: ProductCategoryPage,
        meta: {
          title: 'Catégorie Vêtements bylin - Mode Homme/Femme Bénin | Collection',
          description: 'Parcourez nos catégories de vêtements bylin au Bénin. Mode homme, femme, accessoires. Large sélection disponible à Cotonou avec essai possible.',
          keywords: 'catégorie vêtements, mode homme bénin, mode femme bénin, accessoires cotonou, collection par catégorie'
        }
      },
      {
        path: 'shop/categories',
        name: 'categories.lists',
        component: ProductCategoriesPage,
        meta: {
          title: 'Toutes les Catégories bylin - Mode Complète Bénin | Classification',
          description: 'Explorez toutes les catégories de produits bylin disponibles au Bénin. Organisation par type, style et collection pour shopping facile à Cotonou.',
          keywords: 'catégories bylin, classification vêtements, types produits, organisation boutique, navigation mode'
        }
      },

      // 🛒 Cart / Checkout
      {
        path: 'cart',
        name: 'cart',
        component: CartPage,
        meta: { 
          title: 'Panier bylin - Finalisez Votre Commande Bénin | Récapitulatif',
          description: 'Vérifiez votre panier bylin : articles sélectionnés, quantités et total. Procédez au paiement sécurisé avec livraison à Cotonou et dans tout le Bénin.',
          keywords: 'panier bylin, commande bénin, récapitulatif achat, paiement sécurisé, livraison cotonou'
        }
      },
      {
        path: 'shared-cart',
        name: 'shared-cart',
        component: SharedCartPage,
        meta: { 
          requiresAuth: true, 
          title: 'Panier Partagé bylin - Shopping Collaboratif Bénin | Partage',
          description: 'Créez et partagez vos paniers bylin avec vos proches au Bénin. Shopping collaboratif facile avec livraison groupée à Cotonou.',
          keywords: 'panier partagé, shopping collaboratif, partage achat, groupe commande, livraison groupée'
        }
      },
      { 
        path: 'shared-cart/:token', 
        name: 'shared-cart-token', 
        component: SharedCartTokenPage,
        meta: {
          title: 'Panier Partagé bylin - Rejoindre la Commande | Collaboration',
          description: 'Rejoignez un panier partagé bylin au Bénin. Ajoutez vos articles et profitez de la livraison groupée à Cotonou.'
        }
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: CheckoutPage,
        meta: { 
          requiresAuth: true, 
          title: 'Paiement Sécurisé bylin - Finalisation Commande Bénin | Checkout',
          description: 'Finalisez votre commande bylin en toute sécurité. Paiement crypté, choix de livraison à Cotonou et confirmation instantanée au Bénin.',
          keywords: 'paiement bylin, checkout sécurisé, finalisation commande, livraison bénin, confirmation achat'
        }
      },
      {
        path: 'checkout/success',
        name: 'checkout.success',
        component: CheckoutSuccessPage,
        meta: { 
          requiresAuth: true, 
          title: 'Commande Validée - Confirmation bylin Bénin | Suivi',
          description: 'Votre commande bylin a été validée avec succès. Numéro de suivi, détails de livraison à Cotonou et confirmation envoyée au Bénin.',
          keywords: 'commande validée, confirmation achat, suivi colis, livraison cotonou, reçu bylin'
        }
      },
      {
        path: 'wishlists',
        name: 'wishlists',
        component: WishListPage,
        meta: { 
          title: 'Mes Favoris bylin - Liste de Souhaits Bénin | Articles Sauvegardés',
          description: 'Retrouvez vos articles bylin favoris sauvegardés. Créez vos listes de souhaits pour shopping facile au Bénin avec alertes disponibilité à Cotonou.',
          keywords: 'favoris bylin, liste souhaits, articles sauvegardés, alertes disponibilité, wishlist mode'
        }
      },

      // ❌ 404
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundPage,
        meta: { 
          title: 'Page Introuvable - bylin Bénin | Erreur 404',
          description: 'Cette page est introuvable sur bylin Bénin. Retournez à la boutique de mode à Cotonou ou explorez nos collections exclusives.',
          keywords: 'page introuvable, erreur 404, bylin bénin, boutique cotonou'
        }
      }
    ]
  },

  // 🔐 Legal
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/public/Legal/PrivacyPolicyPage.vue'),
    meta: { 
      title: 'Politique de Confidentialité - bylin Bénin | Protection Données',
      description: 'Politique de confidentialité bylin Bénin : protection de vos données personnelles, utilisation des informations et sécurité à Cotonou.',
      keywords: 'confidentialité bylin, protection données, vie privée, sécurité informations, RGPD bénin'
    }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/public/Legal/TermsPage.vue'),
    meta: { 
      title: 'Conditions d\'Utilisation - bylin Bénin | CGU Boutique',
      description: 'Conditions générales d\'utilisation de la boutique bylin au Bénin. Droits, responsabilités et modalités de service à Cotonou.',
      keywords: 'conditions utilisation, CGU bylin, termes service, droits responsabilités, boutique bénin'
    }
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('@/views/public/Legal/CookiePolicyPage.vue'),
    meta: { 
      title: 'Politique Cookies - bylin Bénin | Gestion Préférences',
      description: 'Politique relative aux cookies sur bylin Bénin. Gestion de vos préférences, tracking et amélioration de l\'expérience shopping à Cotonou.',
      keywords: 'cookies bylin, politique cookies, préférences navigation, tracking site, expérience utilisateur'
    }
  },

  // 🔒 Dashboard
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard.home',
        component: CustomerDashboardHome,
        meta: { 
          title: 'Tableau de Bord - Mon Compte bylin Bénin | Gestion',
          description: 'Tableau de bord personnel bylin Bénin : gérez vos commandes, informations personnelles et préférences de livraison à Cotonou.',
          keywords: 'tableau de bord, compte bylin, gestion commandes, informations personnelles, préférences livraison'
        }
      },
      {
        path: 'orders',
        name: 'dashboard.orders',
        component: CustomerOrders,
        meta: { 
          title: 'Mes Commandes - Historique bylin Bénin | Suivi',
          description: 'Historique complet de vos commandes bylin au Bénin. Suivi en temps réel, détails des achats et statut de livraison à Cotonou.',
          keywords: 'commandes bylin, historique achats, suivi colis, détails commande, livraison bénin'
        }
      },
      { 
        path: 'orders/:orderNumber', 
        name: 'dashboard.order', 
        component: CustomerOrderDetails,
        meta: {
          title: 'Détails Commande - Suivi bylin Bénin | Information',
          description: 'Détails complets de votre commande bylin au Bénin. Articles, statut de livraison à Cotonou et informations de suivi.'
        }
      },
      { 
        path: 'support/orders/:orderNumber', 
        name: 'dashboard.support.order', 
        component: SupportOrderDetails,
        meta: {
          title: 'Support Commande - Assistance bylin Bénin | Aide',
          description: 'Support dédié pour votre commande bylin au Bénin. Assistance clientèle et résolution de problèmes à Cotonou.'
        }
      },
      {
        path: 'addresses',
        name: 'dashboard.addresses',
        component: CustomerAddresses,
        meta: { 
          title: 'Mes Adresses - Livraison bylin Bénin | Gestion',
          description: 'Gérez vos adresses de livraison bylin au Bénin. Ajoutez, modifiez ou supprimez vos adresses à Cotonou et dans tout le pays.',
          keywords: 'adresses livraison, gestion adresses, livraison cotonou, coordonnées bylin, destinations bénin'
        }
      },
      {
        path: 'profile',
        name: 'dashboard.account',
        component: CustomerAccount,
        meta: { 
          title: 'Mon Compte - Profil bylin Bénin | Informations',
          description: 'Gérez votre profil bylin au Bénin. Modifiez vos informations personnelles, préférences de communication et paramètres de compte.',
          keywords: 'profil bylin, informations personnelles, paramètres compte, préférences communication, compte client'
        }
      },
      {
        path: 'security',
        name: 'dashboard.security',
        component: CustomerSecurity,
        meta: { 
          title: 'Sécurité - Compte bylin Bénin | Protection',
          description: 'Gérez la sécurité de votre compte bylin au Bénin. Modification du mot de passe, authentification et paramètres de confidentialité.',
          keywords: 'sécurité compte, mot de passe, authentification, protection compte, confidentialité bylin'
        }
      },
      { 
        path: 'shared-carts', 
        name: 'dashboard.shared.carts', 
        component: SharedCartsPage,
        meta: {
          title: 'Paniers Partagés - Gestion bylin Bénin | Collaboration',
          description: 'Gérez vos paniers partagés bylin au Bénin. Créez, modifiez et suivez vos shopping collaboratifs avec livraison à Cotonou.'
        }
      },
      { 
        path: 'shared-carts/:id(\\d+)', 
        name: 'dashboard.shared.carts.details', 
        component: SharedCartDetailsPage,
        meta: {
          title: 'Détails Panier Partagé - bylin Bénin | Collaboration',
          description: 'Détails du panier partagé bylin au Bénin. Gestion des participants, articles et livraison groupée à Cotonou.'
        }
      },
      { 
        path: 'wishlists', 
        name: 'wishlist', 
        component: DashboardWishListPage,
        meta: {
          title: 'Mes Favoris - Tableau de Bord bylin Bénin | Souhaits',
          description: 'Gérez vos listes de favoris bylin depuis votre tableau de bord. Organisez vos souhaits mode pour shopping au Bénin.'
        }
      },
      { 
        path: 'activities-log', 
        name: 'dashboard.activities.log', 
        component: ActivitiesLogPage,
        meta: {
          title: 'Journal d\'Activités - Compte bylin Bénin | Historique',
          description: 'Consultez le journal de vos activités bylin au Bénin. Historique des connexions, commandes et modifications de compte.'
        }
      },
      {
        path: 'review/order/:orderId',
        name: 'dashboard.review',
        component: ReviewsPage,
        props: route => ({ orderId: route.params.orderId, token: route.query.token }),
        meta: {
          title: 'Avis Produits - Évaluation bylin Bénin | Feedback',
          description: 'Donnez votre avis sur les produits bylin achetés au Bénin. Partagez votre expérience et aidez la communauté shopping à Cotonou.'
        }
      }
    ]
  },

  // 🔐 Auth
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { 
      requiresGuest: true, 
      title: 'Connexion - Compte bylin Bénin | Authentification',
      description: 'Connectez-vous à votre compte bylin Bénin. Accédez à votre historique de commandes, favoris et profitez de la livraison à Cotonou.',
      keywords: 'connexion bylin, compte client, authentification, accès membre, espace client bénin'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { 
      requiresGuest: true, 
      title: 'Créer un Compte - Inscription bylin Bénin | Nouveau Client',
      description: 'Créez votre compte bylin pour shopper au Bénin. Avantages membres, suivi de commandes, livraison rapide à Cotonou et offres exclusives.',
      keywords: 'inscription bylin, créer compte, nouveau client, avantages membres, offre exclusive bénin'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { 
      requiresGuest: true, 
      title: 'Mot de Passe Oublié - bylin Bénin | Récupération',
      description: 'Réinitialisez votre mot de passe bylin au Bénin. Procédure sécurisée de récupération de compte avec confirmation par email.',
      keywords: 'mot de passe oublié, récupération compte, réinitialisation, sécurité bylin, accès perdu'
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordPage,
    meta: { 
      requiresGuest: true, 
      title: 'Réinitialisation Mot de Passe - bylin Bénin | Nouveau Accès',
      description: 'Choisissez un nouveau mot de passe pour votre compte bylin Bénin. Sécurisez votre accès et protégez vos informations personnelles.',
      keywords: 'réinitialisation mot de passe, nouveau accès, sécurité compte, protection bylin, authentification'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Auth Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  if (publicRoutes.includes(to.path)) return next()

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  if (requiresAuth && !authStore.initialized) await authStore.initialize(true)
  if (requiresAuth && !authStore.isAuthenticated)
    return next({ name: 'login', query: { redirect: to.fullPath } })

  if (to.matched.some(r => r.meta.requiresGuest) && authStore.isAuthenticated)
    return next('/dashboard')

  next()
})

// SEO dynamique amélioré pour le Bénin
router.afterEach((to) => {
  const defaultTitle = 'bylin - Mode Premium & Vêtements Tendances au Bénin | Collection Exclusive'
  const defaultDescription = 'bylin : marque de mode premium au Bénin. Découvrez nos collections exclusives de vêtements tendance à Cotonou. Livraison rapide, qualité exceptionnelle.'
  const defaultKeywords = 'bylin, mode bénin, vêtements cotonou, fashion afrique, collection exclusive, marque béninoise'

  // Titre de la page
  document.title = to.meta.title || defaultTitle

  // Meta Description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', to.meta.description || defaultDescription)

  // Meta Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta')
    metaKeywords.name = 'keywords'
    document.head.appendChild(metaKeywords)
  }
  metaKeywords.setAttribute('content', to.meta.keywords || defaultKeywords)

  // Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.href = `https://bylin-style.com${to.fullPath}`

  // Open Graph
  updateMetaTag('property', 'og:title', to.meta.title || defaultTitle)
  updateMetaTag('property', 'og:description', to.meta.description || defaultDescription)
  updateMetaTag('property', 'og:url', `https://bylin-style.com${to.fullPath}`)
  updateMetaTag('property', 'og:type', 'website')
  updateMetaTag('property', 'og:locale', 'fr_BJ')
  updateMetaTag('property', 'og:site_name', 'bylin')

  // Twitter Card
  updateMetaTag('name', 'twitter:card', 'summary_large_image')
  updateMetaTag('name', 'twitter:title', to.meta.title || defaultTitle)
  updateMetaTag('name', 'twitter:description', to.meta.description || defaultDescription)
  updateMetaTag('name', 'twitter:site', '@bylin_ex_bylcompany')

  // Géolocalisation pour le Bénin
  updateMetaTag('name', 'geo.region', 'BJ')
  updateMetaTag('name', 'geo.placename', 'Cotonou')
})

// Fonction utilitaire pour mettre à jour les meta tags
function updateMetaTag(attribute, name, content) {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default router