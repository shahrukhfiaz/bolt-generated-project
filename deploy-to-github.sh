#!/bin/bash

# IsItDownChecker GitHub Repository Deployment Script
# This script pushes the project to GitHub

echo "=== IsItDownChecker GitHub Repository Deployment ==="
echo "This script will push the project to GitHub."
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git before running this script."
    echo "Visit https://git-scm.com/downloads to download and install Git."
    exit 1
fi

# Check if the repository is already initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Add all files to Git
echo "Adding files to Git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit of IsItDownChecker"

# Add GitHub remote
echo "Adding GitHub remote..."
git remote add origin https://github.com/shahrukhfiaz/boltprojectisitdown.git

# Check if the remote already exists
if [ $? -ne 0 ]; then
    echo "Remote already exists, setting URL..."
    git remote set-url origin https://github.com/shahrukhfiaz/boltprojectisitdown.git
fi

# Configure Git credentials
echo "Configuring Git credentials..."
git config user.email "shahrukhfiaz@gmail.com"
git config user.name "Shahrukh Fiaz"

# Push to GitHub with token
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo "Failed to push to main branch. Trying master branch..."
    git push -u origin master
    
    if [ $? -ne 0 ]; then
        echo "Creating and pushing to main branch..."
        git checkout -b main
        git push -u origin main
    fi
fi

echo ""
echo "=== Deployment Complete ==="
echo "The project has been pushed to GitHub: https://github.com/shahrukhfiaz/boltprojectisitdown"
echo ""
