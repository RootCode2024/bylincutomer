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

// Vues du shop
import ShopPage from '@/views/public/Product/ProductsPage.vue'
import CollectionPage from '@/views/public/Product/CollectionsPage.vue'
import CollectionDetailsPage from '@/views/public/Product/CollectionDetailsPage.vue'
import ProductCategoryPage from '@/views/public/Category/CategoryPage.vue'
import ProductCategoriesPage from '@/views/public/Category/CategoriesPage.vue'
import ProductDetailsPage from '@/views/public/Product/ProductDetailsPage.vue'
import TutorialsPage from '@/views/public/Tutorial/TutorialsPage.vue'
import TutorialDetailsPage from '@/views/public/Tutorial/TutorialDetailsPage.vue'
import CartPage from '@/views/public/Cart/CartPage.vue'
import SharedCartPage from '@/views/public/Cart/SharedCartPage.vue'
import SharedCartTokenPage from '@/views/public/Cart/SharedCartTokenPage.vue'
import CheckoutPage from '@/views/public/Cart/Checkout/CheckoutPage.vue'
import CheckoutSuccessPage from '@/views/public/Cart/Checkout/successPage.vue'
import WishListPage from '@/views/public/Cart/WishListPage.vue'
import TutorialWatchPage from '@/views/public/Tutorial/TutorialWatchPage.vue'
import TutorialReadPage from '@/views/public/Tutorial/TutorialReadPage.vue'
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
          title: 'bylin | Boutique & Formations en Stylisme',
          description:
            'Découvrez bylin : boutique de vêtements et plateforme de formation en stylisme et mode au Tchad et en Afrique.'
        }
      },
      {
        path: 'about',
        name: 'about',
        component: AboutPage,
        meta: {
          title: 'À propos | bylin',
          description:
            'Apprenez-en plus sur bylin, notre mission, nos valeurs et notre passion pour la mode et la formation stylisme.'
        }
      },
      {
        path: 'contact',
        name: 'contact',
        component: ContactPage,
        meta: {
          title: 'Contact | bylin',
          description:
            'Contactez l’équipe bylin pour toute question, assistance ou partenariat dans le domaine de la mode et stylisme.'
        }
      },
      {
        path: 'faq',
        name: 'faq',
        component: FaqPage,
        meta: {
          title: 'Foire aux Questions | bylin',
          description:
            'Consultez notre FAQ pour obtenir des réponses sur les commandes, livraisons, retours et formations bylin.'
        }
      },
      { path: 'auth/google/callback', name: 'auth.google.callback', component: GoogleCallbackPage },
      {
        path: 'shop',
        name: 'shop',
        component: ShopPage,
        meta: {
          title: 'Boutique | bylin',
          description:
            'Explorez nos collections de vêtements, accessoires et créations originales de bylin.'
        }
      },
      {
        path: 'collections',
        name: 'collections',
        component: CollectionPage,
        meta: {
          title: 'Collections Mode | bylin',
          description:
            'Découvrez toutes les collections de vêtements tendances créées par bylin.'
        }
      },
      {
        path: 'collections/:slug',
        name: 'collection',
        component: CollectionDetailsPage,
        meta: {
          title: 'Collection Détails | bylin',
          description: 'Explorez les détails de nos collections mode selon vos préférences et styles.'
        }
      },
      {
        path: 'product/:slug',
        name: 'product.details',
        component: ProductDetailsPage,
        meta: {
          title: 'Détails du Produit | bylin',
          description:
            'Découvrez nos vêtements et accessoires : descriptions, tailles, couleurs et avis clients.'
        }
      },
      {
        path: 'shop/category/:slug',
        name: 'product.category',
        component: ProductCategoryPage,
        meta: {
          title: 'Catégories de Produits | bylin',
          description:
            'Parcourez nos produits par catégorie : vêtements, accessoires et formations stylisme.'
        }
      },
      {
        path: 'shop/categories',
        name: 'categories.lists',
        component: ProductCategoriesPage,
        meta: {
          title: 'Toutes les Catégories | bylin',
          description: 'Découvrez toutes les catégories de produits disponibles sur bylin.'
        }
      },
      {
        path: 'tutorials',
        name: 'tutorials',
        component: TutorialsPage,
        meta: {
          title: 'Tutoriels Stylisme | bylin',
          description:
            'Apprenez le stylisme à votre rythme grâce à nos tutoriels vidéo et cours pratiques.'
        }
      },
      {
        path: 'tutorial/:slug',
        name: 'tutorial.details',
        component: TutorialDetailsPage,
        meta: {
          title: 'Détails du Tutoriel | bylin',
          description:
            'Découvrez nos cours de stylisme en ligne, leurs contenus et leurs avantages pour les apprenants.'
        }
      },
      { path: 'cart', name: 'cart', component: CartPage, meta: { title: 'Mon Panier | bylin', description: 'Vérifiez vos articles avant de passer votre commande sur bylin.' } },
      { path: 'shared-cart', name: 'shared-cart', component: SharedCartPage, meta: { requiresAuth: true, title: 'Panier partagé | bylin', description: 'Partagez vos paniers entre amis ou clients sur bylin.' } },
      { path: 'shared-cart/:token', name: 'shared-cart-token', component: SharedCartTokenPage },
      { path: 'checkout', name: 'checkout', component: CheckoutPage, meta: { requiresAuth: true, title: 'Paiement | bylin', description: 'Finalisez votre achat en toute sécurité sur bylin.' } },
      { path: 'checkout/success', name: 'checkout.success', component: CheckoutSuccessPage, meta: { requiresAuth: true, title: 'Commande réussie | bylin', description: 'Votre commande a été validée avec succès sur bylin.' } },
      { path: 'wishlists', name: 'wishlists', component: WishListPage, meta: { title: 'Mes Favoris | bylin', description: 'Retrouvez tous vos articles préférés enregistrés sur bylin.' } },
      { path: '/tutorials/:slug/watch', name: 'TutorialWatch', component: TutorialWatchPage, meta: { requiresAuth: true } },
      { path: '/tutorials/:slug/read', name: 'TutorialRead', component: TutorialReadPage, meta: { requiresAuth: true } },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: 'Page introuvable | bylin', description: 'La page que vous recherchez n’existe pas ou a été déplacée.' } }
    ]
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/public/Legal/PrivacyPolicyPage.vue'),
    meta: { title: 'Politique de Confidentialité | bylin', description: 'Découvrez comment bylin protège vos données personnelles et votre vie privée.' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/public/Legal/TermsPage.vue'),
    meta: { title: 'Conditions d’Utilisation | bylin', description: 'Lisez les conditions générales d’utilisation de notre plateforme bylin.' }
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('@/views/public/Legal/CookiePolicyPage.vue'),
    meta: { title: 'Politique des Cookies | bylin', description: 'En savoir plus sur l’utilisation des cookies sur le site bylin.' }
  },

  // 🔐 Dashboard
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard.home', component: CustomerDashboardHome, meta: { title: 'Tableau de bord | bylin', description: 'Gérez vos commandes, adresses, favoris et formations sur bylin.' } },
      { path: 'orders', name: 'dashboard.orders', component: CustomerOrders, meta: { title: 'Mes Commandes | bylin', description: 'Consultez l’historique et le suivi de vos commandes.' } },
      { path: 'orders/:orderNumber', name: 'dashboard.order', component: CustomerOrderDetails },
      { path: 'support/orders/:orderNumber', name: 'dashboard.support.order', component: SupportOrderDetails },
      { path: 'addresses', name: 'dashboard.addresses', component: CustomerAddresses, meta: { title: 'Mes Adresses | bylin', description: 'Gérez vos adresses de livraison et de facturation.' } },
      { path: 'profile', name: 'dashboard.account', component: CustomerAccount, meta: { title: 'Mon Compte | bylin', description: 'Mettez à jour vos informations personnelles et préférences.' } },
      { path: 'security', name: 'dashboard.security', component: CustomerSecurity, meta: { title: 'Sécurité du Compte | bylin', description: 'Modifiez votre mot de passe et sécurisez votre compte.' } },
      { path: 'shared-carts', name: 'dashboard.shared.carts', component: SharedCartsPage },
      { path: 'shared-carts/:id(\\d+)', name: 'dashboard.shared.carts.details', component: SharedCartDetailsPage },
      { path: 'wishlists', name: 'wishlist', component: DashboardWishListPage },
      { path: 'activities-log', name: 'dashboard.activities.log', component: ActivitiesLogPage },
      { path: 'review/order/:orderId', name: 'dashboard.review', component: ReviewsPage, props: route => ({ orderId: route.params.orderId, token: route.query.token }) }
    ]
  },

  // 🔐 Auth routes
  { path: '/login', name: 'login', component: LoginPage, meta: { requiresGuest: true, title: 'Connexion | bylin', description: 'Connectez-vous à votre compte bylin pour accéder à votre espace client.' } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { requiresGuest: true, title: 'Créer un Compte | bylin', description: 'Inscrivez-vous pour acheter, apprendre et suivre vos commandes sur bylin.' } },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage, meta: { requiresGuest: true, title: 'Mot de Passe Oublié | bylin', description: 'Réinitialisez votre mot de passe en quelques étapes simples.' } },
  { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage, meta: { requiresGuest: true, title: 'Réinitialisation du Mot de Passe | bylin', description: 'Choisissez un nouveau mot de passe sécurisé pour votre compte.' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 🔒 Auth Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  if (publicRoutes.includes(to.path)) return next()

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  if (requiresAuth && !authStore.initialized) await authStore.initialize(true)
  if (requiresAuth && !authStore.isAuthenticated) return next({ name: 'login', query: { redirect: to.fullPath } })
  if (to.matched.some(r => r.meta.requiresGuest) && authStore.isAuthenticated) return next('/dashboard')

  next()
})

// 🧭 SEO dynamique — Mise à jour du <title> et de la meta description
router.afterEach((to) => {
  const defaultTitle = 'bylin | Boutique & Formations en Stylisme'
  const defaultDescription = 'Découvrez bylin : vêtements, formations et inspiration mode pour tous.'

  document.title = to.meta.title || defaultTitle

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', to.meta.description || defaultDescription)
})

export default router
