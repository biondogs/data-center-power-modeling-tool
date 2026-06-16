#!/bin/sh
set -e

# Run Prisma migrations on container start to ensure the database schema is up to date
npx prisma migrate deploy

# Seed the database if it is empty (idempotent — seed script handles duplicates)
npx prisma db seed

# Start the Next.js standalone server
exec node server.js
