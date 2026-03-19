# Data Center Capacity & Power Modeling Tool - Portability Guide

This document explains how to build and distribute the application as a portable executable or Docker container.

## Overview

The application can be distributed in two ways:
1. **Single Binary (Caxa)** - A standalone executable that runs without Node.js installed
2. **Docker Container** - A containerized deployment with persistent data storage

---

## Option 1: Single Binary Distribution (Caxa)

Caxa creates a self-extracting executable that includes the Node.js runtime and your application code.

### Prerequisites
- Node.js 20+ installed on build machine
- Caxa installed: `npm install -g @appthreat/caxa`
- UPX (optional, for compression): `brew install upx` (macOS) or `apt-get install upx` (Linux)

### Build Steps

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npm run build

# 3. Generate Prisma client
npx prisma generate

# 4. Build binary (macOS/Linux)
npm run build:caxa

# For Windows (run on Windows machine)
npm run build:caxa:windows
```

### Output
- **macOS/Linux**: `data-center-tool` executable file
- **Windows**: `data-center-tool.exe`
- **Size**: ~40-80MB (with UPX compression)

### Running the Binary

```bash
# macOS/Linux
./data-center-tool

# Windows
data-center-tool.exe
```

The app will start on port 3000 by default. Access at `http://localhost:3000`.

**Note**: First run extracts files to a temp directory (may take 10-30 seconds).

### Database Location

By default, the SQLite database is stored in the extraction directory. To persist data:

```bash
# Set custom database path
export DATABASE_URL="file:/path/to/persistent/data.db"
./data-center-tool
```

### Cross-Platform Builds

Caxa cannot cross-compile. To build for multiple platforms:

1. **GitHub Actions**: Use matrix builds
2. **Local**: Build on each target platform
3. **CI/CD**: See `.github/workflows/build-binaries.yml` example below

```yaml
# .github/workflows/build-binaries.yml
name: Build Binaries
on:
  release:
    types: [created]
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npx prisma generate
      - run: npm run build:caxa
        if: runner.os != 'Windows'
      - run: npm run build:caxa:windows
        if: runner.os == 'Windows'
      - uses: actions/upload-artifact@v4
        with:
          name: binary-${{ matrix.os }}
          path: data-center-tool*
```

---

## Option 2: Docker Distribution

Docker provides a consistent environment with persistent data storage.

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start

```bash
# 1. Clone or download the project
git clone <repo-url>
cd <project-directory>

# 2. Build and run
docker-compose up -d

# 3. Access application
# Open http://localhost:3000 in your browser
```

### Managing the Container

```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart
docker-compose restart

# Update (pull latest image and restart)
docker-compose pull
docker-compose up -d
```

### Data Persistence

The SQLite database is stored in a Docker volume (`data`) mounted at `/data` inside the container.

**Backup database:**
```bash
docker cp data-center-tool:/data/dev.db ./backup.db
```

**Restore database:**
```bash
docker cp ./backup.db data-center-tool:/data/dev.db
docker-compose restart
```

### Custom Configuration

Create a `.env` file for custom settings:

```bash
# .env
DATABASE_URL=file:/data/dev.db
PORT=3000
```

### Production Deployment

For production, use a reverse proxy (nginx/traefik) and enable HTTPS:

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/data/dev.db
    volumes:
      - ./data:/data
    restart: always
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
```

---

## Comparison

| Feature | Caxa Binary | Docker |
|---------|-------------|--------|
| **Ease of use** | ⭐⭐⭐ Double-click to run | ⭐⭐ Requires Docker knowledge |
| **Bundle size** | ~40-80MB | ~200MB (image) |
| **Portability** | Platform-specific binary | Runs anywhere with Docker |
| **Data persistence** | Manual configuration | Automatic volume management |
| **Updates** | Download new binary | `docker pull` |
| **Multi-user** | Single user | Easy multi-user deployment |
| **CI/CD** | GitHub Actions matrix | Standard Docker workflows |

---

## Troubleshooting

### Caxa Binary Issues

**"Command not found" on macOS/Linux**
```bash
chmod +x data-center-tool
./data-center-tool
```

**"Cannot find module" errors**
- Ensure you ran `npm run build` before `npm run build:caxa`
- Check that Prisma client is generated: `npx prisma generate`

**Database not persisting**
- Set `DATABASE_URL` environment variable to a persistent path
- Example: `DATABASE_URL="file:$HOME/.data-center-tool/dev.db"`

### Docker Issues

**"Port already in use"**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

**Database permission errors**
```bash
# Fix ownership
docker-compose down
sudo chown -R $USER:$USER ./data
docker-compose up -d
```

**Container won't start**
```bash
# View logs for error details
docker-compose logs app
```

---

## Development vs Production

| Aspect | Development | Production (Caxa) | Production (Docker) |
|--------|-------------|-------------------|---------------------|
| Database | `./dev.db` | Configurable | Docker volume |
| Hot reload | Yes | No | No |
| Debug mode | Yes | No | No |
| Source maps | Yes | No | No |
| Optimized | No | Yes | Yes |

---

## Additional Resources

- [Caxa Documentation](https://github.com/appthreat/caxa)
- [Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prisma with Docker](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-prisma-schema-to-docker)
