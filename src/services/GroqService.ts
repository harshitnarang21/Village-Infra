// Groq AI Service for enhanced chatbot interface
export interface GroqResponse {
  response: string;
  action?: string;
  confidence: number;
  language: string;
}

export interface VoiceCommand {
  text: string;
  language: string;
  context?: string;
}

class GroqService {
  private static instance: GroqService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  private constructor() {
    // Try to get API key from environment or localStorage
    this.apiKey = process.env.REACT_APP_GROQ_API_KEY || 
                  localStorage.getItem('groq_api_key') || 
                  null;
  }

  public static getInstance(): GroqService {
    if (!GroqService.instance) {
      GroqService.instance = new GroqService();
    }
    return GroqService.instance;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('groq_api_key', apiKey);
  }

  public hasApiKey(): boolean {
    return !!this.apiKey;
  }

  public async processVoiceCommand(command: VoiceCommand): Promise<GroqResponse> {
    if (!this.apiKey) {
      return this.getFallbackResponse(command);
    }

    try {
      const requestBody = {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are Sahayak, an AI assistant for a Smart Village Digital Twin system helping with rural infrastructure management. Your name means "helper" in Hindi. Provide helpful, concise responses about water quality, energy status, agriculture, emergency services, and village infrastructure.'
          },
          {
            role: 'user',
            content: command.text
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
        top_p: 0.95
      };
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I could not process your request.';

      return this.parseGroqResponse(aiResponse, command.language);
    } catch (error) {
      console.error('Groq API error:', error);
      return this.getFallbackResponse(command);
    }
  }

  private buildPrompt(command: VoiceCommand): string {
    const languageInstruction = command.language === 'hi' ? 'Respond in Hindi (हिंदी)' : 
                               command.language === 'mr' ? 'Respond in Marathi (मराठी)' : 
                               'Respond in English';
    
    return `You are an AI assistant for a Smart Village Digital Twin system helping with rural infrastructure management.

${languageInstruction}. Keep your response concise, helpful, and practical.

User question: ${command.text}

Provide a direct, helpful response about village infrastructure, water quality, energy management, agriculture, or emergency services.`;
  }

  private parseGroqResponse(aiResponse: string, language: string): GroqResponse {
    // Clean up the response - remove any extra formatting, JSON artifacts, or system text
    let cleanResponse = aiResponse.trim();
    
    // Remove any JSON formatting if present
    const jsonMatch = cleanResponse.match(/\{[\s\S]*"response"\s*:\s*"([^"]+)"[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[1];
    }
    
    // Remove any markdown formatting
    cleanResponse = cleanResponse.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
    cleanResponse = cleanResponse.replace(/\*(.*?)\*/g, '$1'); // Remove italic
    cleanResponse = cleanResponse.replace(/`(.*?)`/g, '$1'); // Remove code blocks
    
    // Remove any system prefixes or suffixes
    cleanResponse = cleanResponse.replace(/^(AI Response:|Response:|Answer:)\s*/i, '');
    cleanResponse = cleanResponse.replace(/\s*(End of response|That's all|Hope this helps)\.?\s*$/i, '');
    
    // Ensure it's not empty
    if (!cleanResponse || cleanResponse.length < 3) {
      cleanResponse = "I'm here to help with village infrastructure management. Please ask me about water quality, energy systems, agriculture, or emergency services.";
    }
    
    return {
      response: cleanResponse,
      confidence: 0.8,
      language: language
    };
  }

  private getFallbackResponse(command: VoiceCommand): GroqResponse {
    const fallbackResponses = {
      'en': {
        'water': 'Water quality is good. pH: 7.2, TDS: 320 ppm, Chlorine: 0.5 ppm. All 4 water sources are active. Main tank: 84% full.',
        'energy': 'Energy status: Solar generating 503 kW, Grid import 150 kW, Battery 75% charged. System efficiency: 96%. Daily savings: ₹2,400.',
        'crop': 'Crop health: Rice 87% healthy (25 acres), Wheat 92% healthy (18 acres). Weather favorable for next 3 days. Market prices stable.',
        'emergency': 'Emergency status: 2 active alerts, 3 resources available. Emergency contacts: Medical-108, Fire-101, Police-100.',
        'weather': 'Weather: 28°C, 72% humidity, 5mm rain expected. Good conditions for farming. UV index: 7 (high).',
        'electricity': 'Power grid stable. Solar panels generating efficiently. No outages reported. Battery backup available.',
        'maintenance': 'Maintenance schedule: Water pump service due in 5 days. Solar panel cleaning recommended. All systems operational.',
        'issue': 'Report issues via Citizen Portal. Current issues: 2 water leaks reported, 1 street light repair pending.',
        'proposal': 'Community proposals: 3 active proposals for voting. New playground project approved. Budget allocation in progress.',
        'map': 'Village infrastructure: 45 water points, 120 solar panels, 85 street lights, 12 community buildings all mapped and monitored.',
        'default': 'I\'m Sahayak, your village assistant. I can help with water quality, energy status, crop monitoring, emergency services, weather updates, and infrastructure management. What would you like to know?'
      },
      'hi': {
        'water': 'पानी की गुणवत्ता अच्छी है। pH: 7.2, TDS: 320 ppm, क्लोरीन: 0.5 ppm। सभी 4 जल स्रोत सक्रिय हैं। मुख्य टैंक 84% भरा है।',
        'energy': 'ऊर्जा स्थिति: सोलर 503 kW उत्पादन, ग्रिड 150 kW, बैटरी 75% चार्ज। सिस्टम दक्षता: 96%। दैनिक बचत: ₹2,400।',
        'crop': 'फसल स्वास्थ्य: धान 87% स्वस्थ (25 एकड़), गेहूं 92% स्वस्थ (18 एकड़)। अगले 3 दिन मौसम अनुकूल। बाजार भाव स्थिर।',
        'emergency': 'आपातकाल स्थिति: 2 सक्रिय अलर्ट, 3 संसाधन उपलब्ध। आपातकालीन संपर्क: चिकित्सा-108, अग्निशमन-101, पुलिस-100।',
        'weather': 'मौसम: 28°C, 72% आर्द्रता, 5mm बारिश संभावित। खेती के लिए अच्छी स्थिति। UV सूचकांक: 7 (उच्च)।',
        'electricity': 'विद्युत ग्रिड स्थिर। सोलर पैनल कुशलता से काम कर रहे हैं। कोई आउटेज नहीं। बैटरी बैकअप उपलब्ध।',
        'maintenance': 'रखरखाव कार्यक्रम: 5 दिन में पानी पंप सर्विस। सोलर पैनल सफाई की सिफारिश। सभी सिस्टम चालू।',
        'issue': 'नागरिक पोर्टल के माध्यम से समस्या रिपोर्ट करें। वर्तमान समस्याएं: 2 पानी रिसाव, 1 स्ट्रीट लाइट मरम्मत लंबित।',
        'proposal': 'सामुदायिक प्रस्ताव: 3 सक्रिय प्रस्ताव मतदान के लिए। नया खेल का मैदान प्रोजेक्ट स्वीकृत। बजट आवंटन प्रगति में।',
        'map': 'गांव का बुनियादी ढांचा: 45 पानी बिंदु, 120 सोलर पैनल, 85 स्ट्रीट लाइट, 12 सामुदायिक भवन सभी मैप और निगरानी में।',
        'default': 'मैं सहायक हूं, आपका गाँव का असिस्टेंट। मैं पानी की गुणवत्ता, ऊर्जा स्थिति, फसल निगरानी, आपातकालीन सेवाओं और बुनियादी ढांचे प्रबंधन में मदद कर सकता हूं। आप क्या जानना चाहते हैं?'
      },
      'mr': {
        'water': 'पाण्याची गुणवत्ता चांगली आहे. pH: 7.2, TDS: 320 ppm, क्लोरीन: 0.5 ppm. सर्व 4 पाणी स्रोत सक्रिय आहेत. मुख्य टाकी 84% भरली आहे.',
        'energy': 'ऊर्जा स्थिती: सोलर 503 kW उत्पादन, ग्रिड 150 kW, बॅटरी 75% चार्ज. सिस्टम कार्यक्षमता: 96%. दैनिक बचत: ₹2,400.',
        'crop': 'पिकाचे आरोग्य: तांदूळ 87% निरोगी (25 एकर), गहू 92% निरोगी (18 एकर). पुढील 3 दिवस हवामान अनुकूल. बाजार भाव स्थिर.',
        'emergency': 'आपत्कालीन स्थिती: 2 सक्रिय अलर्ट, 3 संसाधने उपलब्ध. आपत्कालीन संपर्क: वैद्यकीय-108, अग्निशमन-101, पोलीस-100.',
        'weather': 'हवामान: 28°C, 72% आर्द्रता, 5mm पाऊस अपेक्षित. शेतीसाठी चांगली परिस्थिती. UV निर्देशांक: 7 (उच्च).',
        'electricity': 'विद्युत ग्रिड स्थिर. सोलर पॅनेल कार्यक्षमतेने काम करत आहेत. कोणतेही आउटेज नाही. बॅटरी बॅकअप उपलब्ध.',
        'maintenance': 'देखभाल वेळापत्रक: 5 दिवसांत पाणी पंप सेवा. सोलर पॅनेल साफसफाईची शिफारस. सर्व सिस्टम चालू.',
        'issue': 'नागरिक पोर्टलद्वारे समस्यांची तक्रार करा. सध्याच्या समस्या: 2 पाणी गळती, 1 स्ट्रीट लाइट दुरुस्ती प्रलंबित.',
        'proposal': 'सामुदायिक प्रस्ताव: 3 सक्रिय प्रस्ताव मतदानासाठी. नवीन खेळाचे मैदान प्रकल्प मंजूर. बजेट वाटप प्रगतीत.',
        'map': 'गावाची पायाभूत सुविधा: 45 पाणी बिंदू, 120 सोलर पॅनेल, 85 स्ट्रीट लाइट, 12 सामुदायिक इमारती सर्व मॅप आणि निरीक्षणात.',
        'default': 'मी सहायक आहे, तुमचा गावचा असिस्टंट. मी पाण्याची गुणवत्ता, ऊर्जा स्थिती, पीक निरीक्षण, आपत्कालीन सेवा आणि पायाभूत सुविधा व्यवस्थापनात मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?'
      }
    };

    const langResponses = fallbackResponses[command.language as keyof typeof fallbackResponses] || fallbackResponses['en'];
    const text = command.text.toLowerCase();
    
    let response = langResponses.default;
    let action = undefined;

    if (text.includes('water') || text.includes('पानी') || text.includes('पाणी') || text.includes('quality') || text.includes('गुणवत्ता')) {
      response = langResponses.water;
      action = 'navigate_to_water';
    } else if (text.includes('energy') || text.includes('electricity') || text.includes('solar') || text.includes('power') || text.includes('ऊर्जा') || text.includes('विद्युत') || text.includes('बिजली') || text.includes('सोलर')) {
      response = langResponses.energy;
      action = 'navigate_to_energy';
    } else if (text.includes('crop') || text.includes('farm') || text.includes('agriculture') || text.includes('फसल') || text.includes('खेती') || text.includes('पीक') || text.includes('शेती')) {
      response = langResponses.crop;
      action = 'navigate_to_agriculture';
    } else if (text.includes('emergency') || text.includes('alert') || text.includes('आपातकाल') || text.includes('आपत्कालीन') || text.includes('अलर्ट')) {
      response = langResponses.emergency;
      action = 'navigate_to_emergency';
    } else if (text.includes('weather') || text.includes('मौसम') || text.includes('हवामान') || text.includes('rain') || text.includes('बारिश') || text.includes('पाऊस')) {
      response = langResponses.weather;
      action = 'show_weather';
    } else if (text.includes('maintenance') || text.includes('रखरखाव') || text.includes('देखभाल')) {
      response = langResponses.maintenance;
      action = 'navigate_to_maintenance';
    } else if (text.includes('issue') || text.includes('problem') || text.includes('समस्या') || text.includes('तक्रार')) {
      response = langResponses.issue;
      action = 'navigate_to_citizen';
    } else if (text.includes('proposal') || text.includes('vote') || text.includes('प्रस्ताव') || text.includes('मतदान')) {
      response = langResponses.proposal;
      action = 'navigate_to_citizen';
    } else if (text.includes('map') || text.includes('infrastructure') || text.includes('मैप') || text.includes('नक्शा') || text.includes('बुनियादी')) {
      response = langResponses.map;
      action = 'navigate_to_map';
    }

    return {
      response,
      action,
      confidence: 0.5,
      language: command.language
    };
  }

  // Language detection helper
  public detectLanguage(text: string): string {
    // Simple language detection based on character sets
    const hindiPattern = /[\u0900-\u097F]/;
    const marathiPattern = /[\u0900-\u097F]/; // Marathi uses Devanagari script too
    
    if (hindiPattern.test(text)) {
      // More sophisticated detection could be added here
      if (text.includes('आहे') || text.includes('पाणी') || text.includes('गाव')) {
        return 'mr'; // Marathi
      }
      return 'hi'; // Hindi
    }
    
    return 'en'; // Default to English
  }

  // Get supported languages
  public getSupportedLanguages(): Array<{code: string, name: string, nativeName: string}> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
    ];
  }

  // Test API key
  public async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test.'
            }
          ],
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default GroqService;
