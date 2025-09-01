#!/bin/bash
echo "Starting Flupp Frontend for Replit..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting Next.js development server..."
npm run dev