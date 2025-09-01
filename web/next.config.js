/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Replit hosting
  trailingSlash: false,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['localhost', 'workspace-raboh001.repl.co'],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables for client-side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@stripe/react-stripe-js',
    ],
  },

  // Webpack configuration for better module resolution
  webpack: (config, { isServer }) => {
    // Fix for module resolution issues in Replit
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Optimize bundle size
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': __dirname,
        '~': __dirname,
      };
    }

    return config;
  },
};

module.exports = nextConfig;