# TV App with Wireless Remote Control

This project implements a TV application with wireless remote control functionality using WebSockets for real-time communication.

## Features

- **TV Application**: Main TV interface with channel browsing, categories, and video playback
- **Wireless Remote Control**: Separate remote control app that can run on any device
- **Real-time Communication**: WebSocket-based communication between TV and remote
- **Cross-device Control**: Control your TV from mobile, tablet, or another computer
- **Category Filtering**: Browse channels by categories (All, Entertainment, Nature, Animal, Horror, Romance)
- **Channel Navigation**: Number pad input, channel up/down controls
- **Connection Status**: Visual feedback for connection status between devices

## Project Structure

```
TV-app/
├── src/                    # Main TV application
│   ├── components/
│   │   ├── Tv.jsx         # TV component with WebSocket integration
│   │   ├── Remote.jsx     # Original embedded remote
│   │   └── WirelessRemote.jsx # Wireless remote component
│   ├── hooks/
│   │   └── useTvCustomHook.jsx # TV state management with WebSocket
│   └── services/
│       ├── tvWebSocketService.js     # TV WebSocket client
│       └── remoteWebSocketService.js # Remote WebSocket client
├── server/
│   └── tvWebSocketServer.js # WebSocket server for communication
└── remote-app/             # Standalone remote control application
    ├── src/
    │   ├── components/
    │   │   └── RemoteControl.jsx
    │   └── services/
    │       └── remoteService.js
    └── package.json
```

## Setup Instructions

### 1. Install Dependencies

For the main TV app:
```bash
npm install
```

For the remote control app:
```bash
cd remote-app
npm install
cd ..
```

### 2. Running the Applications

#### Option A: Run Everything Together (Recommended)
```bash
# Start WebSocket server and TV app
npm run dev:all

# In a separate terminal, start the remote control app
npm run remote
```

#### Option B: Run Components Individually
```bash
# Terminal 1: Start WebSocket server
npm run server

# Terminal 2: Start TV app
npm run dev

# Terminal 3: Start remote control app
npm run remote
```

### 3. Access the Applications

- **TV App**: http://localhost:5173 (or your Vite dev server port)
- **Remote Control App**: http://localhost:3002
- **WebSocket Server**: Runs on port 3001

## Usage

1. **Start the WebSocket Server**: This handles communication between the TV and remote control apps
2. **Open TV App**: Navigate to the TV app in your browser
3. **Open Remote App**: Open the remote control app on another device or browser tab
4. **Automatic Connection**: The remote will automatically connect to the TV
5. **Control Your TV**: Use the remote control interface to:
   - Turn TV on/off
   - Change channels using number pad
   - Navigate channels with up/down buttons
   - Switch between categories
   - View real-time TV status

## Mobile Usage

To use the remote control from a mobile device:

1. Make sure your mobile device is on the same network as your computer
2. Find your computer's IP address (e.g., `192.168.1.100`)
3. Start the applications as described above
4. On your mobile device, navigate to: `http://YOUR_COMPUTER_IP:3002`
5. The remote control interface will load and connect to your TV

## Configuration

### Changing Server URL
In the remote control app, click the settings icon (⚙️) to configure a custom server URL if needed.

### Port Configuration
- TV App: Configured in `vite.config.js` (default: 5173)
- Remote App: Configured in `remote-app/vite.config.js` (default: 3002)
- WebSocket Server: Configured in `server/tvWebSocketServer.js` (default: 3001)

## Development

### TV App Development
The main TV application uses React Router for navigation and a custom hook (`useTvCustomHook`) for state management. WebSocket integration is handled through the `tvWebSocketService`.

### Remote App Development
The remote control app is a standalone React application that communicates with the TV through the WebSocket server. It includes a responsive interface optimized for mobile devices.

### WebSocket Server
The server handles bidirectional communication between TV and remote control devices, maintaining TV state and broadcasting commands.

## Troubleshooting

### Connection Issues
- Ensure the WebSocket server is running on port 3001
- Check that all applications are on the same network
- Verify firewall settings allow connections on the required ports

### TV Not Responding to Remote
- Check browser console for WebSocket connection errors
- Ensure the TV app is properly connected to the WebSocket server
- Try refreshing both the TV and remote applications

### Remote App Not Loading
- Verify the remote app is running on port 3002
- Check for any build errors in the remote app
- Ensure dependencies are properly installed in the remote-app directory

## Technology Stack

- **Frontend**: React, Material-UI Joy, Vite
- **Real-time Communication**: Socket.IO (WebSockets)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## Future Enhancements

- Volume control functionality
- Audio controls (mute/unmute)
- Playlist management
- Multiple TV support
- User authentication
- Mobile app (React Native)
- Voice control integration
- Touch gestures for mobile remote