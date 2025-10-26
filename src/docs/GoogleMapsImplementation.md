# 🗺️ Google Maps Integration - Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing and deploying the Google Maps integration in the Smart Village Digital Twin platform.

## 🚀 Quick Start

### Prerequisites
- Google Cloud Platform account
- Google Maps JavaScript API key
- React application setup
- Node.js 16+ and npm/yarn

### 1. Google Maps API Setup

#### Step 1: Create Google Cloud Project
```bash
# Visit Google Cloud Console
https://console.cloud.google.com/

# Create new project or select existing one
# Enable Google Maps JavaScript API
# Enable Places API (optional for enhanced features)
```

#### Step 2: Generate API Key
```bash
# Go to Credentials section
# Create API Key
# Restrict API key to your domain for security
# Enable required APIs:
- Maps JavaScript API
- Places API
- Geocoding API
```

#### Step 3: Configure API Key
```javascript
// Add to your environment variables
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here

// Or directly in the component (not recommended for production)
const GOOGLE_MAPS_API_KEY = 'your_api_key_here';
```

### 2. Component Integration

#### Install Dependencies
```bash
npm install @googlemaps/js-api-loader
# or
yarn add @googlemaps/js-api-loader
```

#### Basic Implementation
```typescript
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

// Initialize map
const initializeMap = async () => {
  const google = await loader.load();
  const map = new google.maps.Map(mapRef.current!, {
    center: { lat: 18.5204, lng: 73.8567 },
    zoom: 16
  });
};
```

## 🎯 Core Features Implementation

### 1. Real-Time Asset Monitoring

#### Asset Data Structure
```typescript
interface MapAsset {
  id: string;
  name: string;
  type: 'water_pump' | 'solar_panel' | 'street_light' | 'community_center';
  latitude: number;
  longitude: number;
  status: 'active' | 'maintenance' | 'inactive' | 'critical';
  healthScore: number;
  sensorData?: {
    temperature?: number;
    voltage?: number;
    pressure?: number;
  };
}
```

#### Adding Asset Markers
```typescript
const addAssetMarkers = (assets: MapAsset[]) => {
  assets.forEach(asset => {
    const marker = new google.maps.Marker({
      position: { lat: asset.latitude, lng: asset.longitude },
      map: googleMapRef.current,
      title: asset.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: getStatusColor(asset.status),
        fillOpacity: 0.8,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    });

    // Add click listener for asset details
    marker.addListener('click', () => {
      showAssetDetails(asset);
    });
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#10B981';
    case 'maintenance': return '#F59E0B';
    case 'critical': return '#EF4444';
    default: return '#6B7280';
  }
};
```

### 2. Citizen Issue Reporting

#### Issue Data Structure
```typescript
interface CitizenIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  reportedBy: string;
  reportedAt: string;
  photos?: string[];
}
```

#### Click-to-Report Feature
```typescript
const enableIssueReporting = () => {
  googleMapRef.current.addListener('click', (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Show issue reporting form
    showIssueReportForm({ latitude: lat, longitude: lng });
  });
};

const showIssueReportForm = (location: { latitude: number; longitude: number }) => {
  // Implementation for issue reporting modal
  setReportLocation(location);
  setShowReportModal(true);
};
```

### 3. Multi-Layer Visualization

#### Layer Management
```typescript
interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  markers: google.maps.Marker[];
}

const toggleLayer = (layerId: string) => {
  const layer = mapLayers.find(l => l.id === layerId);
  if (layer) {
    layer.markers.forEach(marker => {
      marker.setVisible(!layer.visible);
    });
    layer.visible = !layer.visible;
  }
};
```

#### Custom Map Styles
```typescript
const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f5f1e6' }]
  }
];

const map = new google.maps.Map(mapRef.current, {
  center: { lat: 18.5204, lng: 73.8567 },
  zoom: 16,
  styles: mapStyles
});
```

## 🔧 Advanced Features

### 1. Voice Integration

#### Voice Command Processing
```typescript
const processMapVoiceCommand = async (command: string) => {
  // Integration with Gemini API for command understanding
  const result = await geminiService.processVoiceCommand({
    text: command,
    language: 'en',
    context: 'map_navigation'
  });

  // Execute map actions based on AI response
  if (result.action === 'show_asset') {
    const asset = findAssetByName(result.parameters.assetName);
    if (asset) {
      panToAsset(asset);
    }
  }
};

const panToAsset = (asset: MapAsset) => {
  googleMapRef.current.panTo({
    lat: asset.latitude,
    lng: asset.longitude
  });
  googleMapRef.current.setZoom(18);
};
```

### 2. Offline Capability

#### Caching Strategy
```typescript
const cacheMapData = () => {
  // Cache critical map data for offline use
  const mapData = {
    assets: assets,
    issues: issues,
    mapBounds: googleMapRef.current.getBounds(),
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem('cached_map_data', JSON.stringify(mapData));
};

const loadOfflineData = () => {
  const cachedData = localStorage.getItem('cached_map_data');
  if (cachedData) {
    const data = JSON.parse(cachedData);
    setAssets(data.assets);
    setIssues(data.issues);
  }
};
```

### 3. Real-Time Updates

#### WebSocket Integration
```typescript
const setupRealTimeUpdates = () => {
  const ws = new WebSocket('ws://your-websocket-server');
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    
    switch (update.type) {
      case 'asset_status_change':
        updateAssetStatus(update.assetId, update.newStatus);
        break;
      case 'new_issue_reported':
        addNewIssueMarker(update.issue);
        break;
    }
  };
};

const updateAssetStatus = (assetId: string, newStatus: string) => {
  // Find and update asset marker color
  const asset = assets.find(a => a.id === assetId);
  if (asset) {
    asset.status = newStatus as any;
    // Update marker appearance
    refreshAssetMarker(asset);
  }
};
```

## 📱 Mobile Optimization

### Responsive Design
```css
/* Mobile-first approach */
.map-container {
  height: 100vh;
  width: 100%;
}

@media (max-width: 768px) {
  .map-sidebar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    transform: translateY(calc(100% - 60px));
    transition: transform 0.3s ease;
  }
  
  .map-sidebar.expanded {
    transform: translateY(0);
  }
}
```

### Touch Gestures
```typescript
const setupMobileGestures = () => {
  // Enable gesture handling for mobile
  googleMapRef.current.setOptions({
    gestureHandling: 'cooperative',
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });
};
```

## 🔒 Security Best Practices

### API Key Security
```typescript
// 1. Use environment variables
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// 2. Restrict API key in Google Cloud Console
// - HTTP referrers (web sites)
// - Add your domain: https://yourdomain.com/*

// 3. Monitor API usage
// - Set up billing alerts
// - Monitor for unusual activity
```

### Data Protection
```typescript
// Sanitize user input
const sanitizeInput = (input: string) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Validate coordinates
const validateCoordinates = (lat: number, lng: number) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
```

## 📊 Performance Optimization

### Marker Clustering
```typescript
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const setupMarkerClustering = () => {
  const clusterer = new MarkerClusterer({
    map: googleMapRef.current,
    markers: allMarkers,
    algorithm: new SuperClusterAlgorithm({
      radius: 100,
      maxZoom: 16
    })
  });
};
```

### Lazy Loading
```typescript
const loadMarkersInViewport = () => {
  const bounds = googleMapRef.current.getBounds();
  const visibleAssets = assets.filter(asset => 
    bounds?.contains(new google.maps.LatLng(asset.latitude, asset.longitude))
  );
  
  // Only render markers in viewport
  renderMarkers(visibleAssets);
};
```

## 🧪 Testing

### Unit Tests
```typescript
// Test marker creation
describe('Asset Markers', () => {
  it('should create marker with correct properties', () => {
    const asset = mockAsset;
    const marker = createAssetMarker(asset);
    
    expect(marker.getPosition()?.lat()).toBe(asset.latitude);
    expect(marker.getPosition()?.lng()).toBe(asset.longitude);
    expect(marker.getTitle()).toBe(asset.name);
  });
});
```

### Integration Tests
```typescript
// Test map initialization
describe('Map Integration', () => {
  it('should initialize map with correct center', async () => {
    await initializeMap();
    const center = googleMapRef.current.getCenter();
    
    expect(center.lat()).toBeCloseTo(18.5204, 4);
    expect(center.lng()).toBeCloseTo(73.8567, 4);
  });
});
```

## 🚀 Deployment

### Environment Configuration
```bash
# Production environment variables
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_api_key
REACT_APP_MAP_CENTER_LAT=18.5204
REACT_APP_MAP_CENTER_LNG=73.8567
REACT_APP_DEFAULT_ZOOM=16
```

### Build Optimization
```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### CDN Configuration
```html
<!-- Preload Google Maps API -->
<link rel="preload" href="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY" as="script">
```

## 📈 Analytics & Monitoring

### Usage Tracking
```typescript
const trackMapInteraction = (action: string, details: any) => {
  // Google Analytics 4
  gtag('event', action, {
    event_category: 'map_interaction',
    event_label: details.type,
    value: details.count
  });
};

// Track marker clicks
marker.addListener('click', () => {
  trackMapInteraction('marker_click', { type: asset.type });
});
```

### Performance Monitoring
```typescript
const measureMapLoadTime = () => {
  const startTime = performance.now();
  
  googleMapRef.current.addListener('idle', () => {
    const loadTime = performance.now() - startTime;
    console.log(`Map loaded in ${loadTime}ms`);
    
    // Send to analytics
    gtag('event', 'timing_complete', {
      name: 'map_load_time',
      value: Math.round(loadTime)
    });
  });
};
```

## 🔧 Troubleshooting

### Common Issues

#### 1. API Key Errors
```typescript
// Check API key validity
const validateApiKey = async () => {
  try {
    await loader.load();
    console.log('API key is valid');
  } catch (error) {
    console.error('API key error:', error);
    // Show user-friendly error message
  }
};
```

#### 2. Marker Not Showing
```typescript
// Debug marker creation
const debugMarker = (asset: MapAsset) => {
  console.log('Creating marker for:', asset.name);
  console.log('Position:', asset.latitude, asset.longitude);
  console.log('Map instance:', googleMapRef.current);
  
  // Ensure coordinates are valid
  if (!validateCoordinates(asset.latitude, asset.longitude)) {
    console.error('Invalid coordinates for asset:', asset.id);
  }
};
```

#### 3. Performance Issues
```typescript
// Monitor performance
const monitorPerformance = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('maps')) {
        console.log('Maps performance:', entry);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
};
```

## 📚 Additional Resources

### Documentation Links
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps Integration](https://developers.google.com/maps/documentation/javascript/react-map)
- [Maps API Best Practices](https://developers.google.com/maps/documentation/javascript/best-practices)

### Community Resources
- [Stack Overflow - Google Maps](https://stackoverflow.com/questions/tagged/google-maps)
- [Google Maps Platform Community](https://developers.google.com/maps/community)
- [GitHub Examples](https://github.com/googlemaps/js-samples)

---

*This implementation guide provides a comprehensive foundation for integrating Google Maps into your village infrastructure management system. Follow the steps sequentially and customize based on your specific requirements.*
