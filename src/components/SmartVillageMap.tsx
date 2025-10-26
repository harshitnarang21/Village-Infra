import React, { useState, useEffect, useRef } from 'react';
import {
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  BeakerIcon,
  SunIcon,
  HomeIcon,
  UserGroupIcon,
  PhoneIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import BrowserDatabase from '../database/BrowserDatabase';

// Mock Google Maps API for demonstration
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface MapAsset {
  id: string;
  name: string;
  type: 'water_pump' | 'solar_panel' | 'street_light' | 'waste_bin' | 'community_center' | 'school' | 'health_center';
  latitude: number;
  longitude: number;
  status: 'active' | 'maintenance' | 'inactive' | 'critical';
  healthScore: number;
  lastMaintenance: string;
  nextMaintenance: string;
  sensorData?: {
    temperature?: number;
    vibration?: number;
    voltage?: number;
    current?: number;
    pressure?: number;
  };
}

interface CitizenIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved';
  latitude: number;
  longitude: number;
  reportedBy: string;
  reportedAt: string;
  upvotes: number;
  photos?: string[];
}

interface MapLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  visible: boolean;
  count: number;
}

const SmartVillageMap: React.FC = () => {
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [assets, setAssets] = useState<MapAsset[]>([]);
  const [issues, setIssues] = useState<CitizenIssue[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MapAsset | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<CitizenIssue | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const database = BrowserDatabase.getInstance();

  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'water', name: 'Water Infrastructure', icon: <BeakerIcon className="h-4 w-4" />, color: 'blue', visible: true, count: 0 },
    { id: 'power', name: 'Power Infrastructure', icon: <BoltIcon className="h-4 w-4" />, color: 'yellow', visible: true, count: 0 },
    { id: 'solar', name: 'Solar Panels', icon: <SunIcon className="h-4 w-4" />, color: 'orange', visible: true, count: 0 },
    { id: 'lighting', name: 'Street Lighting', icon: <BoltIcon className="h-4 w-4" />, color: 'purple', visible: true, count: 0 },
    { id: 'community', name: 'Community Assets', icon: <HomeIcon className="h-4 w-4" />, color: 'green', visible: true, count: 0 },
    { id: 'issues', name: 'Citizen Issues', icon: <ExclamationTriangleIcon className="h-4 w-4" />, color: 'red', visible: true, count: 0 }
  ]);

  // Mock data for demonstration
  useEffect(() => {
    const mockAssets: MapAsset[] = [
      {
        id: 'WP001',
        name: 'Main Water Pump Station',
        type: 'water_pump',
        latitude: 18.5204,
        longitude: 73.8567,
        status: 'active',
        healthScore: 85,
        lastMaintenance: '2024-12-01',
        nextMaintenance: '2025-03-01',
        sensorData: { temperature: 45, vibration: 2.1, pressure: 3.2 }
      },
      {
        id: 'SP001',
        name: 'Solar Panel Array A',
        type: 'solar_panel',
        latitude: 18.5214,
        longitude: 73.8577,
        status: 'active',
        healthScore: 92,
        lastMaintenance: '2024-11-15',
        nextMaintenance: '2025-02-15',
        sensorData: { voltage: 240, current: 12.5, temperature: 35 }
      },
      {
        id: 'SL001',
        name: 'Street Light Circuit 1',
        type: 'street_light',
        latitude: 18.5194,
        longitude: 73.8557,
        status: 'maintenance',
        healthScore: 78,
        lastMaintenance: '2024-10-20',
        nextMaintenance: '2024-12-20',
        sensorData: { voltage: 220, current: 0.8 }
      },
      {
        id: 'CC001',
        name: 'Community Center',
        type: 'community_center',
        latitude: 18.5224,
        longitude: 73.8587,
        status: 'active',
        healthScore: 95,
        lastMaintenance: '2024-11-01',
        nextMaintenance: '2025-05-01'
      },
      {
        id: 'SC001',
        name: 'Primary School',
        type: 'school',
        latitude: 18.5184,
        longitude: 73.8547,
        status: 'active',
        healthScore: 88,
        lastMaintenance: '2024-10-15',
        nextMaintenance: '2025-04-15'
      }
    ];

    const mockIssues: CitizenIssue[] = [
      {
        id: 'ISS001',
        title: 'Water supply disruption',
        description: 'No water supply for the past 2 days in Sector A',
        category: 'water',
        priority: 'high',
        status: 'reported',
        latitude: 18.5200,
        longitude: 73.8560,
        reportedBy: 'Rajesh Kumar',
        reportedAt: '2024-12-15T10:30:00Z',
        upvotes: 15
      },
      {
        id: 'ISS002',
        title: 'Street light not working',
        description: 'Street light near community center has been flickering',
        category: 'electricity',
        priority: 'medium',
        status: 'acknowledged',
        latitude: 18.5220,
        longitude: 73.8580,
        reportedBy: 'Priya Sharma',
        reportedAt: '2024-12-14T18:45:00Z',
        upvotes: 8
      },
      {
        id: 'ISS003',
        title: 'Road pothole',
        description: 'Large pothole causing traffic issues',
        category: 'infrastructure',
        priority: 'medium',
        status: 'in_progress',
        latitude: 18.5190,
        longitude: 73.8550,
        reportedBy: 'Amit Patel',
        reportedAt: '2024-12-13T14:20:00Z',
        upvotes: 12
      }
    ];

    setAssets(mockAssets);
    setIssues(mockIssues);

    // Update layer counts
    setMapLayers(prev => prev.map(layer => ({
      ...layer,
      count: layer.id === 'water' ? mockAssets.filter(a => a.type === 'water_pump').length :
             layer.id === 'power' ? mockAssets.filter(a => a.type === 'street_light').length :
             layer.id === 'solar' ? mockAssets.filter(a => a.type === 'solar_panel').length :
             layer.id === 'community' ? mockAssets.filter(a => ['community_center', 'school', 'health_center'].includes(a.type)).length :
             layer.id === 'issues' ? mockIssues.length : 0
    })));
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 18.5204, lng: 73.8567 }, // Sudarshan Village center
        zoom: 16,
        mapTypeId: mapStyle,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      googleMapRef.current = map;
      setMapLoaded(true);
    };

    // Load Google Maps API
    if (!window.google) {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found in environment variables');
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
      script.async = true;
      script.defer = true;
      window.initMap = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [mapStyle]);

  // Add markers to map
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const visibleLayers = mapLayers.filter(layer => layer.visible).map(layer => layer.id);

    // Add asset markers
    assets.forEach(asset => {
      const shouldShow = 
        (asset.type === 'water_pump' && visibleLayers.includes('water')) ||
        (asset.type === 'solar_panel' && visibleLayers.includes('solar')) ||
        (asset.type === 'street_light' && visibleLayers.includes('power')) ||
        (['community_center', 'school', 'health_center'].includes(asset.type) && visibleLayers.includes('community'));

      if (!shouldShow) return;

      const marker = new window.google.maps.Marker({
        position: { lat: asset.latitude, lng: asset.longitude },
        map: googleMapRef.current,
        title: asset.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: asset.status === 'active' ? '#10B981' : 
                    asset.status === 'maintenance' ? '#F59E0B' : 
                    asset.status === 'critical' ? '#EF4444' : '#6B7280',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        setSelectedAsset(asset);
        setSelectedIssue(null);
      });

      markersRef.current.push(marker);
    });

    // Add issue markers
    if (visibleLayers.includes('issues')) {
      issues.forEach(issue => {
        const marker = new window.google.maps.Marker({
          position: { lat: issue.latitude, lng: issue.longitude },
          map: googleMapRef.current,
          title: issue.title,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: issue.priority === 'critical' ? '#DC2626' :
                      issue.priority === 'high' ? '#EA580C' :
                      issue.priority === 'medium' ? '#D97706' : '#65A30D',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 1
          }
        });

        marker.addListener('click', () => {
          setSelectedIssue(issue);
          setSelectedAsset(null);
        });

        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, assets, issues, mapLayers]);

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'maintenance': return <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'water_pump': return <BeakerIcon className="h-6 w-6 text-blue-600" />;
      case 'solar_panel': return <SunIcon className="h-6 w-6 text-orange-600" />;
      case 'street_light': return <BoltIcon className="h-6 w-6 text-purple-600" />;
      case 'community_center': return <UserGroupIcon className="h-6 w-6 text-green-600" />;
      case 'school': return <HomeIcon className="h-6 w-6 text-blue-600" />;
      default: return <MapPinIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Google Maps API Key Missing</h3>
              <p className="text-red-700 mt-1">
                The Google Maps API key is not configured in your environment variables.
              </p>
              <p className="text-sm text-red-600 mt-2">
                Please check your .env file and ensure REACT_APP_GOOGLE_MAPS_API_KEY is set correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl">
              <MapPinIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Village Map</h1>
              <p className="text-gray-600">Real-time infrastructure monitoring & citizen engagement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets or issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Map Style Selector */}
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="roadmap">Road Map</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
              <option value="terrain">Terrain</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Layer Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Map Layers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {mapLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    layer.visible 
                      ? 'border-blue-500 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {layer.visible ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                    {layer.icon}
                  </div>
                  <div className="text-sm font-medium">{layer.name}</div>
                  <div className="text-xs text-gray-500">{layer.count} items</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Map Loading */}
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Smart Village Map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          {selectedAsset && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getAssetIcon(selectedAsset.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedAsset.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{selectedAsset.type.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAsset.status)}
                    <span className="font-medium capitalize">{selectedAsset.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Health Score</div>
                    <div className="text-lg font-bold text-green-600">{selectedAsset.healthScore}%</div>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium">Last Maintenance</div>
                    <div className="text-sm text-blue-900">{new Date(selectedAsset.lastMaintenance).toLocaleDateString()}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs text-orange-600 font-medium">Next Maintenance</div>
                    <div className="text-sm text-orange-900">{new Date(selectedAsset.nextMaintenance).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Sensor Data */}
                {selectedAsset.sensorData && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Live Sensor Data</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedAsset.sensorData).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 capitalize">{key}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {value} {key === 'temperature' ? '°C' : key === 'voltage' ? 'V' : key === 'current' ? 'A' : key === 'pressure' ? 'PSI' : 'Hz'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule Maintenance
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    View History
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedIssue && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedIssue.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{selectedIssue.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Priority & Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-600">Priority</div>
                    <div className={`text-sm font-medium capitalize ${
                      selectedIssue.priority === 'critical' ? 'text-red-600' :
                      selectedIssue.priority === 'high' ? 'text-orange-600' :
                      selectedIssue.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {selectedIssue.priority}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Status</div>
                    <div className="text-sm font-medium capitalize">{selectedIssue.status.replace('_', ' ')}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700">{selectedIssue.description}</p>
                </div>

                {/* Reporter Info */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">Reported by</div>
                  <div className="text-sm text-blue-900">{selectedIssue.reportedBy}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {new Date(selectedIssue.reportedAt).toLocaleString()}
                  </div>
                </div>

                {/* Upvotes */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800">Community Support</span>
                  <span className="text-lg font-bold text-green-600">👍 {selectedIssue.upvotes}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Update Status
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Assign to Team
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Contact Reporter
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedAsset && !selectedIssue && (
            <div className="p-6">
              <div className="text-center py-12">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Asset or Issue</h3>
                <p className="text-gray-600">Click on any marker on the map to view detailed information</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Village Overview</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{assets.filter(a => a.status === 'active').length}</div>
                    <div className="text-xs text-green-700">Active Assets</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{assets.filter(a => a.status === 'maintenance').length}</div>
                    <div className="text-xs text-yellow-700">Under Maintenance</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{issues.filter(i => i.status === 'reported').length}</div>
                    <div className="text-xs text-red-700">Open Issues</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(assets.reduce((acc, a) => acc + a.healthScore, 0) / assets.length)}%</div>
                    <div className="text-xs text-blue-700">Avg Health</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartVillageMap;
