# 🐳 Docker Deployment Guide

## Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed
- `.env` file in root directory with required variables

## Quick Start

### 1. Set Up Environment Variables
Copy the example file and fill in your API keys:
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 2. Start Everything
Run this command from the root directory (`SR-16-Invictus`):
```bash
docker-compose up -d
```

This will start:
- ✅ MongoDB (Database) on port 27018
- ✅ Redis (Cache) on port 6379
- ✅ Backend Server (API) on port 5001
- ✅ Frontend Client (UI) on port 3000

### 3. Access the Application
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5001/api/test-route

## Commands

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f client
docker-compose logs -f server
docker-compose logs -f mongo
docker-compose logs -f redis
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Stop and remove everything (including volumes)
```bash
docker-compose down -v
```

## Service Health Checks

The docker-compose includes health checks. Services start in this order:
1. MongoDB + Redis (healthy)
2. Server waits for MongoDB + Redis
3. Client waits for Server

## Architecture

```
┌─────────────────┐
│   Client:3000   │ ← Frontend (Next.js)
│   (Next.js UI)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Server:5001   │ ← Backend (Express API)
│  (Express API)  │
└────┬─────┬──────┘
     │     │
     ▼     ▼
┌────────┐ ┌────────┐
│ MongoDB│ │ Redis  │
│  :27018│ │ :6379  │
└────────┘ └────────┘
```

## Environment Variables

Required in `.env` file (root directory):
- `MISTRAL_API_KEY` - Mistral AI API key
- `NASA_API_KEY` - NASA API key
- `JWT_SECRET` - JWT secret for authentication
- Firebase credentials (8 variables)

See `.env.example` for complete list.

**Important Note about API URL:**
- The client is built with `NEXT_PUBLIC_API_URL=http://localhost:5001/api` by default
- This allows the frontend to work when accessed from the host machine (your browser)
- If you need to access from within the Docker network, you may need to rebuild with a different URL

## Troubleshooting

### Port conflicts
If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use different host port
```

### View container status
```bash
docker-compose ps
```

### Enter a container
```bash
docker exec -it astroview_server sh
docker exec -it astroview_client sh
```

### Clean rebuild
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## Development vs Production

This docker-compose is configured for **local development** with:
- Live logs
- Health checks
- Persistent MongoDB data

For **production**, use separate compose files or deploy to:
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
- Cache → Upstash Redis
