import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WebsiteChecker from './components/WebsiteChecker';
import RecentOutages from './components/RecentOutages';
import PopularWebsites from './components/PopularWebsites';
import MonitoredWebsites from './components/MonitoredWebsites';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UptimeMonitor from './pages/UptimeMonitor';
import OutageMap from './pages/OutageMap';
import ApiDocs from './pages/ApiDocs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Contact from './pages/Contact';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminControls from './components/AdminControls';

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(storedTheme || (prefersDark ? 'dark' : 'light'));

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Is It Down Checker",
      "url": "https://isitdownchecker.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://isitdownchecker.com/?website={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "Check if websites are down for everyone or just you. Monitor uptime and get real-time status updates."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={
                  <div className="space-y-8">
                    <WebsiteChecker />
                    <RecentOutages />
                    <PopularWebsites />
                    <MonitoredWebsites />
                  </div>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/uptime" element={<UptimeMonitor />} />
                <Route path="/outage-map" element={<OutageMap />} />
                <Route path="/api" element={<ApiDocs />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
