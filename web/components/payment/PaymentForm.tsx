'use client'

import { useState, useEffect } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../lib/utils'

interface PaymentFormProps {
  amount: number
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: string) => void
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
  }
}

export function PaymentForm({
  amount,
  onSuccess,
  onError,
  customerInfo,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          onSuccess?.(paymentIntent)
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe, onSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
        payment_method_data: {
          billing_details: {
            name: customerInfo?.name,
            email: customerInfo?.email,
            phone: customerInfo?.phone,
          },
        },
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Payment failed')
        onError?.(error.message || 'Payment failed')
      } else {
        setMessage('An unexpected error occurred.')
        onError?.('An unexpected error occurred.')
      }
    } else {
      // Payment succeeded - this will be handled by the redirect
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: 'tabs' as const,
  }

  return (
    <div className="flupp-card p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-fredoka font-semibold text-flupp-neutral-800 mb-2">
          Complete Your Payment
        </h3>
        <div className="text-2xl font-bold text-flupp-sage">
          {formatCurrency(amount)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <PaymentElement options={paymentElementOptions} />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-flupp-neutral-700 mb-3">
            Billing Address
          </h4>
          <AddressElement
            options={{
              mode: 'billing',
              allowedCountries: ['GB'],
              autocomplete: {
                mode: 'automatic',
              },
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
        </Button>

        {message && (
          <div className={`mt-4 p-3 rounded-flupp text-sm ${
            message.includes('succeeded') 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-6 text-xs text-flupp-neutral-500 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span>🔒</span>
          <span>Payments secured by Stripe</span>
        </div>
        <p>
          Your payment information is encrypted and secure. 
          We never store your card details.
        </p>
      </div>
    </div>
  )
}