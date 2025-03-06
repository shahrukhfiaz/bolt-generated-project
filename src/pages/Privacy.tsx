import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Privacy Policy for IsItDownChecker.com
        </h1>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last Updated: 2025
        </p>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <p className="mb-4">
              At IsItDownChecker.com, we value your privacy and are committed to being transparent about how we collect, use, and protect your information.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              We Do Not Sell Your Data
            </h2>
            <p>
              We do not sell your personal data and strive to collect as little information as possible to provide our services effectively.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Data Collection
            </h2>
            <p>
              We use Google Analytics to track website usage, which involves the use of cookies. Additionally, we may collect your IP address when you access our site or report downtime issues. In certain cases, we may ask for your name and email address if you choose to receive notifications about fixes or new features. This information is never shared with third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Advertising
            </h2>
            <p>
              To keep our site free to use, we display ads provided by third-party advertisers. These ads may use cookies to personalize content and track performance. While we try to ensure that ads respect user privacy, we have limited control over how advertisers handle your data.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Data Protection and Retention
            </h2>
            <p>
              Any personal data we collect is obtained lawfully and transparently, with your consent where required. We retain data only as long as necessary to fulfill your requests and provide our services. We implement commercially acceptable measures to safeguard your data against unauthorized access, disclosure, modification, or loss.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Third-Party Links
            </h2>
            <p>
              Our website may contain links to external sites that we do not operate. We are not responsible for the privacy policies or practices of these third-party websites.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Your Choices
            </h2>
            <p>
              You may refuse to provide personal information, but doing so may limit your access to certain features of our website. Your continued use of our website signifies your acceptance of this privacy policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Contact
            </h2>
            <p>
              If you have any questions about how we handle your personal data, feel free to contact us.
            </p>
          </section>
          
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Contact Us
            </h2>
            <div className="space-y-1">
              <p><strong>Digital Storming LLC</strong></p>
              <p>📍 Location: Dover, DE, USA</p>
              <p>📧 Email: <a href="mailto:privacy@isitdownchecker.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@isitdownchecker.com</a></p>
              <p>🌐 Website: <a href="https://isitdownchecker.com" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center inline-flex">isitdownchecker.com <ExternalLink className="h-3 w-3 ml-1" /></a></p>
            </div>
          </section>
          
          <div className="text-center pt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 Digital Storming LLC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
