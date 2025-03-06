import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';

const Terms: React.FC = () => {
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
          Terms of Service
        </h1>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last Updated: 2025
        </p>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing the website at <a href="https://isitdownchecker.com/" className="text-blue-600 dark:text-blue-400 hover:underline">https://isitdownchecker.com/</a> or any of our related sites, you agree to be bound by these Terms of Service, all applicable laws and regulations, and acknowledge that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              2. Use License
            </h2>
            <p className="mb-3">
              Permission is granted to temporarily download one copy of the materials (information or software) on Digital Storming LLC's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on Digital Storming LLC's website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p className="mt-3">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by Digital Storming LLC at any time.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              3. Disclaimer
            </h2>
            <p>
              The materials on Digital Storming LLC's website are provided on an "as is" basis. Digital Storming LLC makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other rights.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              4. Limitations
            </h2>
            <p>
              In no event shall Digital Storming LLC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Digital Storming LLC's website.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              5. Accuracy of Materials
            </h2>
            <p>
              The materials appearing on Digital Storming LLC's website may include technical, typographical, or photographic errors. Digital Storming LLC does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              6. Links to Third-Party Sites
            </h2>
            <p>
              Digital Storming LLC is not responsible for the contents of any linked site. The inclusion of any link does not imply endorsement by Digital Storming LLC of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              7. Modifications to Terms of Service
            </h2>
            <p>
              Digital Storming LLC may revise these Terms of Service for its website at any time without notice.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              8. Governing Law
            </h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of Delaware, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              9. Affiliate Disclosure
            </h2>
            <p>
              Some of the links on this page may be affiliate links. This means that if you click on the link and purchase an item, we will receive an affiliate commission at no extra cost to you.
            </p>
          </section>
          
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Contact Us
            </h2>
            <div className="space-y-1">
              <p><strong>Digital Storming LLC</strong></p>
              <p>📍 Location: Dover, DE, USA</p>
              <p>📧 Email: <a href="mailto:support@isitdownchecker.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@isitdownchecker.com</a></p>
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

export default Terms;
