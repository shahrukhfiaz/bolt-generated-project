const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'self'"],
      frameSrc: ["'self'"],
      connectSrc: ["'self'", "https://*.supabase.co"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(limiter);
app.use(limiter);

// Enhanced status check endpoint with detailed response
app.get('/api/v1/status/check', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required'
    });
  }
  
  // Validate URL format
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format'
    });
  }
  
  console.log(`Checking status for: ${url}`);
  
  try {
    const startTime = Date.now();
    
    // Attempt to fetch the website with timeout and headers
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    // Check if response is successful (2xx status code)
    const isUp = response.status >= 200 && response.status < 300;
    
    console.log(`Status for ${url}: ${isUp ? 'Up' : 'Down'} (${response.status}) - ${responseTime}ms`);
    
    res.json({
      success: true,
      data: {
        url: url,
        status: isUp ? 'up' : 'down',
        responseTime: responseTime,
        statusCode: response.status,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Handle different types of errors
    const errorMessage = error.code === 'ECONNABORTED' ? 'Timeout' :
                        error.code === 'ENOTFOUND' ? 'DNS lookup failed' :
                        error.response?.status ? `HTTP ${error.response.status}` :
                        error.message || 'Unknown error';
    
    console.log(`Status for ${url}: Down (${errorMessage})`);
    
    res.json({
      success: true,
      data: {
        url: url,
        status: 'down',
        error: errorMessage,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Documentation:`);
  console.log(`- Status Check: GET http://localhost:${port}/api/v1/status/check?url=https://example.com`);
  console.log(`- Health Check: GET http://localhost:${port}/api/v1/health`);
});
