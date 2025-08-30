import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../app.js'

describe('Bookings API', () => {
  let server

  beforeAll(() => {
    // Start server on random port for testing
    server = app.listen(0)
  })

  afterAll((done) => {
    server.close(done)
  })

  describe('POST /api/bookings', () => {
    it('should create a booking and return 200 with an id', async () => {
      const bookingData = {
        petName: 'Buddy',
        species: 'dog',
        serviceType: 'grooming',
        startAt: '2025-09-01T10:00:00Z',
        endAt: '2025-09-01T12:00:00Z',
        priceCents: 7500,
        customerEmail: 'test@example.com',
        currency: 'usd'
      }

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(200)

      // Verify response structure
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).toBeTruthy()
      expect(typeof response.body.id).toBe('string')
      
      // Verify booking data is returned correctly
      expect(response.body).toMatchObject({
        petName: bookingData.petName,
        species: bookingData.species,
        serviceType: bookingData.serviceType,
        startAt: bookingData.startAt,
        endAt: bookingData.endAt,
        priceCents: bookingData.priceCents,
        customerEmail: bookingData.customerEmail,
        currency: bookingData.currency,
        status: 'pending_payment'
      })

      // Verify timestamps
      expect(response.body).toHaveProperty('createdAt')
      expect(new Date(response.body.createdAt)).toBeInstanceOf(Date)
    })

    it('should return 400 for invalid booking data', async () => {
      const invalidBookingData = {
        petName: 'Buddy',
        // Missing required fields
      }

      const response = await request(app)
        .post('/api/bookings')
        .send(invalidBookingData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should return 400 for invalid email format', async () => {
      const bookingDataInvalidEmail = {
        petName: 'Buddy',
        species: 'dog',
        serviceType: 'grooming',
        startAt: '2025-09-01T10:00:00Z',
        endAt: '2025-09-01T12:00:00Z',
        priceCents: 7500,
        customerEmail: 'invalid-email',
        currency: 'usd'
      }

      await request(app)
        .post('/api/bookings')
        .send(bookingDataInvalidEmail)
        .expect(400)
    })

    it('should return 400 for invalid date range', async () => {
      const bookingDataInvalidDates = {
        petName: 'Buddy',
        species: 'dog',
        serviceType: 'grooming',
        startAt: '2025-09-01T12:00:00Z',
        endAt: '2025-09-01T10:00:00Z', // End before start
        priceCents: 7500,
        customerEmail: 'test@example.com',
        currency: 'usd'
      }

      await request(app)
        .post('/api/bookings')
        .send(bookingDataInvalidDates)
        .expect(400)
    })
  })

  describe('GET /api/bookings/:id', () => {
    it('should retrieve a booking by id', async () => {
      // First create a booking
      const bookingData = {
        petName: 'Luna',
        species: 'cat',
        serviceType: 'walking',
        startAt: '2025-09-01T14:00:00Z',
        endAt: '2025-09-01T15:00:00Z',
        priceCents: 5000,
        customerEmail: 'test@example.com',
        currency: 'usd'
      }

      const createResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(200)

      const bookingId = createResponse.body.id

      // Then retrieve it
      const getResponse = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .expect(200)

      expect(getResponse.body).toMatchObject({
        id: bookingId,
        ...bookingData,
        status: 'pending_payment'
      })
    })

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .get('/api/bookings/non-existent-id')
        .expect(404)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Booking not found')
    })
  })
})