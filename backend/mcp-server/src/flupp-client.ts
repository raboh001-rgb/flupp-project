/**
 * Flupp API client for MCP server integration
 */

export interface FluppBooking {
  id: string;
  petName: string;
  species: string;
  serviceType: string;
  startAt: string;
  endAt: string;
  priceCents: number;
  customerEmail: string;
  currency: string;
  status: 'pending_payment' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface FluppPaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface BookingRequest {
  petName: string;
  species: string;
  serviceType: string;
  startAt: string;
  endAt: string;
  priceCents: number;
  customerEmail: string;
  currency?: string;
}

export class FluppClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8787') {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<{ ok: boolean }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  }

  async createBooking(booking: BookingRequest): Promise<FluppBooking> {
    const response = await fetch(`${this.baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Booking creation failed: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  async getBooking(bookingId: string): Promise<FluppBooking> {
    const response = await fetch(`${this.baseUrl}/api/bookings/${bookingId}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Get booking failed: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  async updateBookingStatus(bookingId: string, status: FluppBooking['status']): Promise<FluppBooking> {
    const response = await fetch(`${this.baseUrl}/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Status update failed: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  async createPaymentIntent(bookingId: string): Promise<FluppPaymentIntent> {
    const response = await fetch(`${this.baseUrl}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Payment intent creation failed: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  async validateWebhook(webhookData: any, dryRun: boolean = true): Promise<any> {
    if (dryRun) {
      // Simulate webhook validation without actually calling the endpoint
      return {
        valid: true,
        type: webhookData.type || 'payment_intent.succeeded',
        simulated: true,
        validated_at: new Date().toISOString()
      };
    }

    const response = await fetch(`${this.baseUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Webhook validation failed: ${error.error || response.statusText}`);
    }

    return response.json();
  }
}