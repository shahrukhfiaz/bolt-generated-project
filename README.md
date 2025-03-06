# IsItDownChecker

A real-time website status checker that allows users to check if a website is down for everyone or just them. The application includes features like uptime monitoring, outage maps, and user-reported incidents.

## Features

- Real-time website status checking
- Uptime monitoring with historical data
- Global outage map showing reported issues
- User-reported incidents and "Me too" functionality
- Dark mode support
- Responsive design for all devices

## Installation

### Option 1: Quick Setup (Recommended)

1. Download the setup script:

   **For Linux/Mac:**
   ```bash
   curl -o github-setup.sh https://raw.githubusercontent.com/shahrukhfiaz/isitdownchecker/main/github-setup.sh
   chmod +x github-setup.sh
   ./github-setup.sh
   ```

   **For Windows:**
   ```
   curl -o github-setup.bat https://raw.githubusercontent.com/shahrukhfiaz/isitdownchecker/main/github-setup.bat
   github-setup.bat
   ```

2. Start the application:

   **For Linux/Mac:**
   ```bash
   cd isitdownchecker
   ./start.sh
   ```

   **For Windows:**
   ```
   cd isitdownchecker
   start.bat
   ```

### Option 2: Manual Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/shahrukhfiaz/isitdownchecker.git
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
   # Create server.js, package.json, and .env files as described in the setup scripts
   npm install
   cd ..
   ```

4. Start the server:
   ```bash
   cd server
   npm start
   ```

5. In a separate terminal, start the client:
   ```bash
   npm run dev
   ```

## Server Component

The server component provides a simple API endpoint for checking if a website is up or down. It's built with Express.js and uses Axios to make HTTP requests to check website status.

### API Endpoints

- `GET /check?url=https://example.com` - Check if a website is up or down
- `GET /health` - Health check endpoint

## Deployment Options

### Docker

The server component can be deployed using Docker:

```bash
cd server
docker build -t website-status-checker .
docker run -p 5000:5000 website-status-checker
```

Or using Docker Compose:

```bash
cd server
docker-compose up -d
```

### PM2 (Production)

For production environments, you can use PM2:

```bash
cd server
npm install -g pm2
pm2 start pm2.config.js
```

## Environment Variables

### Client

- `VITE_SUPABASE_URL` - Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_MAPBOX_TOKEN` - Mapbox token for the OutageMap component

### Server

- `PORT` - The port on which the server will run (default: 5000)

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox
- **Charts**: Chart.js

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
