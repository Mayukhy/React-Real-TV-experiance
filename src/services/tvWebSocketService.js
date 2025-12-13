import { io } from 'socket.io-client';

class TvWebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.callbacks = new Map();
  }

  connect(serverUrl) {
    // Auto-detect server URL if not provided
    if (!serverUrl) {
      const hostname = window.location.hostname;
      serverUrl = `http://${hostname}:3004`;
    }
    
    try {
      this.socket = io(serverUrl);
      
      this.socket.on('connect', () => {
        console.log('Connected to TV server');
        this.isConnected = true;
        
        // Get TV ID from sessionStorage
        const tvId = sessionStorage.getItem('tvId');
        
        // Register as TV device with ID
        this.socket.emit('register', 'tv', tvId);
        console.log('Registered as TV with ID:', tvId);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from TV server');
        this.isConnected = false;
      });

      // Listen for remote commands
      this.socket.on('tv-command', (command) => {
        this.handleCommand(command);
        console.log('Received TV command:', command);
      });

      // Listen for remote validation events
      this.socket.on('remote-validated', (data) => {
        console.log('Remote validated for this TV:', data);
        this.handleCommand({ type: 'REMOTE_VALIDATED', payload: data });
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Failed to connect to TV server:', error);
      return Promise.reject(error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Register callback functions for different command types
  onCommand(commandType, callback) {
    this.callbacks.set(commandType, callback);
  }

  // Handle incoming commands from remote
  handleCommand(command) {
    const callback = this.callbacks.get(command.type);
    if (callback) {
      callback(command.payload);
    }
  }

  // Send TV state updates to server
  updateTvState(state) {
    if (this.socket && this.isConnected) {
      this.socket.emit('tv-state-update', state);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const tvWebSocketService = new TvWebSocketService();

export default tvWebSocketService;