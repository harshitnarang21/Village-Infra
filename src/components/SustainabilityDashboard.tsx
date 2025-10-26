import React, { useState, useEffect } from 'react';
import { 
  BoltIcon, 
  CloudIcon,
  SunIcon,
  BeakerIcon,
  ChartBarIcon,
  TrophyIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface CarbonMetric {
  category: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface EnergyData {
  source: string;
  consumption: number;
  percentage: number;
  color: string;
  icon: string;
}

interface ESGScore {
  category: string;
  score: number;
  maxScore: number;
  description: string;
  improvements: string[];
}

const SustainabilityDashboard: React.FC = () => {
  const [carbonMetrics, setCarbonMetrics] = useState<CarbonMetric[]>([]);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [esgScores, setESGScores] = useState<ESGScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    // Simulate real-time data loading
    setTimeout(() => {
      setCarbonMetrics([
        {
          category: 'Transportation',
          current: 45.2,
          target: 40.0,
          unit: 'tons CO₂/month',
          trend: 'down',
          change: '-8.5%'
        },
        {
          category: 'Energy Consumption',
          current: 128.7,
          target: 120.0,
          unit: 'tons CO₂/month',
          trend: 'down',
          change: '-12.3%'
        },
        {
          category: 'Waste Management',
          current: 23.1,
          target: 25.0,
          unit: 'tons CO₂/month',
          trend: 'down',
          change: '-15.2%'
        },
        {
          category: 'Water Treatment',
          current: 18.9,
          target: 20.0,
          unit: 'tons CO₂/month',
          trend: 'stable',
          change: '+2.1%'
        }
      ]);

      setEnergyData([
        { source: 'Solar Power', consumption: 245.8, percentage: 45, color: 'bg-yellow-500', icon: '☀️' },
        { source: 'Wind Energy', consumption: 134.2, percentage: 25, color: 'bg-blue-500', icon: '💨' },
        { source: 'Hydroelectric', consumption: 89.6, percentage: 16, color: 'bg-cyan-500', icon: '💧' },
        { source: 'Grid Power', consumption: 76.4, percentage: 14, color: 'bg-gray-500', icon: '⚡' }
      ]);

      setESGScores([
        {
          category: 'Environmental',
          score: 87,
          maxScore: 100,
          description: 'Carbon footprint, renewable energy, waste management',
          improvements: ['Increase solar capacity by 20%', 'Implement composting program', 'Reduce water wastage']
        },
        {
          category: 'Social',
          score: 92,
          maxScore: 100,
          description: 'Community engagement, health & safety, education',
          improvements: ['Expand digital literacy programs', 'Improve healthcare access', 'Enhance public transportation']
        },
        {
          category: 'Governance',
          score: 89,
          maxScore: 100,
          description: 'Transparency, accountability, citizen participation',
          improvements: ['Increase budget transparency', 'Expand citizen voting platforms', 'Regular audit reports']
        }
      ]);
      setIsLoading(false);
    }, 1200);
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      case 'stable': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <GlobeAltIcon className="h-8 w-8 text-green-600 animate-pulse" />
            <span className="text-lg font-medium text-gray-600">Loading sustainability metrics...</span>
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
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl">
            <GlobeAltIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sustainability Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time carbon footprint, energy monitoring & ESG compliance</p>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                selectedPeriod === period
                  ? 'bg-white text-green-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Carbon Footprint</p>
              <p className="text-3xl font-bold text-green-600">215.9</p>
              <p className="text-xs text-gray-500">tons CO₂/month</p>
            </div>
            <CloudIcon className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-green-600 font-medium">↓ 11.2% from last month</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Renewable Energy</p>
              <p className="text-3xl font-bold text-yellow-600">86%</p>
              <p className="text-xs text-gray-500">of total consumption</p>
            </div>
            <SunIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-2 text-sm text-yellow-600 font-medium">↑ 5.3% from last month</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Energy Efficiency</p>
              <p className="text-3xl font-bold text-blue-600">94%</p>
              <p className="text-xs text-gray-500">optimization score</p>
            </div>
            <BoltIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2 text-sm text-blue-600 font-medium">↑ 2.8% from last month</div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ESG Score</p>
              <p className="text-3xl font-bold text-purple-600">89.3</p>
              <p className="text-xs text-gray-500">out of 100</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2 text-sm text-purple-600 font-medium">↑ 4.1% from last month</div>
        </div>
      </div>

      {/* Carbon Footprint Tracking */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🌍 Real-Time Carbon Footprint Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carbonMetrics.map((metric, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{metric.category}</h3>
                <span className={`text-lg ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-semibold">{metric.current} {metric.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-semibold text-green-600">{metric.target} {metric.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.current <= metric.target ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change} vs last period
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy Consumption Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">⚡ Energy Consumption Monitoring</h2>
          <div className="space-y-4">
            {energyData.map((energy, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="text-2xl">{energy.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{energy.source}</span>
                    <span className="text-sm font-semibold">{energy.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${energy.color}`}
                      style={{ width: `${energy.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{energy.consumption} kWh</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">🎯 Energy Goals</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Achieve 90% renewable energy by 2025</li>
              <li>• Reduce overall consumption by 15%</li>
              <li>• Install 100 more solar panels</li>
            </ul>
          </div>
        </div>

        {/* ESG Compliance */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 ESG Compliance Score</h2>
          <div className="space-y-6">
            {esgScores.map((esg, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{esg.category}</h3>
                  <span className="text-lg font-bold text-gray-900">{esg.score}/{esg.maxScore}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${
                      esg.score >= 90 ? 'bg-green-500' : esg.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(esg.score / esg.maxScore) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{esg.description}</p>
                <div className="text-xs text-gray-500">
                  <strong>Improvements:</strong>
                  <ul className="mt-1 space-y-1">
                    {esg.improvements.slice(0, 2).map((improvement, i) => (
                      <li key={i}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Initiatives */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🌱 Active Sustainability Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <SunIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Solar Expansion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Installing 200 additional solar panels across community buildings</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress:</span>
              <span className="font-semibold text-green-600">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BeakerIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Water Conservation</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Rainwater harvesting and greywater recycling systems</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress:</span>
              <span className="font-semibold text-blue-600">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Waste Reduction</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Community composting and plastic-free initiatives</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress:</span>
              <span className="font-semibold text-purple-600">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Environmental Impact Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-600">2,847</div>
            <div className="text-sm text-green-700 font-medium">Trees Equivalent Saved</div>
            <div className="text-xs text-green-600 mt-1">Carbon offset this year</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">45,230</div>
            <div className="text-sm text-blue-700 font-medium">Liters Water Saved</div>
            <div className="text-xs text-blue-600 mt-1">Through conservation efforts</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600">₹3.2L</div>
            <div className="text-sm text-yellow-700 font-medium">Energy Cost Savings</div>
            <div className="text-xs text-yellow-600 mt-1">From renewable sources</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">89%</div>
            <div className="text-sm text-purple-700 font-medium">Waste Diverted</div>
            <div className="text-xs text-purple-600 mt-1">From landfills</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
