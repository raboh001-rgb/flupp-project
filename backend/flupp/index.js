import app from './app.js'

// Robust port and host configuration for Replit
const PORT = parseInt(process.env.PORT) || 8787  // Use 8787 as specified
const HOST = process.env.HOST || '0.0.0.0'

// Enhanced logging function
const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level}] ${message}`)
}

// Startup function with comprehensive error handling
const startServer = async () => {
  try {
    log('Starting Flupp backend server...')
    log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    log(`Port: ${PORT}, Host: ${HOST}`)
    
    // Create server instance
    const server = app.listen(PORT, HOST, () => {
      log('🚀 Flupp backend server started successfully!')
      log(`📡 Server listening on ${HOST}:${PORT}`)
      log(`🌐 Local access: http://localhost:${PORT}`)
      log(`📋 Health check: http://localhost:${PORT}/health`)
      log(`🐾 API endpoints: http://localhost:${PORT}/api/*`)
      
      // Enhanced Replit URL construction
      if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
        const replitUrl = `https://${process.env.REPL_SLUG}-${process.env.REPL_OWNER}.repl.co`
        log(`🔗 Replit URL: ${replitUrl}`)
      } else if (process.env.REPLIT_URL) {
        log(`🔗 Replit URL: ${process.env.REPLIT_URL}`)
      }
    })

    // Enhanced error handling for server
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        log(`❌ Port ${PORT} is already in use. Trying to find available port...`, 'ERROR')
        // Try different ports in Replit environment
        const altPort = PORT + 1
        log(`Attempting to start on port ${altPort}...`)
        server.listen(altPort, HOST)
      } else if (error.code === 'EACCES') {
        log(`❌ Permission denied to bind to ${HOST}:${PORT}`, 'ERROR')
        log('Trying to bind to 0.0.0.0 instead...', 'WARN')
        server.listen(PORT, '0.0.0.0')
      } else {
        log(`❌ Server error: ${error.message}`, 'ERROR')
        log(`Error code: ${error.code}`, 'ERROR')
        process.exit(1)
      }
    })

    // Graceful shutdown handlers
    const gracefulShutdown = (signal) => {
      log(`📴 Received ${signal}. Starting graceful shutdown...`)
      server.close((err) => {
        if (err) {
          log(`❌ Error during shutdown: ${err.message}`, 'ERROR')
          process.exit(1)
        }
        log('✅ Server shut down gracefully')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    log(`❌ Failed to start server: ${error.message}`, 'ERROR')
    log(`Stack trace: ${error.stack}`, 'ERROR')
    process.exit(1)
  }
}

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export default app