# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# 📺 TV Remote Control App

A full-stack real-time TV remote control application with WebSocket communication, featuring a TV interface, mobile remote app, and complete CI/CD deployment pipeline.

## 🌟 Features

- **📺 TV Interface**: Interactive TV with channel switching, categories, and real-time controls
- **📱 Remote Control App**: Mobile-friendly remote with QR code pairing
- **🔌 Real-time Communication**: WebSocket-based instant control transmission
- **🐳 Containerized**: Complete Docker setup for all components
- **🚀 CI/CD Pipeline**: Automated deployment with GitHub Actions
- **☁️ Cloud Deployment**: Production-ready on Render + Vercel

## 🏗️ Architecture

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   TV App        │ ◄──────────────► │ WebSocket Server│
│ (React/Vite)    │                  │ (Node.js)       │
│ Port: 5173      │                  │ Port: 3004      │
└─────────────────┘                  └─────────────────┘
                                              ▲
                                              │ WebSocket
                                              ▼
                                     ┌─────────────────┐
                                     │ Remote App      │
                                     │ (React/Vite)    │
                                     │ Port: 3002      │
                                     └─────────────────┘
```

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Socket.io Client
- Material-UI (Joy UI)
- Tailwind CSS
- QR Code Generation

**Backend:**
- Node.js
- Socket.io Server
- WebSocket communication

**DevOps:**
- Docker & Docker Compose
- GitHub Actions CI/CD
- Render (Backend hosting)
- Vercel (Frontend hosting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd TV-app
```

### 2. Environment Setup

Create environment files:

```bash
# .env.development
VITE_WEBSOCKET_URL=http://localhost:3004

# .env.production
VITE_WEBSOCKET_URL=https://your-render-app.onrender.com
```

```bash
# remote-app/.env.production
VITE_WEBSOCKET_URL=https://your-render-app.onrender.com
```

### 3. Install Dependencies

```bash
# Main TV app
npm install

# Remote app
cd remote-app
npm install
cd ..
```

### 4. Development - Local Setup

#### Option A: Docker Compose (Recommended)

```bash
# Run all services
docker-compose up --build

# Access applications:
# TV App: http://localhost:3000
# Remote App: http://localhost:3002
# WebSocket Server: ws://localhost:3004
```

#### Option B: Manual Setup

```bash
# Terminal 1 - WebSocket Server
npm run server

# Terminal 2 - TV App
npm run dev

# Terminal 3 - Remote App
cd remote-app
npm run dev
```

## 🐳 Docker Configuration

### Available Dockerfiles

1. **Dockerfile** - WebSocket Server
2. **Dockerfile.tv** - TV App (Frontend)
3. **remote-app/Dockerfile.remote** - Remote App (Frontend)

### Docker Commands

```bash
# Build individual images
docker build -t tv-websocket .
docker build -t tv-app -f Dockerfile.tv .
docker build -t remote-app ./remote-app -f Dockerfile.remote

# Run with Docker Compose
docker-compose up --build
docker-compose down
```

## 🌐 Production Deployment

### Architecture Overview

- **Backend**: Render (WebSocket Server)
- **TV App**: Vercel (Static hosting)
- **Remote App**: Vercel (Static hosting)

### Step-by-Step Deployment

#### 1. Deploy Backend to Render

```bash
# Push code to GitHub first
git add .
git commit -m "Ready for deployment"
git push origin main
```

1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tv-websocket-server`
   - **Environment**: `Node`
   - **Build Command**: `npm ci --only=production`
   - **Start Command**: `npm run server`
   - **Dockerfile Path**: `render.dockerfile`

#### 2. Deploy TV App to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy TV App
vercel login
vercel --prod

# Note the deployment URL
```

#### 3. Deploy Remote App to Vercel

```bash
# Deploy Remote App
cd remote-app
vercel --prod

# Note the deployment URL
```

#### 4. Update Environment Variables

Update your environment files with production URLs:

```bash
# .env.production
VITE_WEBSOCKET_URL=https://your-actual-render-url.onrender.com
```

## ⚙️ CI/CD Pipeline

### GitHub Actions Workflow

The project includes automated CI/CD pipeline (`.github/workflows/deploy.yml`):

#### Pipeline Steps:

1. **🧪 Test & Build**
   - Install dependencies
   - Run linting
   - Build all applications

2. **🚀 Deploy Backend**
   - Deploy WebSocket server to Render
   - Health check validation

3. **📱 Deploy Frontends**
   - Deploy TV App to Vercel (Production)
   - Deploy Remote App to Vercel (Production)

#### Setup GitHub Secrets

In your GitHub repository, add these secrets:

```bash
# Render
RENDER_API_KEY=your_render_api_key

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_TV_PROJECT_ID=your_tv_project_id
VERCEL_REMOTE_PROJECT_ID=your_remote_project_id

# Environment
WEBSOCKET_URL=https://your-render-app.onrender.com
```

#### Trigger Deployment

```bash
# Push to main branch triggers automatic deployment
git push origin main
```

## 📱 How to Use

### TV App
1. Open the TV app in your browser
2. Note the TV ID displayed
3. Use channel controls or wait for remote commands

### Remote App
1. Open the remote app on your mobile device
2. Scan QR code or enter TV ID manually
3. Use remote controls to operate the TV

### Pairing Process
1. TV generates unique ID and QR code
2. Remote scans QR or enters ID manually
3. WebSocket server validates and pairs devices
4. Real-time control established

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start TV app
npm run server          # Start WebSocket server
npm run dev:all         # Start server + TV app
npm run remote          # Start remote app

# Production
npm run build           # Build TV app
npm run preview         # Preview built app

# Docker
docker-compose up       # Run all services
docker-compose down     # Stop all services
```

## 📁 Project Structure

```
TV-app/
├── src/                          # TV App source
│   ├── components/              # React components
│   ├── services/               # WebSocket service
│   └── hooks/                  # Custom hooks
├── remote-app/                 # Remote Control App
│   ├── src/components/         # Remote components
│   └── src/services/          # Remote WebSocket service
├── server/                     # WebSocket Server
│   └── tvWebSocketServer.js   # Main server file
├── public/                     # Static assets
├── .github/workflows/          # CI/CD pipeline
├── docker-compose.yml          # Multi-container setup
├── Dockerfile                  # WebSocket server
├── Dockerfile.tv              # TV app container
├── render.dockerfile          # Production server
└── vercel.json                # Frontend deployment
```

## 🌍 Environment Variables

### Development
```env
VITE_WEBSOCKET_URL=http://localhost:3004
NODE_ENV=development
```

### Production
```env
VITE_WEBSOCKET_URL=https://your-render-app.onrender.com
NODE_ENV=production
PORT=3004
```

## 🔍 Troubleshooting

### Common Issues

**WebSocket Connection Failed**
```bash
# Check if server is running
curl http://localhost:3004

# Verify environment variables
echo $VITE_WEBSOCKET_URL
```

**Docker Build Issues**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild containers
docker-compose up --build --force-recreate
```

**Deployment Issues**
```bash
# Check Vercel logs
vercel logs

# Verify environment variables in deployment
vercel env ls
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Vercel for frontend hosting
- Render for backend hosting
- Docker for containerization

---

## 📞 Support

For support, email your-email@domain.com or create an issue in this repository.

## 🔗 Links

- **Live TV App**: https://real-tv-experiance.vercel.app/
- **Live Remote App**: https://remote-app-cyan.vercel.app/
- **Documentation**: [Link to detailed docs]
- **API Documentation**: [WebSocket API docs]