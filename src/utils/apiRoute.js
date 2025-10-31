export const API_ROUTES = {
  // -----------------------------
  // AUTHENTICATION & ACCOUNT
  // -----------------------------
  auth: {
    login: '/api/customer/auth/login',
    register: '/api/customer/auth/register',
    newsletter: '/api/customer/newsletter/subscribe',
    logout: '/api/customer/auth/logout',
    me: '/api/customer/auth/me',
    googleRedirect: '/api/customer/auth/google/redirect',
    googleCallback: '/api/customer/auth/google/callback',

    // Email Verification / OTP
    verifyOtp: '/api/customer/auth/verify-otp',
    resendOtp: '/api/customer/auth/resend-otp',
    verifyEmail: (id, hash) => `/api/customer/auth/email/verify/${id}/${hash}`,
    resendVerification: '/api/customer/auth/email/verification-notification',

    // Password management
    forgotPassword: '/api/customer/auth/forgot-password',
    resetPassword: '/api/customer/auth/reset-password',
    changePassword: '/api/customer/account/password',

    // Profile updates
    updateProfile: '/api/customer/profile',
    updateAvatar: '/api/customer/profile/avatar',
    deleteAvatar: '/api/customer/profile/avatar',
    updateBirthDate: '/api/customer/profile/birth-date',

    // Account management
    updateEmail: '/api/customer/account/email',
    verifyNewEmail: '/api/customer/account/email/verify',
    updatePhone: '/api/customer/account/phone',
    verifyNewPhone: '/api/customer/account/phone/verify',
  },

  // -----------------------------
  // CUSTOMERS & DASHBOARD
  // -----------------------------
  customers: {
    emailAvailable: '/api/customer/email/available',
    dashboard: '/api/customer/dashboard-customer-datas',

    activities: {
      base: '/api/customer/activities',
      stats: '/api/customer/activities/stats',
      types: '/api/customer/activities/types',
    },

    addresses: {
      base: '/api/customer/profile/addresses',
      single: (id) => `/api/customer/profile/addresses/${id}`,
      default: '/api/customer/profile/addresses/default',
      setDefault: (id) => `/api/customer/profile/addresses/default/${id}`,
    },
  },

  // -----------------------------
  // PRODUCTS
  // -----------------------------
  products: {
    base: '/api/customer/products',
    single: (idOrSlug) => `/api/customer/products/${idOrSlug}`,
    newCollection: '/api/customer/products/new-collection',
    // categories: '/api/customer/products/category/${slug}',
    category: (slug) => `/api/customer/products/category/${slug}`,
    featured: '/api/customer/collections/featured',
    latest: '/api/customer/collections/latest',

    // Authenticated (CRUD)
    create: '/api/customer/products',
    update: (id) => `/api/customer/products/${id}`,
    delete: (id) => `/api/customer/products/${id}`,

    // Categories & Brands
    categories: '/api/customer/categories',
    categorySingle: (slug) => `/api/customer/categories/${slug}`,
    navBarCategories: '/api/customer/categories/navbar',
    brands: '/api/customer/brands',
  },

  // -----------------------------
  // COLLECTIONS
  // -----------------------------
  collections: {
    base: '/api/customer/collections',
    featured: '/api/customer/collections/featured',
    latest: '/api/customer/collections/latest',
    single: (slug) => `/api/customer/collections/${slug}`,
  },

  // -----------------------------
  // CARTS
  // -----------------------------
  cart: {
    base: '/api/customer/cart',
    coupon: '/api/customer/cart/coupon',
    check: '/api/customer/cart/check',
    load: '/api/customer/cart/load',
    destroy: '/api/customer/cart',

    // Shared carts
    shared: {
      publicSingle: (token) => `/api/customer/shared-cart/${token}`,
      base: '/api/customer/shared-carts',
      single: (id) => `/api/customer/shared-carts/${id}`,
      delete: (id) => `/api/customer/shared-carts/${id}/delete`,
      paymentMethods: '/api/customer/shared-carts/payment-methods',
      processPayment: (token) => `/api/customer/shared-carts/${token}/payment`,
    },
  },

  // -----------------------------
  // ORDERS
  // -----------------------------
  orders: {
    base: '/api/customer/orders',
    single: (orderNumber) => `/api/customer/orders/${orderNumber}`,
    place: '/api/customer/orders',
    history: '/api/customer/orders/history',
    downloadInvoice: (orderId) => `/api/customer/orders/${orderId}/invoice/download`,
  },

  // -----------------------------
  // REVIEWS
  // -----------------------------
  reviews: {
    base: '/api/customer/reviews',
    showForm: (orderId) => `/api/customer/reviews/order/${orderId}`,
    submit: '/api/customer/reviews/submit',
    submitBatch: '/api/customer/reviews/submit-batch',
  },

  // -----------------------------
  // TUTORIALS
  // -----------------------------
  tutorials: {
    base: '/api/customer/tutorials',
    free: '/api/customer/tutorials/free',
    premium: '/api/customer/tutorials/premium',
    categories: '/api/customer/tutorials/categories',
    byCategory: (categorySlug) => `/api/customer/tutorials/category/${categorySlug}`,
    single: (id) => `/api/customer/tutorials/${id}`,
    bySlug: (slug) => `/api/customer/tutorials/slug/${slug}`,
    purchased: '/api/customer/user/purchased-tutorials',
    purchase: '/api/customer/user/tutorials/purchase',
  },

  // -----------------------------
  // LOCATION
  // -----------------------------
  location: {
    cities: (countryCode) => `/api/customer/countries/${countryCode}/cities`,
    districts: (cityId) => `/api/customer/cities/${cityId}/districts`,
    deliveryOptions: '/api/customer/delivery/options',
  },

  // -----------------------------
  // PAGES
  // -----------------------------
  pages: {
    homepage: '/api/customer/page/homepage',
    homeCollections: '/api/customer/home/collections',
    latestCollection: '/api/customer/home/collections/latest',
  },

  // -----------------------------
  // WISHLISTS
  // -----------------------------
  wishlists: {
    base: '/api/customer/wishlists',
    single: (id) => `/api/customer/wishlists/${id}`,
  },

  // -----------------------------
  // PAYMENTS
  // -----------------------------
  payments: {
    fedapayCallback: '/api/customer/fedapay/callback',
    genericCallback: '/api/customer/payment/callback',
  },
};