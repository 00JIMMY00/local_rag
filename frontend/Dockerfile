FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# The source code will be mounted from the host machine
# so we don't need to copy it here

# Expose port
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001"] 