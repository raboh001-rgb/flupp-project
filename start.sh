#!/bin/bash

echo "🚀 Starting Flupp backend..."

# Navigate to the backend directory
cd backend/flupp

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🎯 Starting server on port 8787..."
npm start