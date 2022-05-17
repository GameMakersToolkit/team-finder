export const allLanguages = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "de", // German
  "ru", // Russian
  "pt", // Portuguese - TODO Brazillian vs Portugal?
  "zh", // Chinese (Mandarin) 汉语 (官話) - TODO Which is correct?
  "hi", // Hindi
  "ar", // Arabic
  "bn", // Bengali
  "ja", // Japanese
  "ko", // Korean
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
  // Spanish
  es: {
    friendlyName: "Español"
  },
  // French
  fr: {
    friendlyName: "Français"
  },
  // German
  de: {
    friendlyName: "Deutsch"
  },
  // Russian
  ru: {
    friendlyName: "Русский"
  },
  // Portuguese - TODO Brazillian vs Portugal?
  pt: {
    friendlyName: "Português"
  },
  // Chinese (Mandarin) 汉语 (官話) - TODO Which is correct?
  zh: {
    friendlyName: "汉语"
  },
  // Hindi
  hi: {
    friendlyName: "हिन्दी"
  },
  // Arabic
  ar: {
    friendlyName: "العربية"
  },
  // Bengali
  bn: {
    friendlyName: "বাংলা"
  },
  // Japanese
  ja: {
    friendlyName: "日本語"
  },
  // Korean
  ko: {
    friendlyName: "조선말"
  },
};
