"use client";

import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import StripeProvider from "@/components/StripeProvider";
import { PaymentErrorBoundary } from "../../../components/ErrorBoundary";
import { config } from "../../../lib/config";
import { getErrorMessage } from "../../../lib/utils";

interface BookingDetails {
  id: string;
  petName: string;
  serviceType: string;
  priceCents: number;
  currency: string;
  status: string;
}

function PayInner({ id }: { id: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input sanitization for booking ID
  const sanitizedId = id?.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);

  useEffect(() => {
    if (!sanitizedId) {
      setError("Invalid booking ID");
      setIsLoading(false);
      return;
    }

    loadBookingAndPaymentIntent();
  }, [sanitizedId]);

  const loadBookingAndPaymentIntent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = config.api.baseUrl || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8787";
      
      // First, fetch booking details
      const bookingResponse = await fetch(`${apiUrl}/api/bookings/${encodeURIComponent(sanitizedId)}`, {
        headers: { "Accept": "application/json" }
      });
      
      if (!bookingResponse.ok) {
        if (bookingResponse.status === 404) {
          throw new Error("Booking not found");
        }
        throw new Error(`Failed to load booking: ${bookingResponse.status}`);
      }

      const bookingData = await bookingResponse.json();
      setBooking(bookingData);

      // Check if booking is already paid
      if (bookingData.status === "paid") {
        router.push(`/thanks/${encodeURIComponent(sanitizedId)}`);
        return;
      }

      if (bookingData.status === "cancelled") {
        throw new Error("This booking has been cancelled");
      }

      // Create payment intent
      const paymentResponse = await fetch(`${apiUrl}/api/payments/create-intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ bookingId: sanitizedId })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Payment setup failed: ${paymentResponse.status}`);
      }

      const paymentData = await paymentResponse.json();
      
      if (!paymentData.clientSecret) {
        throw new Error("Invalid payment response");
      }
      
      setClientSecret(paymentData.clientSecret);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret || !booking) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card,
          billing_details: {
            // You could collect these from the booking form
            name: booking.petName + " Owner",
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      // Payment successful - safe redirect
      router.push(`/thanks/${encodeURIComponent(sanitizedId)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="flupp-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flupp-sage mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="flupp-card p-8 text-center">
          <div className="mb-4">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <h1 className="text-xl font-fredoka font-bold text-flupp-neutral-900 mb-2">
              Payment Error
            </h1>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/book/new')}
              className="flupp-button-outline"
            >
              Book New Service
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!booking || !clientSecret) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="flupp-card p-8 text-center">
          <p>Unable to load payment details. Please try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-md">
      <div className="flupp-card p-8">
        <h1 className="text-2xl font-fredoka font-bold text-flupp-neutral-900 mb-6">
          Complete Payment
        </h1>
        
        <div className="mb-6 p-4 bg-flupp-neutral-50 rounded-flupp">
          <h3 className="font-medium text-flupp-neutral-800 mb-2">Booking Details</h3>
          <p className="text-sm text-flupp-neutral-600">Pet: {booking.petName}</p>
          <p className="text-sm text-flupp-neutral-600 capitalize">Service: {booking.serviceType}</p>
          <p className="text-lg font-semibold text-flupp-sage">
            £{(booking.priceCents / 100).toFixed(2)}
          </p>
        </div>

        <div className="mb-6">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1c1917',
                  '::placeholder': {
                    color: '#a3a3a3',
                  },
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-flupp text-red-700 text-sm">
            {error}
          </div>
        )}

        <button 
          onClick={handlePayment}
          disabled={isProcessing || !stripe || !clientSecret}
          className="flupp-button-primary w-full py-3 text-base font-medium"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Processing...
            </>
          ) : (
            `Pay £${(booking.priceCents / 100).toFixed(2)}`
          )}
        </button>

        <div className="mt-4 text-xs text-flupp-neutral-500 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span>🔒</span>
            <span>Payments secured by Stripe</span>
          </div>
          <p>Your payment information is encrypted and secure.</p>
        </div>
      </div>
    </main>
  );
}

export default function PayPage({ params }: { params: { id: string } }) {
  return (
    <PaymentErrorBoundary>
      <StripeProvider>
        <PayInner id={params.id} />
      </StripeProvider>
    </PaymentErrorBoundary>
  );
}


