import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { z } from 'zod'

const app = express()

// Enhanced logging function
const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level}] [APP] ${message}`)
}

log('Initializing Flupp Express application...')

// Middleware with enhanced error handling
try {
  // Configure Helmet for Replit compatibility
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https:"]
      }
    }
  }))
  
  log('✅ Helmet security middleware configured')

  // Configure CORS for Replit environment
  app.use(cors({
    origin: true, // Allow all origins for development/Replit
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  }))
  
  log('✅ CORS middleware configured')

  // Body parsing with size limits for stability
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  
  log('✅ Body parsing middleware configured')
} catch (error) {
  log(`❌ Middleware configuration error: ${error.message}`, 'ERROR')
  throw error
}

// In-memory storage for testing (replace with database in production)
let bookings = new Map()
let bookingCounter = 1

// Helper function to generate booking ID
const generateBookingId = () => `booking_${Date.now()}_${bookingCounter++}`

// Shared error helper functions
const returnBadRequest = (res, message) => {
  return res.status(400).json({ error: message })
}

const returnNotFound = (res, message) => {
  return res.status(404).json({ error: message })
}

// Zod validation schemas
const bookingCreateSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  serviceType: z.string().min(1, "Service type is required"),
  startAt: z.string().datetime("Invalid start date format"),
  endAt: z.string().datetime("Invalid end date format"),
  priceCents: z.number().int().positive("Price must be a positive integer"),
  customerEmail: z.string().email("Invalid email format"),
  currency: z.string().optional().default("usd")
}).refine((data) => {
  const start = new Date(data.startAt)
  const end = new Date(data.endAt)
  const now = new Date()
  return start < end && start > now
}, {
  message: "End time must be after start time and booking must be in the future"
})

const bookingStatusUpdateSchema = z.object({
  status: z.enum(['pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: "Status must be one of: pending_payment, confirmed, in_progress, completed, cancelled" })
  })
})

const bookingIdSchema = z.string().min(1, "Booking ID is required")

// Error handling utility
const handleValidationError = (error) => {
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0]
    return {
      status: 400,
      error: firstError.message
    }
  }
  return {
    status: 500,
    error: "Validation failed"
  }
}

log('✅ Application initialization complete')

// Health check route with comprehensive diagnostics
app.get('/health', (req, res) => {
  try {
    const healthData = {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
    log('Health check requested - server is healthy')
    res.status(200).json(healthData)
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, 'ERROR')
    res.status(500).json({ ok: false, error: 'Health check failed' })
  }
})

// POST /api/bookings - Create a new booking
app.post('/api/bookings', (req, res) => {
  try {
    const validatedData = bookingCreateSchema.parse(req.body)
    
    const booking = {
      id: generateBookingId(),
      ...validatedData,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    }

    bookings.set(booking.id, booking)
    
    res.status(200).json(booking)
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// GET /api/bookings/:id - Get a specific booking
app.get('/api/bookings/:id', (req, res) => {
  try {
    const bookingId = bookingIdSchema.parse(req.params.id)
    const booking = bookings.get(bookingId)
    
    if (!booking) {
      return returnNotFound(res, 'Booking not found')
    }

    res.status(200).json(booking)
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// PATCH /api/bookings/:id/status - Update booking status
app.patch('/api/bookings/:id/status', (req, res) => {
  try {
    const bookingId = bookingIdSchema.parse(req.params.id)
    const { status } = bookingStatusUpdateSchema.parse(req.body)
    
    const booking = bookings.get(bookingId)
    
    if (!booking) {
      return returnNotFound(res, 'Booking not found')
    }

    booking.status = status
    booking.updatedAt = new Date().toISOString()
    
    bookings.set(booking.id, booking)
    
    res.status(200).json(booking)
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// POST /api/payments/create-intent - Create payment intent
app.post('/api/payments/create-intent', (req, res) => {
  try {
    const bookingIdValidation = z.object({
      bookingId: z.string().min(1, "Booking ID is required")
    })
    
    const { bookingId } = bookingIdValidation.parse(req.body)
    const booking = bookings.get(bookingId)
    
    if (!booking) {
      return returnNotFound(res, 'Booking not found')
    }

    // Mock payment intent creation
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      bookingId: booking.id,
      amount: booking.priceCents,
      currency: booking.currency,
      status: 'requires_payment_method',
      createdAt: new Date().toISOString()
    }
    
    res.status(201).json(paymentIntent)
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// POST /api/payments/webhook - Handle Stripe webhooks
app.post('/api/payments/webhook', (req, res) => {
  try {
    // Basic webhook validation (in production, verify Stripe signature)
    const webhookSchema = z.object({
      type: z.string().min(1, "Webhook type is required"),
      data: z.object({
        object: z.object({
          id: z.string().min(1, "Payment intent ID is required")
        })
      })
    })
    
    const webhookData = webhookSchema.parse(req.body)
    
    // Mock webhook processing
    const response = {
      received: true,
      type: webhookData.type,
      processed_at: new Date().toISOString()
    }
    
    res.status(200).json(response)
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// POST /api/reviews - Create a review
app.post('/api/reviews', (req, res) => {
  try {
    const reviewSchema = z.object({
      bookingId: z.string().min(1, "Booking ID is required"),
      rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
      comment: z.string().optional(),
      reviewerName: z.string().min(1, "Reviewer name is required")
    })
    
    const validatedData = reviewSchema.parse(req.body)
    const booking = bookings.get(validatedData.bookingId)
    
    if (!booking) {
      return returnNotFound(res, 'Booking not found')
    }
    
    if (booking.status !== 'completed') {
      return returnBadRequest(res, 'Can only review completed bookings')
    }
    
    const review = {
      id: `review_${Date.now()}`,
      ...validatedData,
      createdAt: new Date().toISOString()
    }
    
    res.status(201).json(review)
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// GET /api/reviews/for-booking/:bookingId - Get reviews for a booking
app.get('/api/reviews/for-booking/:bookingId', (req, res) => {
  try {
    const bookingId = bookingIdSchema.parse(req.params.bookingId)
    const booking = bookings.get(bookingId)
    
    if (!booking) {
      return returnNotFound(res, 'Booking not found')
    }
    
    // Mock reviews (in production, query from reviews table)
    const reviews = [
      {
        id: `review_${Date.now()}`,
        bookingId: bookingId,
        rating: 5,
        comment: "Great service!",
        reviewerName: "Happy Customer",
        createdAt: new Date().toISOString()
      }
    ]
    
    res.status(200).json({ reviews })
  } catch (error) {
    const { error: message } = handleValidationError(error)
    return returnBadRequest(res, message)
  }
})

// Enhanced JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    log(`❌ JSON parsing error from ${req.ip}: ${err.message}`, 'ERROR')
    return res.status(400).json({ error: 'Invalid JSON format', details: 'Request body contains malformed JSON' })
  }
  next(err)
})

// Enhanced global error handling middleware
app.use((err, req, res, next) => {
  const errorId = Date.now()
  log(`❌ [${errorId}] Unhandled error in ${req.method} ${req.url}:`, 'ERROR')
  log(`❌ [${errorId}] ${err.message}`, 'ERROR')
  log(`❌ [${errorId}] Stack: ${err.stack}`, 'ERROR')
  
  // Don't expose sensitive error details in production
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(500).json({ 
    error: 'Internal server error',
    errorId: errorId,
    ...(isDev && { details: err.message, stack: err.stack })
  })
})

// Enhanced 404 handler with logging
app.use('*', (req, res) => {
  log(`❌ 404 - Route not found: ${req.method} ${req.url}`, 'WARN')
  returnNotFound(res, `Route not found: ${req.method} ${req.url}`)
})

// Process-level error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  log(`❌ Uncaught Exception: ${error.message}`, 'FATAL')
  log(`❌ Stack: ${error.stack}`, 'FATAL')
  // Don't exit immediately, let graceful shutdown handle it
})

process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled Promise Rejection at: ${promise}`, 'FATAL')
  log(`❌ Reason: ${reason}`, 'FATAL')
  // Don't exit immediately, let graceful shutdown handle it
})

log('✅ Error handlers and process-level handlers configured')

export default app