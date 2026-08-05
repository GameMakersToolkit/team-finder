export interface ApiSuccessEnvelope<T> {
  data: T;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiErrorEnvelope {
  error: ApiErrorPayload;
}

export function isApiSuccessEnvelope<T>(input: unknown): input is ApiSuccessEnvelope<T> {
  if (!input || typeof input !== "object") {
    return false;
  }

  return "data" in input;
}

export function isApiErrorEnvelope(input: unknown): input is ApiErrorEnvelope {
  if (!input || typeof input !== "object" || !("error" in input)) {
    return false;
  }

  const error = (input as { error?: unknown }).error;
  return Boolean(error && typeof error === "object" && "message" in error);
}
