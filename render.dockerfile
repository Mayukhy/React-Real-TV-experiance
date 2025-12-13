# Render deployment for WebSocket Server
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy server files  
COPY server/ ./server/

# Expose port (Render will set PORT automatically)
EXPOSE 10000

# Start server
CMD ["npm", "run", "server"]