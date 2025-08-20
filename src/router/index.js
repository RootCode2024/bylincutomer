import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout.vue'
import DashboardLayout from '@/components/layouts/DashboardLayout.vue'

// Vues publiques
import HomePage from '@/views/public/HomePage.vue'
import AboutPage from '@/views/public/AboutPage.vue'
import ContactPage from '@/views/public/ContactPage.vue'

// Vues du shop
import ShopPage from '@/views/public/Products/ProductsListPage.vue'
import ProductDetailsPage from '@/views/public/Products/ProductDetailsPage.vue'
import BylInClothingPage from '@/views/public/Products/BylInClothingPage.vue'
import TutoPage from '@/views/public/Products/TutoPage.vue'
import TutoDetailsPage from '@/views/public/Products/TutoDetailsPage.vue'
import CartPage from '@/views/public/Products/CartPage.vue'
import SharedCartPage from '@/views/public/Products/SharedCartPage.vue'
import CheckoutPage from '@/views/public/Products/CheckoutPage.vue'

// Vues d'authentification
import LoginPage from '@/views/public/Auth/LoginPage.vue'
import RegisterPage from '@/views/public/Auth/RegisterPage.vue'
import ForgotPasswordPage from '@/views/public/Auth/ForgotPasswordPage.vue'
import ResetPasswordPage from '@/views/public/Auth/ResetPasswordPage.vue'

// Vues du tableau de bord client
import CustomerDashboardHome from '@/views/dashboard/MainPage.vue'
import CustomerOrders from '@/views/dashboard/OrdersPage.vue'
import CustomerOrderDetails from '@/views/dashboard/OrderDetailsPage.vue'
import CustomerAddresses from '@/views/dashboard/AddressesPage.vue'
import CustomerAccount from '@/views/dashboard/AccountPage.vue'
import CustomerSecurity from '@/views/dashboard/SecurityPage.vue'
import SharedCartsPage from '@/views/dashboard/Cart/SharedCartsPage.vue'
import SharedCartDetailsPage from '@/views/dashboard/Cart/SharedCartDetailsPage.vue'
import DashboardWishListPage from '@/views/dashboard/WishListPage.vue'
import WishListPage from '@/views/public/WishListPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🌐 PUBLIC ROUTES
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: HomePage },
        { path: 'about', name: 'about', component: AboutPage },
        { path: 'contact', name: 'contact', component: ContactPage },
        { path: 'services', name: 'services', component: ContactPage },
        { path: 'collections', name: 'collections', component: ContactPage },
        { path: 'shipping', name: 'shipping', component: ContactPage },
        { path: 'sitemap', name: 'sitemap', component: ContactPage },
        { path: 'blog', name: 'blog', component: ContactPage },
        { path: 'shop', name: 'shop', component: ShopPage },
        { path: 'product/:slug', name: 'product.details', component: ProductDetailsPage },
        { path: 'byl-in-clothing', name: 'byl.in.clothing', component: BylInClothingPage },
        { path: 'tutos', name: 'tutos', component: TutoPage },
        { path: 'tuto/:slug', name: 'tuto.details', component: TutoDetailsPage },
        { path: 'cart', name: 'cart', component: CartPage },
        { path: 'wishlists', name: 'wishlists', component: WishListPage },
        {
          path: 'shared-cart',
          name: 'shared-cart',
          component: SharedCartPage,
          // meta: { requiresAuth: true },
          // beforeEnter: async (to, from, next) => {
          //   try {
          //     const cartStore = useCartStore()
              
          //     console.log('Vérification du panier avant shared-cart:', {
          //       itemsLength: cartStore.items?.length,
          //       items: cartStore.items,
          //       totalQuantity: cartStore.totalQuantity
          //     })
              
          //     // Vérification multiple pour s'assurer que le panier n'est pas vide
          //     const hasItems = cartStore.items && 
          //                     Array.isArray(cartStore.items) && 
          //                     cartStore.items.length > 0
              
          //     const hasQuantity = cartStore.totalQuantity > 0
              
          //     if (hasItems || hasQuantity) {
          //       console.log('Panier valide, accès autorisé à shared-cart')
          //       next()
          //     } else {
          //       console.warn('Panier vide, redirection vers /cart')
          //       next('/cart')
          //     }
          //   } catch (error) {
          //     console.error('Erreur dans beforeEnter shared-cart:', error)
          //     // En cas d'erreur, rediriger vers le panier plutôt que de bloquer
          //     next('/cart')
          //   }
          // }
        },
        { 
          path: 'checkout', 
          name: 'checkout', 
          component: CheckoutPage,
          meta: { requiresAuth: true }
        },
        { path: 'terms', name: 'terms', component: () => import('@/views/public/Legal/TermsView.vue') },
        { path: 'privacy', name: 'privacy', component: () => import('@/views/public/Legal/PrivacyPolicyView.vue') },
        { path: 'refund-policy', name: 'refund.policy', component: () => import('@/views/public/Legal/RefundPolicyView.vue') },
        { path: 'shipping-policy', name: 'shipping.policy', component: () => import('@/views/public/Legal/ShippingPolicyView.vue') },
      ],
    },

    // 🔐 DASHBOARD ROUTES
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard.home', component: CustomerDashboardHome },
        { path: 'orders', name: 'dashboard.orders', component: CustomerOrders },
        { path: 'orders/:id', name: 'dashboard.order', component: CustomerOrderDetails },
        { path: 'addresses', name: 'dashboard.addresses', component: CustomerAddresses },
        { path: 'account', name: 'dashboard.account', component: CustomerAccount },
        { path: 'profile', name: 'dashboard.account', component: CustomerAccount },
        { path: 'security', name: 'dashboard.security', component: CustomerSecurity },
        { path: 'shared-carts', name: 'dashboard.shared.carts', component: SharedCartsPage },
        { path: 'shared-carts/:id(\\d+)', name: 'dashboard.shared.carts.details', component: SharedCartDetailsPage },
        { path: 'wishlists', name: 'wishlist', component: DashboardWishListPage },
      ],
    },

    // 🔐 AUTH ROUTES
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: ResetPasswordPage,
      meta: { requiresGuest: true }
    },

    // 🔄 OAUTH CALLBACK
    {
      path: '/auth/google/callback',
      name: 'GoogleCallback',
      component: () => import('@/views/public/Auth/GoogleCallback.vue'),
      meta: { public: true }
    },

    // 🚫 404 - Route de fallback
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/public/NotFoundPage.vue')
    },

    {
      path: '/checkout/success',
      name: 'checkout.success',
      component: () => import('@/views/public/Products/checkout/successPage.vue'),
      props: (route) => ({ transaction_id: route.query.transaction_id })
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// Guard de navigation global
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()
    
    // Routes qui nécessitent une authentification
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    // Routes accessibles uniquement aux invités
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
    
    if (requiresAuth) {
      if (!authStore.isAuthenticated) {
        // Rediriger vers la page de connexion
        next({ 
          path: '/login', 
          query: { redirect: to.fullPath } 
        })
        return
      }
      
      // Vérifier la validité du token (optionnel)
      try {
        const isValid = await authStore.checkTokenValidity()
        if (!isValid) {
          next({ 
            path: '/login', 
            query: { redirect: to.fullPath } 
          })
          return
        }
      } catch (error) {
        console.warn('Erreur de validation du token:', error)
        next({ 
          path: '/login', 
          query: { redirect: to.fullPath } 
        })
        return
      }
    }
    
    if (requiresGuest && authStore.isAuthenticated) {
      // Rediriger les utilisateurs connectés loin des pages de connexion/inscription
      next('/')
      return
    }
    
    next()
    
  } catch (error) {
    console.error('Erreur dans le router guard:', error)
    
    // En cas d'erreur, permettre la navigation mais nettoyer l'auth
    const authStore = useAuthStore()
    authStore.clearCorruptedData()
    
    next()
  }
})

// Gestion des erreurs de navigation
router.onError((error) => {
  console.error('Erreur de navigation du router:', error)
  
  // Si c'est une erreur JSON, nettoyer le localStorage
  if (error.message.includes('JSON') || error.message.includes('undefined')) {
    try {
      localStorage.clear()
      window.location.reload()
    } catch (e) {
      console.error('Erreur lors du nettoyage:', e)
    }
  }
})

export default router