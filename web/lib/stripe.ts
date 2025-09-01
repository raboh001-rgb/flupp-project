import { loadStripe, Stripe } from '@stripe/stripe-js'
import { config } from './config'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(config.stripe.publishableKey)
  }
  return stripePromise
}

export interface PaymentIntentData {
  amount: number
  currency?: string
  bookingId?: string
  listingId?: string
  metadata?: Record<string, string>
}

export interface PaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
}

export const createPaymentIntent = async (data: PaymentIntentData): Promise<PaymentIntent> => {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: data.amount,
      currency: data.currency || 'gbp',
      bookingId: data.bookingId,
      listingId: data.listingId,
      metadata: data.metadata,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create payment intent')
  }

  return response.json()
}

export const confirmPayment = async (
  stripe: Stripe,
  clientSecret: string,
  paymentMethod: {
    card: any
    billing_details?: {
      name?: string
      email?: string
      phone?: string
      address?: {
        line1?: string
        line2?: string
        city?: string
        postal_code?: string
        country?: string
      }
    }
  }
) => {
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod,
  })

  return { error, paymentIntent }
}

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  const response = await fetch(`/api/payments/${paymentIntentId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Failed to retrieve payment intent')
  }

  return response.json()
}