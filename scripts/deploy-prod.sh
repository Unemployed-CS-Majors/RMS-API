#!/bin/bash
# Script to deploy production function locally

# Change to functions directory
cd functions || { echo "Cannot find functions directory"; exit 1; }

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run validation
echo "Running validation..."
npm run validate

# Ask for confirmation
echo "You are about to deploy to PRODUCTION. Are you sure? (y/n)"
read -r confirmation

if [ "$confirmation" != "y" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Deploy only the production function
echo "Deploying api function to production..."
npm run deploy:prod

echo "Production deployment completed!"