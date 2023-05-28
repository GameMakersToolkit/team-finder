export const allLanguages = [
  "en", // English
  "ko", // Korean
  "ja", // Japanese
  "pt-BR", // Brazilian Portuguese
  "es", // Spanish
  "zh-Hans", // Chinese (Simplified)
  "ru", // Russian
  "de", // German
  "fr", // French
  "es-419", // Spanish (Latin America)
  "it", // Italian
  "zh-CN", // Chinese (China)
  "pt", // Portuguese
  "zh-TW", // Chinese (Taiwan)
  "pl", // Polish
  "vi", // Vietnamese
  "ar", // Arabic
  "tr", // Turkish
  "id", // Indonesian
  "ot", // Other
] as const;

export type Language = typeof allLanguages[number];

export interface LanguageInfo {
  friendlyName: string;
}

export const isLanguage = (input: string): input is Language =>
  (allLanguages as readonly string[]).includes(input);

export const languageInfoMap: Record<Language, LanguageInfo> = {
  // English
  en: {
    friendlyName: "English"
  },
  // Korean
  ko: {
    friendlyName: "조선말"
  },
  // Japanese
  ja: {
    friendlyName: "日本語"
  },
  // Brazilian Portuguese
  "pt-BR": {
    friendlyName: "Português do Brasil"
  },
  // Spanish
  es: {
    friendlyName: "Español/Castellano"
  },
  // Chinese (Simplified)
  "zh-Hans": {
    friendlyName: "汉语"
  },
  // Russian
  ru: {
    friendlyName: "Русский"
  },
  // German
  de: {
    friendlyName: "Deutsch"
  },
  // French
  fr: {
    friendlyName: "Français"
  },
  // Spanish (Latin America)
  "es-419": {
    friendlyName: "Español latinoamericano"
  },
  // Italian
  it: {
    friendlyName: "Italiano"
  },
  // Chinese (China)
  "zh-CN": {
    friendlyName: "漢語"
  },
  // Portuguese
  pt: {
    friendlyName: "Português"
  },
  // Chinese (Taiwan)
  "zh-TW": {
    friendlyName: "國語"
  },
  // Polish
  "pl": {
    friendlyName: "Polski"
  },
  // Vietnamese
  "vi": {
    friendlyName: "Tiếng Việt"
  },
  // Arabic
  "ar": {
    friendlyName: "اَلْعَرَبِيَّةُ"
  },
  // Turkish
  "tr": {
    friendlyName: "Türkçe"
  },
  // Indonesian
  "id": {
    friendlyName: "Bahasa Indonesia"
  },
  // Other
  ot: {
    friendlyName: "Other/Not Listed"
  },
};
