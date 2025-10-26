import React, { useState, useEffect } from 'react';
import {
  BeakerIcon,
  CloudIcon as CloudRainIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  BeakerIcon as DropletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  ClockIcon,
  CogIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalendarIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface WaterSource {
  id: string;
  name: string;
  type: 'borewell' | 'tank' | 'pump' | 'reservoir' | 'pipeline';
  capacity: number;
  currentLevel: number;
  flowRate: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'active' | 'maintenance' | 'offline';
  location: string;
  lastTested: string;
  nextMaintenance: string;
  ph: number;
  tds: number;
  chlorine: number;
}

interface WaterConsumption {
  id: string;
  area: string;
  type: 'residential' | 'agricultural' | 'commercial' | 'public';
  dailyConsumption: number;
  averageConsumption: number;
  peakConsumption: number;
  efficiency: number;
  population: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: {
    day: string;
    rainfall: number;
    temperature: number;
  }[];
}

interface WaterAlert {
  id: string;
  type: 'quality' | 'level' | 'maintenance' | 'leak' | 'shortage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  timestamp: string;
  resolved: boolean;
}

const WaterResourceManagement: React.FC = () => {
  const { user } = useAuth();
  const [waterSources, setWaterSources] = useState<WaterSource[]>([]);
  const [consumption, setConsumption] = useState<WaterConsumption[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [showQualityDetails, setShowQualityDetails] = useState(false);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockSources: WaterSource[] = [
      {
        id: 'BW001',
        name: 'Main Community Borewell',
        type: 'borewell',
        capacity: 10000,
        currentLevel: 8500,
        flowRate: 150,
        quality: 'good',
        status: 'active',
        location: 'Central Square',
        lastTested: '2024-12-10',
        nextMaintenance: '2025-01-15',
        ph: 7.2,
        tds: 320,
        chlorine: 0.5
      },
      {
        id: 'TK001',
        name: 'Overhead Water Tank',
        type: 'tank',
        capacity: 50000,
        currentLevel: 42000,
        flowRate: 200,
        quality: 'excellent',
        status: 'active',
        location: 'Hill Top',
        lastTested: '2024-12-12',
        nextMaintenance: '2025-02-01',
        ph: 7.0,
        tds: 280,
        chlorine: 0.3
      },
      {
        id: 'PMP001',
        name: 'Distribution Pump Station',
        type: 'pump',
        capacity: 5000,
        currentLevel: 4200,
        flowRate: 300,
        quality: 'good',
        status: 'active',
        location: 'Pump House',
        lastTested: '2024-12-08',
        nextMaintenance: '2024-12-25',
        ph: 7.1,
        tds: 310,
        chlorine: 0.4
      },
      {
        id: 'BW002',
        name: 'Agricultural Borewell',
        type: 'borewell',
        capacity: 8000,
        currentLevel: 6800,
        flowRate: 120,
        quality: 'fair',
        status: 'maintenance',
        location: 'Farm Area',
        lastTested: '2024-12-05',
        nextMaintenance: '2024-12-20',
        ph: 6.8,
        tds: 450,
        chlorine: 0.2
      }
    ];

    const mockConsumption: WaterConsumption[] = [
      {
        id: 'RES001',
        area: 'Residential Zone A',
        type: 'residential',
        dailyConsumption: 15000,
        averageConsumption: 14500,
        peakConsumption: 18000,
        efficiency: 78,
        population: 1200
      },
      {
        id: 'AGR001',
        area: 'Agricultural Fields',
        type: 'agricultural',
        dailyConsumption: 25000,
        averageConsumption: 22000,
        peakConsumption: 35000,
        efficiency: 65,
        population: 0
      },
      {
        id: 'PUB001',
        area: 'Public Facilities',
        type: 'public',
        dailyConsumption: 5000,
        averageConsumption: 4800,
        peakConsumption: 6500,
        efficiency: 82,
        population: 0
      },
      {
        id: 'COM001',
        area: 'Commercial Area',
        type: 'commercial',
        dailyConsumption: 3500,
        averageConsumption: 3200,
        peakConsumption: 4200,
        efficiency: 75,
        population: 0
      }
    ];

    const mockWeather: WeatherData = {
      temperature: 28,
      humidity: 65,
      rainfall: 2.5,
      forecast: [
        { day: 'Today', rainfall: 2.5, temperature: 28 },
        { day: 'Tomorrow', rainfall: 5.2, temperature: 26 },
        { day: 'Day 3', rainfall: 8.1, temperature: 24 },
        { day: 'Day 4', rainfall: 12.3, temperature: 23 },
        { day: 'Day 5', rainfall: 3.7, temperature: 27 }
      ]
    };

    const mockAlerts: WaterAlert[] = [
      {
        id: 'ALT001',
        type: 'maintenance',
        severity: 'medium',
        message: 'Agricultural Borewell requires pump maintenance',
        location: 'Farm Area',
        timestamp: '2024-12-15T10:30:00Z',
        resolved: false
      },
      {
        id: 'ALT002',
        type: 'quality',
        severity: 'low',
        message: 'TDS levels slightly elevated in Borewell BW002',
        location: 'Farm Area',
        timestamp: '2024-12-15T08:15:00Z',
        resolved: false
      },
      {
        id: 'ALT003',
        type: 'level',
        severity: 'high',
        message: 'Water level dropping faster than normal in Main Borewell',
        location: 'Central Square',
        timestamp: '2024-12-15T06:45:00Z',
        resolved: false
      }
    ];

    setWaterSources(mockSources);
    setConsumption(mockConsumption);
    setWeather(mockWeather);
    setAlerts(mockAlerts);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeMonitoring) return;

    const interval = setInterval(() => {
      setWaterSources(prev => prev.map(source => ({
        ...source,
        currentLevel: Math.max(0, source.currentLevel + (Math.random() - 0.5) * 100),
        flowRate: Math.max(0, source.flowRate + (Math.random() - 0.5) * 20),
        ph: Math.max(6.0, Math.min(8.5, source.ph + (Math.random() - 0.5) * 0.2)),
        tds: Math.max(100, Math.min(500, source.tds + (Math.random() - 0.5) * 20))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeMonitoring]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'borewell': return <DropletIcon className="h-6 w-6" />;
      case 'tank': return <BeakerIcon className="h-6 w-6" />;
      case 'pump': return <WrenchScrewdriverIcon className="h-6 w-6" />;
      case 'reservoir': return <BeakerIcon className="h-6 w-6" />;
      default: return <DropletIcon className="h-6 w-6" />;
    }
  };

  const totalCapacity = waterSources.reduce((sum, source) => sum + source.capacity, 0);
  const totalCurrent = waterSources.reduce((sum, source) => sum + source.currentLevel, 0);
  const totalConsumptionDaily = consumption.reduce((sum, cons) => sum + cons.dailyConsumption, 0);
  const averageQuality = waterSources.filter(s => s.quality === 'excellent' || s.quality === 'good').length / waterSources.length * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl">
              <DropletIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Water Resource Management</h1>
              <p className="text-gray-600">Comprehensive water monitoring and quality management for Sudarshan Village</p>
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
            </select>
            
            <button
              onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                realTimeMonitoring 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {realTimeMonitoring ? '🔴 Live Monitoring' : '⏸️ Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BeakerIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">{((totalCurrent/totalCapacity)*100).toFixed(0)}% capacity</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{(totalCurrent/1000).toFixed(1)}K L</div>
          <div className="text-gray-600">Total Water Available</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <span className="text-sm text-cyan-600 font-medium">Daily usage</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{(totalConsumptionDaily/1000).toFixed(1)}K L</div>
          <div className="text-gray-600">Total Consumption</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">Quality score</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{averageQuality.toFixed(0)}%</div>
          <div className="text-gray-600">Water Quality</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CloudRainIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">Today</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{weather?.rainfall || 0} mm</div>
          <div className="text-gray-600">Rainfall</div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BellAlertIcon className="h-6 w-6 text-red-600" />
            Active Alerts ({alerts.filter(a => !a.resolved).length})
          </h2>
          <div className="space-y-4">
            {alerts.filter(a => !a.resolved).map((alert) => (
              <div key={alert.id} className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.severity)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className={`h-5 w-5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{alert.message}</div>
                      <div className="text-sm text-gray-600">{alert.location} • {new Date(alert.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Investigate
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Water Sources Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Water Sources Status</h2>
          <div className="space-y-4">
            {waterSources.map((source) => (
              <div key={source.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      {getSourceIcon(source.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{source.name}</div>
                      <div className="text-sm text-gray-600">{source.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                      {source.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(source.quality)}`}>
                      {source.quality}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Level</div>
                    <div className="font-medium">{(source.currentLevel/1000).toFixed(1)}K L</div>
                    <div className="text-xs text-gray-500">{((source.currentLevel/source.capacity)*100).toFixed(0)}% capacity</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Flow Rate</div>
                    <div className="font-medium">{source.flowRate} L/min</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Next Maintenance</div>
                    <div className="font-medium">{new Date(source.nextMaintenance).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Water Quality Indicators */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <div className="text-gray-600">pH</div>
                      <div className={`font-medium ${source.ph >= 6.5 && source.ph <= 8.5 ? 'text-green-600' : 'text-red-600'}`}>
                        {source.ph.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">TDS</div>
                      <div className={`font-medium ${source.tds <= 500 ? 'text-green-600' : 'text-red-600'}`}>
                        {source.tds} ppm
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600">Chlorine</div>
                      <div className={`font-medium ${source.chlorine >= 0.2 && source.chlorine <= 1.0 ? 'text-green-600' : 'text-red-600'}`}>
                        {source.chlorine.toFixed(1)} ppm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Consumption by Area</h2>
          <div className="space-y-4">
            {consumption.map((area) => (
              <div key={area.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{area.area}</div>
                    <div className="text-sm text-gray-600 capitalize">{area.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{(area.dailyConsumption/1000).toFixed(1)}K L</div>
                    <div className="text-sm text-gray-600">per day</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Efficiency</div>
                    <div className={`font-medium ${area.efficiency >= 80 ? 'text-green-600' : area.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {area.efficiency}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Peak Usage</div>
                    <div className="font-medium">{(area.peakConsumption/1000).toFixed(1)}K L</div>
                  </div>
                </div>

                {area.population > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    Serving {area.population.toLocaleString()} people • {(area.dailyConsumption/area.population).toFixed(0)} L per person/day
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather & Forecast */}
      {weather && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CloudRainIcon className="h-6 w-6 text-blue-600" />
            Weather & Rainfall Forecast
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Current Conditions</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{weather.temperature}°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">{weather.humidity}%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{weather.rainfall} mm</div>
                  <div className="text-sm text-gray-600">Today's Rain</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-4">5-Day Forecast</h3>
              <div className="space-y-2">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{day.day}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">{day.temperature}°C</div>
                      <div className="flex items-center gap-1">
                        <CloudRainIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">{day.rainfall} mm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all">
            <BeakerIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Test Water Quality</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
            <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Usage Reports</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all">
            <CalendarIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Schedule Maintenance</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all">
            <PhoneIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Emergency Contact</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterResourceManagement;
