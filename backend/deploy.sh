#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Infrastructure Configuration Variables
VPS_IP="151.145.84.119" # Update this to your new VPS IP if different
VPS_USER="ubuntu"
SSH_KEY="$HOME/.ssh/oracle_key_noffty" # Update if using a different SSH key
REMOTE_DIR="~/vk-backend"

echo "Building Angular Frontend Static Assets..."
# Assuming you run deploy.sh from inside the backend folder:
cd ../frontend
npm run build
cd ../backend

echo "Building NestJS Backend..."
npm run build

echo "Building Docker Image..."
docker build -t vk-backend:latest .

echo "Ensuring remote target directories exist..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "mkdir -p $REMOTE_DIR"

echo "Syncing Configurations and Static Files..."
rsync -avz --delete -e "ssh -i $SSH_KEY" ./out/ "$VPS_USER@$VPS_IP:$REMOTE_DIR/out/"
rsync -avz -e "ssh -i $SSH_KEY" ./nginx.conf "$VPS_USER@$VPS_IP:$REMOTE_DIR/nginx.conf"
rsync -avz -e "ssh -i $SSH_KEY" ./docker-compose.yml "$VPS_USER@$VPS_IP:$REMOTE_DIR/docker-compose.yml"
rsync -avz -e "ssh -i $SSH_KEY" ./.env "$VPS_USER@$VPS_IP:$REMOTE_DIR/.env"

echo "Shipping Image to VPS (This may take a minute)..."
docker save vk-backend:latest | gzip | ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "gunzip | docker load"

echo "Restarting Docker Stack..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "cd $REMOTE_DIR && docker compose up -d --force-recreate"

echo "Cleaning up orphaned images on VPS..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "docker image prune -f"

echo "Deployment Successful!"