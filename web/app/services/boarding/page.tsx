'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { providerApi } from '../../../lib/api'
import { formatCurrency, formatDistance } from '../../../lib/utils'

interface Provider {
  id: string
  businessName: string
  ownerName: string
  description: string
  address: {
    street: string
    city: string
    postcode: string
  }
  services: string[]
  pricing: {
    [key: string]: {
      price: number
      unit: string
    }
  }
  rating: number
  reviewCount: number
  distance?: number
  availability: boolean
  images: string[]
  verifications: string[]
}

export default function BoardingProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [petType, setPetType] = useState('')
  const [sortBy, setSortBy] = useState('distance')

  useEffect(() => {
    searchProviders()
  }, [])

  const searchProviders = async () => {
    setLoading(true)
    try {
      const filters = {
        serviceType: 'boarding',
        location,
        startDate: checkIn ? new Date(checkIn) : undefined,
        endDate: checkOut ? new Date(checkOut) : undefined,
        petType,
        sortBy,
      }
      
      const response = await providerApi.search(filters)
      setProviders(response.data || [])
    } catch (error) {
      console.error('Error searching providers:', error)
      // Mock data for development
      setProviders([
        {
          id: '1',
          businessName: 'Cozy Paws Pet Hotel',
          ownerName: 'Sarah Johnson',
          description: 'Family-run pet hotel offering luxury accommodation for your beloved pets. We provide individual suites with daily exercise, professional care, and lots of love.',
          address: {
            street: '123 Oak Tree Lane',
            city: 'London',
            postcode: 'SW15 2AB'
          },
          services: ['boarding', 'daycare', 'walking'],
          pricing: {
            boarding: { price: 3500, unit: 'night' }, // £35.00
            daycare: { price: 2500, unit: 'day' }
          },
          rating: 4.8,
          reviewCount: 127,
          distance: 1.2,
          availability: true,
          images: ['/images/cozy-paws-1.jpg'],
          verifications: ['DBS Checked', 'Insured', 'Licensed']
        },
        {
          id: '2', 
          businessName: 'Happy Tails Boarding',
          ownerName: 'Michael Chen',
          description: 'Modern boarding facility with spacious runs, play areas, and 24/7 monitoring. Perfect for dogs who love to play and socialize.',
          address: {
            street: '456 Green Valley Road',
            city: 'London',
            postcode: 'N12 8LH'
          },
          services: ['boarding', 'grooming', 'training'],
          pricing: {
            boarding: { price: 4200, unit: 'night' }, // £42.00
          },
          rating: 4.6,
          reviewCount: 89,
          distance: 2.8,
          availability: true,
          images: ['/images/happy-tails-1.jpg'],
          verifications: ['DBS Checked', 'Insured', 'Veterinary Approved']
        },
        {
          id: '3',
          businessName: 'Countryside Pet Retreat',
          ownerName: 'Emma Williams',
          description: 'Rural pet boarding with acres of secure countryside for your pets to explore. Ideal for active dogs who love the outdoors.',
          address: {
            street: '789 Country Lane',
            city: 'Surrey',
            postcode: 'GU15 4RT'
          },
          services: ['boarding', 'walking', 'training'],
          pricing: {
            boarding: { price: 3800, unit: 'night' }, // £38.00
          },
          rating: 4.9,
          reviewCount: 156,
          distance: 8.5,
          availability: false,
          images: ['/images/countryside-1.jpg'],
          verifications: ['DBS Checked', 'Insured', 'RSPCA Approved']
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100">
      {/* Header */}
      <div className="bg-flupp-warm text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold mb-4">
              Pet Boarding & Hotels
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Find trusted pet boarding facilities and hotels for overnight stays. 
              All providers are vetted and insured for your peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-flupp-neutral-200/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Location or postcode"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            
            <div>
              <Input
                type="date"
                placeholder="Check-in date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            
            <div>
              <Input
                type="date"
                placeholder="Check-out date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            
            <select
              className="flupp-input"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
            >
              <option value="">All pets</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="rabbit">Rabbits</option>
              <option value="other">Other</option>
            </select>
            
            <select
              className="flupp-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="distance">Distance</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="availability">Availability</option>
            </select>
          </div>
          
          <div className="mt-4 text-center">
            <Button onClick={searchProviders} loading={loading}>
              🔍 Search Boarding Providers
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-fredoka font-semibold text-flupp-neutral-800">
            {providers.length} Boarding Providers Found
          </h2>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flupp-card loading-shimmer h-64"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {providers.map((provider) => (
              <div key={provider.id} className="flupp-card p-6 hover:shadow-warm transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Provider Info */}
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-fredoka font-semibold text-flupp-neutral-800 mb-1">
                          {provider.businessName}
                        </h3>
                        <p className="text-sm text-flupp-neutral-600 mb-2">
                          Owned by {provider.ownerName}
                        </p>
                        <div className="flex items-center mb-2">
                          {renderStars(provider.rating)}
                          <span className="ml-2 text-sm text-flupp-neutral-600">
                            {provider.rating} ({provider.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          provider.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {provider.availability ? 'Available' : 'Fully Booked'}
                        </div>
                        
                        {provider.distance && (
                          <div className="text-sm text-flupp-sage font-medium mt-1">
                            📏 {provider.distance} miles away
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <p className="text-flupp-neutral-700 mb-3">
                      📍 {provider.address.street}, {provider.address.city} {provider.address.postcode}
                    </p>

                    {/* Description */}
                    <p className="text-flupp-neutral-600 text-sm mb-4 leading-relaxed">
                      {provider.description}
                    </p>

                    {/* Services */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.services.map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-flupp-warm-100 text-flupp-warm-700 text-xs rounded-full capitalize"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    {/* Verifications */}
                    <div className="flex flex-wrap gap-2">
                      {provider.verifications.map((verification) => (
                        <span
                          key={verification}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          ✓ {verification}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="lg:col-span-2 lg:border-l lg:border-flupp-neutral-200 lg:pl-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-fredoka font-semibold text-flupp-neutral-800 mb-3">
                        Pricing
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(provider.pricing).map(([service, pricing]) => (
                          <div key={service} className="flex justify-between items-center">
                            <span className="text-sm text-flupp-neutral-600 capitalize">
                              {service} (per {pricing.unit})
                            </span>
                            <span className="font-semibold text-flupp-warm-600">
                              {formatCurrency(pricing.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        disabled={!provider.availability}
                        onClick={() => window.location.href = `/book/boarding/${provider.id}`}
                      >
                        {provider.availability ? '📅 Book Now' : 'Fully Booked'}
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/providers/${provider.id}`}
                        >
                          👁️ View Profile
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/providers/${provider.id}/reviews`}
                        >
                          ⭐ Read Reviews
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-flupp-warm-50 border border-flupp-warm-200 rounded-flupp p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">🏠</div>
            <div>
              <h3 className="text-lg font-fredoka font-semibold text-flupp-warm-800 mb-2">
                About Pet Boarding
              </h3>
              <p className="text-flupp-warm-700 leading-relaxed">
                All boarding providers on Flupp are thoroughly vetted with background checks, insurance verification, 
                and facility inspections. Your payment is held securely until service completion. 
                Book with confidence knowing your pet will receive professional care in a safe environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}