import { importMetaEnv } from "./importMeta";

export enum JamState {Before, During, After}

export const getJamState = () => {
  const currentDate = new Date();

  // If an end date hasn't been given, never show the BeforeJam view
  const jamStartDate = new Date(importMetaEnv().VITE_JAM_START || "1999-01-01");
  if (currentDate <= jamStartDate) {
    return JamState.Before;
  }

  // If an end date hasn't been given, never show the AfterJam view
  const jamEndDate = new Date(importMetaEnv().VITE_JAM_END || "2999-01-01");
  if (jamEndDate <= currentDate) {
    return JamState.After;
  }

  return JamState.During;
}
