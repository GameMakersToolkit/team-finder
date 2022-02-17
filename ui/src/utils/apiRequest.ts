import { importMetaEnv } from "../../src/utils/importMeta";
import { useAuth, useAuthActions } from "./AuthContext";

interface ApiRequestOptions {
  method?: "GET";
  authToken?: string;
  body?: unknown;
}

interface ApiRequestDependencies {
  logout: () => void;
}

export class NotAuthorizedError extends Error {
  constructor(message = "Not authorized") {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

/**
 * General API request method
 */
export async function apiRequest<T>(
  path: string,
  dependencies: ApiRequestDependencies,
  apiRequestOptions: ApiRequestOptions = {}
): Promise<T> {
  const headers: Headers = new Headers({
    "Content-Type": "application/json",
  });
  if (apiRequestOptions.authToken) {
    headers.append("Authorization", `Bearer ${apiRequestOptions.authToken}`);
  }

  const options: RequestInit = {
    method: apiRequestOptions?.method ?? "GET",
    mode: "cors",
    headers,
  };

  if (apiRequestOptions?.body) {
    options["body"] = JSON.stringify(apiRequestOptions.body);
  }

  const res = await fetch(`${importMetaEnv().VITE_API_URL}${path}`, options);
  if (!res.ok) {
    if (res.status == 401) {
      dependencies.logout();
      throw new NotAuthorizedError();
    }
    if (res.status == 403) {
      throw new ForbiddenError();
    }
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * @returns Query string representation of input, not including the leading "?"
 */
export function toQueryString(
  input: Record<string, string | null | undefined>
): string {
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (value != null) {
      params.append(key, value);
    }
  });
  return params.toString();
}

export function useApiRequest() {
  const { token } = useAuth() ?? {};
  const { logout } = useAuthActions();
  return <T>(path: string, apiRequestOptions: ApiRequestOptions = {}) => {
    return apiRequest<T>(
      path,
      {
        logout,
      },
      { authToken: token, ...apiRequestOptions }
    );
  };
}
