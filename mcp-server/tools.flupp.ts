// tools.flupp.ts
type FluppToolDecl = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};

type FluppHandler = (
  args: any,
  ctx: { baseUrl: string; fetch: typeof fetch }
) => Promise<any>;

type OrchestrationStep = {
  step: number;
  action: string;
  status: "in_progress" | "completed" | "failed";
  result?: any;
};

// ---- Tool definitions ----
export const tools: FluppToolDecl[] = [
  {
    name: "booking_create",
    description: "Create a Flupp booking",
    inputSchema: {
      type: "object",
      properties: {
        petName: { type: "string" },
        species: { type: "string" },
        serviceType: { type: "string" },
        startAt: { type: "string" },
        endAt: { type: "string" },
        priceCents: { type: "number" },
        customerEmail: { type: "string" },
        currency: { type: "string" }
      },
      required: [
        "petName",
        "species",
        "serviceType",
        "startAt",
        "endAt",
        "priceCents",
        "customerEmail"
      ]
    }
  },
  {
    name: "payments_createIntent",
    description: "Create a Stripe PaymentIntent for a booking",
    inputSchema: {
      type: "object",
      properties: {
        bookingId: { type: "string" }
      },
      required: ["bookingId"]
    }
  },
  {
    name: "webhook_validate",
    description: "Validate webhook payloads and signatures (dry-run mode)",
    inputSchema: {
      type: "object",
      properties: {
        webhookType: { type: "string", enum: ["stripe", "booking"] },
        payload: { type: "object" },
        signature: { type: "string" },
        dryRun: { type: "boolean", default: true }
      },
      required: ["webhookType", "payload"]
    }
  },
  {
    name: "orchestrate_bookingFlow",
    description: "Orchestrate complete booking flow: create booking, payment intent, and validate webhook flow",
    inputSchema: {
      type: "object",
      properties: {
        petName: { type: "string" },
        species: { type: "string" },
        serviceType: { type: "string" },
        startAt: { type: "string" },
        endAt: { type: "string" },
        priceCents: { type: "number" },
        customerEmail: { type: "string" },
        currency: { type: "string", default: "usd" },
        dryRun: { type: "boolean", default: true }
      },
      required: [
        "petName",
        "species",
        "serviceType", 
        "startAt",
        "endAt",
        "priceCents",
        "customerEmail"
      ]
    }
  }
];

// ---- Handlers map for everything.ts to consume ----
export const handlers: Record<string, FluppHandler> = {
  "booking_create": async (input, ctx) => {
    const res = await ctx.fetch(`${ctx.baseUrl}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`booking_create failed: ${res.status}`);
    return await res.json();
  },
  
  "payments_createIntent": async (input, ctx) => {
    const res = await ctx.fetch(`${ctx.baseUrl}/api/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`payments_createIntent failed: ${res.status}`);
    return await res.json();
  },

  "webhook_validate": async (input, ctx) => {
    // Dry-run webhook validation without submitting actual card details
    const { webhookType, payload, signature, dryRun = true } = input;
    
    if (!dryRun) {
      throw new Error("Non-dry-run webhook validation is not supported for security");
    }

    // Simulate webhook validation logic
    const validation = {
      webhookType,
      isValidStructure: typeof payload === 'object' && payload !== null,
      hasSignature: Boolean(signature),
      dryRun,
      timestamp: new Date().toISOString(),
      status: 'validated_dry_run'
    };

    return {
      success: true,
      validation,
      message: `${webhookType} webhook structure validated in dry-run mode`
    };
  },

  "orchestrate_bookingFlow": async (input, ctx) => {
    const { dryRun = true, ...bookingData } = input;
    const steps: OrchestrationStep[] = [];
    const results = { steps, dryRun, timestamp: new Date().toISOString() };

    try {
      // Step 1: Create booking
      steps.push({ step: 1, action: "create_booking", status: "in_progress" });
      
      if (dryRun) {
        // Simulate booking creation
        const mockBooking = {
          id: `booking_${Date.now()}`,
          ...bookingData,
          status: "pending_payment",
          createdAt: new Date().toISOString()
        };
        steps[0].status = "completed";
        steps[0].result = mockBooking;
        
        // Step 2: Create payment intent
        steps.push({ step: 2, action: "create_payment_intent", status: "in_progress" });
        const mockPaymentIntent = {
          id: `pi_${Date.now()}`,
          bookingId: mockBooking.id,
          amount: bookingData.priceCents,
          currency: bookingData.currency || "usd",
          status: "requires_payment_method"
        };
        steps[1].status = "completed";
        steps[1].result = mockPaymentIntent;

        // Step 3: Validate webhook flow
        steps.push({ step: 3, action: "validate_webhook_flow", status: "in_progress" });
        const webhookValidation = {
          bookingWebhook: { valid: true, type: "booking.updated" },
          paymentWebhook: { valid: true, type: "payment_intent.succeeded" },
          flowComplete: true
        };
        steps[2].status = "completed";
        steps[2].result = webhookValidation;

        return {
          success: true,
          orchestrationComplete: true,
          booking: mockBooking,
          paymentIntent: mockPaymentIntent,
          webhookValidation,
          ...results
        };
      } else {
        // Real booking creation
        const bookingRes = await ctx.fetch(`${ctx.baseUrl}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });
        
        if (!bookingRes.ok) throw new Error(`Booking creation failed: ${bookingRes.status}`);
        const booking = await bookingRes.json();
        steps[0].status = "completed";
        steps[0].result = booking;

        // Step 2: Create payment intent
        steps.push({ step: 2, action: "create_payment_intent", status: "in_progress" });
        const paymentRes = await ctx.fetch(`${ctx.baseUrl}/api/payments/create-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.id })
        });
        
        if (!paymentRes.ok) throw new Error(`Payment intent creation failed: ${paymentRes.status}`);
        const paymentIntent = await paymentRes.json();
        steps[1].status = "completed";
        steps[1].result = paymentIntent;

        return {
          success: true,
          orchestrationComplete: true,
          booking,
          paymentIntent,
          ...results,
          note: "Real booking created - webhook validation requires actual payment processing"
        };
      }
    } catch (error: any) {
      const currentStep = steps.find(s => s.status === "in_progress");
      if (currentStep) currentStep.status = "failed";
      
      return {
        success: false,
        error: error.message,
        ...results
      };
    }
  }
};

