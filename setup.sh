#!/bin/bash
# Medical Kiosk Startup Script

echo "🏥 Medical Kiosk - Initialization Script"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+"
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Initialize database
echo "🗄️  Initializing database..."
cd server
npm run db:init

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

echo "✓ Database initialized with sample data"
echo ""

cd ..

echo "=========================================="
echo "✓ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
echo ""
echo "📝 Demo Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
