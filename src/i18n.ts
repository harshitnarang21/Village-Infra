import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { "speak": "Speak", "stop": "Stop", "choose_language": "Choose Language" } },
    hi: { translation: { "speak": "बोलें", "stop": "रोकें", "choose_language": "भाषा चुनें" } },
    ta: { translation: { "speak": "பேசவும்", "stop": "நிறுத்தவும்", "choose_language": "மொழியை தேர்ந்தெடுக்கவும்" } }
    // Add more languages here as needed
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});
export default i18n;
