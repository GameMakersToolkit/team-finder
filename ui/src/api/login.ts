import { getJamId } from "../common/utils/getJamId.ts";

export const LOGIN_LAST_KNOWN_JAM_KEY = "auth:last_known_jam"

export const login = () => {
  const jamId = getJamId();
  localStorage.setItem(LOGIN_LAST_KNOWN_JAM_KEY, jamId);
  window.location.href = `${import.meta.env.VITE_API_URL}/login?jamId=${getJamId()}`;
}
