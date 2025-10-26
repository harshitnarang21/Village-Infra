import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import ApiService, { RealAsset, RealMaintenancePrediction, RealSensorReading } from '../services/ApiService';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../contexts/AuthContext';

interface AssetHealthData {
  asset: RealAsset;
  predictions: RealMaintenancePrediction[];
  latestSensorData: RealSensorReading[];
  healthTrend: 'improving' | 'stable' | 'declining';
}

const RealPredictiveMaintenance: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<RealAsset[]>([]);
  const [predictions, setPredictions] = useState<RealMaintenancePrediction[]>([]);
  const [assetHealthData, setAssetHealthData] = useState<AssetHealthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Real-time data integration
  const { 
    sensorData, 
    latestReadings, 
    maintenanceAlerts, 
    isConnected 
  } = useRealTimeData({
    villageId: user?.villageId || '',
    enableSensorData: true,
    enableAlerts: true
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.villageId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load assets and predictions in parallel
        const [assetsData, predictionsData] = await Promise.all([
          ApiService.getAssets(user.villageId),
          ApiService.getMaintenancePredictions()
        ]);

        setAssets(assetsData);
        setPredictions(predictionsData);

        // Load detailed health data for each asset
        const healthDataPromises = assetsData.map(async (asset) => {
          const [assetPredictions, sensorData] = await Promise.all([
            ApiService.getMaintenancePredictions(asset.id),
            ApiService.getAssetSensorData(asset.id, selectedTimeRange)
          ]);

          // Calculate health trend
          const healthTrend = calculateHealthTrend(sensorData, asset.healthScore);

          return {
            asset,
            predictions: assetPredictions,
            latestSensorData: sensorData,
            healthTrend
          };
        });

        const healthData = await Promise.all(healthDataPromises);
        setAssetHealthData(healthData);

      } catch (err) {
        console.error('Failed to load predictive maintenance data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.villageId, selectedTimeRange]);

  // Update data when real-time sensor data arrives
  useEffect(() => {
    if (sensorData.length > 0) {
      // Update asset health data with latest sensor readings
      setAssetHealthData(prev => 
        prev.map(data => {
          const assetSensorData = sensorData.filter(reading => reading.assetId === data.asset.id);
          if (assetSensorData.length > 0) {
            const updatedSensorData = [...assetSensorData, ...data.latestSensorData]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 100); // Keep last 100 readings

            const newHealthTrend = calculateHealthTrend(updatedSensorData, data.asset.healthScore);

            return {
              ...data,
              latestSensorData: updatedSensorData,
              healthTrend: newHealthTrend
            };
          }
          return data;
        })
      );
    }
  }, [sensorData]);

  const calculateHealthTrend = (sensorData: RealSensorReading[], currentHealth: number): 'improving' | 'stable' | 'declining' => {
    if (sensorData.length < 10) return 'stable';

    // Calculate trend based on recent sensor readings
    const recentReadings = sensorData.slice(0, 10);
    const olderReadings = sensorData.slice(10, 20);

    if (recentReadings.length === 0 || olderReadings.length === 0) return 'stable';

    const recentAvg = recentReadings.reduce((sum, reading) => sum + reading.value, 0) / recentReadings.length;
    const olderAvg = olderReadings.reduce((sum, reading) => sum + reading.value, 0) / olderReadings.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (changePercent > 5) return 'declining'; // Assuming higher sensor values indicate problems
    if (changePercent < -5) return 'improving';
    return 'stable';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityFromConfidence = (confidence: number): string => {
    if (confidence >= 0.9) return 'critical';
    if (confidence >= 0.7) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  };

  const formatTimeUntilFailure = (predictedDate: string): string => {
    const now = new Date();
    const failureDate = new Date(predictedDate);
    const diffTime = failureDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  const handleResolvePrediction = async (predictionId: string) => {
    try {
      await ApiService.markPredictionResolved(predictionId);
      setPredictions(prev => 
        prev.map(p => p.id === predictionId ? { ...p, isResolved: true } : p)
      );
    } catch (error) {
      console.error('Failed to resolve prediction:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <CpuChipIcon className="h-8 w-8 text-green-600 animate-pulse" />
            <span className="text-lg font-medium text-gray-600">Loading real-time maintenance data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <CpuChipIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Predictive Maintenance</h1>
            <p className="text-gray-600 mt-1">
              Real-time ML predictions • {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTimeRange === range
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Assets</p>
              <p className="text-3xl font-bold text-green-600">{assets.filter(a => a.status === 'active').length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Predictions</p>
              <p className="text-3xl font-bold text-orange-600">{predictions.filter(p => !p.isResolved).length}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sensor Readings</p>
              <p className="text-3xl font-bold text-blue-600">{sensorData.length}</p>
            </div>
            <CpuChipIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(assets.reduce((sum, a) => sum + a.healthScore, 0) / assets.length)}%
              </p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Active Predictions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🚨 Active Maintenance Predictions</h2>
        <div className="space-y-4">
          {predictions.filter(p => !p.isResolved).map((prediction) => {
            const asset = assets.find(a => a.id === prediction.assetId);
            const priority = getPriorityFromConfidence(prediction.confidenceScore);
            const timeUntil = formatTimeUntilFailure(prediction.predictedFailureDate);
            
            return (
              <div key={prediction.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset?.name || 'Unknown Asset'}</h3>
                      <p className="text-gray-600 text-sm">{prediction.failureType}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Asset Type: {asset?.assetType} • Last Maintenance: {asset?.lastMaintenance}
                      </p>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Prevention Actions:</h4>
                        <ul className="text-xs text-gray-600 mt-1">
                          {prediction.preventionActions.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(priority)}`}>
                      {priority.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Failure in: {timeUntil}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Confidence: {Math.round(prediction.confidenceScore * 100)}%
                    </p>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      Est. Cost: ₹{prediction.estimatedCost.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleResolvePrediction(prediction.id)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {predictions.filter(p => !p.isResolved).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircleIcon className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>No active maintenance predictions. All systems running smoothly!</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Health Overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🏗️ Real-time Asset Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetHealthData.map((data) => {
            const latestReading = latestReadings[`${data.asset.id}_temperature`] || 
                                latestReadings[`${data.asset.id}_vibration`] ||
                                latestReadings[`${data.asset.id}_current`];
            
            return (
              <div key={data.asset.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{data.asset.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    data.healthTrend === 'improving' ? 'bg-green-100 text-green-800' :
                    data.healthTrend === 'declining' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {data.healthTrend}
                  </span>
                </div>
                
                {/* Health Score */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Health Score</span>
                    <span className="font-semibold">{data.asset.healthScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        data.asset.healthScore >= 90 ? 'bg-green-500' : 
                        data.asset.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.asset.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Latest Sensor Reading */}
                {latestReading && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium">Latest Reading</div>
                    <div className="text-sm text-blue-800">
                      {latestReading.sensorType}: {latestReading.value} {latestReading.unit}
                    </div>
                    <div className="text-xs text-blue-600">
                      {new Date(latestReading.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                )}

                {/* Predictions Count */}
                <div className="text-sm text-gray-600">
                  Active Predictions: {data.predictions.filter(p => !p.isResolved).length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Alerts */}
      {maintenanceAlerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-orange-800 mb-4">⚠️ Recent Alerts</h2>
          <div className="space-y-2">
            {maintenanceAlerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                <ClockIcon className="h-4 w-4 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600">{alert.description}</p>
                </div>
                <span className="text-xs text-orange-600">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealPredictiveMaintenance;
