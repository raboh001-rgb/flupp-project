'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { veterinaryApi } from '../../lib/api'
import { formatDistance } from '../../lib/utils'

interface VetPractice {
  id: string
  name: string
  address: {
    street: string
    city: string
    postcode: string
    country: string
  }
  phone: string
  email?: string
  website?: string
  description: string
  specialties: string[]
  services: string[]
  emergencyServices: boolean
  rating: number
  reviewCount: number
  distance?: number
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed?: boolean
    }
  }
}

export default function VeterinaryDirectory() {
  const [practices, setPractices] = useState<VetPractice[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)

  const specialties = [
    'General Practice',
    'Emergency & Critical Care', 
    'Surgery',
    'Dermatology',
    'Cardiology',
    'Oncology',
    'Orthopedics',
    'Ophthalmology',
    'Dentistry',
    'Exotic Animals',
    'Large Animals',
    'Behavioral Medicine'
  ]

  useEffect(() => {
    searchVets()
  }, [])

  const searchVets = async () => {
    setLoading(true)
    try {
      const filters = {
        location,
        specialty: selectedSpecialty,
        emergencyServices: emergencyOnly,
      }
      
      const response = await veterinaryApi.search(filters)
      setPractices(response.data || [])
    } catch (error) {
      console.error('Error searching veterinary practices:', error)
      // Mock data for development
      setPractices([
        {
          id: '1',
          name: 'City Centre Veterinary Practice',
          address: {
            street: '123 High Street',
            city: 'London',
            postcode: 'SW1A 1AA',
            country: 'United Kingdom'
          },
          phone: '020 7946 0958',
          email: 'info@cityvets.co.uk',
          website: 'https://cityvets.co.uk',
          description: 'A modern veterinary practice offering comprehensive pet care services with state-of-the-art facilities.',
          specialties: ['General Practice', 'Surgery', 'Dentistry'],
          services: ['Vaccinations', 'Health Checks', 'Surgery', 'Dental Care', 'Microchipping'],
          emergencyServices: true,
          rating: 4.8,
          reviewCount: 127,
          distance: 1.2,
          openingHours: {
            monday: { open: '08:00', close: '18:00' },
            tuesday: { open: '08:00', close: '18:00' },
            wednesday: { open: '08:00', close: '18:00' },
            thursday: { open: '08:00', close: '18:00' },
            friday: { open: '08:00', close: '18:00' },
            saturday: { open: '09:00', close: '16:00' },
            sunday: { open: '10:00', close: '14:00' }
          }
        },
        {
          id: '2',
          name: 'Parkside Animal Hospital',
          address: {
            street: '456 Park Road',
            city: 'Manchester',
            postcode: 'M1 4FG',
            country: 'United Kingdom'
          },
          phone: '0161 234 5678',
          email: 'reception@parksideah.co.uk',
          description: 'Specialist animal hospital providing emergency care and advanced treatments for all types of pets.',
          specialties: ['Emergency & Critical Care', 'Surgery', 'Cardiology'],
          services: ['24/7 Emergency Care', 'Specialist Surgery', 'Diagnostic Imaging', 'Intensive Care'],
          emergencyServices: true,
          rating: 4.6,
          reviewCount: 89,
          distance: 2.8,
          openingHours: {
            monday: { open: '24/7', close: '24/7' },
            tuesday: { open: '24/7', close: '24/7' },
            wednesday: { open: '24/7', close: '24/7' },
            thursday: { open: '24/7', close: '24/7' },
            friday: { open: '24/7', close: '24/7' },
            saturday: { open: '24/7', close: '24/7' },
            sunday: { open: '24/7', close: '24/7' }
          }
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

  const formatOpeningHours = (hours: any, day: string) => {
    const dayHours = hours[day.toLowerCase()]
    if (!dayHours || dayHours.closed) return 'Closed'
    if (dayHours.open === '24/7') return '24/7'
    return `${dayHours.open} - ${dayHours.close}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100">
      {/* Header */}
      <div className="bg-flupp-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold mb-4">
              Find a Veterinary Practice
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover trusted veterinary practices and animal hospitals near you. 
              Find contact details, specialties, and opening hours - no booking required.
            </p>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-flupp-neutral-200/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search practices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Input
              placeholder="Location or postcode"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            
            <select
              className="flupp-input"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="mr-2 text-flupp-sage focus:ring-flupp-sage"
                />
                <span className="text-sm text-flupp-neutral-700">Emergency services only</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button onClick={searchVets} loading={loading}>
              🔍 Search Veterinary Practices
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-fredoka font-semibold text-flupp-neutral-800">
            {practices.length} Practices Found
          </h2>
          <div className="text-sm text-flupp-neutral-600">
            🩺 Directory service - Contact practices directly
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flupp-card loading-shimmer h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practices.map((practice) => (
              <div key={practice.id} className="flupp-card p-6 hover:shadow-flupp-lg transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-fredoka font-semibold text-flupp-neutral-800 mb-2">
                      {practice.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      {renderStars(practice.rating)}
                      <span className="ml-2 text-sm text-flupp-neutral-600">
                        {practice.rating} ({practice.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {practice.emergencyServices && (
                    <div className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      24/7 Emergency
                    </div>
                  )}
                </div>

                {/* Address & Distance */}
                <div className="mb-4">
                  <p className="text-flupp-neutral-700 mb-1">
                    📍 {practice.address.street}, {practice.address.city} {practice.address.postcode}
                  </p>
                  {practice.distance && (
                    <p className="text-sm text-flupp-sage font-medium">
                      📏 {practice.distance} miles away
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-flupp-neutral-600 text-sm mb-4 leading-relaxed">
                  {practice.description}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {practice.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-flupp-teal-100 text-flupp-teal-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-flupp-neutral-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-flupp-neutral-800 mb-1">
                        📞 Contact
                      </p>
                      <p className="text-sm text-flupp-neutral-600 mb-1">
                        {practice.phone}
                      </p>
                      {practice.email && (
                        <p className="text-sm text-flupp-sage">
                          {practice.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-flupp-neutral-800 mb-1">
                        🕐 Today's Hours
                      </p>
                      <p className="text-sm text-flupp-neutral-600">
                        {formatOpeningHours(practice.openingHours, 'monday')}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <a
                      href={`tel:${practice.phone}`}
                      className="flex-1 flupp-button-primary text-sm text-center"
                    >
                      📞 Call Practice
                    </a>
                    
                    {practice.website && (
                      <a
                        href={practice.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flupp-button-outline text-sm text-center"
                      >
                        🌐 Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-flupp-teal-50 border border-flupp-teal-200 rounded-flupp p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">ℹ️</div>
            <div>
              <h3 className="text-lg font-fredoka font-semibold text-flupp-teal-800 mb-2">
                About Our Veterinary Directory
              </h3>
              <p className="text-flupp-teal-700 leading-relaxed">
                Our veterinary directory helps you find local veterinary practices and animal hospitals. 
                This is a directory service only - we do not provide booking functionality. 
                Please contact practices directly to schedule appointments or emergency care.
                All practices listed are independent businesses and are not affiliated with Flupp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}