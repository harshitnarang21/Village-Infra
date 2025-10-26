import React, { useState, useEffect } from 'react';
import {
  SunIcon,
  CloudIcon,
  BeakerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  MapPinIcon,
  CameraIcon,
  BugAntIcon,
  SparklesIcon as LeafIcon,
  TruckIcon,
  UserGroupIcon,
  PhoneIcon,
  DocumentTextIcon,
  ClockIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface CropData {
  id: string;
  name: string;
  variety: string;
  area: number; // in acres
  plantingDate: string;
  expectedHarvest: string;
  currentStage: 'seeding' | 'growing' | 'flowering' | 'fruiting' | 'harvesting';
  healthScore: number;
  yieldPrediction: number;
  location: string;
  farmer: string;
  soilType: string;
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'rainfed';
}

interface SoilData {
  id: string;
  location: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  temperature: number;
  lastTested: string;
  recommendations: string[];
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  uvIndex: number;
  forecast: {
    day: string;
    temp: number;
    rainfall: number;
    humidity: number;
    condition: string;
  }[];
}

interface MarketPrice {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  market: string;
  date: string;
}

interface Alert {
  id: string;
  type: 'pest' | 'disease' | 'weather' | 'irrigation' | 'harvest' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  crop: string;
  location: string;
  timestamp: string;
  actionRequired: boolean;
}

const AgriculturalIntelligence: React.FC = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState<CropData[]>([]);
  const [soilData, setSoilData] = useState<SoilData[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'crops' | 'soil' | 'weather' | 'market'>('overview');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockCrops: CropData[] = [
      {
        id: 'CROP001',
        name: 'Rice',
        variety: 'Basmati 1121',
        area: 25,
        plantingDate: '2024-06-15',
        expectedHarvest: '2024-11-20',
        currentStage: 'flowering',
        healthScore: 87,
        yieldPrediction: 45,
        location: 'Field A - North',
        farmer: 'Ramesh Kumar',
        soilType: 'Clay Loam',
        irrigationType: 'flood'
      },
      {
        id: 'CROP002',
        name: 'Wheat',
        variety: 'HD 2967',
        area: 18,
        plantingDate: '2024-11-01',
        expectedHarvest: '2025-04-15',
        currentStage: 'growing',
        healthScore: 92,
        yieldPrediction: 38,
        location: 'Field B - South',
        farmer: 'Suresh Patel',
        soilType: 'Sandy Loam',
        irrigationType: 'sprinkler'
      },
      {
        id: 'CROP003',
        name: 'Sugarcane',
        variety: 'Co 86032',
        area: 12,
        plantingDate: '2024-03-10',
        expectedHarvest: '2025-01-30',
        currentStage: 'growing',
        healthScore: 78,
        yieldPrediction: 65,
        location: 'Field C - East',
        farmer: 'Mahesh Singh',
        soilType: 'Black Soil',
        irrigationType: 'drip'
      },
      {
        id: 'CROP004',
        name: 'Cotton',
        variety: 'Bt Cotton',
        area: 20,
        plantingDate: '2024-05-20',
        expectedHarvest: '2024-12-10',
        currentStage: 'fruiting',
        healthScore: 85,
        yieldPrediction: 28,
        location: 'Field D - West',
        farmer: 'Vijay Sharma',
        soilType: 'Red Soil',
        irrigationType: 'drip'
      }
    ];

    const mockSoilData: SoilData[] = [
      {
        id: 'SOIL001',
        location: 'Field A - North',
        ph: 6.8,
        nitrogen: 280,
        phosphorus: 45,
        potassium: 320,
        organicMatter: 3.2,
        moisture: 65,
        temperature: 26,
        lastTested: '2024-12-10',
        recommendations: ['Add organic compost', 'Reduce nitrogen fertilizer', 'Maintain current irrigation']
      },
      {
        id: 'SOIL002',
        location: 'Field B - South',
        ph: 7.2,
        nitrogen: 320,
        phosphorus: 38,
        potassium: 280,
        organicMatter: 2.8,
        moisture: 58,
        temperature: 24,
        lastTested: '2024-12-08',
        recommendations: ['Increase phosphorus', 'Add lime to reduce pH', 'Consider drip irrigation']
      }
    ];

    const mockWeather: WeatherData = {
      temperature: 28,
      humidity: 72,
      rainfall: 5.2,
      windSpeed: 12,
      uvIndex: 7,
      forecast: [
        { day: 'Today', temp: 28, rainfall: 5.2, humidity: 72, condition: 'Partly Cloudy' },
        { day: 'Tomorrow', temp: 30, rainfall: 2.1, humidity: 68, condition: 'Sunny' },
        { day: 'Day 3', temp: 26, rainfall: 12.5, humidity: 85, condition: 'Rainy' },
        { day: 'Day 4', temp: 24, rainfall: 18.3, humidity: 90, condition: 'Heavy Rain' },
        { day: 'Day 5', temp: 27, rainfall: 3.7, humidity: 75, condition: 'Cloudy' }
      ]
    };

    const mockMarketPrices: MarketPrice[] = [
      { crop: 'Rice', currentPrice: 2850, previousPrice: 2780, trend: 'up', market: 'Pune APMC', date: '2024-12-15' },
      { crop: 'Wheat', currentPrice: 2320, previousPrice: 2350, trend: 'down', market: 'Delhi Mandi', date: '2024-12-15' },
      { crop: 'Sugarcane', currentPrice: 3200, previousPrice: 3150, trend: 'up', market: 'Mumbai Market', date: '2024-12-15' },
      { crop: 'Cotton', currentPrice: 6800, previousPrice: 6750, trend: 'up', market: 'Nagpur Cotton', date: '2024-12-15' }
    ];

    const mockAlerts: Alert[] = [
      {
        id: 'ALT001',
        type: 'pest',
        severity: 'high',
        message: 'Brown Plant Hopper detected in Rice Field A',
        crop: 'Rice',
        location: 'Field A - North',
        timestamp: '2024-12-15T08:30:00Z',
        actionRequired: true
      },
      {
        id: 'ALT002',
        type: 'weather',
        severity: 'medium',
        message: 'Heavy rainfall expected in next 48 hours',
        crop: 'All Crops',
        location: 'All Fields',
        timestamp: '2024-12-15T06:00:00Z',
        actionRequired: true
      },
      {
        id: 'ALT003',
        type: 'market',
        severity: 'low',
        message: 'Rice prices increased by 2.5% in Pune APMC',
        crop: 'Rice',
        location: 'Market',
        timestamp: '2024-12-15T10:15:00Z',
        actionRequired: false
      }
    ];

    setCrops(mockCrops);
    setSoilData(mockSoilData);
    setWeather(mockWeather);
    setMarketPrices(mockMarketPrices);
    setAlerts(mockAlerts);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      setCrops(prev => prev.map(crop => ({
        ...crop,
        healthScore: Math.max(60, Math.min(100, crop.healthScore + (Math.random() - 0.5) * 4)),
        yieldPrediction: Math.max(crop.yieldPrediction * 0.8, Math.min(crop.yieldPrediction * 1.2, crop.yieldPrediction + (Math.random() - 0.5) * 3))
      })));
    }, 8000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seeding': return 'text-yellow-600 bg-yellow-100';
      case 'growing': return 'text-green-600 bg-green-100';
      case 'flowering': return 'text-purple-600 bg-purple-100';
      case 'fruiting': return 'text-orange-600 bg-orange-100';
      case 'harvesting': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const averageHealth = crops.reduce((sum, crop) => sum + crop.healthScore, 0) / crops.length;
  const totalYieldPrediction = crops.reduce((sum, crop) => sum + (crop.yieldPrediction * crop.area), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-yellow-600 rounded-2xl">
              <LeafIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agricultural Intelligence Platform</h1>
              <p className="text-gray-600">Smart farming with AI-powered crop monitoring and market insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="overview">Overview</option>
              <option value="crops">Crop Details</option>
              <option value="soil">Soil Analysis</option>
              <option value="weather">Weather</option>
              <option value="market">Market Prices</option>
            </select>
            
            <button
              onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                realTimeUpdates 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {realTimeUpdates ? '🔴 Live Updates' : '⏸️ Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <LeafIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">{crops.length} crops</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalArea} acres</div>
          <div className="text-gray-600">Total Cultivated Area</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">Average</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{averageHealth.toFixed(0)}%</div>
          <div className="text-gray-600">Crop Health Score</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TruckIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm text-yellow-600 font-medium">Predicted</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{(totalYieldPrediction/1000).toFixed(1)}K</div>
          <div className="text-gray-600">Total Yield (quintals)</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyRupeeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">Estimated</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">₹{((totalYieldPrediction * 2500)/100000).toFixed(1)}L</div>
          <div className="text-gray-600">Revenue Potential</div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.filter(a => a.actionRequired).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            Active Alerts ({alerts.filter(a => a.actionRequired).length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {alerts.filter(a => a.actionRequired).map((alert) => (
              <div key={alert.id} className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {alert.type === 'pest' && <BugAntIcon className="h-5 w-5 text-red-600" />}
                    {alert.type === 'weather' && <CloudIcon className="h-5 w-5 text-blue-600" />}
                    {alert.type === 'market' && <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />}
                    <span className="font-medium text-gray-900 capitalize">{alert.type} Alert</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{alert.message}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{alert.crop} • {alert.location}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">
                      Take Action
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Based on Selected View */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Crop Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Crop Overview</h2>
            <div className="space-y-4">
              {crops.map((crop) => (
                <div key={crop.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <LeafIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{crop.name} ({crop.variety})</div>
                        <div className="text-sm text-gray-600">{crop.area} acres • {crop.farmer}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(crop.currentStage)}`}>
                        {crop.currentStage}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Health Score</div>
                      <div className={`text-lg font-bold ${getHealthColor(crop.healthScore)}`}>
                        {crop.healthScore}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Yield Prediction</div>
                      <div className="text-lg font-bold text-blue-600">{crop.yieldPrediction.toFixed(1)} q/acre</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Expected Harvest</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(crop.expectedHarvest).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather & Market Summary */}
          <div className="space-y-6">
            {/* Weather Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CloudIcon className="h-6 w-6 text-blue-600" />
                Weather Conditions
              </h2>
              {weather && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{weather.temperature}°C</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                  <div className="text-center p-3 bg-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600">{weather.humidity}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{weather.rainfall} mm</div>
                    <div className="text-sm text-gray-600">Rainfall</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{weather.uvIndex}</div>
                    <div className="text-sm text-gray-600">UV Index</div>
                  </div>
                </div>
              )}
            </div>

            {/* Market Prices Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                Market Prices
              </h2>
              <div className="space-y-3">
                {marketPrices.map((price, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{price.crop}</div>
                      <div className="text-sm text-gray-600">{price.market}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{price.currentPrice}</span>
                        {getTrendIcon(price.trend)}
                      </div>
                      <div className="text-sm text-gray-600">per quintal</div>
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
          <button 
            onClick={() => {
              alert('🔍 Crop Health Scan\n\nInitiating AI-powered crop health analysis...\n\n• Camera-based disease detection\n• Pest identification\n• Growth stage assessment\n• Health score calculation\n\nFeature: Ready for field deployment!');
            }}
            className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Start crop health scanning using AI-powered image analysis"
          >
            <CameraIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Crop Health Scan</div>
            <div className="text-xs mt-1 opacity-90">AI-powered analysis</div>
          </button>
          
          <button 
            onClick={() => {
              alert('🧪 Soil Testing\n\nScheduling comprehensive soil analysis...\n\n• NPK levels testing\n• pH measurement\n• Organic matter analysis\n• Moisture content check\n• Fertilizer recommendations\n\nNext available slot: Tomorrow 9:00 AM');
            }}
            className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Schedule comprehensive soil testing and analysis"
          >
            <BeakerIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Soil Testing</div>
            <div className="text-xs mt-1 opacity-90">NPK & pH analysis</div>
          </button>
          
          <button 
            onClick={() => {
              const currentTime = new Date().toLocaleTimeString();
              alert(`💧 Irrigation Scheduled\n\nSmart irrigation system activated!\n\n• Next irrigation: ${currentTime}\n• Duration: 45 minutes\n• Water amount: 2,500 liters\n• Coverage: 25 acres\n• Weather-optimized timing\n\nSystem will auto-adjust based on soil moisture and weather forecast.`);
            }}
            className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            aria-label="Schedule smart irrigation system with weather optimization"
          >
            <CalendarIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Schedule Irrigation</div>
            <div className="text-xs mt-1 opacity-90">Weather-optimized</div>
          </button>
          
          <button 
            onClick={() => {
              alert('👨‍🌾 Expert Consultation\n\nConnecting you with agricultural experts...\n\n• Dr. Rajesh Kumar - Crop Specialist\n• Available: Online now\n• Expertise: Rice, Wheat, Cotton\n• Languages: Hindi, English, Marathi\n\n📞 Call now: +91-9876543210\n💬 Video consultation available\n📧 Email: expert@agriculture.gov.in');
            }}
            className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Connect with agricultural experts for consultation"
          >
            <PhoneIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Expert Consultation</div>
            <div className="text-xs mt-1 opacity-90">24/7 available</div>
          </button>
        </div>
        
        {/* Additional Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <button 
            onClick={() => {
              alert('📊 Market Analysis\n\nLatest market insights:\n\n• Rice: ₹2,850/quintal (↑2.5%)\n• Wheat: ₹2,320/quintal (↓1.3%)\n• Cotton: ₹6,800/quintal (↑0.7%)\n• Sugarcane: ₹3,200/quintal (↑1.6%)\n\nBest selling time: Next week\nRecommended action: Hold rice, sell wheat');
            }}
            className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="View current market prices and selling recommendations"
          >
            <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Market Analysis</div>
            <div className="text-xs mt-1 opacity-90">Price trends</div>
          </button>
          
          <button 
            onClick={() => {
              alert('🌤️ Weather Forecast\n\n5-Day Agricultural Weather:\n\n• Today: 28°C, 5mm rain, Good for spraying\n• Tomorrow: 30°C, 2mm rain, Ideal for harvesting\n• Day 3: 26°C, 12mm rain, Avoid field work\n• Day 4: 24°C, 18mm rain, Heavy rain expected\n• Day 5: 27°C, 4mm rain, Resume operations\n\nRecommendation: Complete harvesting by Day 2');
            }}
            className="p-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            aria-label="View detailed weather forecast for agricultural planning"
          >
            <CloudIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Weather Forecast</div>
            <div className="text-xs mt-1 opacity-90">5-day outlook</div>
          </button>
          
          <button 
            onClick={() => {
              alert('📋 Crop Reports\n\nGenerate comprehensive reports:\n\n• Yield Analysis Report\n• Seasonal Performance Summary\n• Cost-Benefit Analysis\n• Pest & Disease Log\n• Irrigation Efficiency Report\n• Market Performance Tracking\n\nReports available in: PDF, Excel, Hindi\nEmail delivery: Enabled\nNext auto-report: Weekly Monday');
            }}
            className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Generate and download comprehensive crop reports"
          >
            <DocumentTextIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Generate Reports</div>
            <div className="text-xs mt-1 opacity-90">PDF & Excel</div>
          </button>
          
          <button 
            onClick={() => {
              alert('⚙️ System Settings\n\nAgriculture Dashboard Settings:\n\n• Language: हिंदी/English/मराठी\n• Units: Metric/Imperial\n• Notifications: Email + SMS\n• Auto-reports: Weekly\n• Weather alerts: Enabled\n• Market updates: Daily\n\n🔔 Alert preferences:\n• Pest warnings: High priority\n• Weather alerts: Medium priority\n• Market updates: Low priority');
            }}
            className="p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Configure agriculture dashboard settings and preferences"
          >
            <CogIcon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Settings</div>
            <div className="text-xs mt-1 opacity-90">Preferences</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalIntelligence;
