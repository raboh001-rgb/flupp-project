'use client'

import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '../../lib/stripe'

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const stripePromise = getStripe()

  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6B8E5A', // flupp-sage
        colorBackground: '#ffffff',
        colorText: '#1c1917', // flupp-neutral-900
        colorDanger: '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '16px', // flupp rounded
      },
      rules: {
        '.Input': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          border: '1px solid #d6d3d1', // flupp-neutral-300
        },
        '.Input:focus': {
          border: '1px solid #6B8E5A', // flupp-sage
          boxShadow: '0 0 0 2px rgba(107, 142, 90, 0.2)',
        },
        '.Label': {
          fontWeight: '500',
          color: '#44403c', // flupp-neutral-700
        },
        '.Tab': {
          backgroundColor: '#f5f5f4', // flupp-neutral-100
          border: '1px solid #e7e5e4', // flupp-neutral-200
          borderRadius: '16px',
        },
        '.Tab--selected': {
          backgroundColor: '#6B8E5A', // flupp-sage
          color: '#ffffff',
        },
        '.Error': {
          color: '#dc2626',
        }
      }
    }
  } : undefined

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}