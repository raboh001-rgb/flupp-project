'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { marketplaceApi } from '../../lib/api'
import { formatCurrency, formatDistance } from '../../lib/utils'

interface MarketplaceListing {
  id: string
  title: string
  description: string
  category: string
  condition: string
  price: number
  images: string[]
  seller: {
    id: string
    name: string
    rating: number
    reviewCount: number
  }
  location: {
    city: string
    postcode: string
  }
  distance?: number
  createdAt: string
  deliveryOptions: {
    collection: boolean
    localDelivery: boolean
    postage: boolean
    deliveryFee?: number
  }
}

export default function Marketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const categories = [
    'Food & Treats',
    'Toys & Enrichment', 
    'Beds & Comfort',
    'Carriers & Travel',
    'Grooming & Health',
    'Training & Behavior',
    'Accessories',
    'Other'
  ]

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair', 
    'Poor'
  ]

  useEffect(() => {
    searchListings()
  }, [])

  const searchListings = async () => {
    setLoading(true)
    try {
      const filters = {
        query: searchQuery,
        category: category.toLowerCase().replace(/\s+/g, '-'),
        condition: condition.toLowerCase().replace(/\s+/g, '-'),
        location,
        priceRange: maxPrice ? { max: parseFloat(maxPrice) * 100 } : undefined,
        sortBy,
      }
      
      const response = await marketplaceApi.getListings(filters)
      setListings(response.data || [])
    } catch (error) {
      console.error('Error searching marketplace:', error)
      // Mock data for development
      setListings([
        {
          id: '1',
          title: 'Large Dog Bed - Orthopedic Memory Foam',
          description: 'Excellent condition orthopedic dog bed, perfect for large dogs. Machine washable cover, barely used. Great for joint support.',
          category: 'beds',
          condition: 'like-new',
          price: 3500, // £35.00
          images: ['/images/dog-bed-1.jpg'],
          seller: {
            id: 'seller1',
            name: 'Sarah M.',
            rating: 4.8,
            reviewCount: 23
          },
          location: {
            city: 'London',
            postcode: 'SW15'
          },
          distance: 1.2,
          createdAt: '2024-01-15T10:00:00Z',
          deliveryOptions: {
            collection: true,
            localDelivery: true,
            postage: false,
            deliveryFee: 5.00
          }
        },
        {
          id: '2',
          title: 'Interactive Puzzle Feeder for Cats',
          description: 'Slow feeder puzzle toy to keep cats mentally stimulated during meal times. Helps prevent overeating and boredom.',
          category: 'toys',
          condition: 'good',
          price: 1200, // £12.00
          images: ['/images/cat-puzzle-1.jpg'],
          seller: {
            id: 'seller2',
            name: 'Mike K.',
            rating: 4.9,
            reviewCount: 45
          },
          location: {
            city: 'Manchester',
            postcode: 'M1'
          },
          distance: 2.8,
          createdAt: '2024-01-14T15:30:00Z',
          deliveryOptions: {
            collection: true,
            localDelivery: false,
            postage: true,
          }
        },
        {
          id: '3',
          title: 'Premium Dog Food - Natural & Organic 15kg',
          description: 'Unopened bag of premium natural dog food. Best before date is 6 months away. Suitable for adult dogs all sizes.',
          category: 'food',
          condition: 'new',
          price: 4500, // £45.00
          images: ['/images/dog-food-1.jpg'],
          seller: {
            id: 'seller3',
            name: 'Emma W.',
            rating: 4.7,
            reviewCount: 12
          },
          location: {
            city: 'Birmingham',
            postcode: 'B1'
          },
          distance: 5.2,
          createdAt: '2024-01-13T09:15:00Z',
          deliveryOptions: {
            collection: true,
            localDelivery: true,
            postage: true,
            deliveryFee: 8.00
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getConditionColor = (condition: string) => {
    const colors = {
      'new': 'bg-green-100 text-green-800',
      'like-new': 'bg-emerald-100 text-emerald-800',
      'good': 'bg-blue-100 text-blue-800',
      'fair': 'bg-yellow-100 text-yellow-800',
      'poor': 'bg-red-100 text-red-800'
    }
    return colors[condition.toLowerCase().replace(/\s+/g, '-')] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100">
      {/* Header */}
      <div className="bg-flupp-purple text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold mb-4">
              Pet Marketplace
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Buy and sell quality second-hand pet items with secure payments and buyer protection. 
              Find great deals on everything your pet needs.
            </p>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-flupp-neutral-200/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="flupp-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            
            <select
              className="flupp-input"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Any condition</option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
            
            <Input
              placeholder="Max price £"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              min="0"
              step="0.50"
            />
            
            <select
              className="flupp-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="distance">Distance</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              placeholder="Location or postcode"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="sm:max-w-xs"
            />
            
            <Button onClick={searchListings} loading={loading}>
              🔍 Search Items
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/marketplace/sell'}
            >
              💰 Sell Your Items
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-fredoka font-semibold text-flupp-neutral-800">
            {listings.length} Items Found
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flupp-card loading-shimmer h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flupp-card overflow-hidden hover:shadow-purple transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/marketplace/item/${listing.id}`}
              >
                {/* Image */}
                <div className="h-48 bg-flupp-neutral-200 bg-cover bg-center relative">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                  
                  {/* Condition Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(listing.condition)}`}>
                    {listing.condition}
                  </div>
                  
                  {/* Date */}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {formatDate(listing.createdAt)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-flupp-neutral-800 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  <p className="text-sm text-flupp-neutral-600 mb-3 line-clamp-3">
                    {listing.description}
                  </p>

                  {/* Price */}
                  <div className="text-xl font-bold text-flupp-purple-600 mb-3">
                    {formatCurrency(listing.price)}
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-flupp-gradient rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                        {listing.seller.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-flupp-neutral-800">
                          {listing.seller.name}
                        </div>
                        <div className="flex items-center">
                          {renderStars(listing.seller.rating)}
                          <span className="text-xs text-flupp-neutral-500 ml-1">
                            ({listing.seller.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Distance */}
                  <div className="flex items-center justify-between text-sm text-flupp-neutral-600 mb-3">
                    <span>📍 {listing.location.city}</span>
                    {listing.distance && (
                      <span>📏 {listing.distance} miles</span>
                    )}
                  </div>

                  {/* Delivery Options */}
                  <div className="flex flex-wrap gap-1 text-xs">
                    {listing.deliveryOptions.collection && (
                      <span className="px-2 py-1 bg-flupp-neutral-100 text-flupp-neutral-700 rounded">
                        Collection
                      </span>
                    )}
                    {listing.deliveryOptions.localDelivery && (
                      <span className="px-2 py-1 bg-flupp-neutral-100 text-flupp-neutral-700 rounded">
                        Delivery
                      </span>
                    )}
                    {listing.deliveryOptions.postage && (
                      <span className="px-2 py-1 bg-flupp-neutral-100 text-flupp-neutral-700 rounded">
                        Post
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* How It Works */}
          <div className="bg-flupp-purple-50 border border-flupp-purple-200 rounded-flupp p-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">🛍️</div>
              <div>
                <h3 className="text-lg font-fredoka font-semibold text-flupp-purple-800 mb-2">
                  How Our Marketplace Works
                </h3>
                <ul className="text-sm text-flupp-purple-700 space-y-1">
                  <li>• Browse quality second-hand pet items</li>
                  <li>• Secure payment processing with buyer protection</li>
                  <li>• Meet sellers locally or arrange delivery/postage</li>
                  <li>• Rate your experience to help the community</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-flupp-warm-50 border border-flupp-warm-200 rounded-flupp p-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">🛡️</div>
              <div>
                <h3 className="text-lg font-fredoka font-semibold text-flupp-warm-800 mb-2">
                  Safety & Security
                </h3>
                <ul className="text-sm text-flupp-warm-700 space-y-1">
                  <li>• All payments processed securely through Flupp</li>
                  <li>• Meet in safe, public locations for collection</li>
                  <li>• Inspect items before completing purchase</li>
                  <li>• Report any issues through our support system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}