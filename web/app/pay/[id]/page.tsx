"use client";

import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import StripeProvider from "@/components/StripeProvider";

function PayInner({ id }: { id: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    fetch(`${base}/api/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id })
    })
      .then((r) => r.json())
      .then((d: { clientSecret: string }) => setClientSecret(d.clientSecret))
      .catch(() => setClientSecret(null));
  }, [id]);

  async function pay() {
    if (!stripe || !elements || !clientSecret) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card }
    });

    if (result.error) {
      alert(result.error.message);
      return;
    }

    window.location.href = `/thanks/${id}`;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Payment</h1>
      <CardElement />
      <button onClick={pay} disabled={!stripe || !clientSecret}>
        Pay
      </button>
    </main>
  );
}

export default function PayPage({ params }: { params: { id: string } }) {
  return (
    <StripeProvider>
      <PayInner id={params.id} />
    </StripeProvider>
  );
}


