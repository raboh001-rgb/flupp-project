import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../app.js'

describe('Additional API Endpoints', () => {
  let server

  beforeAll(() => {
    server = app.listen(0)
  })

  afterAll((done) => {
    server.close(done)
  })

  describe('POST /api/payments/create-intent', () => {
    it('should create payment intent for existing booking', async () => {
      // First create a booking
      const bookingData = {
        petName: 'Max',
        species: 'dog',
        serviceType: 'grooming',
        startAt: '2025-09-01T10:00:00Z',
        endAt: '2025-09-01T11:00:00Z',
        priceCents: 5000,
        customerEmail: 'test@example.com'
      }

      const bookingResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(200)

      // Create payment intent
      const paymentResponse = await request(app)
        .post('/api/payments/create-intent')
        .send({ bookingId: bookingResponse.body.id })
        .expect(201)

      expect(paymentResponse.body).toHaveProperty('id')
      expect(paymentResponse.body).toMatchObject({
        bookingId: bookingResponse.body.id,
        amount: 5000,
        currency: 'usd',
        status: 'requires_payment_method'
      })
    })

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .send({ bookingId: 'non-existent' })
        .expect(404)

      expect(response.body).toEqual({ error: 'Booking not found' })
    })

    it('should return 400 for missing bookingId', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .send({})
        .expect(400)

      expect(response.body).toEqual({ error: 'Required' })
    })
  })

  describe('POST /api/payments/webhook', () => {
    it('should handle valid webhook payload', async () => {
      const webhookPayload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_1234567890'
          }
        }
      }

      const response = await request(app)
        .post('/api/payments/webhook')
        .send(webhookPayload)
        .expect(200)

      expect(response.body).toMatchObject({
        received: true,
        type: 'payment_intent.succeeded'
      })
    })

    it('should return 400 for invalid webhook payload', async () => {
      const response = await request(app)
        .post('/api/payments/webhook')
        .send({ invalid: 'payload' })
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/reviews', () => {
    it('should create review for completed booking', async () => {
      // Create booking
      const bookingData = {
        petName: 'Bella',
        species: 'cat',
        serviceType: 'grooming',
        startAt: '2025-09-01T10:00:00Z',
        endAt: '2025-09-01T11:00:00Z',
        priceCents: 4000,
        customerEmail: 'test@example.com'
      }

      const bookingResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(200)

      // Update booking to completed
      await request(app)
        .patch(`/api/bookings/${bookingResponse.body.id}/status`)
        .send({ status: 'completed' })
        .expect(200)

      // Create review
      const reviewData = {
        bookingId: bookingResponse.body.id,
        rating: 5,
        comment: 'Excellent service!',
        reviewerName: 'John Doe'
      }

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(201)

      expect(response.body).toMatchObject({
        ...reviewData,
        id: expect.any(String)
      })
    })

    it('should return 400 for reviewing non-completed booking', async () => {
      // Create booking (will be pending_payment by default)
      const bookingData = {
        petName: 'Charlie',
        species: 'dog',
        serviceType: 'walking',
        startAt: '2025-09-01T10:00:00Z',
        endAt: '2025-09-01T11:00:00Z',
        priceCents: 3000,
        customerEmail: 'test@example.com'
      }

      const bookingResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(200)

      const reviewData = {
        bookingId: bookingResponse.body.id,
        rating: 5,
        reviewerName: 'John Doe'
      }

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400)

      expect(response.body).toEqual({ error: 'Can only review completed bookings' })
    })

    it('should return 400 for invalid rating', async () => {
      const reviewData = {
        bookingId: 'some-id',
        rating: 6, // Invalid rating (must be 1-5)
        reviewerName: 'John Doe'
      }

      const response = await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/reviews/for-booking/:bookingId', () => {
    it('should get reviews for existing booking', async () => {
      // Create booking
      const bookingData = {
        petName: 'Oscar',
        species: 'dog',
        serviceType: 'grooming',
        startAt: '2025-09-01T10:00:00Z',
        endAt: '2025-09-01T11:00:00Z',
        priceCents: 6000,
        customerEmail: 'test@example.com'
      }

      const bookingResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(200)

      const response = await request(app)
        .get(`/api/reviews/for-booking/${bookingResponse.body.id}`)
        .expect(200)

      expect(response.body).toHaveProperty('reviews')
      expect(Array.isArray(response.body.reviews)).toBe(true)
    })

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .get('/api/reviews/for-booking/non-existent')
        .expect(404)

      expect(response.body).toEqual({ error: 'Booking not found' })
    })
  })

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404)

      expect(response.body).toEqual({ error: 'Route not found' })
    })

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .type('json')
        .send('{"invalid": json}')
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })
})