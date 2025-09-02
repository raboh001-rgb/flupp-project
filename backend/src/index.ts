// src/index.ts

// 1) Load environment first (prefer .env.local)
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = existsSync(resolve(process.cwd(), ".env.local")) ? ".env.local" : ".env";
loadEnv({ path: envPath });

// 2) Fail fast on critical env
const must = (k: string) => {
  const v = process.env[k];
  if (!v || v.trim() === "") {
    console.error(`[ENV] Missing required variable: ${k}`);
    process.exit(1);
  }
  return v;
};

const STRIPE_SECRET_KEY = must("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = must("STRIPE_WEBHOOK_SECRET");
const PORT = Number(process.env.PORT ?? 8787);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import { prisma } from "./services/prisma.js"; // named export

const app = express();
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// 3) Stripe webhook BEFORE any JSON middleware (must use raw body)
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"] as string | undefined;
    if (!signature) return res.status(400).send("Missing stripe-signature header");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    }

    try {
      if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata?.bookingId;

        if (bookingId && String(bookingId).trim() !== "") {
          // Adjust to your Prisma id type if needed (string vs int)
          await prisma.booking.update({
            where: { id: String(bookingId) },
            data: { status: "paid" },
          });
        }
      }
      return res.json({ received: true });
    } catch (err) {
      console.error("[Webhook handler error]", err);
      // Acknowledge so Stripe doesn't keep retrying; log for follow-up
      return res.status(200).json({ received: true, warning: "handler-error" });
    }
  }
);

// 4) Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "api.stripe.com"],
      frameSrc: ["js.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow Stripe embeds
}));

// Rate limiting - different limits for different endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // stricter limit for payment endpoints
  message: { error: "Too many payment attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/bookings', generalLimiter);
app.use('/api/reviews', generalLimiter);
app.use('/api/payments/create-intent', paymentLimiter);

// CORS configuration - restrict in production
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:3001', 'http://0.0.0.0:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

app.use(express.json({ limit: '10mb' }));

// Input sanitization
const { sanitizeInput } = await import("./middleware/auth.js");
app.use(sanitizeInput);

// 5) Dynamically import routes AFTER env is loaded (prevents ESM hoisting issues)
const bookings = (await import("./routes/bookings.js")).default;
const payments = (await import("./routes/payments.js")).default;
const reviews = (await import("./routes/reviews.js")).default;
const { errorHandler } = await import("./services/errors.js");

app.use("/api/bookings", bookings);
app.use("/api/payments", payments);
app.use("/api/reviews", reviews);

app.get("/health", (_req, res) => res.json({ 
  ok: true, 
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.originalUrl 
  });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
