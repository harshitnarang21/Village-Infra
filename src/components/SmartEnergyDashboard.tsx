import React, { useState, useEffect } from 'react';
import {
  BoltIcon,
  SunIcon,
  Battery100Icon as BatteryIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CogIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  SparklesIcon as LeafIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface EnergySource {
  id: string;
  name: string;
  type: 'solar' | 'grid' | 'battery' | 'wind' | 'hydro';
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: 'active' | 'maintenance' | 'offline';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface EnergyConsumer {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'public' | 'agricultural';
  currentConsumption: number;
  averageConsumption: number;
  peakConsumption: number;
  efficiency: number;
  location: string;
}

interface EnergyMetrics {
  totalGeneration: number;
  totalConsumption: number;
  gridImport: number;
  gridExport: number;
  batteryLevel: number;
  carbonOffset: number;
  costSavings: number;
  efficiency: number;
}

const SmartEnergyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [energySources, setEnergySources] = useState<EnergySource[]>([]);
  const [energyConsumers, setEnergyConsumers] = useState<EnergyConsumer[]>([]);
  const [metrics, setMetrics] = useState<EnergyMetrics>({
    totalGeneration: 0,
    totalConsumption: 0,
    gridImport: 0,
    gridExport: 0,
    batteryLevel: 0,
    carbonOffset: 0,
    costSavings: 0,
    efficiency: 0
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('24h');
  const [showAlerts, setShowAlerts] = useState(true);
  const [realTimeData, setRealTimeData] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockSources: EnergySource[] = [
      {
        id: 'SOLAR001',
        name: 'Community Solar Farm',
        type: 'solar',
        capacity: 500,
        currentOutput: 425,
        efficiency: 85,
        status: 'active',
        location: 'North Field',
        lastMaintenance: '2024-11-01',
        nextMaintenance: '2025-02-01'
      },
      {
        id: 'SOLAR002',
        name: 'School Rooftop Solar',
        type: 'solar',
        capacity: 100,
        currentOutput: 78,
        efficiency: 78,
        status: 'active',
        location: 'Primary School',
        lastMaintenance: '2024-10-15',
        nextMaintenance: '2025-01-15'
      },
      {
        id: 'GRID001',
        name: 'State Grid Connection',
        type: 'grid',
        capacity: 1000,
        currentOutput: 150,
        efficiency: 95,
        status: 'active',
        location: 'Main Substation',
        lastMaintenance: '2024-12-01',
        nextMaintenance: '2025-03-01'
      },
      {
        id: 'BATT001',
        name: 'Community Battery Bank',
        type: 'battery',
        capacity: 200,
        currentOutput: -50,
        efficiency: 92,
        status: 'active',
        location: 'Energy Center',
        lastMaintenance: '2024-11-20',
        nextMaintenance: '2025-02-20'
      }
    ];

    const mockConsumers: EnergyConsumer[] = [
      {
        id: 'RES001',
        name: 'Residential Sector',
        type: 'residential',
        currentConsumption: 320,
        averageConsumption: 280,
        peakConsumption: 450,
        efficiency: 75,
        location: 'Village Center'
      },
      {
        id: 'PUB001',
        name: 'Public Infrastructure',
        type: 'public',
        currentConsumption: 180,
        averageConsumption: 160,
        peakConsumption: 220,
        efficiency: 82,
        location: 'Various'
      },
      {
        id: 'AGR001',
        name: 'Agricultural Systems',
        type: 'agricultural',
        currentConsumption: 95,
        averageConsumption: 120,
        peakConsumption: 180,
        efficiency: 68,
        location: 'Farm Areas'
      },
      {
        id: 'COM001',
        name: 'Commercial Buildings',
        type: 'commercial',
        currentConsumption: 58,
        averageConsumption: 65,
        peakConsumption: 85,
        efficiency: 79,
        location: 'Market Area'
      }
    ];

    setEnergySources(mockSources);
    setEnergyConsumers(mockConsumers);

    // Calculate metrics
    const totalGen = mockSources.reduce((sum, source) => sum + Math.max(0, source.currentOutput), 0);
    const totalCons = mockConsumers.reduce((sum, consumer) => sum + consumer.currentConsumption, 0);
    const batteryOutput = mockSources.find(s => s.type === 'battery')?.currentOutput || 0;
    
    setMetrics({
      totalGeneration: totalGen,
      totalConsumption: totalCons,
      gridImport: Math.max(0, totalCons - totalGen + Math.abs(batteryOutput)),
      gridExport: Math.max(0, totalGen - totalCons - Math.abs(batteryOutput)),
      batteryLevel: 75,
      carbonOffset: 2.4,
      costSavings: 15420,
      efficiency: Math.round((totalGen / (totalGen + 50)) * 100)
    });
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeData) return;

    const interval = setInterval(() => {
      setEnergySources(prev => prev.map(source => ({
        ...source,
        currentOutput: source.currentOutput + (Math.random() - 0.5) * 10,
        efficiency: Math.max(60, Math.min(95, source.efficiency + (Math.random() - 0.5) * 2))
      })));

      setEnergyConsumers(prev => prev.map(consumer => ({
        ...consumer,
        currentConsumption: Math.max(0, consumer.currentConsumption + (Math.random() - 0.5) * 20)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeData]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'solar': return <SunIcon className="h-6 w-6" />;
      case 'battery': return <BoltIcon className="h-6 w-6" />;
      case 'grid': return <BoltIcon className="h-6 w-6" />;
      case 'wind': return <ArrowTrendingUpIcon className="h-6 w-6" />;
      default: return <BoltIcon className="h-6 w-6" />;
    }
  };

  const getConsumerIcon = (type: string) => {
    switch (type) {
      case 'residential': return <HomeIcon className="h-6 w-6" />;
      case 'commercial': return <BuildingOfficeIcon className="h-6 w-6" />;
      case 'public': return <LightBulbIcon className="h-6 w-6" />;
      case 'agricultural': return <LeafIcon className="h-6 w-6" />;
      default: return <BoltIcon className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl">
              <BoltIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Energy Management</h1>
              <p className="text-gray-600">Real-time energy monitoring and optimization for Sudarshan Village</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <button
              onClick={() => setRealTimeData(!realTimeData)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                realTimeData 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {realTimeData ? '🔴 Live' : '⏸️ Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12% vs yesterday</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.totalGeneration.toFixed(0)} kW</div>
          <div className="text-gray-600">Total Generation</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">-5% vs yesterday</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.totalConsumption.toFixed(0)} kW</div>
          <div className="text-gray-600">Total Consumption</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BatteryIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">{metrics.batteryLevel}% charged</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.efficiency}%</div>
          <div className="text-gray-600">System Efficiency</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-medium">Monthly savings</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">₹{metrics.costSavings.toLocaleString()}</div>
          <div className="text-gray-600">Cost Savings</div>
        </div>
      </div>

      {/* Energy Flow Visualization */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Real-Time Energy Flow</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation */}
          <div>
            <h3 className="text-lg font-medium text-green-700 mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-5 w-5" />
              Generation Sources
            </h3>
            <div className="space-y-3">
              {energySources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${source.type === 'solar' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                      {getSourceIcon(source.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{source.name}</div>
                      <div className="text-sm text-gray-600">{source.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{source.currentOutput.toFixed(0)} kW</div>
                    <div className={`text-sm ${getEfficiencyColor(source.efficiency)}`}>
                      {source.efficiency.toFixed(0)}% eff.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Balance */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {(metrics.totalGeneration - metrics.totalConsumption).toFixed(0)} kW
              </div>
              <div className="text-gray-600">
                {metrics.totalGeneration > metrics.totalConsumption ? 'Surplus' : 'Deficit'}
              </div>
            </div>
            
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(metrics.totalGeneration / (metrics.totalGeneration + metrics.totalConsumption)) * 251.2} 251.2`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BoltIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Consumption */}
          <div>
            <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center gap-2">
              <ArrowTrendingDownIcon className="h-5 w-5" />
              Consumption by Sector
            </h3>
            <div className="space-y-3">
              {energyConsumers.map((consumer) => (
                <div key={consumer.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      {getConsumerIcon(consumer.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{consumer.name}</div>
                      <div className="text-sm text-gray-600">{consumer.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{consumer.currentConsumption.toFixed(0)} kW</div>
                    <div className={`text-sm ${getEfficiencyColor(consumer.efficiency)}`}>
                      {consumer.efficiency}% eff.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <LeafIcon className="h-6 w-6 text-green-600" />
            Environmental Impact
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <LeafIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Carbon Offset Today</div>
                  <div className="text-sm text-gray-600">CO₂ emissions avoided</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{metrics.carbonOffset} tons</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <SunIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Solar Generation</div>
                  <div className="text-sm text-gray-600">Clean energy produced</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {energySources.filter(s => s.type === 'solar').reduce((sum, s) => sum + s.currentOutput, 0).toFixed(0)} kW
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FireIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Grid Dependency</div>
                  <div className="text-sm text-gray-600">External power usage</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {((metrics.gridImport / metrics.totalConsumption) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            System Alerts & Recommendations
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Maintenance Due</span>
              </div>
              <p className="text-yellow-700 text-sm">
                School Rooftop Solar system requires cleaning. Efficiency dropped to 78%.
              </p>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Optimization Opportunity</span>
              </div>
              <p className="text-green-700 text-sm">
                Peak solar generation detected. Consider shifting high-consumption activities to 11 AM - 2 PM.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Performance Insight</span>
              </div>
              <p className="text-blue-700 text-sm">
                Battery storage is 75% full. Excess solar energy being exported to grid.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all">
            <CogIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">System Settings</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
            <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">View Reports</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all">
            <ClockIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Schedule Maintenance</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all">
            <BoltIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Optimize Load</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartEnergyDashboard;
