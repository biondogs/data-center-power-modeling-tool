# Data Center Capacity & Power Modeling Tool - Dockerfile
# Multi-stage build for production deployment

# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies for Prisma and native modules
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Production
FROM node:20-slim AS runner

WORKDIR /app

# Install openssl for Prisma and dumb-init for proper signal handling
RUN apt-get update && apt-get install -y \
    openssl \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production

# Copy package files for Prisma CLI access
COPY package.json package-lock.json ./
RUN npm ci --only=production && npx prisma generate

# Copy Prisma schema for migrations
COPY prisma ./prisma

# Copy built Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Create directory for SQLite database persistence
RUN mkdir -p /data

EXPOSE 3000

USER node

# Use entrypoint to run migrations and seed before starting the server
ENTRYPOINT ["dumb-init", "/app/entrypoint.sh"]
