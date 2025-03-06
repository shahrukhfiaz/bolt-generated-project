import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Cookies: React.FC = () => {
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
          Cookie Policy
        </h1>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last Updated: 2025
        </p>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <p>
              This Cookie Policy explains how isitDownChecker.com ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website at <a href="https://isitdownchecker.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://isitdownchecker.com</a> ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information. Cookies set by the website owner (in this case, isitDownChecker.com) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              2. Why Do We Use Cookies?
            </h2>
            <p className="mb-3">
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
            </p>
            <p>
              The specific types of first and third-party cookies served through our Website and the purposes they perform are described below:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</li>
              <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</li>
              <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</li>
              <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              3. How Can You Control Cookies?
            </h2>
            <p className="mb-3">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner that appears when you first visit our website.
            </p>
            <p className="mb-3">
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
            </p>
            <p>
              In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" className="text-blue-600 dark:text-blue-400 hover:underline">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" className="text-blue-600 dark:text-blue-400 hover:underline">http://www.youronlinechoices.com</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              4. How Often Will We Update This Cookie Policy?
            </h2>
            <p>
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              5. Where Can You Get Further Information?
            </h2>
            <p>
              If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@isitdownchecker.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@isitdownchecker.com</a>.
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

export default Cookies;
