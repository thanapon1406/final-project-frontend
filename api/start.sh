#!/bin/bash

# Huay Tueng Thao API Startup Script

echo "🚀 Starting Huay Tueng Thao Website API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p ../data/backups
mkdir -p ../uploads

echo "✅ Setup complete!"
echo ""
echo "🌐 Starting API server..."
echo "   - API will be available at: http://localhost:3001"
echo "   - Health check: http://localhost:3001/api/health"
echo "   - Documentation: See README.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start