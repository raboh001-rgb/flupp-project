// Environment validation
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Helper function for required environment variables
const getRequiredEnv = (key: string, fallback?: string) => {
  const value = process.env[key];
  if (!value && isProduction) {
    console.error(`Missing required environment variable: ${key}`);
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback || '';
};

export const config = {
  api: {
    baseUrl: getRequiredEnv(
      'NEXT_PUBLIC_API_BASE_URL',
      isDevelopment ? 'http://localhost:8787' : undefined
    ),
    timeout: 10000,
  },
  stripe: {
    publishableKey: getRequiredEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    secretKey: getRequiredEnv('STRIPE_SECRET_KEY'),
    webhookSecret: getRequiredEnv('STRIPE_WEBHOOK_SECRET'),
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Flupp',
    url: getRequiredEnv(
      'NEXTAUTH_URL',
      isDevelopment ? 'http://localhost:3000' : undefined
    ),
  },
  auth: {
    secret: getRequiredEnv('NEXTAUTH_SECRET'),
  },
  features: {
    // Feature flags for different environments
    enableAnalytics: isProduction,
    enableErrorReporting: isProduction,
    enableDebugMode: isDevelopment,
    enableMockPayments: isDevelopment,
  },
  security: {
    // Security configuration
    enableCSP: isProduction,
    enableHSTS: isProduction,
    trustProxy: isProduction,
  }
} as const

// Validate critical configuration on startup
if (isProduction) {
  const requiredKeys = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const missing = requiredKeys.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Production deployment requires these environment variables: ${missing.join(', ')}`);
  }
}

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