// Global test setup
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Global test environment setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.PORT = '0' // Use random available port for tests
})

afterAll(() => {
  // Cleanup after all tests
})

beforeEach(() => {
  // Reset state before each test
})

afterEach(() => {
  // Cleanup after each test
})