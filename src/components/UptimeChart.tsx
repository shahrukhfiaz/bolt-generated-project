import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions
} from 'chart.js';
import { format } from 'date-fns';
import { getUptimeData } from '../services/websiteService';
import { UptimeData } from '../types';
import { Clock } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface UptimeChartProps {
  websiteId: string;
  websiteUrl: string;
  timeRange: '24h' | '7d' | '30d';
}

const UptimeChart: React.FC<UptimeChartProps> = ({ websiteId, websiteUrl, timeRange }) => {
  const [uptimeData, setUptimeData] = useState<UptimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTimeRange, setActiveTimeRange] = useState<'24h' | '7d' | '30d'>(timeRange);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Convert timeRange to days
        const days = activeTimeRange === '24h' ? 1 : activeTimeRange === '7d' ? 7 : 30;
        
        const data = await getUptimeData(websiteId, days);
        setUptimeData(data);
      } catch (err) {
        setError('Failed to load uptime data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId, activeTimeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Clock className="animate-spin h-6 w-6 text-blue-500 mr-3" />
        <p>Loading uptime data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = {
    labels: uptimeData.map(data => format(new Date(data.timestamp), 'MMM dd, HH:mm')),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: uptimeData.map(data => data.responseTime || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: uptimeData.map(data => 
          data.status === 'up' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        pointBorderColor: uptimeData.map(data => 
          data.status === 'up' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        tension: 0.1
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = uptimeData[context.dataIndex];
            const status = dataPoint.status === 'up' ? '🟢 UP' : '🔴 DOWN';
            const responseTime = dataPoint.responseTime 
              ? `Response Time: ${dataPoint.responseTime}ms` 
              : 'No Response';
            return [`Status: ${status}`, responseTime];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Response Time (ms)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  // Calculate uptime percentage
  const uptimePercentage = (uptimeData.filter(data => data.status === 'up').length / uptimeData.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Uptime for {new URL(websiteUrl).hostname.replace('www.', '')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Last {activeTimeRange === '24h' ? '24 hours' : activeTimeRange === '7d' ? '7 days' : '30 days'}
          </p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center">
          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
            uptimePercentage >= 99 ? 'bg-green-500' : 
            uptimePercentage >= 95 ? 'bg-yellow-500' : 
            uptimePercentage >= 90 ? 'bg-orange-500' : 'bg-red-500'
          }`}>
            {uptimePercentage.toFixed(2)}% Uptime
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button 
          onClick={() => setActiveTimeRange('24h')} 
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            activeTimeRange === '24h' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Last 24 Hours
        </button>
        <button 
          onClick={() => setActiveTimeRange('7d')} 
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            activeTimeRange === '7d' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Last 7 Days
        </button>
        <button 
          onClick={() => setActiveTimeRange('30d')} 
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            activeTimeRange === '30d' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          Last 30 Days
        </button>
      </div>
    </div>
  );
};

export default UptimeChart;
