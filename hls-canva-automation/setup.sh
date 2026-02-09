#!/bin/bash

# Hello Little Sleepers - Design Automation Platform Setup
# This script sets up the development environment

set -e

echo "🌙 Hello Little Sleepers - Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) found"
echo ""

# Navigate to script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"
echo ""

echo "📁 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

echo "========================================"
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Start the backend (Terminal 1):"
echo "   cd backend && npm start"
echo ""
echo "2. Start the frontend (Terminal 2):"
echo "   cd frontend && npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more details, see README.md"
echo ""
