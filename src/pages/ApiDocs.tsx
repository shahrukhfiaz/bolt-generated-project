import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Info } from 'lucide-react';

const ApiDocs: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      id: 'check',
      name: 'Check Website Status',
      method: 'GET',
      path: '/api/v1/check',
      description: 'Check if a website is up or down',
      parameters: [
        { name: 'url', type: 'string', required: true, description: 'The URL to check (e.g., https://example.com)' }
      ],
      response: {
        status: 'up',
        url: 'https://example.com',
        responseTime: 125,
        lastChecked: '2025-06-15T12:30:45Z'
      }
    },
    {
      id: 'history',
      name: 'Get Uptime History',
      method: 'GET',
      path: '/api/v1/history',
      description: 'Get historical uptime data for a website',
      parameters: [
        { name: 'url', type: 'string', required: true, description: 'The URL to check' },
        { name: 'days', type: 'number', required: false, description: 'Number of days of history (default: 7, max: 30)' }
      ],
      response: [
        {
          timestamp: '2025-06-15T12:30:45Z',
          status: 'up',
          responseTime: 125
        },
        {
          timestamp: '2025-06-15T11:30:45Z',
          status: 'up',
          responseTime: 130
        },
        {
          timestamp: '2025-06-15T10:30:45Z',
          status: 'down',
          responseTime: null
        }
      ]
    },
    {
      id: 'incidents',
      name: 'Get Reported Incidents',
      method: 'GET',
      path: '/api/v1/incidents',
      description: 'Get user-reported incidents for a website',
      parameters: [
        { name: 'url', type: 'string', required: true, description: 'The URL to check' },
        { name: 'limit', type: 'number', required: false, description: 'Maximum number of incidents to return (default: 10, max: 100)' }
      ],
      response: [
        {
          id: '123456',
          type: 'down',
          timestamp: '2025-06-15T10:30:45Z',
          meTooCount: 42,
          location: {
            city: 'New York',
            country: 'United States'
          }
        },
        {
          id: '123457',
          type: 'slow',
          timestamp: '2025-06-15T09:15:22Z',
          meTooCount: 18,
          location: {
            city: 'London',
            country: 'United Kingdom'
          }
        }
      ]
    },
    {
      id: 'report',
      name: 'Submit Incident Report',
      method: 'POST',
      path: '/api/v1/report',
      description: 'Submit a new incident report for a website',
      parameters: [
        { name: 'url', type: 'string', required: true, description: 'The URL to report' },
        { name: 'type', type: 'string', required: true, description: 'Type of incident (down, slow, intermittent, partial)' },
        { name: 'apiKey', type: 'string', required: true, description: 'Your API key' }
      ],
      requestBody: {
        url: 'https://example.com',
        type: 'down',
        apiKey: 'your_api_key_here'
      },
      response: {
        success: true,
        message: 'Incident report submitted successfully',
        reportId: '123458'
      }
    },
    {
      id: 'popular',
      name: 'Get Popular Websites',
      method: 'GET',
      path: '/api/v1/popular',
      description: 'Get a list of popular websites and their current status',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Maximum number of websites to return (default: 10, max: 50)' }
      ],
      response: [
        {
          url: 'https://google.com',
          status: 'up',
          responseTime: 125
        },
        {
          url: 'https://facebook.com',
          status: 'up',
          responseTime: 230
        },
        {
          url: 'https://twitter.com',
          status: 'down',
          responseTime: null
        }
      ]
    }
  ];

  const codeExamples = {
    curl: {
      check: `curl -X GET "https://api.isitdownchecker.com/v1/check?url=https://example.com"`,
      history: `curl -X GET "https://api.isitdownchecker.com/v1/history?url=https://example.com&days=7"`,
      incidents: `curl -X GET "https://api.isitdownchecker.com/v1/incidents?url=https://example.com&limit=10"`,
      report: `curl -X POST "https://api.isitdownchecker.com/v1/report" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com","type":"down","apiKey":"your_api_key_here"}'`,
      popular: `curl -X GET "https://api.isitdownchecker.com/v1/popular?limit=10"`
    },
    javascript: {
      check: `fetch('https://api.isitdownchecker.com/v1/check?url=https://example.com')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
      history: `fetch('https://api.isitdownchecker.com/v1/history?url=https://example.com&days=7')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
      incidents: `fetch('https://api.isitdownchecker.com/v1/incidents?url=https://example.com&limit=10')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
      report: `fetch('https://api.isitdownchecker.com/v1/report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    type: 'down',
    apiKey: 'your_api_key_here'
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
      popular: `fetch('https://api.isitdownchecker.com/v1/popular?limit=10')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
    },
    python: {
      check: `import requests

response = requests.get('https://api.isitdownchecker.com/v1/check', 
                       params={'url': 'https://example.com'})
data = response.json()
print(data)`,
      history: `import requests

response = requests.get('https://api.isitdownchecker.com/v1/history', 
                       params={'url': 'https://example.com', 'days': 7})
data = response.json()
print(data)`,
      incidents: `import requests

response = requests.get('https://api.isitdownchecker.com/v1/incidents', 
                       params={'url': 'https://example.com', 'limit': 10})
data = response.json()
print(data)`,
      report: `import requests

payload = {
    'url': 'https://example.com',
    'type': 'down',
    'apiKey': 'your_api_key_here'
}

response = requests.post('https://api.isitdownchecker.com/v1/report', json=payload)
data = response.json()
print(data)`,
      popular: `import requests

response = requests.get('https://api.isitdownchecker.com/v1/popular', 
                       params={'limit': 10})
data = response.json()
print(data)`
    }
  };

  const [activeTab, setActiveTab] = useState<'curl' | 'javascript' | 'python'>('curl');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          API Documentation
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Integrate website status checking into your applications with our simple and powerful API.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-600 dark:text-blue-400 mb-2">
              <strong>Get your API key</strong>
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              To use our API, you'll need an API key. <a href="/register" className="underline">Create an account</a> or <a href="/login" className="underline">log in</a> to get your API key from the dashboard.
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Base URL
          </h2>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center">
            <code className="text-blue-600 dark:text-blue-400">https://api.isitdownchecker.com/v1</code>
            <button 
              onClick={() => copyToClipboard('https://api.isitdownchecker.com/v1', 'base-url')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {copiedEndpoint === 'base-url' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Authentication
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Some endpoints require authentication using an API key. Include your API key in the request parameters or headers as shown in the examples.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Example with query parameter:</p>
            <code className="text-blue-600 dark:text-blue-400">
              https://api.isitdownchecker.com/v1/report?apiKey=your_api_key_here
            </code>
            
            <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2">Example with header:</p>
            <code className="text-blue-600 dark:text-blue-400">
              X-API-Key: your_api_key_here
            </code>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Rate Limits
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Plan</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Rate Limit</th>
                  <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                <tr>
                  <td className="py-2 px-4 text-gray-800 dark:text-white">Free</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">100 requests per day</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">$0</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-gray-800 dark:text-white">Basic</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">1,000 requests per day</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">$9.99/month</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-gray-800 dark:text-white">Pro</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">10,000 requests per day</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">$29.99/month</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-gray-800 dark:text-white">Enterprise</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">Custom</td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-300">Contact us</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Endpoints
          </h2>
          
          <div className="space-y-8">
            {endpoints.map(endpoint => (
              <div key={endpoint.id} id={endpoint.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold mr-3 ${
                      endpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {endpoint.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`https://api.isitdownchecker.com${endpoint.path}`, endpoint.id)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    {copiedEndpoint === endpoint.id ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {endpoint.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                      Endpoint
                    </h4>
                    <code className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-blue-600 dark:text-blue-400 block">
                      {endpoint.path}
                    </code>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                      Parameters
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-600">
                          <tr>
                            <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Name</th>
                            <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Type</th>
                            <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Required</th>
                            <th className="py-2 px-4 text-left text-gray-800 dark:text-white">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {endpoint.parameters.map(param => (
                            <tr key={param.name}>
                              <td className="py-2 px-4 text-gray-800 dark:text-white">{param.name}</td>
                              <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{param.type}</td>
                              <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{param.required ? 'Yes' : 'No'}</td>
                              <td className="py-2 px-4 text-gray-600 dark:text-gray-300">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {endpoint.requestBody && (
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                        Request Body
                      </h4>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                        <code className="text-blue-600 dark:text-blue-400">
                          {JSON.stringify(endpoint.requestBody, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                      Response
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                      <code className="text-blue-600 dark:text-blue-400">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                      Code Examples
                    </h4>
                    
                    <div className="mb-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex">
                        <button
                          onClick={() => setActiveTab('curl')}
                          className={`px-4 py-2 ${
                            activeTab === 'curl'
                              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          cURL
                        </button>
                        <button
                          onClick={() => setActiveTab('javascript')}
                          className={`px-4 py-2 ${
                            activeTab === 'javascript'
                              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          JavaScript
                        </button>
                        <button
                          onClick={() => setActiveTab('python')}
                          className={`px-4 py-2 ${
                            activeTab === 'python'
                              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          Python
                        </button>
                      </div>
                    </div>
                    
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                      <code className="text-blue-600 dark:text-blue-400">
                        {codeExamples[activeTab][endpoint.id as keyof typeof codeExamples.curl]}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Need Help?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you have any questions or need assistance with our API, please don't hesitate to contact us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="mailto:api@isitdownchecker.com" 
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Contact API Support
          </a>
          <a 
            href="https://github.com/isitdownchecker/api-docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            API Documentation on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
