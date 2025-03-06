@echo off
echo === IsItDownChecker GitHub Repository Setup ===
echo This script will clone the repository and set up both client and server components.
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install Git before running this script.
    echo Visit https://git-scm.com/downloads to download and install Git.
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js before running this script.
    echo Visit https://nodejs.org/ to download and install Node.js.
    exit /b 1
)

REM Create a directory for the project
echo Creating project directory...
mkdir isitdownchecker
cd isitdownchecker

REM Clone the repository
echo Cloning the repository...
git clone https://github.com/shahrukhfiaz/isitdownchecker.git .

if %ERRORLEVEL% neq 0 (
    echo Failed to clone the repository. Please check your internet connection and try again.
    exit /b 1
)

REM Create server directory
echo Setting up server component...
mkdir server
cd server

REM Create server files
echo Creating server files...
(
echo const express = require('express'^);
echo const axios = require('axios'^);
echo const cors = require('cors'^);
echo const helmet = require('helmet'^);
echo.
echo const app = express(^);
echo const port = process.env.PORT ^|^| 5000;
echo.
echo // Middleware
echo app.use(cors(^)^);
echo app.use(helmet(^)^);
echo app.use(express.json(^)^);
echo.
echo // Website status check endpoint
echo app.get('/check', async (req, res^) =^> {
echo   const { url } = req.query;
echo.  
echo   if (!url^) {
echo     return res.status(400^).send('URL parameter is required'^);
echo   }
echo.  
echo   console.log(`Checking status for: ${url}`^);
echo.  
echo   try {
echo     // Attempt to fetch the website
echo     const response = await axios.get(url, {
echo       timeout: 10000,
echo       headers: {
echo         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64^) AppleWebKit/537.36 (KHTML, like Gecko^) Chrome/91.0.4472.124 Safari/537.36'
echo       }
echo     }^);
echo.    
echo     // If we get here, the website is up
echo     console.log(`Status for ${url}: Up (${response.status}^)`^);
echo     res.send('Up'^);
echo   } catch (error^) {
echo     // If there's an error, the website is down
echo     console.log(`Status for ${url}: Down (${error.message ^|^| 'Unknown error'}^)`^);
echo     res.send('Down'^);
echo   }
echo }^);
echo.
echo // Health check endpoint
echo app.get('/health', (req, res^) =^> {
echo   res.status(200^).send('OK'^);
echo }^);
echo.
echo app.listen(port, (^) =^> {
echo   console.log(`Server running on port ${port}`^);
echo   console.log(`Website status check endpoint: http://localhost:${port}/check?url=https://example.com`^);
echo }^);
) > server.js

REM Create package.json for server
(
echo {
echo   "name": "website-status-checker-server",
echo   "version": "1.0.0",
echo   "description": "Server for checking website status",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js",
echo     "dev": "nodemon server.js"
echo   },
echo   "dependencies": {
echo     "axios": "^1.6.2",
echo     "cors": "^2.8.5",
echo     "express": "^4.18.2",
echo     "helmet": "^7.1.0"
echo   },
echo   "devDependencies": {
echo     "nodemon": "^3.0.1"
echo   }
echo }
) > package.json

REM Create .env file for server
echo PORT=5000 > .env

REM Create .gitignore file for server
(
echo node_modules/
echo .env
echo npm-debug.log
echo yarn-debug.log
echo yarn-error.log
echo .DS_Store
) > .gitignore

REM Install server dependencies
echo Installing server dependencies...
call npm install

REM Go back to the project root
cd ..

REM Install client dependencies
echo Installing client dependencies...
call npm install

REM Create a Windows start script
(
echo @echo off
echo Starting IsItDownChecker application...
echo.
echo Starting server...
echo start /B cmd /c "cd server && npm start"
echo.
echo Waiting for server to start...
echo timeout /t 2 /nobreak ^> nul
echo.
echo Starting client...
echo npm run dev
) > start.bat

echo.
echo === Setup Complete ===
echo To start the application, run: start.bat
echo.
echo The client will be available at: http://localhost:5173
echo The server will be available at: http://localhost:5000
echo.
