#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Infrastructure Configuration Variables
VPS_IP="$(grep -E '^VPS_IP=' .env | cut -d= -f2- | tr -d "\"'\r")"
: "${VPS_IP:?VPS_IP is missing from .env}"

VPS_USER="ubuntu"
SSH_KEY="$HOME/.ssh/aws_key_my_site"
REMOTE_DIR="~/kuv-backend"

echo "Building NestJS Backend..."
npm run build

echo "Building Docker Image..."
docker build -t kuv-backend:latest .

echo "Ensuring remote target directories exist..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "mkdir -p $REMOTE_DIR"

echo "Syncing Configurations and Static Files..."
rsync -avz -e "ssh -i $SSH_KEY" ./nginx.conf "$VPS_USER@$VPS_IP:$REMOTE_DIR/nginx.conf"
rsync -avz -e "ssh -i $SSH_KEY" ./docker-compose.yaml "$VPS_USER@$VPS_IP:$REMOTE_DIR/docker-compose.yaml"
rsync -avz -e "ssh -i $SSH_KEY" ./.env "$VPS_USER@$VPS_IP:$REMOTE_DIR/.env"

echo "Shipping Image to VPS (This may take a minute)..."
docker save kuv-backend:latest | gzip | ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "gunzip | docker load"

echo "Restarting Docker Stack..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "cd $REMOTE_DIR && docker compose up -d --force-recreate"

echo "Cleaning up orphaned images on VPS..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "docker image prune -f"

echo "Deployment Successful!"