import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../services/prisma.js";
import { createPaymentIntentSchema } from "../services/validate.js";
import { asyncHandler, NotFoundError, ValidationError } from "../services/errors.js";

const r = Router();

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment");
}
const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

r.post("/create-intent", asyncHandler(async (req, res) => {
  const { bookingId } = createPaymentIntentSchema.parse(req.body);

  const booking = await prisma.booking.findUnique({ 
    where: { id: bookingId },
    select: {
      id: true,
      priceCents: true,
      currency: true,
      status: true,
      customerEmail: true,
      paymentIntentId: true,
    }
  });
  
  if (!booking) {
    throw new NotFoundError("Booking");
  }

  // Prevent creating payment intent for paid bookings
  if (booking.status === "paid") {
    throw new ValidationError("This booking has already been paid");
  }

  // Prevent creating payment intent for cancelled bookings
  if (booking.status === "cancelled") {
    throw new ValidationError("Cannot create payment for cancelled booking");
  }

  // If payment intent already exists, retrieve it instead of creating new one
  if (booking.paymentIntentId) {
    try {
      const existingIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
      if (existingIntent.status !== "succeeded" && existingIntent.status !== "canceled") {
        return res.json({ clientSecret: existingIntent.client_secret });
      }
    } catch (error) {
      // Continue to create new intent if retrieval fails
      console.log("Failed to retrieve existing payment intent, creating new one");
    }
  }

  // Validate price is reasonable
  if (booking.priceCents < 50 || booking.priceCents > 100000000) {
    throw new ValidationError("Invalid booking price");
  }

  const intent = await stripe.paymentIntents.create({
    amount: booking.priceCents,
    currency: booking.currency.toLowerCase(),
    metadata: { 
      bookingId,
      customerEmail: booking.customerEmail,
      environment: process.env.NODE_ENV || 'development'
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      paymentIntentId: intent.id,
      updatedAt: new Date()
    }
  });

  res.json({ clientSecret: intent.client_secret });
}));

export default r;

