import { importMetaEnv } from "./importMeta";

export enum JamState { Before, During, After }

export const getJamState = () => {
  const searchParams = new URL(window.location.toString()).searchParams;
  const overrideStateParam: string = searchParams.get("js") || localStorage.getItem("js") || "";

  // If we've got one, set it in localStorage
  // We'll track this in localStorage so it works during redirects
  if (overrideStateParam) {
    localStorage.setItem("js", overrideStateParam);
  }

  if (overrideStateParam) {
    // Enum key needs begins with a capital letter,
    // and bafflingly this is still apparently the only way to do this
    const overrideStateKey = overrideStateParam.charAt(0).toUpperCase() + overrideStateParam.slice(1) as keyof typeof JamState
    return JamState[overrideStateKey] as JamState;
  }

  const currentDate = new Date();

  // If a start date hasn't been given, never show the BeforeJam view
//   const jamStartDate = new Date(importMetaEnv().VITE_JAM_START || "1999-01-01");
//   if (currentDate <= jamStartDate) {
//     return JamState.Before;
//   }

  // If an end date hasn't been given, never show the AfterJam view
  const jamEndDate = new Date(importMetaEnv().VITE_JAM_END || "2999-01-01");
  if (jamEndDate <= currentDate) {
    return JamState.After;
  }

  return JamState.During;
}
