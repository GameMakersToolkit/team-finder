import { getJamId } from "../common/utils/getJamId.ts";

export const login = () => window.location.href = `${import.meta.env.VITE_API_URL}/login?jamId=${getJamId()}`;
