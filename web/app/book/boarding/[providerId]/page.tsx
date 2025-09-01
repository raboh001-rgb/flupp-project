'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema, type Booking } from '../../../../lib/schemas'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input' 
import { StripeProvider } from '../../../../components/payment/StripeProvider'
import { PaymentForm } from '../../../../components/payment/PaymentForm'
import { createPaymentIntent } from '../../../../lib/stripe'
import { formatCurrency, formatDate } from '../../../../lib/utils'

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
  pricing: {
    boarding: {
      price: number
      unit: string
    }
  }
  rating: number
  reviewCount: number
  images: string[]
}

interface BookingFormData {
  petName: string
  petSpecies: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other'
  petAge: number
  petWeight: number
  startDate: string
  endDate: string
  specialRequests?: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
}

export default function BookingPage({ params }: { params: { providerId: string } }) {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'booking' | 'payment' | 'confirmation'>('booking')
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null)
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [numberOfNights, setNumberOfNights] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema.omit({
      serviceType: true,
      providerId: true,
      petId: true,
      emergencyContact: true,
    }).extend({
      petName: bookingSchema.shape.petId,
      petSpecies: bookingSchema.shape.petId,
      petAge: bookingSchema.shape.petId,
      petWeight: bookingSchema.shape.petId,
      emergencyContactName: bookingSchema.shape.emergencyContact.shape.name,
      emergencyContactPhone: bookingSchema.shape.emergencyContact.shape.phone,
      emergencyContactRelationship: bookingSchema.shape.emergencyContact.shape.relationship,
    }))
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  useEffect(() => {
    // Mock provider data - in real app, fetch from API
    setProvider({
      id: params.providerId,
      businessName: 'Cozy Paws Pet Hotel',
      ownerName: 'Sarah Johnson',
      description: 'Family-run pet hotel offering luxury accommodation for your beloved pets.',
      address: {
        street: '123 Oak Tree Lane',
        city: 'London',
        postcode: 'SW15 2AB'
      },
      pricing: {
        boarding: { price: 3500, unit: 'night' }
      },
      rating: 4.8,
      reviewCount: 127,
      images: ['/images/cozy-paws-1.jpg']
    })
    setLoading(false)
  }, [params.providerId])

  useEffect(() => {
    if (startDate && endDate && provider) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      setNumberOfNights(nights)
      setTotalAmount(nights * provider.pricing.boarding.price)
    }
  }, [startDate, endDate, provider])

  const onBookingSubmit = async (data: BookingFormData) => {
    setBookingData(data)
    
    try {
      const intent = await createPaymentIntent({
        amount: totalAmount,
        bookingId: `booking_${Date.now()}`,
        metadata: {
          providerId: params.providerId,
          providerName: provider?.businessName || '',
          petName: data.petName,
          startDate,
          endDate,
          numberOfNights: numberOfNights.toString(),
        }
      })
      
      setPaymentIntent(intent)
      setStep('payment')
    } catch (error) {
      console.error('Error creating payment intent:', error)
      alert('Error processing booking. Please try again.')
    }
  }

  const onPaymentSuccess = (paymentIntent: any) => {
    setStep('confirmation')
  }

  const onPaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100 flex items-center justify-center">
        <div className="flupp-card p-8 text-center loading-shimmer">
          <div className="text-4xl mb-4">🏠</div>
          <div>Loading provider details...</div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100 flex items-center justify-center">
        <div className="flupp-card p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <div>Provider not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flupp-neutral-50 to-flupp-neutral-100">
      {/* Header */}
      <div className="bg-flupp-warm text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">
              Book with {provider.businessName}
            </h1>
            <p className="text-white/90">
              Complete your booking in just a few simple steps
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step === 'booking' ? 'text-flupp-sage' : 'text-flupp-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'booking' ? 'bg-flupp-sage text-white' : 'bg-flupp-neutral-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Booking Details</span>
            </div>
            
            <div className={`flex items-center ${step === 'payment' ? 'text-flupp-sage' : 'text-flupp-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'payment' ? 'bg-flupp-sage text-white' : 'bg-flupp-neutral-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            
            <div className={`flex items-center ${step === 'confirmation' ? 'text-flupp-sage' : 'text-flupp-neutral-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'confirmation' ? 'bg-flupp-sage text-white' : 'bg-flupp-neutral-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'booking' && (
              <div className="flupp-card p-6">
                <h2 className="text-xl font-fredoka font-semibold mb-6">Booking Details</h2>
                
                <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Pet Name"
                      {...register('petName')}
                      error={errors.petName?.message}
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-flupp-neutral-700 mb-2">
                        Pet Species <span className="text-red-500">*</span>
                      </label>
                      <select {...register('petSpecies')} className="flupp-input">
                        <option value="">Select species</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="rabbit">Rabbit</option>
                        <option value="bird">Bird</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.petSpecies && (
                        <p className="mt-1 text-sm text-red-600">{errors.petSpecies.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Pet Age (years)"
                      type="number"
                      {...register('petAge', { valueAsNumber: true })}
                      error={errors.petAge?.message}
                      required
                    />
                    
                    <Input
                      label="Pet Weight (kg)"
                      type="number"
                      step="0.1"
                      {...register('petWeight', { valueAsNumber: true })}
                      error={errors.petWeight?.message}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Check-in Date"
                      type="date"
                      {...register('startDate')}
                      error={errors.startDate?.message}
                      required
                    />
                    
                    <Input
                      label="Check-out Date"
                      type="date"
                      {...register('endDate')}
                      error={errors.endDate?.message}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-flupp-neutral-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      {...register('specialRequests')}
                      rows={3}
                      className="flupp-input resize-none"
                      placeholder="Any special care instructions or requests..."
                    />
                  </div>

                  <div className="border-t border-flupp-neutral-200 pt-6">
                    <h3 className="text-lg font-fredoka font-semibold mb-4">Emergency Contact</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Contact Name"
                        {...register('emergencyContactName')}
                        error={errors.emergencyContactName?.message}
                        required
                      />
                      
                      <Input
                        label="Phone Number"
                        type="tel"
                        {...register('emergencyContactPhone')}
                        error={errors.emergencyContactPhone?.message}
                        required
                      />
                    </div>
                    
                    <Input
                      label="Relationship to You"
                      {...register('emergencyContactRelationship')}
                      error={errors.emergencyContactRelationship?.message}
                      placeholder="e.g., Spouse, Parent, Friend"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === 'payment' && paymentIntent && (
              <StripeProvider clientSecret={paymentIntent.client_secret}>
                <PaymentForm
                  amount={totalAmount}
                  onSuccess={onPaymentSuccess}
                  onError={onPaymentError}
                  customerInfo={{
                    name: `${bookingData?.emergencyContactName}`,
                    phone: bookingData?.emergencyContactPhone,
                  }}
                />
              </StripeProvider>
            )}

            {step === 'confirmation' && (
              <div className="flupp-card p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-fredoka font-bold text-flupp-sage mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-flupp-neutral-600 mb-6">
                  Your booking with {provider.businessName} has been confirmed. 
                  You'll receive a confirmation email shortly.
                </p>
                <div className="space-y-3">
                  <Button onClick={() => window.location.href = '/dashboard/bookings'}>
                    View My Bookings
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Back to Home
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="flupp-card p-6 sticky top-8">
              <h3 className="text-lg font-fredoka font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🏠</div>
                  <div>
                    <div className="font-medium text-flupp-neutral-800">{provider.businessName}</div>
                    <div className="text-sm text-flupp-neutral-600">{provider.address.city}</div>
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="border-t border-flupp-neutral-200 pt-4">
                    <div className="text-sm text-flupp-neutral-600 mb-2">Dates</div>
                    <div className="font-medium">
                      {formatDate(new Date(startDate))} - {formatDate(new Date(endDate))}
                    </div>
                    <div className="text-sm text-flupp-neutral-600">
                      {numberOfNights} night{numberOfNights !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                {numberOfNights > 0 && (
                  <div className="border-t border-flupp-neutral-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-flupp-neutral-600">
                        {numberOfNights} night{numberOfNights !== 1 ? 's' : ''} × {formatCurrency(provider.pricing.boarding.price)}
                      </span>
                      <span className="font-medium">{formatCurrency(totalAmount)}</span>
                    </div>
                    
                    <div className="border-t border-flupp-neutral-200 pt-2 flex justify-between items-center">
                      <span className="font-semibold text-flupp-neutral-800">Total</span>
                      <span className="text-xl font-bold text-flupp-sage">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="border-t border-flupp-neutral-200 pt-4 text-xs text-flupp-neutral-500">
                  <div className="flex items-center mb-2">
                    <span className="mr-1">🛡️</span>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="mr-1">↩️</span>
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">⭐</span>
                    <span>Quality guaranteed by Flupp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}