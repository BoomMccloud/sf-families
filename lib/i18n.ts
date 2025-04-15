import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';

// Unused imports removed - translation files are loaded via require below

const LANGUAGES = {
    en: require('../locales/en.json'),
    es: require('../locales/es.json'),
    'zh-CN': require('../locales/zh-CN.json'),
    'zh-TW': require('../locales/zh-TW.json'),
    fil: require('../locales/fil.json'),
    vi: require('../locales/vi.json'),
    ru: require('../locales/ru.json'),
};

const SUPPORTED_LANG_CODES = Object.keys(LANGUAGES);
const SELECTED_LANGUAGE_KEY = '@selectedLanguage'; // Use the same key as in onboarding

const languageDetector = {
  type: 'languageDetector' as const, // Use 'as const' for proper type inference
  async: true, // Indicates detection is asynchronous
  detect: async (callback: (lang: string) => void) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
        console.log('i18n: Skipping language detection on server.');
        return callback('en');
    }

    try {
      // 1. Check AsyncStorage for saved language
      const savedLanguage = await AsyncStorage.getItem(SELECTED_LANGUAGE_KEY);
      if (savedLanguage && SUPPORTED_LANG_CODES.includes(savedLanguage)) {
        console.log('i18n: Found saved language:', savedLanguage);
        return callback(savedLanguage);
      }

      // 2. If no saved language, detect device locale
      const locales = Localization.getLocales();
      const deviceLocale = locales[0]; // Get the first locale object
      const deviceLanguage = deviceLocale?.languageCode; // e.g., 'en'
      const deviceRegion = deviceLocale?.regionCode; // e.g., 'US'
      // Safely access scriptCode, treat as null if missing
      const deviceScript = (deviceLocale as any)?.scriptCode ?? null; // e.g., 'Hans'

      console.log('i18n: Detected device locale:', deviceLocale);

      let foundLang = 'en'; // Default to English

      // Try to find the best match based on locale, similar logic to onboarding
      if (deviceLanguage === 'zh') {
         if (deviceScript === 'Hans' || deviceRegion === 'CN' || deviceRegion === 'SG') foundLang = 'zh-CN';
         else if (deviceScript === 'Hant' || deviceRegion === 'TW' || deviceRegion === 'HK' || deviceRegion === 'MO') {
             if (SUPPORTED_LANG_CODES.includes('zh-TW')) foundLang = 'zh-TW';
             else foundLang = 'zh-CN';
         }
         // Default 'zh' to 'zh-CN' if no specific region/script matches supported ones
         else foundLang = SUPPORTED_LANG_CODES.includes('zh-CN') ? 'zh-CN' : 'en';
      } else if (deviceLanguage && SUPPORTED_LANG_CODES.includes(deviceLanguage)) {
        foundLang = deviceLanguage;
      }

      console.log('i18n: Setting language based on detection:', foundLang);
      callback(foundLang);

    } catch (error) {
      console.error('i18n: Error detecting language (client-side):', error);
      callback('en'); // Fallback to English on error
    }
  },
  init: () => {}, // Required empty function
  cacheUserLanguage: (language: string) => {
    // Optionally, re-cache the language if it changes later, though we handle saving in onboarding
    // AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, language);
  },
};


i18n
  .use(languageDetector) // Use our custom detector
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: LANGUAGES,
    react: {
      useSuspense: false, // Set to false for React Native non-Suspense usage
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    fallbackLng: 'en', // Use English if detected language is not available
    // Language detection is handled by our custom detector
    // detection: { ... } // We don't need the standard detection options
  });

export default i18n;
