# Docker Deployment Guide

This guide explains how to deploy your Next.js blog application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Basic understanding of Docker concepts

## Project Structure

```
├── Dockerfile                 # Multi-stage Docker build configuration
├── docker-compose.yml         # Orchestrates app + PostgreSQL + pgAdmin
├── .dockerignore              # Excludes unnecessary files from build
├── scripts/
│   └── docker-entrypoint.sh   # Handles DB migrations on startup
└── next.config.ts             # Configured for standalone output
```

## Quick Start

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Start all services (app + database + pgAdmin)
npm run docker:up

# View application logs
npm run docker:logs

# Stop all services
npm run docker:down

# Clean up (removes containers, volumes, and images)
npm run docker:clean
```

### 2. Manual Docker Build

```bash
# Build the Docker image
npm run docker:build

# Run with environment file
npm run docker:run
```

## Services Overview

### Application (port 3000)
- **URL**: http://localhost:3000
- **Environment**: Production optimized
- **Features**: Automatic database migration on startup

### PostgreSQL Database (port 5432)
- **Host**: localhost:5432
- **Database**: company-01
- **Username**: admin
- **Password**: password

### pgAdmin (port 5050) - Optional
- **URL**: http://localhost:5050
- **Email**: admin@example.com
- **Password**: admin
- **Purpose**: Database management interface

## Environment Configuration

The docker-compose.yml includes these environment variables:

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgresql://admin:password@db:5432/company-01
  - NEXTAUTH_URL=http://localhost:3000
  - NEXTAUTH_SECRET=your-super-secret-nextauth-secret-change-this-in-production
```

### Security Note
⚠️ **Change the NEXTAUTH_SECRET** before deploying to production!

## Docker Features

### Multi-Stage Build
- **deps**: Installs production dependencies
- **builder**: Builds the application and generates Prisma client
- **runner**: Lightweight production image with only necessary files

### Automatic Database Setup
- Health checks ensure database is ready
- Automatic Prisma migrations on container startup
- No manual database setup required

### Volume Persistence
- PostgreSQL data persisted in Docker volumes
- Survives container restarts and rebuilds

## Useful Commands

```bash
# View all running containers
docker ps

# View application logs
docker logs fullstack-app-1

# Access database container
docker exec -it fullstack-db-1 psql -U admin -d company-01

# Access application container
docker exec -it fullstack-app-1 sh

# Rebuild and restart
docker-compose up --build -d

# View resource usage
docker stats
```

## Development vs Production

### Development
```bash
npm run dev
```

### Production (Docker)
```bash
npm run docker:up
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs fullstack-db-1

# Restart database service
docker-compose restart db
```

### Application Issues
```bash
# Check application logs
npm run docker:logs

# Rebuild application
docker-compose up --build app -d

# Access container for debugging
docker exec -it fullstack-app-1 sh
```

### Port Conflicts
If ports 3000, 5432, or 5050 are in use:

1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

## Deployment to Production

### 1. Update Environment Variables
Modify `docker-compose.yml` with production values:
- Change `NEXTAUTH_SECRET` to a secure random string
- Update `NEXTAUTH_URL` to your domain
- Consider using Docker secrets for sensitive data

### 2. Use Production Database
Replace the PostgreSQL service with your production database:
```yaml
environment:
  - DATABASE_URL=postgresql://user:pass@your-db-host:5432/dbname
```

### 3. Enable HTTPS
- Use a reverse proxy (nginx, Traefik, or Caddy)
- Update `NEXTAUTH_URL` to use https://
- Configure SSL certificates

### 4. Resource Limits
Add resource constraints:
```yaml
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

## Performance Optimization

### Image Size
- Uses Alpine Linux (smaller base image)
- Multi-stage build reduces final image size
- .dockerignore excludes unnecessary files

### Startup Time
- Standalone output for faster cold starts
- Pre-built Prisma client
- Optimized layer caching

### Memory Usage
- Non-root user for security
- Efficient Node.js configuration
- Minimal runtime dependencies

## Monitoring

### Health Checks
PostgreSQL includes built-in health checks:
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U admin -d company-01"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Logs
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f app
docker-compose logs -f db
```

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker exec fullstack-db-1 pg_dump -U admin company-01 > backup.sql

# Restore from backup
docker exec -i fullstack-db-1 psql -U admin -d company-01 < backup.sql
```

### Application Data
Application state is stored in the database, so database backups are sufficient.

## Next Steps

1. **Set up CI/CD**: Automate builds and deployments
2. **Add monitoring**: Use tools like Prometheus + Grafana
3. **Scale**: Consider Kubernetes for multi-instance deployment
4. **Security**: Implement proper secrets management
5. **Performance**: Add Redis for caching if needed

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review Docker and container logs
3. Ensure Docker Desktop is running and updated
4. Check if ports are available and not blocked by firewall 