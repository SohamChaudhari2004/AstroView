#!/bin/bash

echo "🚀 AstroView Docker Setup"
echo "========================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found!"
    
    # Check if server/.env exists
    if [ -f "server/.env" ]; then
        echo "✅ Found server/.env - copying to root..."
        cp server/.env .env
        echo "✅ .env file created!"
    else
        echo "❌ Please create .env file with your API keys"
        echo "   Use .env.example as a template"
        exit 1
    fi
else
    echo "✅ .env file found"
fi

echo ""
echo "🐳 Starting Docker services..."
echo ""

# Start Docker Compose
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001/api/test-route"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop all:     docker-compose down"
echo "   Rebuild:      docker-compose up -d --build"
echo ""
