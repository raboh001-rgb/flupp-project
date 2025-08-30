import app from './app.js'

const PORT = process.env.PORT || 8787

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Flupp backend running on http://localhost:${PORT}`)
    console.log(`📋 Health check: http://localhost:${PORT}/health`)
    console.log(`🐾 API ready at http://localhost:${PORT}/api/bookings`)
  })
}

export default app