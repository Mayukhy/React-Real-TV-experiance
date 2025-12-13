@echo off
REM deploy.bat - Windows deployment script

echo 🚀 Starting deployment process...

REM Build all images
echo 📦 Building Docker images...
docker build -t tv-app-websocket .
docker build -t tv-app-frontend -f Dockerfile.tv .
docker build -t tv-app-remote ./remote-app -f Dockerfile.remote

echo ✅ All images built successfully!

REM Option to push to registry
set /p push_to_hub="Push to Docker Hub? (y/n): "
if "%push_to_hub%"=="y" (
    set /p username="Enter your Docker Hub username: "
    
    docker tag tv-app-websocket %username%/tv-app-websocket
    docker tag tv-app-frontend %username%/tv-app-frontend  
    docker tag tv-app-remote %username%/tv-app-remote
    
    docker push %username%/tv-app-websocket
    docker push %username%/tv-app-frontend
    docker push %username%/tv-app-remote
    
    echo ✅ Images pushed to Docker Hub!
)

echo 🎉 Deployment preparation complete!