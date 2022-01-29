import { importMetaEnv } from "../../src/utils/importMeta";

/**
 * General API request method
 */
export async function apiRequest<T>(
  path: string,
  method = "GET",
  body: unknown = undefined
): Promise<T> {
  const options: RequestInit = {
    method: method,
    mode: "cors",
    headers: {
      // TODO: auth
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options["body"] = JSON.stringify(body);
  }

  const res = await fetch(`${importMetaEnv().VITE_API_URL}${path}`, options);
  if (!res.ok) {
    // TODO: if (res.status == 401)
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json();
}
