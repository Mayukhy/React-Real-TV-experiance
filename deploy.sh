#!/bin/bash
# deploy.sh - Deployment script

echo "🚀 Starting deployment process..."

# Build all images
echo "📦 Building Docker images..."
docker build -t tv-app-websocket .
docker build -t tv-app-frontend -f Dockerfile.tv .
docker build -t tv-app-remote ./remote-app -f Dockerfile.remote

echo "✅ All images built successfully!"

# Option to push to registry
read -p "Push to Docker Hub? (y/n): " push_to_hub
if [ "$push_to_hub" = "y" ]; then
    read -p "Enter your Docker Hub username: " username
    
    docker tag tv-app-websocket $username/tv-app-websocket
    docker tag tv-app-frontend $username/tv-app-frontend
    docker tag tv-app-remote $username/tv-app-remote
    
    docker push $username/tv-app-websocket
    docker push $username/tv-app-frontend
    docker push $username/tv-app-remote
    
    echo "✅ Images pushed to Docker Hub!"
fi

echo "🎉 Deployment preparation complete!"