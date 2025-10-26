import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import BrowserDatabase, { DatabaseAsset, DatabaseMaintenancePrediction, DatabaseSensorReading } from '../database/BrowserDatabase';
import { useAuth } from '../contexts/AuthContext';

interface AssetWithData {
  asset: DatabaseAsset;
  predictions: DatabaseMaintenancePrediction[];
  latestSensorData: DatabaseSensorReading[];
}

const DatabasePredictiveMaintenance: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DatabaseAsset[]>([]);
  const [predictions, setPredictions] = useState<DatabaseMaintenancePrediction[]>([]);
  const [assetData, setAssetData] = useState<AssetWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [database] = useState(() => BrowserDatabase.getInstance());

  useEffect(() => {
    const loadData = async () => {
      if (!user?.villageId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load assets and predictions
        const [assetsData, predictionsData] = await Promise.all([
          database.getAssetsByVillage(user.villageId),
          database.getMaintenancePredictions()
        ]);

        setAssets(assetsData);
        setPredictions(predictionsData);

        // Load sensor data for each asset
        const assetDataPromises = assetsData.map(async (asset) => {
          const [assetPredictions, sensorData] = await Promise.all([
            database.getMaintenancePredictions(asset.id),
            database.getSensorReadings(asset.id, 10)
          ]);

          return {
            asset,
            predictions: assetPredictions,
            latestSensorData: sensorData
          };
        });

        const combinedAssetData = await Promise.all(assetDataPromises);
        setAssetData(combinedAssetData);

      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load maintenance data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.villageId, database]);

  const handleResolvePrediction = async (predictionId: string) => {
    try {
      await database.markPredictionResolved(predictionId);
      setPredictions(prev => 
        prev.map(p => p.id === predictionId ? { ...p, is_resolved: true } : p)
      );
      
      // Update asset data
      setAssetData(prev => 
        prev.map(data => ({
          ...data,
          predictions: data.predictions.map(p => 
            p.id === predictionId ? { ...p, is_resolved: true } : p
          )
        }))
      );
    } catch (error) {
      console.error('Failed to resolve prediction:', error);
    }
  };

  const getSeverityColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-red-100 text-red-800 border-red-200';
    if (confidence >= 0.7) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
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

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <CpuChipIcon className="h-8 w-8 text-green-600 animate-pulse" />
            <span className="text-lg font-medium text-gray-600">Loading database...</span>
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
              <h3 className="text-lg font-semibold text-red-800">Database Error</h3>
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
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          <CpuChipIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database-Powered Predictive Maintenance</h1>
          <p className="text-gray-600 mt-1">Real SQLite database with {assets.length} assets tracked</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-green-600">{assets.length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Predictions</p>
              <p className="text-3xl font-bold text-orange-600">
                {predictions.filter(p => !p.is_resolved).length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {assets.length > 0 ? Math.round(assets.reduce((sum, a) => sum + a.health_score, 0) / assets.length) : 0}%
              </p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-3xl font-bold text-purple-600">
                {predictions.filter(p => !p.is_resolved && p.confidence_score >= 0.8).length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Active Predictions from Database */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🚨 Database Predictions</h2>
        <div className="space-y-4">
          {predictions.filter(p => !p.is_resolved).map((prediction) => {
            const asset = assets.find(a => a.id === prediction.asset_id);
            const timeUntil = formatTimeUntilFailure(prediction.predicted_failure_date);
            const preventionActions = prediction.prevention_actions ? JSON.parse(prediction.prevention_actions) : [];
            
            return (
              <div key={prediction.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset?.name || 'Unknown Asset'}</h3>
                      <p className="text-gray-600 text-sm">{prediction.failure_type}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Asset Type: {asset?.asset_type} • Health: {asset?.health_score}%
                      </p>
                      {preventionActions.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-700">Prevention Actions:</h4>
                          <ul className="text-xs text-gray-600 mt-1">
                            {preventionActions.map((action: string, index: number) => (
                              <li key={index}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(prediction.confidence_score)}`}>
                      {Math.round(prediction.confidence_score * 100)}% CONFIDENCE
                    </span>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Failure in: {timeUntil}</strong>
                    </p>
                    {prediction.estimated_cost && (
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        Est. Cost: ₹{prediction.estimated_cost.toLocaleString()}
                      </p>
                    )}
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
          
          {predictions.filter(p => !p.is_resolved).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircleIcon className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>No active predictions in database. All systems running smoothly!</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Overview from Database */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🏗️ Database Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetData.map((data) => (
            <div key={data.asset.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{data.asset.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  data.asset.status === 'active' ? 'bg-green-100 text-green-800' :
                  data.asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {data.asset.status}
                </span>
              </div>
              
              {/* Health Score */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Health Score</span>
                  <span className="font-semibold">{data.asset.health_score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      data.asset.health_score >= 90 ? 'bg-green-500' : 
                      data.asset.health_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.asset.health_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Asset Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div>Type: <span className="font-medium">{data.asset.asset_type}</span></div>
                <div>Installed: <span className="font-medium">{data.asset.installation_date || 'N/A'}</span></div>
                <div>Last Maintenance: <span className="font-medium">{data.asset.last_maintenance || 'N/A'}</span></div>
                <div>Active Predictions: <span className="font-medium text-orange-600">
                  {data.predictions.filter(p => !p.is_resolved).length}
                </span></div>
                <div>Sensor Readings: <span className="font-medium text-blue-600">
                  {data.latestSensorData.length}
                </span></div>
              </div>

              {/* Latest Sensor Reading */}
              {data.latestSensorData.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">Latest Reading</div>
                  <div className="text-sm text-blue-800">
                    {data.latestSensorData[0].sensor_type}: {data.latestSensorData[0].value.toFixed(2)} {data.latestSensorData[0].unit}
                  </div>
                  <div className="text-xs text-blue-600">
                    {new Date(data.latestSensorData[0].timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Database Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Database Type</h3>
            <p className="text-gray-700">SQLite (Development)</p>
            <p className="text-xs text-gray-500 mt-1">Located at: data/village_infrastructure.db</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Tables</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Users & Authentication</li>
              <li>• Infrastructure Assets</li>
              <li>• Sensor Readings</li>
              <li>• Maintenance Predictions</li>
              <li>• Citizen Issues</li>
              <li>• Community Proposals</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real user authentication</li>
              <li>• Persistent data storage</li>
              <li>• Relational data integrity</li>
              <li>• Sample data included</li>
              <li>• Production-ready schema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabasePredictiveMaintenance;
