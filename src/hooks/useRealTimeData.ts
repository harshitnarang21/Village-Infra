import { useState, useEffect, useCallback, useRef } from 'react';
// import io, { Socket } from 'socket.io-client';
// import ApiService from '../services/ApiService';

interface RealTimeDataHook {
  // Sensor data
  sensorData: any[];
  latestReadings: Record<string, any>;
  
  // Alerts and notifications
  maintenanceAlerts: any[];
  criticalAlerts: any[];
  
  // System status
  isConnected: boolean;
  connectionError: string | null;
  
  // Methods
  clearAlerts: () => void;
  reconnect: () => void;
}

interface UseRealTimeDataOptions {
  villageId: string;
  enableSensorData?: boolean;
  enableAlerts?: boolean;
  enableVoiceCommands?: boolean;
  sensorDataLimit?: number;
}

export const useRealTimeData = (options: UseRealTimeDataOptions): RealTimeDataHook => {
  const {
    villageId,
    enableSensorData = true,
    enableAlerts = true,
    enableVoiceCommands = false,
    sensorDataLimit = 100
  } = options;

  // State
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [latestReadings, setLatestReadings] = useState<Record<string, any>>({});
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<any[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Refs
  const socketRef = useRef<any | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // TODO: Implement WebSocket connection when socket.io-client is properly configured
    console.log('WebSocket connection would be initialized here');
    
    // Mock connection for now
    setIsConnected(true);
    setConnectionError(null);
    
    return; // Skip actual socket initialization for now
    
    /*
    const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3000';
    const socket = io(wsUrl, {
      transports: ['websocket'],
      upgrade: true,
      rememberUpgrade: true,
    });*/

    // All socket event handling code commented out for now
    /*
    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to real-time server');
      setIsConnected(true);
      setConnectionError(null);
      
      // Join village room for targeted updates
      socket.emit('join_village', villageId);
      
      // Subscribe to specific data types
      if (enableSensorData) {
        socket.emit('subscribe_sensors', villageId);
      }
      if (enableAlerts) {
        socket.emit('subscribe_alerts', villageId);
      }
      if (enableVoiceCommands) {
        socket.emit('subscribe_voice', villageId);
      }
    });

    // ... rest of socket event handlers would go here
    */

  }, [villageId, enableSensorData, enableAlerts, enableVoiceCommands, sensorDataLimit]);

  // Initialize on mount
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeSocket]);

  // Load initial data from API - commented out for now
  useEffect(() => {
    // TODO: Implement when ApiService is properly configured
    console.log('Would load initial data here');
    
    /*
    const loadInitialData = async () => {
      try {
        if (enableSensorData) {
          // Load recent sensor data
          const assets = await ApiService.getAssets(villageId);
          const sensorPromises = assets.map(asset => 
            ApiService.getAssetSensorData(asset.id, '24h')
          );
          const sensorResults = await Promise.all(sensorPromises);
          const allReadings = sensorResults.flat().sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setSensorData(allReadings.slice(0, sensorDataLimit));
        }

        if (enableAlerts) {
          // Load recent maintenance predictions
          const predictions = await ApiService.getMaintenancePredictions();
          const alerts = predictions
            .filter(p => !p.isResolved)
            .map(p => ({
              id: p.id,
              title: `Predicted ${p.failureType}`,
              description: `Asset may fail in ${Math.ceil((new Date(p.predictedFailureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`,
              priority: p.confidenceScore > 0.8 ? 'high' : 'medium',
              assetId: p.assetId,
              timestamp: new Date().toISOString()
            }));
          setMaintenanceAlerts(alerts);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setConnectionError('Failed to load initial data');
      }
    };

    loadInitialData();
    */
  }, [villageId, enableSensorData, enableAlerts, sensorDataLimit]);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setMaintenanceAlerts([]);
    setCriticalAlerts([]);
  }, []);

  // Manual reconnect
  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    initializeSocket();
  }, [initializeSocket]);

  return {
    sensorData,
    latestReadings,
    maintenanceAlerts,
    criticalAlerts,
    isConnected,
    connectionError,
    clearAlerts,
    reconnect
  };
};

// Hook for offline data management
export const useOfflineData = (villageId: string) => {
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline queue from localStorage
    const stored = localStorage.getItem(`offline_queue_${villageId}`);
    if (stored) {
      setOfflineQueue(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [villageId]);

  const addToOfflineQueue = useCallback((data: any) => {
    const queueItem = {
      id: Date.now().toString(),
      data,
      timestamp: new Date().toISOString(),
      type: data.type || 'unknown'
    };

    setOfflineQueue(prev => {
      const newQueue = [...prev, queueItem];
      localStorage.setItem(`offline_queue_${villageId}`, JSON.stringify(newQueue));
      return newQueue;
    });
  }, [villageId]);

  const syncOfflineData = useCallback(async () => {
    if (offlineQueue.length === 0 || !isOnline) return;

    setSyncStatus('syncing');
    try {
      // TODO: Implement when ApiService is available
      console.log('Would sync offline data here');
      
      /*
      const result = await ApiService.syncOfflineData(offlineQueue);
      
      // Remove synced items from queue
      setOfflineQueue([]);
      localStorage.removeItem(`offline_queue_${villageId}`);
      
      setSyncStatus('idle');
      console.log(`Synced ${result.synced} items, ${result.failed} failed`);
      */
      
      // Mock successful sync
      setOfflineQueue([]);
      localStorage.removeItem(`offline_queue_${villageId}`);
      setSyncStatus('idle');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
    }
  }, [offlineQueue, isOnline, villageId]);

  return {
    offlineQueue,
    isOnline,
    syncStatus,
    addToOfflineQueue,
    syncOfflineData
  };
};

// Hook for voice interface integration
export const useVoiceInterface = (villageId: string) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const processVoiceCommand = useCallback(async (command: string, language: string) => {
    try {
      // TODO: Implement when ApiService is available
      console.log('Would process voice command:', command, language);
      
      /*
      const result = await ApiService.processVoiceCommand(command, language);
      setResponse(result.response);
      
      // Execute any actions
      if (result.action) {
        // Handle specific actions like navigation, data updates, etc.
        console.log('Executing action:', result.action);
      }
      */
      
      // Mock response
      setResponse(`Processed command: "${command}" in ${language}`);
    } catch (error) {
      console.error('Voice command processing failed:', error);
      setError('Failed to process voice command');
    }
  }, []);

  return {
    isListening,
    transcript,
    response,
    error,
    setIsListening,
    setTranscript,
    processVoiceCommand
  };
};
