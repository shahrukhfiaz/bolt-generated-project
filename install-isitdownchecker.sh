#!/bin/bash

# IsItDownChecker Installation Script for Ubuntu 24.04
# This script installs all dependencies and sets up the project

echo "====================================================="
echo "  IsItDownChecker Installation Script for Ubuntu 24  "
echo "====================================================="
echo ""

# Check if script is run with sudo
if [ "$EUID" -eq 0 ]; then
  echo "Please do not run this script with sudo or as root."
  echo "The script will use sudo only when necessary."
  exit 1
fi

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Update package lists
echo "Updating package lists..."
sudo apt update

# Install required dependencies
echo "Installing required dependencies..."
sudo apt install -y curl git build-essential

# Install Node.js if not already installed
if ! command_exists node; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

# Check Node.js and npm versions
echo "Checking Node.js and npm versions..."
node_version=$(node -v)
npm_version=$(npm -v)
echo "Node.js version: $node_version"
echo "npm version: $npm_version"

# Create a directory for the project
echo "Creating project directory..."
mkdir -p ~/isitdownchecker
cd ~/isitdownchecker

# Clone the repository
echo "Cloning the repository..."
git clone https://github.com/shahrukhfiaz/boltprojectisitdown.git .

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOF
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibWRlcHRudmNvdnVudGV0cWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDgzNzYsImV4cCI6MjA1NjE4NDM3Nn0.sJe8jnIQjvOQGcLLAsjDk-C49f3UjkiDR6cuNRLkduc
VITE_SUPABASE_URL=https://jbmdeptnvcovuntetqgn.supabase.co

# Mapbox token for the OutageMap component
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoic2hhaHJ1a2hmaWF6IiwiYSI6ImNtN21qenN6bzBuMTYyaXEwbW1qazdoZjMifQ.QfGArp8DlF35-aRrmQvk3Q
EOF
fi

# Set up the server component
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

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Go back to the project root
cd ..

# Create a start script
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

echo ""
echo "====================================================="
echo "  Installation Complete!                             "
echo "====================================================="
echo ""
echo "To start the application:"
echo "  cd ~/isitdownchecker"
echo "  ./start.sh"
echo ""
echo "The client will be available at: http://localhost:5173"
echo "The server will be available at: http://localhost:5000"
echo ""
echo "Thank you for installing IsItDownChecker!"
