export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://workspace-raboh001.repl.co',
    timeout: 10000,
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Flupp',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET || '',
  },
} as const

export const apiEndpoints = {
  // Booking endpoints
  bookings: '/api/bookings',
  bookingsCreate: '/api/bookings/create',
  bookingsUpdate: '/api/bookings/update',
  bookingsCancel: '/api/bookings/cancel',
  
  // Payment endpoints  
  payments: '/api/payments',
  paymentsCreateIntent: '/api/payments/create-intent',
  paymentsConfirm: '/api/payments/confirm',
  
  // Review endpoints
  reviews: '/api/reviews',
  reviewsCreate: '/api/reviews/create',
  
  // Provider endpoints
  providers: '/api/providers',
  providersSearch: '/api/providers/search',
  providersProfile: '/api/providers/profile',
  
  // Veterinary directory endpoints
  veterinary: '/api/veterinary',
  veterinarySearch: '/api/veterinary/search',
  
  // Marketplace endpoints
  marketplace: '/api/marketplace',
  marketplaceListings: '/api/marketplace/listings',
  marketplaceCreate: '/api/marketplace/create',
  marketplacePurchase: '/api/marketplace/purchase',
  
  // User endpoints
  users: '/api/users',
  usersProfile: '/api/users/profile',
  usersBookings: '/api/users/bookings',
  
  // Authentication endpoints
  auth: '/api/auth',
  authLogin: '/api/auth/login',
  authRegister: '/api/auth/register',
  authLogout: '/api/auth/logout',
} as const

export type ApiEndpoint = keyof typeof apiEndpoints