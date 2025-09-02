"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { config } from "../../../lib/config";
import { getErrorMessage } from "../../../lib/utils";

interface BookingForm {
  petName: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  serviceType: "boarding" | "grooming" | "daycare" | "training" | "walking";
  startAt: string;
  endAt: string;
  priceCents: number;
  customerEmail: string;
  currency: string;
}

const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "other", label: "Other" },
] as const;

const SERVICE_OPTIONS = [
  { value: "boarding", label: "Pet Boarding" },
  { value: "grooming", label: "Pet Grooming" },
  { value: "daycare", label: "Pet Daycare" },
  { value: "training", label: "Pet Training" },
  { value: "walking", label: "Dog Walking" },
] as const;

export default function NewBooking() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<BookingForm>({
    petName: "",
    species: "dog",
    serviceType: "boarding",
    startAt: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    endAt: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0, 16),
    priceCents: 2500, // £25.00
    customerEmail: "",
    currency: "GBP"
  });

  // Input validation
  const validateForm = (): string | null => {
    if (!form.petName.trim()) return "Pet name is required";
    if (form.petName.length > 50) return "Pet name is too long";
    if (!form.customerEmail.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) return "Please enter a valid email";
    if (!form.startAt) return "Start date is required";
    if (!form.endAt) return "End date is required";
    if (new Date(form.endAt) <= new Date(form.startAt)) return "End date must be after start date";
    if (new Date(form.startAt) < new Date()) return "Start date cannot be in the past";
    if (form.priceCents < 50) return "Price must be at least £0.50";
    if (form.priceCents > 100000000) return "Price is too high";
    return null;
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = config.api.baseUrl || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8787";
      
      const res = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...form,
          startAt: new Date(form.startAt).toISOString(),
          endAt: new Date(form.endAt).toISOString(),
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      if (data.id) {
        // Safe redirect using Next.js router
        router.push(`/pay/${encodeURIComponent(data.id)}`);
      } else {
        throw new Error("Invalid response: missing booking ID");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flupp-card p-8">
        <h1 className="text-2xl font-fredoka font-bold text-flupp-neutral-900 mb-6">
          Book a Service
        </h1>
        
        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-flupp text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="petName" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
              Pet Name *
            </label>
            <input
              id="petName"
              type="text"
              required
              maxLength={50}
              className="flupp-input"
              placeholder="Enter your pet's name"
              value={form.petName}
              onChange={e => setForm({ ...form, petName: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="species" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
              Species *
            </label>
            <select
              id="species"
              required
              className="flupp-input"
              value={form.species}
              onChange={e => setForm({ ...form, species: e.target.value as any })}
              disabled={isLoading}
            >
              {SPECIES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
              Service Type *
            </label>
            <select
              id="serviceType"
              required
              className="flupp-input"
              value={form.serviceType}
              onChange={e => setForm({ ...form, serviceType: e.target.value as any })}
              disabled={isLoading}
            >
              {SERVICE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startAt" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
                Start Date & Time *
              </label>
              <input
                id="startAt"
                type="datetime-local"
                required
                className="flupp-input"
                value={form.startAt}
                onChange={e => setForm({ ...form, startAt: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="endAt" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
                End Date & Time *
              </label>
              <input
                id="endAt"
                type="datetime-local"
                required
                className="flupp-input"
                value={form.endAt}
                onChange={e => setForm({ ...form, endAt: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
              Email Address *
            </label>
            <input
              id="customerEmail"
              type="email"
              required
              maxLength={100}
              className="flupp-input"
              placeholder="your@email.com"
              value={form.customerEmail}
              onChange={e => setForm({ ...form, customerEmail: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="priceCents" className="block text-sm font-medium text-flupp-neutral-700 mb-2">
              Price (in pence) *
            </label>
            <input
              id="priceCents"
              type="number"
              min={50}
              max={100000000}
              required
              className="flupp-input"
              placeholder="2500 (£25.00)"
              value={form.priceCents}
              onChange={e => setForm({ ...form, priceCents: parseInt(e.target.value) || 0 })}
              disabled={isLoading}
            />
            <p className="text-sm text-flupp-neutral-600 mt-1">
              Enter price in pence (e.g., 2500 = £25.00)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flupp-button-primary w-full py-3 text-base font-medium"
          >
            {isLoading ? "Creating Booking..." : "Continue to Payment"}
          </button>
        </form>
      </div>
    </main>
  );
}
