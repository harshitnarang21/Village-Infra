import React, { useState, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MicrophoneIcon,
  LanguageIcon,
  SparklesIcon,
  MapPinIcon,
  BoltIcon,
  BeakerIcon,
  ExclamationCircleIcon,
  CogIcon,
  CloudIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import GroqService from '../services/GroqService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'system';
  suggestions?: string[];
}

interface QuickReply {
  id: string;
  text: string;
  category: string;
  icon: React.ReactNode;
}

const SmartChatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const groqService = GroqService.getInstance();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Check water quality', category: 'water', icon: <BeakerIcon className="h-4 w-4" /> },
    { id: '2', text: 'Energy consumption today', category: 'energy', icon: <BoltIcon className="h-4 w-4" /> },
    { id: '3', text: 'Crop health status', category: 'agriculture', icon: <SparklesIcon className="h-4 w-4" /> },
    { id: '4', text: 'Emergency contacts', category: 'emergency', icon: <ExclamationCircleIcon className="h-4 w-4" /> },
    { id: '5', text: 'Village map overview', category: 'map', icon: <MapPinIcon className="h-4 w-4" /> },
    { id: '6', text: 'Weather forecast', category: 'weather', icon: <ClockIcon className="h-4 w-4" /> }
  ];

  // Initialize chatbot
  useEffect(() => {
    const initializeChatbot = async () => {
      try {
        const hasKey = groqService.hasApiKey();
        setIsConnected(hasKey);
        
        if (hasKey) {
          // Welcome message
          const welcomeMessage: ChatMessage = {
            id: Date.now().toString(),
            text: getWelcomeMessage(),
            sender: 'bot',
            timestamp: new Date(),
            type: 'text',
            suggestions: ['What can you help me with?', 'Show village status', 'Emergency information']
          };
          setMessages([welcomeMessage]);
        } else {
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            text: 'Sorry, I need an API key to function properly. Please configure the Gemini API key.',
            sender: 'bot',
            timestamp: new Date(),
            type: 'system'
          };
          setMessages([errorMessage]);
        }
      } catch (error) {
        console.error('Failed to initialize chatbot:', error);
      }
    };

    initializeChatbot();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = () => {
    const currentLang = languages.find(lang => lang.code === selectedLanguage);
    
    switch (selectedLanguage) {
      case 'hi':
        return `नमस्ते ${user?.name || 'मित्र'}! मैं सहायक हूँ, आपका स्मार्ट विलेज AI असिस्टेंट। मैं आपको गाँव के बुनियादी ढांचे, पानी की गुणवत्ता, ऊर्जा प्रबंधन, कृषि और आपातकालीन सेवाओं के बारे में जानकारी दे सकता हूँ। आप मुझसे क्या जानना चाहते हैं?`;
      case 'mr':
        return `नमस्कार ${user?.name || 'मित्रा'}! मी सहायक आहे, तुमचा स्मार्ट व्हिलेज AI असिस्टंट। मी तुम्हाला गावातील पायाभूत सुविधा, पाण्याची गुणवत्ता, ऊर्जा व्यवस्थापन, शेती आणि आपत्कालीन सेवांबद्दल माहिती देऊ शकतो। तुम्हाला काय जाणून घ्यायचे आहे?`;
      default:
        return `Hello ${user?.name || 'there'}! I'm Sahayak, your Smart Village AI Assistant. I can help you with village infrastructure, water quality, energy management, agriculture, and emergency services. What would you like to know?`;
    }
  };

  const processUserMessage = async (message: string) => {
    setIsTyping(true);
    
    try {
      // Create context for the AI based on village management
      const context = `You are a Smart Village AI Assistant helping with rural infrastructure management. 
      Current user language: ${selectedLanguage}
      User message: "${message}"
      
      You can help with:
      - Water quality monitoring (pH: 7.2, TDS: 320 ppm, Chlorine: 0.5 ppm)
      - Energy management (Solar: 503 kW, Grid: 150 kW, Battery: 75%)
      - Agriculture (Rice: 87% health, Wheat: 92% health, 25 acres total)
      - Emergency services (2 active alerts, 3 available resources)
      - Village map and infrastructure status
      - Weather forecast and planning
      
      Provide helpful, accurate information in ${selectedLanguage === 'hi' ? 'Hindi' : selectedLanguage === 'mr' ? 'Marathi' : 'English'}.
      Keep responses concise but informative.`;

      const response = await groqService.processVoiceCommand({
        text: context,
        language: selectedLanguage,
        context: 'village_management'
      });

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response.response || generateFallbackResponse(message),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        suggestions: generateSuggestions(message)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: generateFallbackResponse(message),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Water-related queries
    if (lowerMessage.includes('water') || lowerMessage.includes('पानी') || lowerMessage.includes('पाणी')) {
      return selectedLanguage === 'hi' 
        ? 'पानी की गुणवत्ता अच्छी है। pH: 7.2, TDS: 320 ppm, क्लोरीन: 0.5 ppm। सभी स्रोत सक्रिय हैं।'
        : selectedLanguage === 'mr'
        ? 'पाण्याची गुणवत्ता चांगली आहे। pH: 7.2, TDS: 320 ppm, क्लोरीन: 0.5 ppm। सर्व स्रोत सक्रिय आहेत।'
        : 'Water quality is good. pH: 7.2, TDS: 320 ppm, Chlorine: 0.5 ppm. All sources are active.';
    }
    
    // Energy-related queries
    if (lowerMessage.includes('energy') || lowerMessage.includes('power') || lowerMessage.includes('ऊर्जा') || lowerMessage.includes('बिजली')) {
      return selectedLanguage === 'hi'
        ? 'ऊर्जा स्थिति: सोलर 503 kW, ग्रिड 150 kW, बैटरी 75% चार्ज। सिस्टम दक्षता 96%।'
        : selectedLanguage === 'mr'
        ? 'ऊर्जा स्थिती: सोलर 503 kW, ग्रिड 150 kW, बॅटरी 75% चार्ज। सिस्टम कार्यक्षमता 96%।'
        : 'Energy status: Solar 503 kW, Grid 150 kW, Battery 75% charged. System efficiency 96%.';
    }
    
    // Agriculture-related queries
    if (lowerMessage.includes('crop') || lowerMessage.includes('farm') || lowerMessage.includes('फसल') || lowerMessage.includes('खेती')) {
      return selectedLanguage === 'hi'
        ? 'फसल की स्थिति: धान 87% स्वस्थ, गेहूं 92% स्वस्थ। कुल 25 एकड़ में खेती। मौसम अनुकूल है।'
        : selectedLanguage === 'mr'
        ? 'पिकाची स्थिती: तांदूळ 87% निरोगी, गहू 92% निरोगी। एकूण 25 एकर शेती. हवामान अनुकूल आहे.'
        : 'Crop status: Rice 87% healthy, Wheat 92% healthy. Total 25 acres under cultivation. Weather is favorable.';
    }
    
    // Emergency-related queries
    if (lowerMessage.includes('emergency') || lowerMessage.includes('alert') || lowerMessage.includes('आपातकाल') || lowerMessage.includes('आपत्कालीन')) {
      return selectedLanguage === 'hi'
        ? 'आपातकालीन स्थिति: 2 सक्रिय अलर्ट, 3 संसाधन उपलब्ध। आपातकालीन नंबर: 108, 102, 101।'
        : selectedLanguage === 'mr'
        ? 'आपत्कालीन स्थिती: 2 सक्रिय अलर्ट, 3 संसाधने उपलब्ध. आपत्कालीन नंबर: 108, 102, 101.'
        : 'Emergency status: 2 active alerts, 3 resources available. Emergency numbers: 108, 102, 101.';
    }
    
    // Default response
    return selectedLanguage === 'hi'
      ? 'मैं आपकी मदद करने के लिए यहाँ हूँ। आप मुझसे गाँव के बुनियादी ढांचे, पानी, ऊर्जा, कृषि या आपातकालीन सेवाओं के बारे में पूछ सकते हैं।'
      : selectedLanguage === 'mr'
      ? 'मी तुमची मदत करण्यासाठी येथे आहे. तुम्ही मला गावातील पायाभूत सुविधा, पाणी, ऊर्जा, शेती किंवा आपत्कालीन सेवांबद्दल विचारू शकता.'
      : 'I\'m here to help you! You can ask me about village infrastructure, water, energy, agriculture, or emergency services.';
  };

  const generateSuggestions = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('water') || lowerMessage.includes('पानी')) {
      return ['Show water sources', 'Check quality alerts', 'Schedule maintenance'];
    }
    if (lowerMessage.includes('energy') || lowerMessage.includes('ऊर्जा')) {
      return ['Solar performance', 'Battery status', 'Cost savings'];
    }
    if (lowerMessage.includes('crop') || lowerMessage.includes('फसल')) {
      return ['Weather forecast', 'Market prices', 'Irrigation schedule'];
    }
    
    return ['Village overview', 'System status', 'Emergency info'];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickReplies(false);

    await processUserMessage(inputText);
  };

  const handleQuickReply = async (reply: QuickReply) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: reply.text,
      sender: 'user',
      timestamp: new Date(),
      type: 'quick_reply'
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuickReplies(false);

    await processUserMessage(reply.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sahayak - Smart Village AI Assistant</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-gray-600">
                  {isConnected ? 'Sahayak is Online' : 'Sahayak is Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
              <CpuChipIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Groq AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <CpuChipIcon className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                
                <div className={`p-3 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.type === 'system'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-white text-gray-900 shadow-md border border-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(suggestion);
                        handleSendMessage();
                      }}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <CpuChipIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="p-3 rounded-2xl bg-white shadow-md border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleQuickReply(reply)}
                className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                {reply.icon}
                <span className="text-sm text-gray-700">{reply.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedLanguage === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 
                         selectedLanguage === 'mr' ? 'तुमचा प्रश्न येथे लिहा...' : 
                         'Type your question here...'}
              className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by Groq AI</span>
        </div>
      </div>
    </div>
  );
};

export default SmartChatbot;
