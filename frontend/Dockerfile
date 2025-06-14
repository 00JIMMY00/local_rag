# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Final stage - using Node to serve static files
FROM node:20-alpine

WORKDIR /app

# Install serve to host static files
RUN npm install -g serve

# Copy built assets from build stage
COPY --from=build /app/dist /app/dist

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose port 3001
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["/app/entrypoint.sh"]