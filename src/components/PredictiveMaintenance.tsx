import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface MaintenanceAlert {
  id: string;
  asset: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  predictedFailure: string;
  confidence: number;
  costSaving: string;
  location: string;
  iotSensorId: string;
}

interface AssetHealth {
  id: string;
  name: string;
  health: number;
  nextMaintenance: string;
  lifespanExtension: string;
  costReduction: string;
}

const PredictiveMaintenance: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [assets, setAssets] = useState<AssetHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI predictions loading
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          asset: 'Water Pump Station A',
          type: 'Motor Bearing Failure',
          severity: 'critical',
          predictedFailure: '18 days',
          confidence: 94,
          costSaving: '₹45,000',
          location: 'Sector 3, Block B',
          iotSensorId: 'WP-001-VIB'
        },
        {
          id: '2',
          asset: 'Solar Panel Array 2',
          type: 'Inverter Degradation',
          severity: 'warning',
          predictedFailure: '26 days',
          confidence: 87,
          costSaving: '₹28,000',
          location: 'Community Center Roof',
          iotSensorId: 'SP-002-PWR'
        },
        {
          id: '3',
          asset: 'Street Light Circuit 5',
          type: 'LED Driver Failure',
          severity: 'info',
          predictedFailure: '32 days',
          confidence: 76,
          costSaving: '₹12,000',
          location: 'Main Road Junction',
          iotSensorId: 'SL-005-CUR'
        }
      ]);

      setAssets([
        {
          id: '1',
          name: 'Water Distribution Network',
          health: 92,
          nextMaintenance: '12 days',
          lifespanExtension: '+35%',
          costReduction: '32%'
        },
        {
          id: '2',
          name: 'Electrical Grid',
          health: 88,
          nextMaintenance: '8 days',
          lifespanExtension: '+28%',
          costReduction: '29%'
        },
        {
          id: '3',
          name: 'Waste Management System',
          health: 95,
          nextMaintenance: '20 days',
          lifespanExtension: '+42%',
          costReduction: '38%'
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'warning': return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'info': return <CheckCircleIcon className="h-5 w-5 text-blue-600" />;
      default: return <CheckCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <CpuChipIcon className="h-8 w-8 text-green-600 animate-pulse" />
            <span className="text-lg font-medium text-gray-600">AI analyzing infrastructure data...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Predictive Maintenance</h1>
          <p className="text-gray-600 mt-1">Machine learning predictions for proactive infrastructure management</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Reduction</p>
              <p className="text-3xl font-bold text-green-600">30%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lifespan Extension</p>
              <p className="text-3xl font-bold text-blue-600">20-40%</p>
            </div>
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prediction Window</p>
              <p className="text-3xl font-bold text-purple-600">2-4 weeks</p>
            </div>
            <ClockIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">IoT Sensors</p>
              <p className="text-3xl font-bold text-orange-600">247</p>
            </div>
            <CpuChipIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Predictive Alerts */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🚨 Predictive Maintenance Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.asset}</h3>
                    <p className="text-gray-600 text-sm">{alert.type}</p>
                    <p className="text-gray-500 text-xs mt-1">📍 {alert.location} • Sensor: {alert.iotSensorId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">Predicted failure in <strong>{alert.predictedFailure}</strong></p>
                  <p className="text-xs text-gray-500">Confidence: {alert.confidence}%</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">Save: {alert.costSaving}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Health Overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🏗️ Asset Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{asset.name}</h3>
              
              {/* Health Score */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Health Score</span>
                  <span className="font-semibold">{asset.health}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${asset.health >= 90 ? 'bg-green-500' : asset.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${asset.health}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Maintenance:</span>
                  <span className="font-medium">{asset.nextMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lifespan Extension:</span>
                  <span className="font-medium text-green-600">{asset.lifespanExtension}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Reduction:</span>
                  <span className="font-medium text-blue-600">{asset.costReduction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Optimization Opportunities</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Schedule Water Pump maintenance during low-demand hours to save ₹15,000</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Bulk order LED drivers for 3 upcoming failures - 20% discount available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Solar panel cleaning recommended before monsoon season</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Performance Trends</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">📈</span>
                <span>Overall infrastructure health improved by 12% this quarter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">📊</span>
                <span>Predictive maintenance reduced emergency repairs by 45%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <span>IoT sensor coverage increased to 95% of critical assets</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMaintenance;
