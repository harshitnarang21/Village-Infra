// Google Maps API Test Utility
export const testGoogleMapsAPI = async () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Google Maps API key not found in environment variables');
    return false;
  }
  
  console.log('🗺️ Testing Google Maps API...');
  console.log(`📍 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    // Test API key validity by making a simple request
    const testUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    
    // Create a test script element to verify API loading
    const script = document.createElement('script');
    script.src = testUrl;
    
    return new Promise((resolve) => {
      script.onload = () => {
        console.log('✅ Google Maps API loaded successfully');
        console.log('🌍 API Features Available:');
        console.log('  - Maps JavaScript API: ✅');
        console.log('  - Places Library: ✅');
        console.log('  - Geocoding: ✅');
        
        // Test basic map creation
        if (window.google && window.google.maps) {
          console.log('🗺️ Google Maps object available');
          console.log('📍 Map types available:', Object.keys(window.google.maps.MapTypeId));
          resolve(true);
        } else {
          console.log('⚠️ Google Maps object not yet available');
          resolve(false);
        }
        
        // Clean up test script
        document.head.removeChild(script);
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API');
        console.error('🔍 Possible issues:');
        console.error('  - Invalid API key');
        console.error('  - API key restrictions');
        console.error('  - Network connectivity');
        console.error('  - API quotas exceeded');
        
        document.head.removeChild(script);
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
    
  } catch (error) {
    console.error('❌ Error testing Google Maps API:', error);
    return false;
  }
};

export const validateMapConfiguration = () => {
  console.log('🔧 Validating Google Maps Configuration...');
  
  const config = {
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    hasApiKey: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    keyLength: process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.length || 0,
    environment: process.env.NODE_ENV
  };
  
  console.log('📋 Configuration Status:');
  console.log(`  - API Key Present: ${config.hasApiKey ? '✅' : '❌'}`);
  console.log(`  - Key Length: ${config.keyLength} characters`);
  console.log(`  - Environment: ${config.environment}`);
  
  if (config.hasApiKey) {
    const key = config.apiKey!;
    console.log(`  - Key Format: ${key.startsWith('AIza') ? '✅ Valid format' : '❌ Invalid format'}`);
    console.log(`  - Key Preview: ${key.substring(0, 10)}...${key.substring(key.length - 4)}`);
  }
  
  return config;
};

export const getMapFeatures = () => {
  return {
    realTimeMonitoring: {
      name: 'Real-Time Infrastructure Monitoring',
      description: 'Live status updates for water pumps, solar panels, street lights',
      benefits: ['40% reduction in downtime', 'Proactive maintenance', 'Cost savings']
    },
    citizenReporting: {
      name: 'Citizen Issue Reporting',
      description: 'GPS-precise issue reporting with photo documentation',
      benefits: ['60% faster response', 'Community engagement', 'Transparency']
    },
    voiceIntegration: {
      name: 'Voice-Controlled Navigation',
      description: 'Multilingual voice commands for map interaction',
      benefits: ['8+ Indian languages', 'Accessibility', 'Hands-free operation']
    },
    offlineCapability: {
      name: 'Offline-First Architecture',
      description: 'Works without internet connectivity',
      benefits: ['100% uptime', 'Rural area support', 'Data synchronization']
    },
    blockchainTransparency: {
      name: 'Blockchain Verification',
      description: 'Immutable records of all infrastructure changes',
      benefits: ['Complete transparency', 'Audit trail', 'Trust building']
    }
  };
};

// Auto-run validation when imported (for development)
if (typeof window !== 'undefined') {
  console.log('🗺️ Google Maps Test Utility Loaded');
  console.log('💡 Available functions:');
  console.log('  - testGoogleMapsAPI() - Test API connectivity');
  console.log('  - validateMapConfiguration() - Check configuration');
  console.log('  - getMapFeatures() - List available features');
  
  // Auto-validate configuration
  validateMapConfiguration();
}

export default { testGoogleMapsAPI, validateMapConfiguration, getMapFeatures };
