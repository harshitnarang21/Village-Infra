// Voice accent demonstration utility
export const demoVoiceAccents = () => {
  const synthesis = window.speechSynthesis;
  const voices = synthesis.getVoices();
  
  console.log('🎭 Available Voice Accents:');
  console.log('=========================');
  
  // Group voices by language/accent
  const voiceGroups = {
    'English (US)': voices.filter(v => v.lang.includes('en-US')),
    'English (UK)': voices.filter(v => v.lang.includes('en-GB')),
    'English (AU)': voices.filter(v => v.lang.includes('en-AU')),
    'English (CA)': voices.filter(v => v.lang.includes('en-CA')),
    'Hindi (IN)': voices.filter(v => v.lang.includes('hi')),
    'Marathi (IN)': voices.filter(v => v.lang.includes('mr')),
    'Other Languages': voices.filter(v => 
      !v.lang.includes('en') && !v.lang.includes('hi') && !v.lang.includes('mr')
    )
  };
  
  Object.entries(voiceGroups).forEach(([group, groupVoices]) => {
    if (groupVoices.length > 0) {
      console.log(`\n${group}:`);
      groupVoices.forEach((voice, index) => {
        console.log(`  ${index + 1}. ${voice.name} (${voice.lang}) ${voice.localService ? '🏠' : '🌐'}`);
      });
    }
  });
  
  console.log('\n🎯 Voice Selection Tips:');
  console.log('• 🏠 = Local/Offline voice (faster, more reliable)');
  console.log('• 🌐 = Network voice (may require internet)');
  console.log('• Different accents provide unique pronunciation styles');
  console.log('• Local voices work better for real-time applications');
};

export const testVoiceAccent = (voiceName: string, text: string = 'Hello! I am here to help you with village infrastructure.') => {
  const synthesis = window.speechSynthesis;
  const voices = synthesis.getVoices();
  const voice = voices.find(v => v.name === voiceName);
  
  if (!voice) {
    console.error(`Voice "${voiceName}" not found`);
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  console.log(`🗣️ Testing voice: ${voice.name} (${voice.lang})`);
  synthesis.speak(utterance);
};

export const getRecommendedVoices = () => {
  const synthesis = window.speechSynthesis;
  const voices = synthesis.getVoices();
  
  const recommendations = {
    'English (US - Female)': voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('female')),
    'English (US - Male)': voices.find(v => v.lang.includes('en-US') && v.name.toLowerCase().includes('male')),
    'English (UK - Female)': voices.find(v => v.lang.includes('en-GB') && v.name.toLowerCase().includes('female')),
    'English (UK - Male)': voices.find(v => v.lang.includes('en-GB') && v.name.toLowerCase().includes('male')),
    'Hindi (India)': voices.find(v => v.lang.includes('hi')),
    'Best Local Voice': voices.find(v => v.localService && v.lang.includes('en')),
    'Default System Voice': voices.find(v => v.default)
  };
  
  console.log('🌟 Recommended Voices:');
  Object.entries(recommendations).forEach(([category, voice]) => {
    if (voice) {
      console.log(`${category}: ${voice.name} (${voice.lang})`);
    }
  });
  
  return recommendations;
};

// Auto-run demo when imported (for development)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  console.log('🎭 Voice Accent Demo Utility Loaded');
  console.log('💡 Available functions:');
  console.log('  - demoVoiceAccents() - Show all available voices');
  console.log('  - testVoiceAccent(voiceName, text) - Test a specific voice');
  console.log('  - getRecommendedVoices() - Get recommended voices');
}

export default { demoVoiceAccents, testVoiceAccent, getRecommendedVoices };
