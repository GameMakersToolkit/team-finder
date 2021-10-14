import { baseUrl } from "../../test-utils/config";

export function importMetaEnv(): unknown {
  return {
    VITE_API_URL: baseUrl,
  };
}
