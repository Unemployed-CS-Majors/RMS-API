#!/bin/bash
# Script to deploy development function locally

# Change to functions directory
cd ..
cd functions || { echo "Cannot find functions directory"; exit 1; }

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run validation
echo "Running validation..."
npm run validate

# Deploy only the dev function
echo "Deploying api-dev function..."
npm run deploy:dev

echo "Deployment completed!"