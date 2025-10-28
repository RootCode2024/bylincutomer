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
import GoogleCallbackPage from '@/views/public/Auth/GoogleCallbackPage.vue'

const routes = [
  // 🌐 Public
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'about', name: 'about', component: AboutPage },
      { path: 'contact', name: 'contact', component: ContactPage },
      { path: 'faq', name: 'faq', component: FaqPage },
      { path: 'auth/google/callback', name: 'auth.google.callback', component: GoogleCallbackPage },
      { path: 'shop', name: 'shop', component: ShopPage },
      { path: 'collections', name: 'collections', component: CollectionPage },
      { path: 'collections/:slug', name: 'collection', component: CollectionDetailsPage },
      { path: 'product/:slug', name: 'product.details', component: ProductDetailsPage },
      { path: 'shop/category/:slug', name: 'product.category', component: ProductCategoryPage },
      { path: 'shop/categories', name: 'categories.lists', component: ProductCategoriesPage },
      { path: 'tutorials', name: 'tutorials', component: TutorialsPage },
      { path: 'tutorial/:slug', name: 'tutorial.details', component: TutorialDetailsPage },
      { path: 'cart', name: 'cart', component: CartPage },
      { path: 'shared-cart', name: 'shared-cart', component: SharedCartPage, meta: { requiresAuth: true } },
      { path: 'shared-cart/:token', name: 'shared-cart-token', component: SharedCartTokenPage },
      { path: 'checkout', name: 'checkout', component: CheckoutPage, meta: { requiresAuth: true } },
      { path: 'checkout/success', name: 'checkout.success', component: CheckoutSuccessPage, meta: { requiresAuth: true } },
      { path: 'wishlists', name: 'wishlists', component: WishListPage },
      { path: '/tutorials/:slug/watch', name: 'TutorialWatch', component: TutorialWatchPage, meta: { requiresAuth: true } },
      { path: '/tutorials/:slug/read', name: 'TutorialRead', component: TutorialReadPage, meta: { requiresAuth: true } },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
    ]
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/public/Legal/PrivacyPolicyPage.vue'),
    meta: { title: 'Politique de Confidentialité' }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/public/Legal/TermsPage.vue'),
    meta: { title: 'Conditions d\'Utilisation' }
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('@/views/public/Legal/CookiePolicyPage.vue'),
    meta: { title: 'Politique des Cookies' }
  },

  // 🔐 Dashboard
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard.home', component: CustomerDashboardHome },
      { path: 'orders', name: 'dashboard.orders', component: CustomerOrders },
      { path: 'orders/:orderNumber', name: 'dashboard.order', component: CustomerOrderDetails },
      { path: 'support/orders/:orderNumber', name: 'dashboard.support.order', component: SupportOrderDetails },
      { path: 'addresses', name: 'dashboard.addresses', component: CustomerAddresses },
      { path: 'profile', name: 'dashboard.account', component: CustomerAccount },
      { path: 'security', name: 'dashboard.security', component: CustomerSecurity },
      { path: 'shared-carts', name: 'dashboard.shared.carts', component: SharedCartsPage },
      { path: 'shared-carts/:id(\\d+)', name: 'dashboard.shared.carts.details', component: SharedCartDetailsPage },
      { path: 'wishlists', name: 'wishlist', component: DashboardWishListPage },
      { path: 'activities-log', name: 'dashboard.activities.log', component: ActivitiesLogPage },
      { path: 'review/order/:orderId', name: 'dashboard.review', component: ReviewsPage, props: route => ({ orderId: route.params.orderId, token: route.query.token }) }
    ]
  },

  // 🔐 Auth routes
  { path: '/login', name: 'login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { requiresGuest: true } },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage, meta: { requiresGuest: true } },
  { path: '/reset-password', name: 'reset-password', component: ResetPasswordPage, meta: { requiresGuest: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 🔒 Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  // Route publique → pas besoin d'auth
  if (publicRoutes.includes(to.path)) {
    next()
    return
  }

  // Routes protégées → init auth si pas déjà fait
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  if (requiresAuth && !authStore.initialized) {
    console.log('🔄 Router: Initializing auth store for protected route...')
    await authStore.initialize(true) // force CSRF & fetchUser
  }

  // Redirection si non authentifié
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Redirection si invité authentifié
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)
  if (requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})


export default router