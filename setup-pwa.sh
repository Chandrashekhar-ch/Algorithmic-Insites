#!/bin/bash

echo "🚀 Setting up Algorithmic Insights PWA..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if icons directory exists
if [ ! -d "public" ]; then
    mkdir public
    echo "📁 Created public directory"
fi

# Check for required icon files
echo "🖼️  Checking for PWA icons..."
MISSING_ICONS=()

if [ ! -f "public/pwa-192x192.png" ]; then
    MISSING_ICONS+=("pwa-192x192.png")
fi

if [ ! -f "public/pwa-512x512.png" ]; then
    MISSING_ICONS+=("pwa-512x512.png")
fi

if [ ! -f "public/apple-touch-icon.png" ]; then
    MISSING_ICONS+=("apple-touch-icon.png")
fi

if [ ! -f "public/favicon.ico" ]; then
    MISSING_ICONS+=("favicon.ico")
fi

if [ ${#MISSING_ICONS[@]} -gt 0 ]; then
    echo "⚠️  Missing PWA icons:"
    for icon in "${MISSING_ICONS[@]}"; do
        echo "   - public/$icon"
    done
    echo ""
    echo "📖 Please see PWA_ICONS_SETUP.md for instructions on creating these icons."
    echo ""
fi

# Run type check
echo "🔍 Running TypeScript check..."
npx tsc --noEmit

# Check if development server can start
echo "🌐 Starting development server..."
echo "📱 Your PWA will be available at: http://localhost:3000"
echo ""
echo "✨ PWA Features enabled:"
echo "   - 📱 Installable as native app"
echo "   - 🔄 Automatic updates"
echo "   - 📶 Offline functionality"
echo "   - 🎯 Caching strategies for performance"
echo "   - 🤖 AI explanations caching"
echo ""

npm run dev
