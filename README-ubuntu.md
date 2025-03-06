# IsItDownChecker Installation Guide for Ubuntu 24.04

This guide will help you install and run the IsItDownChecker application on Ubuntu 24.04.

## Automatic Installation

The easiest way to install IsItDownChecker is using our installation script:

1. Download the installation script:
   ```bash
   curl -O https://raw.githubusercontent.com/shahrukhfiaz/boltprojectisitdown/main/install-isitdownchecker.sh
   ```

2. Make the script executable:
   ```bash
   chmod +x install-isitdownchecker.sh
   ```

3. Run the installation script:
   ```bash
   ./install-isitdownchecker.sh
   ```

4. Start the application:
   ```bash
   cd ~/isitdownchecker
   ./start.sh
   ```

## Manual Installation

If you prefer to install manually, follow these steps:

### Prerequisites

1. Update your system:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. Install Node.js and npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. Install Git:
   ```bash
   sudo apt install -y git
   ```

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/shahrukhfiaz/boltprojectisitdown.git isitdownchecker
   cd isitdownchecker
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Set up the server:
   ```bash
   mkdir -p server
   cd server
   ```

4. Create server files (server.js, package.json, .env) as shown in the installation script.

5. Install server dependencies:
   ```bash
   npm install
   ```

6. Go back to the project root:
   ```bash
   cd ..
   ```

7. Create a start script:
   ```bash
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
   
   chmod +x start.sh
   ```

8. Start the application:
   ```bash
   ./start.sh
   ```

## Accessing the Application

- The client will be available at: http://localhost:5173
- The server will be available at: http://localhost:5000

## Troubleshooting

If you encounter any issues during installation:

1. Make sure you have the correct permissions:
   ```bash
   sudo chown -R $(whoami):$(whoami) ~/isitdownchecker
   ```

2. Check if ports 5173 and 5000 are available:
   ```bash
   sudo lsof -i :5173
   sudo lsof -i :5000
   ```

3. If Node.js installation fails, try:
   ```bash
   sudo apt install -y curl
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

4. If you get EACCES errors with npm:
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

## System Requirements

- Ubuntu 24.04 or later
- Node.js 20.x or later
- npm 10.x or later
- At least 1GB of free disk space
- At least 2GB of RAM

## Support

If you need help, please open an issue on our GitHub repository or contact us at support@isitdownchecker.com.
