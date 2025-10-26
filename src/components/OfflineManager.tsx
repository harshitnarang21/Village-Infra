import React, { useState, useEffect } from 'react';
import { 
  WifiIcon, 
  CloudArrowUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface OfflineData {
  id: string;
  type: 'issue_report' | 'vote' | 'maintenance_log' | 'citizen_feedback';
  data: any;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
}

interface SMSAlert {
  id: string;
  message: string;
  recipient: string;
  type: 'critical' | 'maintenance' | 'budget' | 'voting';
  timestamp: string;
  status: 'sent' | 'pending' | 'failed';
}

const OfflineManager: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [smsAlerts, setSmsAlerts] = useState<SMSAlert[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'error'>('idle');

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    loadOfflineData();
    loadSMSAlerts();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    const stored = localStorage.getItem('offlineData');
    if (stored) {
      setOfflineData(JSON.parse(stored));
    } else {
      // Mock offline data
      setOfflineData([
        {
          id: 'OFF001',
          type: 'issue_report',
          data: { title: 'Street light not working', location: 'Main Road', priority: 'medium' },
          timestamp: '2025-01-15 14:30:00',
          status: 'pending'
        },
        {
          id: 'OFF002',
          type: 'vote',
          data: { proposalId: 'P001', vote: 'for', citizenId: 'C123' },
          timestamp: '2025-01-15 12:15:00',
          status: 'pending'
        },
        {
          id: 'OFF003',
          type: 'maintenance_log',
          data: { assetId: 'WP001', status: 'completed', notes: 'Pump serviced successfully' },
          timestamp: '2025-01-14 16:45:00',
          status: 'synced'
        }
      ]);
    }
  };

  const loadSMSAlerts = () => {
    setSmsAlerts([
      {
        id: 'SMS001',
        message: 'CRITICAL: Water supply disruption in Sector 3. Estimated repair time: 4 hours. Alternative arrangements made.',
        recipient: 'All residents (1,247 numbers)',
        type: 'critical',
        timestamp: '2025-01-15 09:30:00',
        status: 'sent'
      },
      {
        id: 'SMS002',
        message: 'VOTING: Community park proposal voting ends today at 6 PM. Cast your vote via SMS or app.',
        recipient: 'Registered voters (892 numbers)',
        type: 'voting',
        timestamp: '2025-01-15 08:00:00',
        status: 'sent'
      },
      {
        id: 'SMS003',
        message: 'MAINTENANCE: Scheduled power maintenance tomorrow 10 AM - 2 PM. Solar backup available.',
        recipient: 'All residents (1,247 numbers)',
        type: 'maintenance',
        timestamp: '2025-01-14 18:00:00',
        status: 'pending'
      }
    ]);
  };

  const syncOfflineData = async () => {
    if (!isOnline) return;
    
    setSyncStatus('syncing');
    
    // Simulate sync process
    setTimeout(() => {
      setOfflineData(prev => prev.map(item => 
        item.status === 'pending' ? { ...item, status: 'synced' } : item
      ));
      setSyncStatus('completed');
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': case 'sent': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'maintenance': return '🔧';
      case 'budget': return '💰';
      case 'voting': return '🗳️';
      default: return '📱';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isOnline ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
          <WifiIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offline-First Architecture</h1>
          <p className="text-gray-600 mt-1">Seamless operation with auto-sync and SMS alerts</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`rounded-2xl border p-6 ${isOnline ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isOnline ? (
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            )}
            <div>
              <h2 className={`text-xl font-bold ${isOnline ? 'text-green-800' : 'text-orange-800'}`}>
                {isOnline ? '🌐 Online Mode' : '📱 Offline Mode'}
              </h2>
              <p className={`${isOnline ? 'text-green-700' : 'text-orange-700'}`}>
                {isOnline 
                  ? 'Connected to server. Real-time sync enabled.' 
                  : 'Working offline. Data will sync when connection is restored.'
                }
              </p>
            </div>
          </div>
          
          {isOnline && syncStatus !== 'idle' && (
            <div className="flex items-center gap-2">
              {syncStatus === 'syncing' && (
                <>
                  <ClockIcon className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="text-blue-600 font-medium">Syncing...</span>
                </>
              )}
              {syncStatus === 'completed' && (
                <>
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Sync Complete</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offline Capability</p>
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-xs text-gray-500">Full functionality</p>
            </div>
            <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Auto-Sync</p>
              <p className="text-3xl font-bold text-green-600">Real-time</p>
              <p className="text-xs text-gray-500">When online</p>
            </div>
            <CloudArrowUpIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SMS Alerts</p>
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-xs text-gray-500">Critical updates</p>
            </div>
            <DevicePhoneMobileIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Offline Data Queue */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">📱 Offline Data Queue</h2>
          {isOnline && (
            <button 
              onClick={syncOfflineData}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Sync Now
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {offlineData.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {item.type.replace('_', ' ')} - {item.id}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {JSON.stringify(item.data).substring(0, 100)}...
                  </p>
                  <p className="text-gray-500 text-xs mt-2">{item.timestamp}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SMS Alert System */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📱 SMS Alert System</h2>
        
        <div className="space-y-4">
          {smsAlerts.map((alert) => (
            <div key={alert.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{alert.type.toUpperCase()} Alert</h3>
                      <p className="text-gray-700 mt-1">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>To: {alert.recipient}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">📲 SMS Integration Features</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Critical infrastructure alerts sent automatically</li>
            <li>• Citizens can report issues via SMS when offline</li>
            <li>• Voting reminders and deadline notifications</li>
            <li>• Budget updates and transparency reports</li>
            <li>• Multi-language support for all SMS communications</li>
          </ul>
        </div>
      </div>

      {/* Offline Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🔧 Offline Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">✅ Available Offline</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span>Report infrastructure issues with photos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span>View cached dashboard data</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span>Submit community votes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span>Log maintenance activities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span>Access emergency contact information</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🔄 Auto-Sync Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />
                <span>Automatic data synchronization when online</span>
              </li>
              <li className="flex items-center gap-2">
                <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />
                <span>Conflict resolution for concurrent edits</span>
              </li>
              <li className="flex items-center gap-2">
                <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />
                <span>Progressive data loading</span>
              </li>
              <li className="flex items-center gap-2">
                <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />
                <span>Background sync for better performance</span>
              </li>
              <li className="flex items-center gap-2">
                <CloudArrowUpIcon className="h-4 w-4 text-blue-600" />
                <span>Smart caching of critical data</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineManager;
