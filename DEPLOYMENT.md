# Deployment Guide for TV App

## 🚀 Deployment Architecture
- **Backend (WebSocket Server)**: Railway
- **TV App Frontend**: Vercel
- **Remote App Frontend**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Setup Checklist

### 1. Railway Setup (Backend)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

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
Add these secrets to your GitHub repository:

#### Railway Secrets:
- `RAILWAY_TOKEN`: Get from Railway dashboard

#### Vercel Secrets:
- `VERCEL_TOKEN`: Get from Vercel dashboard
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_TV_PROJECT_ID`: TV app project ID
- `VERCEL_REMOTE_PROJECT_ID`: Remote app project ID

#### Environment URLs:
- `WEBSOCKET_URL`: Your Railway app URL (e.g., https://tv-app-websocket.railway.app)

### 4. Production URLs
After deployment, you'll have:
- **TV App**: https://tv-app-frontend.vercel.app
- **Remote App**: https://tv-remote-app.vercel.app  
- **WebSocket Server**: https://your-app-name.railway.app

### 5. Update Environment Variables
1. Update `.env.production` with your Railway URL
2. Set Vercel environment variables in dashboard
3. Update GitHub secrets

## 🔄 CI/CD Pipeline
The pipeline automatically:
1. Tests all components on PR/push
2. Deploys backend to Railway
3. Deploys frontends to Vercel
4. Notifies deployment status

## 📱 QR Code Setup
The TV app will generate QR codes pointing to your production Remote app URL.

## 🔧 Manual Deployment Commands
```bash
# Build and test locally
docker-compose up --build

# Deploy to Railway
railway up

# Deploy to Vercel
vercel --prod
cd remote-app && vercel --prod
```