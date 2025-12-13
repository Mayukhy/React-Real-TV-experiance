# Railway deployment for WebSocket Server
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy server files  
COPY server/ ./server/

# Add health check endpoint
RUN echo 'import express from "express"; const app = express(); app.get("/health", (req, res) => res.json({status: "ok", timestamp: new Date().toISOString()})); const port = process.env.PORT || 3004; app.listen(port, () => console.log(`Health check server running on port ${port}`));' > health-server.js

# Expose Railway PORT
EXPOSE $PORT

# Start server (Railway will set PORT automatically)
CMD ["npm", "run", "server"]