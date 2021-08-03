import { ArrayToRecord } from "../utils/ArrayToRecord";
import { languages } from "../utils/LanguageData";


export const languageSelectIndex: Record<string, string> = ArrayToRecord(languages, l => [l.code, l.display]);
