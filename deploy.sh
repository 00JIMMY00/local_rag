#!/bin/bash

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down

# Build the images
echo "Building images..."
docker-compose build

# Start the services
echo "Starting services..."
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 5

# Check if services are running
echo "Checking service status..."
docker-compose ps

# Show logs
echo "Showing logs (press Ctrl+C to exit)..."
docker-compose logs -f 