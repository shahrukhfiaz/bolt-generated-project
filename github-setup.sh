#!/bin/bash

# IsItDownChecker GitHub Repository Setup Script
# This script clones the repository and sets up both client and server components

echo "=== IsItDownChecker GitHub Repository Setup ==="
echo "This script will clone the repository and set up both client and server components."
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git before running this script."
    echo "Visit https://git-scm.com/downloads to download and install Git."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before running this script."
    echo "Visit https://nodejs.org/ to download and install Node.js."
    exit 1
fi

# Create a directory for the project
echo "Creating project directory..."
mkdir -p isitdownchecker
cd isitdownchecker

# Clone the repository
echo "Cloning the repository..."
git clone https://github.com/shahrukhfiaz/boltprojectisitdown.git .

if [ $? -ne 0 ]; then
    echo "Failed to clone the repository. Please check your internet connection and try again."
    exit 1
fi

# Create server directory
echo "Setting up server component..."
mkdir -p server
cd server

# Create server files
echo "Creating server files..."
cat > server.js << 'EOF'
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Website status check endpoint
app.get('/check', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL parameter is required');
  }
  
  console.log(`Checking status for: ${url}`);
  
  try {
    // Attempt to fetch the website
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // If we get here, the website is up
    console.log(`Status for ${url}: Up (${response.status})`);
    res.send('Up');
  } catch (error) {
    // If there's an error, the website is down
    console.log(`Status for ${url}: Down (${error.message || 'Unknown error'})`);
    res.send('Down');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Website status check endpoint: http://localhost:${port}/check?url=https://example.com`);
});
EOF

# Create package.json for server
cat > package.json << 'EOF'
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

# Create .env file for server
cat > .env << 'EOF'
PORT=5000
EOF

# Create .gitignore file for server
cat > .gitignore << 'EOF'
node_modules/
.env
npm-debug.log
yarn-debug.log
yarn-error.log
.DS_Store
EOF

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Go back to the project root
cd ..

# Install client dependencies
echo "Installing client dependencies..."
npm install

# Create a start script for the entire application
echo "Creating start script..."
cat > start.sh << 'EOF'
#!/bin/bash

# Start both client and server
echo "Starting IsItDownChecker application..."

# Start the server in the background
echo "Starting server..."
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait a moment for the server to start
sleep 2

# Start the client
echo "Starting client..."
npm run dev

# When the client is stopped, also stop the server
kill $SERVER_PID
EOF

# Make the start script executable
chmod +x start.sh

# Create a Windows start script
cat > start.bat << 'EOF'
@echo off
echo Starting IsItDownChecker application...

echo Starting server...
start /B cmd /c "cd server && npm start"

echo Waiting for server to start...
timeout /t 2 /nobreak > nul

echo Starting client...
npm run dev
EOF

echo ""
echo "=== Setup Complete ==="
echo "To start the application:"
echo "- On Linux/Mac: ./start.sh"
echo "- On Windows: start.bat"
echo ""
echo "The client will be available at: http://localhost:5173"
echo "The server will be available at: http://localhost:5000"
echo ""
