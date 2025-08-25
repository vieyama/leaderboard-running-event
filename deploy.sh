#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Laravel Docker Deployment Script${NC}"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please update it with your configuration.${NC}"
    echo -e "${YELLOW}📝 Important: Update the following in your .env file:${NC}"
    echo "   - APP_URL (your domain)"
    echo "   - DB_PASSWORD (secure password)"
    echo "   - APP_KEY will be generated automatically"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
fi

# Create directory for MySQL initialization scripts
mkdir -p docker/mysql/init

# Stop any existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose down

# Remove old images to ensure fresh build
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

# Build and start services
echo -e "${GREEN}🔨 Building and starting services...${NC}"
docker compose up --build -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
echo "This may take a few minutes for the first time..."

# Check service health
for i in {1..30}; do
    if docker compose ps --format json | jq -e '.[] | select(.Health == "healthy")' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Services are healthy!${NC}"
        break
    else
        echo -n "."
        sleep 10
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Services took too long to become healthy. Check logs:${NC}"
        echo "docker compose logs"
        exit 1
    fi
done

# Run database migrations
echo -e "${GREEN}📊 Running database migrations...${NC}"
docker compose exec -T app php artisan migrate --force

# Show final status
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=========================================="
echo -e "${GREEN}Application URL:${NC} http://localhost:3003"
echo -e "${GREEN}MySQL:${NC} localhost:3306"
echo -e "${GREEN}Redis:${NC} localhost:6379"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo "  docker compose logs -f        # View logs"
echo "  docker compose ps             # Check status"
echo "  docker compose down           # Stop services"
echo "  docker compose exec app bash  # Access app container"
echo ""
echo -e "${GREEN}🔍 Check application health:${NC}"
curl -I http://localhost:3003 2>/dev/null | head -n 1 || echo "Application not yet ready, wait a moment..."