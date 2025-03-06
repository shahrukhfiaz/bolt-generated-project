@echo off
echo === IsItDownChecker GitHub Repository Deployment ===
echo This script will push the project to GitHub.
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install Git before running this script.
    echo Visit https://git-scm.com/downloads to download and install Git.
    exit /b 1
)

REM Check if the repository is already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
)

REM Add all files to Git
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Initial commit of IsItDownChecker"

REM Add GitHub remote
echo Adding GitHub remote...
git remote add origin https://github.com/shahrukhfiaz/isitdownchecker.git

REM Check if the remote already exists
if %ERRORLEVEL% neq 0 (
    echo Remote already exists, setting URL...
    git remote set-url origin https://github.com/shahrukhfiaz/isitdownchecker.git
)

REM Configure Git credentials
echo Configuring Git credentials...
git config user.email "shahrukhfiaz@gmail.com"
git config user.name "Shahrukh Fiaz"

REM Push to GitHub with token
echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% neq 0 (
    echo Failed to push to main branch. Trying master branch...
    git push -u origin master
    
    if %ERRORLEVEL% neq 0 (
        echo Creating and pushing to main branch...
        git checkout -b main
        git push -u origin main
    )
)

echo.
echo === Deployment Complete ===
echo The project has been pushed to GitHub: https://github.com/shahrukhfiaz/isitdownchecker
echo.
