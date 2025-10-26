import React, { useState } from 'react';
import {
  MapPinIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  MicrophoneIcon,
  CloudIcon,
  ShieldCheckIcon,
  LanguageIcon,
  ChartBarIcon,
  CogIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface USPFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  metrics: { label: string; value: string; color: string }[];
  demoAvailable: boolean;
}

const MapUSPShowcase: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const uspFeatures: USPFeature[] = [
    {
      id: 'real-time-monitoring',
      title: 'Real-Time Infrastructure Visualization',
      description: 'Live monitoring of all village assets with instant status updates and health scores',
      icon: <EyeIcon className="h-8 w-8" />,
      benefits: [
        'Reduces infrastructure downtime by 40%',
        'Proactive maintenance alerts',
        'Live sensor data integration',
        'Color-coded health indicators'
      ],
      metrics: [
        { label: 'Uptime Improvement', value: '40%', color: 'green' },
        { label: 'Response Time', value: '<2min', color: 'blue' },
        { label: 'Assets Monitored', value: '500+', color: 'purple' }
      ],
      demoAvailable: true
    },
    {
      id: 'citizen-engagement',
      title: 'Citizen-Centric Issue Reporting',
      description: 'GPS-precise issue reporting with photo documentation and community voting',
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      benefits: [
        'Increases citizen satisfaction by 60%',
        'GPS-precise location reporting',
        'Photo evidence attachment',
        'Community upvoting system'
      ],
      metrics: [
        { label: 'Satisfaction Increase', value: '60%', color: 'green' },
        { label: 'Response Time Reduction', value: '50%', color: 'blue' },
        { label: 'Citizen Participation', value: '85%', color: 'orange' }
      ],
      demoAvailable: true
    },
    {
      id: 'voice-integration',
      title: 'AI-Powered Voice Navigation',
      description: 'Multilingual voice commands for hands-free map interaction and accessibility',
      icon: <MicrophoneIcon className="h-8 w-8" />,
      benefits: [
        'First voice-controlled village mapping system',
        '8+ Indian languages supported',
        'Hands-free operation for field workers',
        'Audio descriptions for accessibility'
      ],
      metrics: [
        { label: 'Languages Supported', value: '8+', color: 'purple' },
        { label: 'Voice Accuracy', value: '95%', color: 'green' },
        { label: 'Accessibility Score', value: 'AAA', color: 'blue' }
      ],
      demoAvailable: true
    },
    {
      id: 'offline-capability',
      title: 'Offline-First Architecture',
      description: 'Works without internet connectivity with intelligent sync when online',
      icon: <CloudIcon className="h-8 w-8" />,
      benefits: [
        'Ensures 100% uptime in poor connectivity areas',
        'Cached map data for offline use',
        'Queue reports for sync when online',
        'Progressive data synchronization'
      ],
      metrics: [
        { label: 'Offline Uptime', value: '100%', color: 'green' },
        { label: 'Sync Efficiency', value: '98%', color: 'blue' },
        { label: 'Data Cached', value: '50MB', color: 'orange' }
      ],
      demoAvailable: true
    },
    {
      id: 'blockchain-transparency',
      title: 'Blockchain-Verified Transparency',
      description: 'Immutable records of all infrastructure changes and citizen reports',
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      benefits: [
        'First blockchain-verified village system',
        'Immutable issue records',
        'Transparent fund allocation mapping',
        'Complete audit trail'
      ],
      metrics: [
        { label: 'Transparency Score', value: '100%', color: 'green' },
        { label: 'Records Verified', value: '10K+', color: 'blue' },
        { label: 'Trust Rating', value: '9.8/10', color: 'purple' }
      ],
      demoAvailable: true
    },
    {
      id: 'cultural-adaptation',
      title: 'Cultural & Linguistic Adaptation',
      description: 'Designed specifically for Indian villages with local language and cultural integration',
      icon: <LanguageIcon className="h-8 w-8" />,
      benefits: [
        'Interface in regional languages',
        'Cultural landmarks integration',
        'Festival and event mapping',
        'Traditional knowledge incorporation'
      ],
      metrics: [
        { label: 'Regional Languages', value: '8', color: 'orange' },
        { label: 'Cultural Sites', value: '200+', color: 'green' },
        { label: 'User Adoption', value: '90%', color: 'blue' }
      ],
      demoAvailable: true
    },
    {
      id: 'predictive-analytics',
      title: 'AI-Powered Spatial Analytics',
      description: 'Machine learning algorithms for pattern recognition and predictive maintenance',
      icon: <SparklesIcon className="h-8 w-8" />,
      benefits: [
        'Predicts infrastructure failures',
        'Optimizes resource allocation',
        'Risk assessment by location',
        'Maintenance route planning'
      ],
      metrics: [
        { label: 'Cost Reduction', value: '35%', color: 'green' },
        { label: 'Prediction Accuracy', value: '92%', color: 'blue' },
        { label: 'Efficiency Gain', value: '45%', color: 'purple' }
      ],
      demoAvailable: true
    },
    {
      id: 'multi-layer-intelligence',
      title: 'Multi-Layer Intelligence System',
      description: 'Comprehensive data layers for infrastructure, demographics, and environmental monitoring',
      icon: <ChartBarIcon className="h-8 w-8" />,
      benefits: [
        'Infrastructure, demographic, environmental layers',
        'Emergency response planning',
        'Data-driven decision making',
        'Comprehensive village analytics'
      ],
      metrics: [
        { label: 'Data Layers', value: '12+', color: 'purple' },
        { label: 'Decision Accuracy', value: '88%', color: 'green' },
        { label: 'Planning Efficiency', value: '65%', color: 'blue' }
      ],
      demoAvailable: true
    }
  ];

  const competitiveAdvantages = [
    { feature: 'Real-time Monitoring', us: 'Live updates', others: 'Manual reports', advantage: '10x faster response' },
    { feature: 'Citizen Engagement', us: 'Direct GPS reporting', others: 'Phone/email only', advantage: '5x higher participation' },
    { feature: 'Multilingual Support', us: '8+ languages', others: 'English only', advantage: '100% accessibility' },
    { feature: 'Offline Capability', us: 'Full offline mode', others: 'Requires internet', advantage: 'Works everywhere' },
    { feature: 'Predictive Analytics', us: 'AI-powered', others: 'Reactive only', advantage: '40% cost reduction' },
    { feature: 'Transparency', us: 'Blockchain verified', others: 'Paper records', advantage: 'Complete accountability' }
  ];

  const futureRoadmap = [
    { phase: 'Phase 1: Core Implementation', status: 'Completed', items: ['Basic map integration', 'Issue reporting', 'Real-time monitoring', 'Multi-language support'] },
    { phase: 'Phase 2: Advanced Features', status: 'In Progress', items: ['AI predictive analytics', 'Voice integration', 'Offline sync', 'Mobile app'] },
    { phase: 'Phase 3: Ecosystem Expansion', status: 'Planned', items: ['IoT sensor network', 'Blockchain layer', 'AR/VR tools', 'Inter-village connectivity'] },
    { phase: 'Phase 4: Scale & Innovation', status: 'Future', items: ['Drone integration', 'Satellite imagery', 'AI urban planning', 'Global expansion'] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl">
                <GlobeAltIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Google Maps Integration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary village infrastructure management combining real-time monitoring, 
              citizen engagement, and predictive analytics in a single geospatial interface
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <div className="px-6 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                🏆 Industry First
              </div>
              <div className="px-6 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                🌍 Made for India
              </div>
              <div className="px-6 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
                🚀 AI-Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
            <div className="text-gray-600">Infrastructure Downtime Reduction</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
            <div className="text-gray-600">Citizen Satisfaction Increase</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">35%</div>
            <div className="text-gray-600">Operational Cost Reduction</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">8+</div>
            <div className="text-gray-600">Indian Languages Supported</div>
          </div>
        </div>

        {/* Core USP Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Core USP Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uspFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedFeature === feature.id ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                }`}
                onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                
                {/* Metrics */}
                <div className="space-y-2">
                  {feature.metrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{metric.label}</span>
                      <span className={`text-sm font-bold ${
                        metric.color === 'green' ? 'text-green-600' :
                        metric.color === 'blue' ? 'text-blue-600' :
                        metric.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                      }`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                {feature.demoAvailable && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Try Demo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Feature View */}
        {selectedFeature && (
          <div className="mb-16">
            {(() => {
              const feature = uspFeatures.find(f => f.id === selectedFeature);
              if (!feature) return null;
              
              return (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-blue-600">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{feature.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h4>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                      <div className="space-y-4">
                        {feature.metrics.map((metric, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{metric.label}</span>
                            <span className={`text-xl font-bold ${
                              metric.color === 'green' ? 'text-green-600' :
                              metric.color === 'blue' ? 'text-blue-600' :
                              metric.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                            }`}>
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Competitive Analysis */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Competitive Advantage</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600">Our Solution</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Traditional Systems</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-600">Our Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {competitiveAdvantages.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">✅ {item.us}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">❌ {item.others}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">{item.advantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Future Roadmap */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Development Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {futureRoadmap.map((phase, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${
                    phase.status === 'Completed' ? 'bg-green-500' :
                    phase.status === 'In Progress' ? 'bg-blue-500' :
                    phase.status === 'Planned' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    phase.status === 'Completed' ? 'text-green-600' :
                    phase.status === 'In Progress' ? 'text-blue-600' :
                    phase.status === 'Planned' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{phase.phase}</h3>
                <ul className="space-y-1">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
            <RocketLaunchIcon className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Village?</h2>
            <p className="text-xl mb-6 opacity-90">
              Experience the future of village infrastructure management with our Google Maps integration
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Try Live Demo
              </button>
              <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapUSPShowcase;
