import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { checkWebsiteStatus } from '../services/websiteService';
import { formatUrl, isValidUrl, getDomainName } from '../utils/urlUtils';
import { Website } from '../types';
import IncidentReport from './IncidentReport';
import UptimeChart from './UptimeChart';
import { useLocation } from 'react-router-dom';

const WebsiteChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<Website | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showIncidentReport, setShowIncidentReport] = useState(false);
  const [showUptimeChart, setShowUptimeChart] = useState(false);
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check for website parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const websiteParam = params.get('website');
    
    if (websiteParam) {
      setUrl(websiteParam);
      
      // Auto-check the website status
      const checkWebsite = async () => {
        try {
          const formattedUrl = formatUrl(websiteParam);
          
          if (!isValidUrl(formattedUrl)) {
            setError('Please enter a valid URL');
            return;
          }
          
          setIsChecking(true);
          setError(null);
          setResult(null);
          setShowIncidentReport(false);
          setShowUptimeChart(false);
          
          const status = await checkWebsiteStatus(formattedUrl);
          setResult(status);
          setShowIncidentReport(true);
          setShowUptimeChart(true);
        } catch (err) {
          setError('An error occurred while checking the website');
          console.error('Error in auto-check:', typeof err === 'object' && err !== null ? (err as Error).message || 'Unknown error' : String(err));
        } finally {
          setIsChecking(false);
        }
      };
      
      checkWebsite();
      
      // Focus on the search input
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [location.search]);

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setError(null);
    
    // Show suggestions if the URL doesn't have a TLD
    if (inputUrl && !inputUrl.includes('.')) {
      setSuggestions([`${inputUrl}.com`, `${inputUrl}.org`, `${inputUrl}.net`]);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setUrl(suggestion);
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }
    
    try {
      const formattedUrl = formatUrl(url);
      
      if (!isValidUrl(formattedUrl)) {
        setError('Please enter a valid URL');
        return;
      }
      
      setIsChecking(true);
      setError(null);
      setResult(null);
      setShowIncidentReport(false);
      setShowUptimeChart(false);
      
      const status = await checkWebsiteStatus(formattedUrl);
      setResult(status);
      setShowIncidentReport(true);
      setShowUptimeChart(true);
      
      // Update URL with the website parameter for better SEO and sharing
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('website', formattedUrl);
      window.history.pushState({}, '', currentUrl.toString());
    } catch (err) {
      setError('An error occurred while checking the website');
      console.error('Error in handleSubmit:', typeof err === 'object' && err !== null ? (err as Error).message || 'Unknown error' : String(err));
    } finally {
      setIsChecking(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto" id="website-checker">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Is it down for everyone or just you?
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6" itemScope itemType="https://schema.org/WebSite">
          <meta itemProp="url" content="https://isitdownchecker.com/" />
          <div itemProp="potentialAction" itemScope itemType="https://schema.org/SearchAction">
            <meta itemProp="target" content="https://isitdownchecker.com/?website={search_term_string}" />
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={url}
                onChange={handleUrlChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter website URL (e.g., google.com)"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isChecking}
                aria-label="Website URL"
                itemProp="query-input"
                name="search_term_string"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                disabled={isChecking}
                aria-label="Check website status"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
          
          {/* URL suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white dark:bg-gray-700 rounded-md shadow-md border border-gray-200 dark:border-gray-600">
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-white"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}
        </form>
        
        {isChecking && (
          <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Clock className="animate-spin h-8 w-8 text-blue-500 mr-3" />
            <p className="text-gray-700 dark:text-gray-200">Checking real-time website status...</p>
          </div>
        )}
        
        {result && (
          <div className={`p-6 rounded-lg ${
            result.status === 'up'
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          }`} itemScope itemType="https://schema.org/TechArticle">
            <meta itemProp="headline" content={`${getDomainName(result.url)} Status Check Result`} />
            <meta itemProp="datePublished" content={new Date().toISOString()} />
            <div className="flex items-center mb-4">
              {result.status === 'up' ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
              )}
              <h3 className="text-xl font-semibold" itemProp="name">
                {result.status === 'up'
                  ? "It's just you! The website is UP."
                  : "It's not just you! The website appears to be DOWN."}
              </h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-md p-4 mb-4" itemProp="articleBody">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">URL checked:</span> <span itemProp="url">{result.url}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Status:</span>{' '}
                <span className={result.status === 'up' ? 'text-green-500' : 'text-red-500'} itemProp="description">
                  {result.status.toUpperCase()}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Last checked:</span>{' '}
                <time itemProp="dateModified" dateTime={new Date().toISOString()}>
                  {new Date().toLocaleString()}
                </time>
              </p>
              {result.responseTime && (
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Response time:</span>{' '}
                  <span itemProp="timeRequired">{result.responseTime}ms</span>
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.open(result.url, '_blank')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Visit Website
              </button>
              <button
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Check Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Incident Report Section */}
      {showIncidentReport && result && (
        <div className="mt-6">
          <IncidentReport websiteUrl={result.url} websiteId={result.id} />
        </div>
      )}
      
      {/* Uptime Chart Section */}
      {showUptimeChart && result && (
        <div className="mt-6">
          <UptimeChart websiteUrl={result.url} websiteId={result.id} timeRange="24h" />
        </div>
      )}
    </div>
  );
};

export default WebsiteChecker;
