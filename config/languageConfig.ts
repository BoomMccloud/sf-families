// config/languageConfig.ts

export interface LanguageDetail {
  appCode: string;       // Code used by i18n and internal app logic (e.g., 'en', 'es')
  displayName: string;   // Name shown in UI (e.g., 'English', 'Español')
  apiCode: string;       // BCP-47 code for the Live API (e.g., 'en-US', 'es-US')
  promptName: string;    // Name used for interpolating the system prompt (e.g., 'English', 'Spanish')
}

export const supportedLanguagesConfig: LanguageDetail[] = [
  { appCode: 'en', displayName: 'English', apiCode: 'en-US', promptName: 'English' },
  { appCode: 'es', displayName: 'Español', apiCode: 'es-US', promptName: 'Spanish' },
  { appCode: 'zh-CN', displayName: '中文 (简体)', apiCode: 'cmn-CN', promptName: '中文' },
  { appCode: 'zh-TW', displayName: '中文 (繁體)', apiCode: 'cmn-CN', promptName: '中文' }, // API maps to cmn-CN
  { appCode: 'fil', displayName: 'Filipino', apiCode: 'en-US', promptName: 'English' }, // API maps to en-US
  { appCode: 'vi', displayName: 'Tiếng Việt', apiCode: 'vi-VN', promptName: 'Tiếng Việt' },
  { appCode: 'ru', displayName: 'Русский', apiCode: 'ru-RU', promptName: 'Русский' },
  // Add new languages here by adding a new object to this array
];

// Helper function to get API code from App code
export const getApiCodeByAppCode = (appCode: string): string | undefined => {
  const config = supportedLanguagesConfig.find(lang => lang.appCode === appCode);
  return config?.apiCode;
};

// Helper function to get Prompt Name from API code
export const getPromptNameByApiCode = (apiCode: string): string | undefined => {
  // Find the first language detail that matches the API code.
  // This handles cases where multiple app codes might map to the same API code (e.g., zh-CN/zh-TW -> cmn-CN)
  const config = supportedLanguagesConfig.find(lang => lang.apiCode === apiCode);
  return config?.promptName;
};

// Helper function to get the full config object by App code
export const getLanguageConfigByAppCode = (appCode: string): LanguageDetail | undefined => {
    return supportedLanguagesConfig.find(lang => lang.appCode === appCode);
}

// Add other helpers if needed, e.g., getting display name by app code
export const getDisplayNameByAppCode = (appCode: string): string | undefined => {
    return supportedLanguagesConfig.find(lang => lang.appCode === appCode)?.displayName;
}; 