import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto" itemScope itemType="https://schema.org/WPFooter">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-gray-800 dark:text-white" itemProp="name">isitDownChecker.com</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4" itemProp="description">
              Check if a website is down for everyone or just you. Monitor uptime and get alerts when your favorite sites go down.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/isitdownchecker" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" aria-label="GitHub" rel="noopener" itemProp="sameAs">
                <Github size={20} />
              </a>
              <a href="https://twitter.com/isitdownchecker" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Twitter" rel="noopener" itemProp="sameAs">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@isitdownchecker.com" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Email" itemProp="email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Website Status Checker
                </Link>
              </li>
              <li>
                <Link to="/uptime" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Uptime Monitoring
                </Link>
              </li>
              <li>
                <Link to="/outage-map" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Outage Map
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Developer API
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/reset-password" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} isitDownChecker.com. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with <span className="text-red-500">♥</span> by <a href="https://digitalstorming.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Digital Storming</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
