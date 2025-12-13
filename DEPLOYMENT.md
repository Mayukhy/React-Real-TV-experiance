# Deployment Guide for TV App

## 🚀 Deployment Architecture
- **Backend (WebSocket Server)**: Render
- **TV App Frontend**: Vercel
- **Remote App Frontend**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Setup Checklist

### 1. Render Setup (Backend)
1. Go to [render.com](https://render.com) and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: tv-websocket-server
   - **Environment**: Node
   - **Build Command**: `npm ci --only=production`
   - **Start Command**: `npm run server`
   - **Plan**: Free (or paid for better performance)
5. Add environment variable: `NODE_ENV=production`
6. Deploy!

### 2. Vercel Setup (Frontends)
```bash
npm install -g vercel
vercel login

# Deploy TV App
vercel --prod

# Deploy Remote App  
cd remote-app
vercel --prod
```

### 3. GitHub Secrets Configuration
Add these secrets to your GitHub repository (Settings → Secrets):

#### Render Secrets:
- `RENDER_API_KEY`: Get from Render Account Settings → API Keys
- `RENDER_SERVICE_ID`: Get from your service dashboard URL

#### Vercel Secrets:
- `VERCEL_TOKEN`: Get from Vercel Account Settings → Tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_TV_PROJECT_ID`: TV app project ID
- `VERCEL_REMOTE_PROJECT_ID`: Remote app project ID

#### Environment URLs:
- `WEBSOCKET_URL`: Your Render app URL (e.g., https://tv-websocket-server.onrender.com)

### 4. Production URLs
After deployment, you'll have:
- **TV App**: https://tv-app-frontend.vercel.app
- **Remote App**: https://tv-remote-app.vercel.app  
- **WebSocket Server**: https://tv-websocket-server.onrender.com

### 5. Update Environment Variables
1. Update `.env.production` with your Render URL
2. Set Vercel environment variables in dashboard
3. Update GitHub secrets

## 🔄 CI/CD Pipeline
The pipeline automatically:
1. Tests all components on PR/push
2. Deploys backend to Render
3. Deploys frontends to Vercel
4. Notifies deployment status

## 📱 QR Code Setup
The TV app will generate QR codes pointing to your production Remote app URL.

## 🔧 Manual Deployment Commands
```bash
# Test locally
docker-compose up --build

# Deploy to Render (via Git push or dashboard)
git push origin main

# Deploy to Vercel
vercel --prod
cd remote-app && vercel --prod
```

## 📊 Render Features
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Auto-deploy from Git
- ✅ Environment variables
- ✅ Health checks
- ✅ Logs and metrics