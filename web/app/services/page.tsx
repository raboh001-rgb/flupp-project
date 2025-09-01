'use client'

import { getServiceIcon, getServiceColor } from '../../lib/utils'

export default function ServicesOverview() {
  const services = [
    {
      id: 'boarding',
      title: 'Pet Boarding & Hotels',
      description: 'Professional overnight care for your pets when you\'re away',
      icon: '🏠',
      color: 'warm',
      features: [
        'Overnight & multi-day stays',
        'Daily walks and exercise',
        '24/7 supervision and care',
        'Individual or group accommodation',
        'Regular updates and photos',
        'Special dietary requirements'
      ],
      pricing: 'From £25-50 per night',
      href: '/services/boarding'
    },
    {
      id: 'grooming',
      title: 'Grooming & Care',
      description: 'Professional grooming services to keep your pets looking their best',
      icon: '✂️',
      color: 'cool',
      features: [
        'Full grooming packages',
        'Nail trimming and care',
        'Professional bathing',
        'Coat styling and brushing',
        'Teeth cleaning',
        'Flea and tick treatments'
      ],
      pricing: 'From £30-80 per session',
      href: '/services/grooming'
    },
    {
      id: 'daycare',
      title: 'Daycare & Training',
      description: 'Daytime care and professional training services',
      icon: '🏃',
      color: 'purple',
      features: [
        'Daily daycare services',
        'Socialization activities',
        'Obedience training',
        'Puppy training classes',
        'Behavioral consultations',
        'Exercise and play sessions'
      ],
      pricing: 'From £20-40 per day',
      href: '/services/daycare'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100">
      {/* Header */}
      <div className="bg-flupp-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold mb-4">
              Pet Services
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Book trusted pet care services from vetted providers across the UK. 
              All bookings include secure payments and service guarantees.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`service-card service-card-${service.id} p-8 animate-slide-up`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Service Icon */}
              <div className="text-6xl mb-6 text-center animate-bounce-gentle">
                {service.icon}
              </div>

              {/* Service Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-fredoka font-bold text-flupp-neutral-800 mb-3">
                  {service.title}
                </h2>
                <p className="text-flupp-neutral-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className={`text-lg font-semibold text-flupp-${service.color}-600`}>
                  {service.pricing}
                </div>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-flupp-neutral-800 mb-3 uppercase tracking-wide">
                  What's Included:
                </h3>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-flupp-neutral-600">
                      <span className="text-flupp-sage mr-2 text-xs">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <a 
                  href={service.href}
                  className={`flupp-button-primary w-full block shadow-${service.color}`}
                >
                  Find {service.title.split(' ')[0]} Providers
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-flupp-neutral-800 mb-4">
              How Flupp Services Work
            </h2>
            <p className="text-lg text-flupp-neutral-600 max-w-2xl mx-auto">
              Simple, secure, and trusted pet care booking in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-fredoka font-semibold mb-2 text-flupp-neutral-800">
                Search & Compare
              </h3>
              <p className="text-flupp-neutral-600 text-sm">
                Find and compare vetted service providers in your area based on location, services, and reviews.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-fredoka font-semibold mb-2 text-flupp-neutral-800">
                Book & Pay Securely
              </h3>
              <p className="text-flupp-neutral-600 text-sm">
                Choose your dates, add your pet details, and pay securely online. Your payment is protected.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-fredoka font-semibold mb-2 text-flupp-neutral-800">
                Enjoy the Service
              </h3>
              <p className="text-flupp-neutral-600 text-sm">
                Your pet receives professional care from vetted providers. Get updates and photos during the service.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-flupp-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">4</span>
              </div>
              <h3 className="text-lg font-fredoka font-semibold mb-2 text-flupp-neutral-800">
                Rate & Review
              </h3>
              <p className="text-flupp-neutral-600 text-sm">
                Leave a review to help other pet owners find the best services in the community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-flupp-neutral-800 mb-4">
              Trust & Safety
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flupp-card p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-fredoka font-semibold mb-2">Vetted Providers</h3>
              <p className="text-flupp-neutral-600 text-sm">
                All service providers undergo thorough background checks, insurance verification, and professional vetting.
              </p>
            </div>

            <div className="flupp-card p-6 text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-lg font-fredoka font-semibold mb-2">Secure Payments</h3>
              <p className="text-flupp-neutral-600 text-sm">
                Your payments are processed securely and held until service completion for your protection.
              </p>
            </div>

            <div className="flupp-card p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-fredoka font-semibold mb-2">Reviewed Services</h3>
              <p className="text-flupp-neutral-600 text-sm">
                Read genuine reviews from other pet owners to make informed decisions about care providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-flupp-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-fredoka font-bold mb-4">
            Ready to Book Pet Care?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Find trusted pet care providers in your area and book with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/services/boarding"
              className="bg-white text-flupp-sage font-semibold px-8 py-4 rounded-flupp hover:bg-flupp-neutral-50 transition-colors"
            >
              Find Boarding
            </a>
            <a 
              href="/services/grooming"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-flupp hover:bg-white/10 transition-colors"
            >
              Find Grooming
            </a>
            <a 
              href="/services/daycare"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-flupp hover:bg-white/10 transition-colors"
            >
              Find Daycare
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}