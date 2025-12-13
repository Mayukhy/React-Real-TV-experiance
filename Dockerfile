# Dockerfile for WebSocket Server
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server files
COPY server/ ./server/

# Expose port 3004
EXPOSE 3004

# Start the WebSocket server
CMD ["npm", "run", "server"]