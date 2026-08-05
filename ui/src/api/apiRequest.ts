import { useAuth, useAuthActions } from "./AuthContext";
import { toast } from "react-hot-toast";
import {
  ApiErrorPayload,
  isApiErrorEnvelope,
  isApiSuccessEnvelope,
} from "./types";

interface ApiRequestOptions {
  method?: "GET" | "PUT" | "POST" | "DELETE";
  authToken?: string;
  body?: unknown;
  isFileUpload?: boolean;
}

type ApiRequestBody = BodyInit | null;

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

export class NotFoundError extends Error {
  constructor() {
    super("Not Found");
    this.name = "NotFoundError";
  }
}

export class ApiRequestError extends Error {
  code: string;
  details?: Record<string, string>;

  constructor(payload: ApiErrorPayload, fallbackCode = "request_error") {
    super(payload.message || "Sorry, something went wrong.");
    this.name = "ApiRequestError";
    this.code = payload.code || fallbackCode;
    this.details = payload.details;
  }
}

function toRequestBody(body: unknown, isFileUpload?: boolean): ApiRequestBody {
  if (body == null) {
    return null;
  }

  if (isFileUpload && body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function unwrapApiSuccess<T>(raw: unknown): T {
  if (isApiSuccessEnvelope<T>(raw)) {
    return raw.data;
  }

  throw new Error("Malformed API success payload. Expected { data: ... } envelope.");
}

function parseApiErrorPayload(raw: unknown): ApiErrorPayload {
  if (isApiErrorEnvelope(raw)) {
    return raw.error;
  }

  const fallbackMessage =
    typeof raw === "object" && raw && "message" in raw
      ? String((raw as { message?: unknown }).message ?? "")
      : "Sorry, something went wrong.\nAn unknown error occurred.";

  return {
    code: "request_error",
    message: fallbackMessage,
  };
}

/**
 * General API request method
 */
export async function apiRequest<T>(
  path: string,
  dependencies: ApiRequestDependencies,
  apiRequestOptions: ApiRequestOptions = {}
): Promise<T> {
  const headers: Headers = new Headers();

  if (!apiRequestOptions.isFileUpload) {
    headers.append("Content-Type", "application/json");
  }

  if (apiRequestOptions.authToken) {
    headers.append("Authorization", `Bearer ${apiRequestOptions.authToken}`);
  }

  const options: RequestInit = {
    method: apiRequestOptions?.method ?? "GET",
    mode: "cors",
    headers,
  };

  if (apiRequestOptions?.body) {
    options.body = toRequestBody(apiRequestOptions.body, apiRequestOptions.isFileUpload);
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, options);
  const rawBody = await parseJsonSafely(res);

  if (!res.ok) {
    if (res.status === 401) {
      dependencies.logout();
      throw new NotAuthorizedError();
    }
    if (res.status === 403) {
      throw new ForbiddenError();
    }
    if (res.status === 404) {
      throw new NotFoundError();
    }

    const parsedError = parseApiErrorPayload(rawBody);

    toast.error(parsedError.message);

    throw new ApiRequestError(parsedError, String(res.status));
  }

  return unwrapApiSuccess<T>(rawBody);
}

// /**
//  * @returns Query string representation of input, not including the leading "?"
//  */
// export function toQueryString(
//   input: Record<string, string | null | undefined>
// ): string {
//   const params = new URLSearchParams();
//   Object.entries(input).forEach(([key, value]) => {
//     if (value != null) {
//       params.append(key, value);
//     }
//   });
//   return params.toString();
// }

/**
 * A hook that pre-populates the apiRequest() function from context
 */
export function useApiRequest() {
  const { token } = useAuth() ?? {};
  const auth = useAuth();
  const { logout } = useAuthActions();
  const jamToken = auth?.token;
  return <T>(path: string, apiRequestOptions: ApiRequestOptions = {}) => {
    return apiRequest<T>(
      path,
      {
        logout: () => {
          if (jamToken) {
            logout("*");
          }
        },
      },
      { authToken: token, ...apiRequestOptions }
    );
  };
}

/*
 * Returns null for a 404 response
 */
export function expectNotFound<T>(promise: Promise<T>): Promise<T | null> {
  return promise.then(
    (value) => value,
    (err) => {
      if (err instanceof NotFoundError) {
        return null;
      }

      throw err;
    }
  );
}
