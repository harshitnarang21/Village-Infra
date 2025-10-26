import React, { useState, useEffect, useRef } from 'react';
import {
  MicrophoneIcon,
  SpeakerWaveIcon,
  StopIcon,
  Cog6ToothIcon,
  LanguageIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  KeyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import GroqService from '../services/GroqService';
import { useAuth } from '../contexts/AuthContext';
import BrowserDatabase from '../database/BrowserDatabase';

interface VoiceCommand {
  id: string;
  command: string;
  language: string;
  response: string;
  timestamp: string;
  confidence: number;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  supported: boolean;
}

const EnhancedVoiceInterface: React.FC = () => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [groqApiKey, setGroqApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const groqService = GroqService.getInstance();
  const database = BrowserDatabase.getInstance();
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const [languages] = useState<Language[]>([
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', supported: true },
    { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸', supported: true },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', supported: true },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', supported: true },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', supported: true },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', supported: true },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', supported: true },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', supported: true },
  ]);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    setIsSupported(!!(SpeechRecognition && speechSynthesis));
    synthesisRef.current = speechSynthesis;

    // Load available voices
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice based on selected language
      if (voices.length > 0 && !selectedVoice) {
        const languageCode = selectedLanguage.split('-')[0];
        const defaultVoice = voices.find(voice => 
          voice.lang.startsWith(languageCode) || voice.lang.startsWith(selectedLanguage)
        ) || voices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    // Load voices immediately and also when they change
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    // Check if API key exists and validate
    const hasKey = groqService.hasApiKey();
    setApiKeyValid(hasKey);
    if (hasKey) {
      const storedKey = localStorage.getItem('groq_api_key') || process.env.REACT_APP_GROQ_API_KEY || '';
      setGroqApiKey(storedKey);
      // Auto-test the API key
      if (storedKey) {
        testApiKeyAutomatically(storedKey);
      }
    }

    // Load previous commands
    loadVoiceCommands();
  }, []);

  const loadVoiceCommands = async () => {
    if (user) {
      try {
        const userCommands = await database.getVoiceCommands(user.id, 10);
        setCommands(userCommands.map(cmd => ({
          id: cmd.id,
          command: cmd.command,
          language: cmd.language,
          response: cmd.response,
          timestamp: cmd.created_at,
          confidence: cmd.confidence_score
        })));
      } catch (error) {
        console.error('Failed to load voice commands:', error);
      }
    }
  };

  const initializeRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        processVoiceCommand(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  const processVoiceCommand = async (commandText: string) => {
    setIsProcessing(true);
    try {
      const languageCode = selectedLanguage.split('-')[0]; // Convert 'hi-IN' to 'hi'
      
      const result = await groqService.processVoiceCommand({
        text: commandText,
        language: languageCode,
        context: 'village_management'
      });

      setResponse(result.response);
      
      // Save to database
      if (user) {
        await database.saveVoiceCommand(
          user.id,
          commandText,
          languageCode,
          result.response,
          result.confidence
        );
        await loadVoiceCommands();
      }

      // Handle actions
      if (result.action) {
        handleVoiceAction(result.action);
      }

      // Speak the response
      speakResponse(result.response, languageCode);

    } catch (error) {
      console.error('Error processing voice command:', error);
      setError('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceAction = (action: string) => {
    switch (action) {
      case 'navigate_to_maintenance':
        // This would trigger navigation in a real app
        console.log('Navigating to maintenance dashboard');
        break;
      case 'navigate_to_citizen':
        console.log('Navigating to citizen portal');
        break;
      case 'show_water_status':
        console.log('Showing water system status');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const speakResponse = (text: string, language: string) => {
    if (!synthesisRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Use the selected voice or find the best match
    let voice = null;
    if (selectedVoice) {
      voice = availableVoices.find(v => v.name === selectedVoice);
    }
    
    // Fallback to language-based selection
    if (!voice) {
      voice = availableVoices.find(v => v.lang.startsWith(language)) || 
             availableVoices.find(v => v.lang.startsWith(selectedLanguage)) ||
             availableVoices[0];
    }
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Speech synthesis error');
    };

    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = initializeRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const testApiKeyAutomatically = async (apiKey: string) => {
    try {
      const isValid = await groqService.testApiKey(apiKey);
      setApiKeyValid(isValid);
      if (isValid) {
        setError(null);
      }
    } catch (error) {
      console.log('API key test failed, will use fallback responses');
      setApiKeyValid(false);
    }
  };

  const testApiKey = async () => {
    if (!groqApiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    try {
      const isValid = await groqService.testApiKey(groqApiKey);
      if (isValid) {
        groqService.setApiKey(groqApiKey);
        setApiKeyValid(true);
        setShowApiKeyInput(false);
        setError(null);
      } else {
        setError('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setError('Failed to test API key');
    }
  };

  const clearCommands = () => {
    setCommands([]);
    setTranscript('');
    setResponse('');
  };

  if (!isSupported) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Browser Not Supported</h3>
              <p className="text-red-700">Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.</p>
            </div>
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
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl">
            <MicrophoneIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enhanced Voice Interface</h1>
            <p className="text-gray-600 mt-1">
              {apiKeyValid ? (
                <span className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-green-600" />
                  AI-powered with Gemini API
                </span>
              ) : (
                'Basic voice interface (Add Gemini API key for AI features)'
              )}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className={`p-3 rounded-xl transition-colors ${
              apiKeyValid 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            <KeyIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="p-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors"
          >
            <SpeakerWaveIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Groq AI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Groq API Key
              </label>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="Enter your Groq API key..."
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={testApiKey}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test & Save
                </button>
              </div>
            </div>
            <div className="text-sm text-blue-700">
              <p>Get your free Gemini API key from: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></p>
              <p className="mt-1">This enables AI-powered voice understanding in multiple languages.</p>
            </div>
          </div>
        </div>
      )}

      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">🎭 Voice & Accent Settings</h3>
          <div className="space-y-6">
            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-3">
                Choose Voice & Accent ({availableVoices.length} available)
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {availableVoices.map((voice, index) => {
                  const isSelected = selectedVoice === voice.name;
                  const flagEmoji = voice.lang.includes('en-US') ? '🇺🇸' :
                                   voice.lang.includes('en-GB') ? '🇬🇧' :
                                   voice.lang.includes('en-AU') ? '🇦🇺' :
                                   voice.lang.includes('en-CA') ? '🇨🇦' :
                                   voice.lang.includes('hi') ? '🇮🇳' :
                                   voice.lang.includes('mr') ? '🇮🇳' :
                                   voice.lang.includes('ta') ? '🇮🇳' :
                                   voice.lang.includes('te') ? '🇮🇳' :
                                   voice.lang.includes('bn') ? '🇧🇩' :
                                   voice.lang.includes('fr') ? '🇫🇷' :
                                   voice.lang.includes('es') ? '🇪🇸' :
                                   voice.lang.includes('de') ? '🇩🇪' :
                                   voice.lang.includes('it') ? '🇮🇹' :
                                   voice.lang.includes('pt') ? '🇵🇹' :
                                   voice.lang.includes('ru') ? '🇷🇺' :
                                   voice.lang.includes('ja') ? '🇯🇵' :
                                   voice.lang.includes('ko') ? '🇰🇷' :
                                   voice.lang.includes('zh') ? '🇨🇳' : '🌐';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedVoice(voice.name)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-100 text-purple-900' 
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{flagEmoji}</span>
                          <div>
                            <div className="font-medium text-sm">{voice.name}</div>
                            <div className="text-xs text-gray-500">
                              {voice.lang} • {voice.localService ? 'Local' : 'Network'}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice Test */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Test Selected Voice
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const testText = selectedLanguage.includes('hi') ? 'नमस्ते! मैं आपकी सहायता के लिए यहाँ हूँ।' :
                                    selectedLanguage.includes('mr') ? 'नमस्कार! मी तुमच्या मदतीसाठी येथे आहे।' :
                                    'Hello! I am here to help you with village infrastructure.';
                    speakResponse(testText, selectedLanguage.split('-')[0]);
                  }}
                  disabled={isSpeaking}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSpeaking ? 'Speaking...' : 'Test Voice'}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>

            {/* Voice Info */}
            {selectedVoice && (
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Current Voice Details:</h4>
                {(() => {
                  const voice = availableVoices.find(v => v.name === selectedVoice);
                  return voice ? (
                    <div className="text-sm text-gray-700 space-y-1">
                      <div><strong>Name:</strong> {voice.name}</div>
                      <div><strong>Language:</strong> {voice.lang}</div>
                      <div><strong>Type:</strong> {voice.localService ? 'Local/Offline' : 'Network/Online'}</div>
                      <div><strong>Default:</strong> {voice.default ? 'Yes' : 'No'}</div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {Math.round(rate * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-4">
            {!isListening ? (
              <button
                onClick={startListening}
                disabled={isProcessing}
                className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                <MicrophoneIcon className="h-8 w-8" />
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="p-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all animate-pulse"
              >
                <StopIcon className="h-8 w-8" />
              </button>
            )}
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all"
              >
                <SpeakerWaveIcon className="h-8 w-8" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {isListening && (
              <p className="text-purple-600 font-medium animate-pulse">
                🎤 Listening... Speak now
              </p>
            )}
            {isProcessing && (
              <p className="text-blue-600 font-medium">
                <SparklesIcon className="h-4 w-4 inline mr-2" />
                Processing with AI...
              </p>
            )}
            {isSpeaking && (
              <p className="text-green-600 font-medium">
                🔊 Speaking response...
              </p>
            )}
          </div>

          {/* Current Interaction */}
          {transcript && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-semibold text-purple-900 mb-2">You said:</h4>
              <p className="text-purple-800">{transcript}</p>
            </div>
          )}

          {response && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">AI Response:</h4>
              <p className="text-green-800">{response}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-red-900 mb-2">Error:</h4>
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Command History */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Voice Commands</h2>
          <button
            onClick={clearCommands}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear History
          </button>
        </div>

        <div className="space-y-4">
          {commands.length > 0 ? (
            commands.map((cmd) => (
              <div key={cmd.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(cmd.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {cmd.language.toUpperCase()}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {Math.round(cmd.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">"{cmd.command}"</p>
                    <p className="text-gray-600 text-sm">{cmd.response}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MicrophoneIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No voice commands yet. Start by clicking the microphone!</p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Voice Command Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">English Examples:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• "Show me water pump status"</li>
              <li>• "Check maintenance predictions"</li>
              <li>• "Report a street light issue"</li>
              <li>• "What's the village sustainability score?"</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">हिन्दी उदाहरण:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• "पानी पंप की स्थिति दिखाएं"</li>
              <li>• "रखरखाव की भविष्यवाणी जांचें"</li>
              <li>• "स्ट्रीट लाइट की समस्या रिपोर्ट करें"</li>
              <li>• "गांव का स्थिरता स्कोर क्या है?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVoiceInterface;
