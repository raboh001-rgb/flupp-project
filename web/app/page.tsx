import { getServiceIcon } from '../lib/utils'

export default function Home() {
  const services = [
    {
      id: 'boarding',
      title: 'Pet Boarding & Hotels',
      description: 'Find trusted boarding facilities and pet hotels for overnight stays',
      icon: '🏠',
      href: '/services/boarding',
      color: 'warm',
      features: ['Overnight stays', 'Daily walks', '24/7 care'],
      bookable: true,
    },
    {
      id: 'grooming',
      title: 'Grooming & Care',
      description: 'Professional grooming, bathing, nail trimming, and beauty services',
      icon: '✂️',
      href: '/services/grooming', 
      color: 'cool',
      features: ['Full grooming', 'Nail care', 'Bathing'],
      bookable: true,
    },
    {
      id: 'daycare',
      title: 'Daycare & Training',
      description: 'Day care services and professional training programs',
      icon: '🏃',
      href: '/services/daycare',
      color: 'purple', 
      features: ['Daily care', 'Socialization', 'Training'],
      bookable: true,
    },
    {
      id: 'veterinary',
      title: 'Veterinary Services',
      description: 'Find local veterinary practices and animal hospitals',
      icon: '🩺',
      href: '/veterinary',
      color: 'flupp',
      features: ['Local vets', 'Specialists', 'Emergency care'],
      bookable: false,
    },
    {
      id: 'marketplace',
      title: 'Second-Hand Marketplace',
      description: 'Buy and sell quality second-hand pet items and accessories',
      icon: '🛍️',
      href: '/marketplace',
      color: 'purple',
      features: ['Buy & sell', 'Quality items', 'Great prices'],
      bookable: false,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-fredoka font-bold mb-6 bg-flupp-gradient bg-clip-text text-transparent">
              Everything your pet needs, all in one place
            </h1>
            <p className="text-xl text-flupp-neutral-600 mb-8 max-w-3xl mx-auto">
              Discover trusted pet services, find local veterinary practices, and shop second-hand pet items across the UK.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="flupp-button-primary text-lg px-8 py-4">
                Find Services Near You
              </button>
              <button className="flupp-button-outline text-lg px-8 py-4">
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating pet emojis */}
        <div className="absolute top-20 left-10 text-4xl animate-float">🐕</div>
        <div className="absolute top-40 right-16 text-3xl animate-bounce-slow">🐱</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-float" style={{animationDelay: '1s'}}>🐰</div>
        <div className="absolute bottom-32 right-10 text-2xl animate-bounce-slow" style={{animationDelay: '2s'}}>🦜</div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-flupp-neutral-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-flupp-neutral-600 max-w-2xl mx-auto">
              From booking trusted pet services to finding veterinary care and shopping second-hand items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service, index) => (
              <a 
                key={service.id}
                href={service.href}
                className={`service-card service-card-${service.id} animate-slide-up`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-4 animate-bounce-gentle">
                  {service.icon}
                </div>
                <h3 className="text-xl font-fredoka font-semibold mb-2 text-flupp-neutral-800">
                  {service.title}
                </h3>
                <p className="text-flupp-neutral-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature) => (
                    <span 
                      key={feature}
                      className="px-3 py-1 bg-flupp-neutral-100 text-flupp-neutral-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium text-flupp-${service.color}-600`}>
                    {service.bookable ? 'Book Now' : 'Find & Contact'}
                  </span>
                  <svg 
                    className="w-5 h-5 text-flupp-neutral-400 group-hover:text-flupp-sage transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-flupp-sage/10 to-flupp-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-flupp-neutral-800 mb-4">
              Why Choose Flupp?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-fredoka font-semibold mb-2">Trusted & Vetted</h3>
              <p className="text-flupp-neutral-600">
                All service providers are thoroughly vetted with insurance and background checks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-fredoka font-semibold mb-2">Secure Payments</h3>
              <p className="text-flupp-neutral-600">
                Safe and secure payment processing with full buyer and seller protection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-fredoka font-semibold mb-2">Local Services</h3>
              <p className="text-flupp-neutral-600">
                Find services and shops right in your neighborhood across the UK.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-flupp-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-fredoka font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of pet owners who trust Flupp for their pet care needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-flupp-sage font-semibold px-8 py-4 rounded-flupp hover:bg-flupp-neutral-50 transition-colors">
              Browse Services
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-flupp hover:bg-white/10 transition-colors">
              Become a Provider
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
