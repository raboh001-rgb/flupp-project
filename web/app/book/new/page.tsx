"use client";
import { useState } from "react";

export default function NewBooking() {
  const [form, setForm] = useState({
    petName: "",
    species: "dog",
    serviceType: "walk",
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 60*60*1000).toISOString(),
    priceCents: 1500,
    customerEmail: "",
    currency: "GBP"
  });

  async function submit() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const booking = await res.json();
    if (booking.id) window.location.href = `/pay/${booking.id}`;
    else alert(booking.error || "Something went wrong");
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>New Booking</h1>
      <input placeholder="Pet name" onChange={e => setForm({ ...form, petName: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, customerEmail: e.target.value })} />
      <button onClick={submit}>Continue to payment</button>
    </main>
  );
}
