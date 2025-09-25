export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    verifyToken: '/auth/verify-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: (id, hash) => `/auth/email/verify/${id}/${hash}`,
    resendVerification: '/auth/email/verification-notification',
    updateProfile: '/auth/user/update',
    changePassword: '/auth/password/change',
    updateAvatar: '/auth/user/avatar',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp'
  },
  users: {
    base: '/users',
    single: (id) => `/users/${id}`,
    roles: '/users/roles',
    permissions: '/users/permissions'
  },
  products: {
    base: '/products/customer',
    single: (id) => `/products/customer/${id}`,
    featured: '/products/customer/featured',
    search: '/products/customer/search',
    categories: '/products/customer/categories',
    brands: '/products/customer/brands'
  },
  cart: {
    base: '/cart',
    items: '/cart/items',
    item: (id) => `/cart/items/${id}`,
    count: '/cart/count',
    shared: {
      base: '/cart/shared',
      single: (token) => `/cart/shared/${token}`,
      contributions: (token) => `/cart/shared/${token}/contributions`
    }
  },
  orders: {
    base: '/orders',
    single: (id) => `/orders/${id}`,
    statuses: (id) => `/orders/${id}/statuses`,
    history: '/orders/history'
  },
  admin: {
    dashboard: '/dashboard',
    stats: '/stats',
    notifications: '/notifications',
    reports: '/reports'
  },
  webhooks: {
    stripe: '/webhooks/stripe',
    paypal: '/webhooks/paypal',
    twilio: '/webhooks/twilio'
  }
}