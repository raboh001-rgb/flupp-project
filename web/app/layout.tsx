import type { Metadata } from 'next'
import { Inter, Fredoka } from 'next/font/google'
import './globals.css'
import { config } from '../lib/config'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fredoka = Fredoka({ 
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${config.app.name} - Pet Services Marketplace`,
    template: `%s | ${config.app.name}`,
  },
  description: 'Find trusted pet boarding, grooming, daycare, training services and a marketplace for second-hand pet items. Plus discover local veterinary practices.',
  keywords: ['pet services', 'pet boarding', 'dog grooming', 'pet daycare', 'pet training', 'veterinary', 'pet marketplace', 'UK'],
  authors: [{ name: config.app.name }],
  creator: config.app.name,
  metadataBase: new URL(config.app.url),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: config.app.url,
    title: `${config.app.name} - Pet Services Marketplace`,
    description: 'Find trusted pet services and discover local veterinary practices across the UK.',
    siteName: config.app.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.app.name} - Pet Services Marketplace`,
    description: 'Find trusted pet services and discover local veterinary practices across the UK.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import { ErrorBoundary } from '../components/ErrorBoundary'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`font-inter antialiased bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100`}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
          <header className="bg-white/80 backdrop-blur-md border-b border-flupp-neutral-200/50 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <a href="/" className="text-2xl font-fredoka font-bold">
                    <span className="bg-flupp-gradient bg-clip-text text-transparent">
                      {config.app.name}
                    </span>
                  </a>
                </div>
                
                <div className="hidden md:flex items-center space-x-8">
                  <a href="/services" className="text-flupp-neutral-700 hover:text-flupp-sage transition-colors">
                    Services
                  </a>
                  <a href="/marketplace" className="text-flupp-neutral-700 hover:text-flupp-sage transition-colors">
                    Marketplace
                  </a>
                  <a href="/veterinary" className="text-flupp-neutral-700 hover:text-flupp-sage transition-colors">
                    Find a Vet
                  </a>
                  <a href="/become-provider" className="text-flupp-neutral-700 hover:text-flupp-sage transition-colors">
                    Become a Provider
                  </a>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="flupp-button-outline text-sm px-4 py-2">
                    Log In
                  </button>
                  <button className="flupp-button-primary text-sm px-4 py-2">
                    Sign Up
                  </button>
                </div>
              </div>
            </nav>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-flupp-neutral-800 text-flupp-neutral-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-xl font-fredoka font-bold text-white mb-4">
                    {config.app.name}
                  </h3>
                  <p className="text-flupp-neutral-400 mb-4 max-w-md">
                    Your trusted marketplace for pet services across the UK. 
                    Find boarding, grooming, daycare, training, and veterinary services, 
                    plus shop second-hand pet items.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-4">Services</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/services/boarding" className="hover:text-white transition-colors">Pet Boarding</a></li>
                    <li><a href="/services/grooming" className="hover:text-white transition-colors">Pet Grooming</a></li>
                    <li><a href="/services/daycare" className="hover:text-white transition-colors">Pet Daycare</a></li>
                    <li><a href="/services/training" className="hover:text-white transition-colors">Pet Training</a></li>
                    <li><a href="/veterinary" className="hover:text-white transition-colors">Veterinary Directory</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                    <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-flupp-neutral-700 mt-8 pt-8 text-center text-sm text-flupp-neutral-400">
                <p>&copy; {new Date().getFullYear()} {config.app.name}. All rights reserved.</p>
              </div>
            </div>
          </footer>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}