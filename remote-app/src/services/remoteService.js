import { io } from 'socket.io-client';

class RemoteWebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.tvState = {
      isOn: false,
      currentChannel: 1,
      currentCategory: 'All'
    };
    this.callbacks = new Map();
    this.serverUrl = 'http://localhost:3004';
  }

  async connect(customUrl) {
    let url = customUrl;
    
    // Auto-detect server URL if not provided
    if (!url) {
      const hostname = window.location.hostname;
      url = `http://${hostname}:3004`;
    }
    
    try {
      this.socket = io(url);
      
      this.socket.on('connect', () => {
        console.log('Remote connected to TV server');
        this.isConnected = true;
        
        // Register as remote device
        this.socket.emit('register', 'remote');
        
        // Notify connection status change
        this.notifyCallback('connectionChange', { isConnected: true });
      });

      this.socket.on('disconnect', () => {
        console.log('Remote disconnected from TV server');
        this.isConnected = false;
        this.notifyCallback('connectionChange', { isConnected: false });
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.isConnected = false;
        this.notifyCallback('connectionChange', { isConnected: false });
      });

      // Listen for TV state updates
      this.socket.on('tvState', (state) => {
        console.log('Received TV state:', state);
        this.tvState = state;
        this.notifyCallback('tvStateUpdate', state);
      });

      // Listen for TV ID validation response
      this.socket.on('tv-id-validation', (data) => {
        console.log('TV ID validation response:', data);
        this.notifyCallback('tvIdValidation', data);
      });

      // Listen for command errors
      this.socket.on('command-error', (error) => {
        console.error('Command error:', error);
        this.notifyCallback('commandError', error);
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

  // Validate TV ID with server
  validateTvId(tvId) {
    if (this.socket && this.isConnected) {
      console.log('Sending TV ID validation request to server:', tvId);
      this.socket.emit('validate-tv-id', { tvId });
      return true;
    } else {
      console.error('Cannot validate TV ID - not connected to server');
      return false;
    }
  }

  // Send commands to TV
  sendCommand(type, payload = {}, tvId = null) {
    if (this.socket && this.isConnected) {
      const command = { type, payload };
      if (tvId) {
        command.tvId = tvId;
      }
      console.log('Sending command:', command);
      this.socket.emit('remote-command', command);
      return true;
    } else {
      console.warn('Not connected to TV server');
      return false;
    }
  }

  // Remote control actions
  togglePower(tvId) {
    return this.sendCommand('POWER_TOGGLE', {}, tvId);
  }

  setChannel(channelNo, tvId) {
    return this.sendCommand('CHANNEL_SET', { channelNo }, tvId);
  }

  channelUp(tvId) {
    return this.sendCommand('CHANNEL_UP', {channelNo: this.tvState.currentChannel}, tvId);
  }

  channelDown(tvId) {
    return this.sendCommand('CHANNEL_DOWN', {channelNo: this.tvState.currentChannel}, tvId);
  }

  setCategory(category, tvId) {
    return this.sendCommand('CATEGORY_CHANGE', { category }, tvId);
  }

  // Register callbacks for events
  on(event, callback) {
    this.callbacks.set(event, callback);
  }

  off(event) {
    this.callbacks.delete(event);
  }

  notifyCallback(event, data) {
    const callback = this.callbacks.get(event);
    if (callback) {
      callback(data);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getTvState() {
    return this.tvState;
  }

  setServerUrl(url) {
    this.serverUrl = url;
  }
}

// Create singleton instance
const remoteService = new RemoteWebSocketService();

export default remoteService;