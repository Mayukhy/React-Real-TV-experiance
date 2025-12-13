import { createServer } from 'http';
import { Server } from 'socket.io';
import { networkInterfaces } from 'os';

class TvWebSocketServer {
  constructor(port = 3004) {
    this.port = port;
    this.httpServer = createServer();
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.connectedRemotes = new Map();
    this.connectedTvs = new Map(); // Track TVs by their ID
    this.tvState = {
      isOn: false,
      currentChannel: 1,
      currentCategory: 'All',
      volume: 50
    };
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Device connected:', socket.id);

      // Handle device type registration
      socket.on('register', (deviceType, tvId) => {
        socket.deviceType = deviceType;
        
        if (deviceType === 'tv' && tvId) {
          socket.tvId = tvId;
          this.connectedTvs.set(tvId, socket);
          console.log(`TV registered with ID: ${tvId}, socket: ${socket.id}`);
          
          // Confirm TV registration
          socket.emit('registration-confirmed', { success: true, tvId });
          
        } else if (deviceType === 'remote') {
          this.connectedRemotes.set(socket.id, socket);
          console.log(`Remote registered:`, socket.id);
          // Send current TV state to newly connected remote
          socket.emit('tvState', this.tvState);
        } else {
          console.log(`${deviceType} registered:`, socket.id);
        }
      });

      // Handle TV ID validation from remote
      socket.on('validate-tv-id', (data) => {
        const { tvId } = data;
        const isValid = this.connectedTvs.has(tvId);
        
        console.log(`TV ID validation for ${tvId}: ${isValid ? 'VALID' : 'INVALID'}`);
        
        const response = { 
          tvId, 
          isValid, 
          message: isValid ? 'TV ID is valid' : 'TV ID not found or TV is not online' 
        };
        
        console.log('Sending validation response:', response);
        socket.emit('tv-id-validation', response);
        // If valid, register the remote with the specific TV ID and notify the TV
        if (isValid) {
          socket.tvId = tvId; // Associate remote with TV ID
          
          // Notify the TV that a remote has been validated
          const targetTv = this.connectedTvs.get(tvId);

          if (targetTv) {
            targetTv.emit('remote-validated', {
              tvId,
              remoteId: socket.id,
              timestamp: new Date().toISOString()
            });
            console.log(`Notified TV ${tvId} about remote validation`);
          }
        }
        
      });

      // Handle remote control commands
      socket.on('remote-command', (command) => {
        console.log('Remote command received:', command);
        
        // Validate TV ID if provided
        if (command.tvId && !this.connectedTvs.has(command.tvId)) {
          socket.emit('command-error', {
            error: 'Invalid TV ID or TV not connected',
            tvId: command.tvId
          });
          return;
        }
        
        // Update TV state based on command
        this.handleRemoteCommand(command);
        
        // Route command to specific TV if tvId is provided
        if (command.tvId && this.connectedTvs.has(command.tvId)) {
          const targetTv = this.connectedTvs.get(command.tvId);
          targetTv.emit('tv-command', command);
          console.log(`Command sent to TV: ${command.tvId}`);
        } else {
          // Fallback: broadcast to all TVs if no specific TV ID
          socket.broadcast.emit('tv-command', command);
        }
      });

      // Handle TV state updates
      socket.on('tv-state-update', (newState) => {
        this.tvState = { ...this.tvState, ...newState };
        
        // Broadcast state update to all remotes
        this.connectedRemotes.forEach((remoteSocket) => {
          remoteSocket.emit('tvState', this.tvState);
        });
      });

      socket.on('disconnect', () => {
        console.log('Device disconnected:', socket.id);
        
        if (socket.deviceType === 'remote') {
          this.connectedRemotes.delete(socket.id);
        } else if (socket.deviceType === 'tv' && socket.tvId) {
          this.connectedTvs.delete(socket.tvId);
          console.log(`TV ${socket.tvId} disconnected`);
        }
      });
    });
  }

  handleRemoteCommand(command) {
    switch (command.type) {
      case 'POWER_TOGGLE':
        this.tvState.isOn = !this.tvState.isOn;
        break;
      case 'CHANNEL_UP':
      case 'CHANNEL_DOWN':
      case 'CHANNEL_SET':
        if (command.payload && command.payload.channelNo) {
          this.tvState.currentChannel = command.payload.channelNo;
        }
        break;
      case 'CATEGORY_CHANGE':
        if (command.payload && command.payload.category) {
          this.tvState.currentCategory = command.payload.category;
        }
        break;
    }
  }

  start() {
    this.httpServer.listen(this.port, '0.0.0.0', () => {
      console.log(`TV WebSocket server running on port ${this.port}`);
      console.log(`Local: http://localhost:${this.port}`);
      
      // Show all network interfaces for mobile connection
      const nets = networkInterfaces();
      const results = Object.create(null);
      
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
          }
        }
      }
      
      console.log('\\nAvailable on your network:');
      for (const name of Object.keys(results)) {
        for (const address of results[name]) {
          console.log(`  http://${address}:${this.port} (${name})`);
        }
      }
      console.log('\\nUse any of the above URLs to connect from mobile devices\\n');
    });
  }

  stop() {
    this.httpServer.close();
  }
}

// Start the server
const port = 3004;
const server = new TvWebSocketServer(port);
server.start();

export default TvWebSocketServer;