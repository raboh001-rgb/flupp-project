#!/bin/bash
# Simple Replit startup script - no Nix dependencies
set -e

echo "🚀 Starting Flupp backend..."

# Navigate to backend directory  
cd backend/flupp

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 8787..."
npm start