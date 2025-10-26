// Test utility to verify Groq AI integration
import GroqService from '../services/GroqService';

export const testGroqAPI = async () => {
  const groqService = GroqService.getInstance();
  
  console.log('🧪 Testing Groq AI integration...');
  
  try {
    // Test with a simple command
    const result = await groqService.processVoiceCommand({
      text: 'Hello, can you help me with village infrastructure?',
      language: 'en',
      context: 'village_management'
    });
    
    console.log('✅ Groq AI Test Successful!');
    console.log('📝 Response:', result.response);
    console.log('🎯 Confidence:', result.confidence);
    console.log('🔧 Action:', result.action || 'None');
    
    return result;
  } catch (error) {
    console.error('❌ Groq AI Test Failed:', error);
    throw error;
  }
};

export const testMultiLanguage = async (): Promise<void> => {
  const groqService = GroqService.getInstance();
  
  console.log('🌍 Testing Multi-language Support...');
  
  const testCases = [
    { text: 'Show water pump status', language: 'en' },
    { text: 'पानी पंप की स्थिति दिखाएं', language: 'hi' },
    { text: 'पाण्याच्या पंपची स्थिती दाखवा', language: 'mr' }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n🔤 Testing ${testCase.language.toUpperCase()}: "${testCase.text}"`);
      
      const result = await groqService.processVoiceCommand({
        text: testCase.text,
        language: testCase.language,
        context: 'village_management'
      });
      
      console.log(`✅ ${testCase.language.toUpperCase()} Response:`, result.response);
      console.log(`🎯 Confidence:`, result.confidence);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ ${testCase.language.toUpperCase()} Test Failed:`, error);
    }
  }
};

// Auto-run test when imported (for development)
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Groq AI Test Utility Loaded');
  console.log('💡 Run testGroqAPI() or testMultiLanguage() in console to test');
}

export default { testGroqAPI, testMultiLanguage };
