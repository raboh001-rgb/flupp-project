#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting Flupp backend..."

# Display environment info
echo "📊 Environment: ${NODE_ENV:-development}"
echo "📡 Port: ${PORT:-auto-detect}"
echo "🏠 Host: ${HOST:-0.0.0.0}"

# Navigate to the backend directory
cd backend/flupp || {
    echo "❌ Error: Cannot find backend/flupp directory"
    exit 1
}

# Clean install dependencies
echo "📦 Installing dependencies..."
if [ -d "node_modules" ]; then
    echo "🧹 Cleaning existing node_modules..."
    rm -rf node_modules
fi

npm ci --production || npm install || {
    echo "❌ Error: Failed to install dependencies"
    exit 1
}

# Verify Node.js version
echo "🔍 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Health check before starting
echo "🔧 Pre-startup checks..."
node -e "
try {
  require('./app.js');
  console.log('✅ App module loads successfully');
} catch (error) {
  console.error('❌ App module failed to load:', error.message);
  process.exit(1);
}
" || {
    echo "❌ Error: Pre-startup check failed"
    exit 1
}

# Start the server with error handling
echo "🎯 Starting server..."
exec npm start