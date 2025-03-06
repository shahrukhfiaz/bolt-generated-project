import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startMonitoringService } from './services/monitoringService.ts';

// Start the website monitoring service
startMonitoringService().catch(error => {
  console.error('Failed to start monitoring service:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
