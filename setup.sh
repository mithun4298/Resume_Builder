#!/bin/bash

echo "🚀 Setting up Resume Builder development environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your actual values."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p dist/client
mkdir -p dist/server
mkdir -p drizzle

# Generate database schema (if DATABASE_URL is set)
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗄️ Generating database schema..."
    npm run db:generate
    npm run db:push
else
    echo "⚠️ DATABASE_URL not set, skipping database setup"
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env file with your API keys"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:5000 to see your app"