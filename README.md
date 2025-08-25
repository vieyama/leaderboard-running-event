# S2P Running Event - Laravel Inertia Application

A Laravel application with Inertia.js frontend for managing running events.

## 🚀 Quick Deployment

### Prerequisites
- Docker and Docker Compose installed
- Port 3003, 3306, and 6379 available

### Automatic Deployment
```bash
# Clone the repository
git clone <your-repo-url>
cd leaderboard-running-event

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Update .env with your configuration
# Edit .env file with your settings

# 3. Start services
docker compose up --build -d

# 4. Wait for services to be ready (check health)
docker compose ps

# 5. Run migrations
docker compose exec app php artisan migrate --force
```

## 🔧 Configuration

### Environment Variables (.env)
Update these important settings in your `.env` file:

```env
APP_NAME="S2P Running Event"
APP_URL=http://your-domain.com
DB_PASSWORD=your-secure-password
```

### Port Configuration
- **Application**: 3003
- **MySQL**: 3306  
- **Redis**: 6379

## 📊 Services

### Application Stack
- **App**: Laravel 11 with Inertia.js + React
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Frontend**: Vite build system

### Health Checks
All services include health checks:
- Application: HTTP check on port 3003
- MySQL: Connection test
- Redis: Ping test

## 🛠️ Development Commands

```bash
# View logs
docker compose logs -f

# Access application container
docker compose exec app bash

# Run artisan commands
docker compose exec app php artisan <command>

# Rebuild application
docker compose up --build app

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## 🗄️ Database Management

### Connect to MySQL
```bash
# From host
mysql -h localhost -P 3306 -u laravel -p

# From container
docker compose exec mysql mysql -u laravel -p
```

### Backup Database
```bash
docker compose exec mysql mysqldump -u laravel -p laravel > backup.sql
```

### Restore Database
```bash
docker compose exec -T mysql mysql -u laravel -p laravel < backup.sql
```

## 🎯 Production Deployment

### Firewall Setup
Open these ports:
- 3003 (Application)
- 3306 (MySQL - if external access needed)

### SSL/HTTPS
For production, use a reverse proxy (nginx/traefik) for SSL termination.

### Environment Security
- Change default passwords
- Use strong APP_KEY (generated automatically)
- Set APP_DEBUG=false
- Configure proper LOG_LEVEL

## 📋 Migration Checklist

When moving to a new server:

1. ✅ Install Docker & Docker Compose
2. ✅ Copy project files
3. ✅ Update `.env` configuration
4. ✅ Run `./deploy.sh`
5. ✅ Configure firewall
6. ✅ Set up domain/DNS
7. ✅ Configure SSL (production)

## 🐛 Troubleshooting

### Common Issues

**Services not starting:**
```bash
docker compose logs
```

**Permission issues:**
```bash
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
```

**Database connection issues:**
```bash
docker compose exec app php artisan config:clear
```

**Assets not loading:**
```bash
docker compose exec app npm run build
```

### Reset Everything
```bash
docker compose down -v
docker system prune -f
./deploy.sh
```

## 🔍 Monitoring

### Check Service Status
```bash
docker compose ps
```

### Application Health
```bash
curl -I http://localhost:3003
```

### Resource Usage
```bash
docker stats
```

## 📞 Support

For issues:
1. Check logs: `docker compose logs`
2. Verify health: `docker compose ps`
3. Check configuration: `.env` file
4. Review firewall settings