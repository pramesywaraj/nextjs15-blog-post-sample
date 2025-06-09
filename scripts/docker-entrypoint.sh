#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z db 5432; do
  echo "Database is not ready yet. Waiting..."
  sleep 2
done

echo "Database is ready!"

# Run database migrations
echo "Running database migrations..."
npx prisma db push --accept-data-loss

# Generate Prisma client (if not already done)
echo "Generating Prisma client..."
npx prisma generate

echo "Starting the application..."
# Start the application
exec "$@" 