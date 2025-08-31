import app from './app.js'

const PORT = process.env.PORT || 8787
const HOST = process.env.HOST || '0.0.0.0'

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Flupp backend running on http://localhost:${PORT}`)
    console.log(`🌐 External access: http://0.0.0.0:${PORT}`)
    console.log(`📋 Health check: http://localhost:${PORT}/health`)
    console.log(`🐾 API ready at http://localhost:${PORT}/api/bookings`)
    console.log(`🔗 Replit URL: https://${process.env.REPL_SLUG || 'your-repl'}-${process.env.REPL_OWNER || 'username'}.repl.co`)
  })
}

export default app