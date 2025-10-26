#!/bin/bash

# Smart Village Digital Twin - Quick Deployment Script
echo "🚀 Smart Village Digital Twin - Deployment Script"
echo "=================================================="

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

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating one..."
    echo "REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyAvUTmxJq59stO4zSDaB-6UOiGX9snjkm8" > .env
    echo "REACT_APP_GEMINI_API_KEY=AIzaSyBq-e2JGh9a64n9ojLnJYtDO10QORJxci8" >> .env
    echo "✅ .env file created with API keys"
else
    echo "✅ .env file exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your Smart Village Digital Twin is ready!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. For local demo: npm start"
    echo "2. For public demo: Deploy the 'build' folder to Netlify/Vercel"
    echo "3. Check PROTOTYPE_GUIDE.md for detailed instructions"
    echo ""
    echo "🌟 Features Ready:"
    echo "   🗺️  Smart Map (Google Maps Integration)"
    echo "   ⚡  Energy Management Dashboard"
    echo "   💧  Water Resource Management"
    echo "   🌾  Agricultural Intelligence"
    echo "   🚨  Emergency Response System"
    echo "   🎤  AI Voice Interface"
    echo ""
    echo "🚀 Ready to revolutionize village management!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
