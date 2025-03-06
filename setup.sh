#!/bin/bash

# Website Status Checker Server Setup Script
# This script installs all necessary dependencies and sets up the server

echo "=== Website Status Checker Server Setup ==="
echo "This script will install all necessary dependencies and set up the server."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before running this script."
    echo "Visit https://nodejs.org/ to download and install Node.js."
    exit 1
fi

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "Creating package.json..."
    cat > package.json << EOF
{
  "name": "website-status-checker-server",
  "version": "1.0.0",
  "description": "Server for checking website status",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
    echo "package.json created."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
EOF
    echo ".env file created."
fi

# Create .gitignore file if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore file..."
    cat > .gitignore << EOF
node_modules/
.env
npm-debug.log
yarn-debug.log
yarn-error.log
.DS_Store
EOF
    echo ".gitignore file created."
fi

# Create README.md file if it doesn't exist
if [ ! -f "README.md" ]; then
    echo "Creating README.md file..."
    cat > README.md << EOF
# Website Status Checker Server

This server provides an API endpoint for checking if a website is up or down.

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Start the server:
   \`\`\`
   npm start
   \`\`\`

## API Endpoints

### Check Website Status
\`GET /check?url=https://example.com\`

Returns "Up" if the website is up, "Down" if the website is down.

### Health Check
\`GET /health\`

Returns "OK" if the server is running.

## Environment Variables

- \`PORT\`: The port on which the server will run (default: 5000)
EOF
    echo "README.md file created."
fi

# Make the script executable
chmod +x server.js

echo ""
echo "=== Setup Complete ==="
echo "To start the server, run: npm start"
echo "The server will be available at: http://localhost:5000"
echo "To check a website status, use: http://localhost:5000/check?url=https://example.com"
echo ""
