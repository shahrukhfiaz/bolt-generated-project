@echo off
echo === Website Status Checker Server Setup ===
echo This script will install all necessary dependencies and set up the server.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js before running this script.
    echo Visit https://nodejs.org/ to download and install Node.js.
    exit /b 1
)

REM Create package.json if it doesn't exist
if not exist package.json (
    echo Creating package.json...
    echo {^
  "name": "website-status-checker-server",^
  "version": "1.0.0",^
  "description": "Server for checking website status",^
  "main": "server.js",^
  "scripts": {^
    "start": "node server.js",^
    "dev": "nodemon server.js"^
  },^
  "dependencies": {^
    "axios": "^1.6.2",^
    "cors": "^2.8.5",^
    "express": "^4.18.2",^
    "helmet": "^7.1.0"^
  },^
  "devDependencies": {^
    "nodemon": "^3.0.1"^
  }^
} > package.json
    echo package.json created.
)

REM Install dependencies
echo Installing dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    echo PORT=5000 > .env
    echo .env file created.
)

REM Create .gitignore file if it doesn't exist
if not exist .gitignore (
    echo Creating .gitignore file...
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo npm-debug.log >> .gitignore
    echo yarn-debug.log >> .gitignore
    echo yarn-error.log >> .gitignore
    echo .DS_Store >> .gitignore
    echo .gitignore file created.
)

REM Create README.md file if it doesn't exist
if not exist README.md (
    echo Creating README.md file...
    echo # Website Status Checker Server > README.md
    echo. >> README.md
    echo This server provides an API endpoint for checking if a website is up or down. >> README.md
    echo. >> README.md
    echo ## Setup >> README.md
    echo. >> README.md
    echo 1. Install dependencies: >> README.md
    echo    ```>> README.md
    echo    npm install>> README.md
    echo    ```>> README.md
    echo. >> README.md
    echo 2. Start the server: >> README.md
    echo    ```>> README.md
    echo    npm start>> README.md
    echo    ```>> README.md
    echo. >> README.md
    echo ## API Endpoints >> README.md
    echo. >> README.md
    echo ### Check Website Status >> README.md
    echo `GET /check?url=https://example.com` >> README.md
    echo. >> README.md
    echo Returns "Up" if the website is up, "Down" if the website is down. >> README.md
    echo. >> README.md
    echo ### Health Check >> README.md
    echo `GET /health` >> README.md
    echo. >> README.md
    echo Returns "OK" if the server is running. >> README.md
    echo. >> README.md
    echo ## Environment Variables >> README.md
    echo. >> README.md
    echo - `PORT`: The port on which the server will run (default: 5000) >> README.md
    echo README.md file created.
)

echo.
echo === Setup Complete ===
echo To start the server, run: npm start
echo The server will be available at: http://localhost:5000
echo To check a website status, use: http://localhost:5000/check?url=https://example.com
echo.
