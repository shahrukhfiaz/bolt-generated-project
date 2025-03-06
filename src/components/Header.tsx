import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md" itemScope itemType="https://schema.org/WPHeader">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2" itemProp="headline">
            <Globe className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">isitDownChecker.com</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6" itemScope itemType="https://schema.org/SiteNavigationElement">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" itemProp="url">
              <span itemProp="name">Home</span>
            </Link>
            <Link to="/uptime" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" itemProp="url">
              <span itemProp="name">Uptime Monitor</span>
            </Link>
            <Link to="/outage-map" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" itemProp="url">
              <span itemProp="name">Outage Map</span>
            </Link>
            <Link to="/api" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" itemProp="url">
              <span itemProp="name">API</span>
            </Link>
            
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" itemProp="url">
                  <span itemProp="name">Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  itemProp="url"
                >
                  <span itemProp="name">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  itemProp="url"
                >
                  <span itemProp="name">Register</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4" itemScope itemType="https://schema.org/SiteNavigationElement">
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
                itemProp="url"
              >
                <span itemProp="name">Home</span>
              </Link>
              <Link 
                to="/uptime" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
                itemProp="url"
              >
                <span itemProp="name">Uptime Monitor</span>
              </Link>
              <Link 
                to="/outage-map" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
                itemProp="url"
              >
                <span itemProp="name">Outage Map</span>
              </Link>
              <Link 
                to="/api" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
                itemProp="url"
              >
                <span itemProp="name">API</span>
              </Link>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
              
              {user ? (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    to="/dashboard" 
                    className="block text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                    itemProp="url"
                  >
                    <span itemProp="name">Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                    itemProp="url"
                  >
                    <span itemProp="name">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                    itemProp="url"
                  >
                    <span itemProp="name">Register</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
