import { ArrayToRecord } from "./ArrayToRecord";

export const getDisplay = (codes: string[] | null) : string => {
  if(!codes) return "";
  return codes
    .map(c => languageIndex[c])
    .filter(c => c != undefined && c != null)
    .map(l => l.display)
    .toString()
    .replace(/,/g, ', ');
}

export const filterValidLanguageCodes = (codes: string[]) : string[] => {
  return codes.filter(code => languages.some(language => language.code === code))
}

export const languages = [
  {code: "en", display: "English"},   // English
  {code: "es", display: "Español"},   // Spanish
  {code: "fr", display: "Français"},  // French
  {code: "de", display: "Deutsch"},   // German
  {code: "ru", display: "Русский"},   // Russian
  {code: "pt", display: "Português"}, // Portuguese - TODO Brazillian vs Portugal?
  {code: "zh", display: "汉语"},       // Chinese (Mandarin) 汉语 (官話) - TODO Which is correct?
  {code: "hi", display: "हिन्दी"},       // Hindi
  {code: "ar", display: "العربية"},   // Arabic
  {code: "bn", display: "বাংলা"},      // Bengali
  {code: "ja", display: "日本語"},     // Japanese
  {code: "ko", display: "조선말"},     // Korean
]

const languageIndex = ArrayToRecord(languages, l => [l.code, l]);