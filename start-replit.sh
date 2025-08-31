#!/bin/bash

# Robust Replit startup script for Flupp backend
set -e

echo "🚀 Starting Flupp backend on Replit..."

# Navigate to backend directory
cd backend/flupp

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in the right directory?"
    pwd
    ls -la
    exit 1
fi

echo "📂 Working directory: $(pwd)"
echo "📋 Found package.json"

# Clean install dependencies
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install

# Verify critical dependencies are installed
echo "🔍 Verifying dependencies..."
node -e "
try {
    require('helmet');
    require('cors');
    require('express');
    require('zod');
    console.log('✅ All dependencies verified');
} catch (e) {
    console.error('❌ Dependency verification failed:', e.message);
    process.exit(1);
}
"

# Set Replit-specific environment variables
export NODE_ENV=development
export HOST=0.0.0.0
export PORT=${PORT:-8787}

echo "🌍 Environment: NODE_ENV=$NODE_ENV, HOST=$HOST, PORT=$PORT"

# Start the server
echo "🚀 Starting Flupp backend server..."
npm start