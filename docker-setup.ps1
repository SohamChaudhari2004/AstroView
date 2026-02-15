# 🐳 Quick Docker Setup Script

Write-Host "🚀 AstroView Docker Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found!" -ForegroundColor Yellow
    
    # Check if server/.env exists
    if (Test-Path "server/.env") {
        Write-Host "✅ Found server/.env - copying to root..." -ForegroundColor Green
        Copy-Item "server/.env" ".env"
        Write-Host "✅ .env file created!" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Please create .env file with your API keys" -ForegroundColor Red
        Write-Host "   Use .env.example as a template" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
Write-Host ""

# Start Docker Compose
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5001/api/test-route" -ForegroundColor White
Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:    docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop all:     docker-compose down" -ForegroundColor White
Write-Host "   Rebuild:      docker-compose up -d --build" -ForegroundColor White
Write-Host ""
