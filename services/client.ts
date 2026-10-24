import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { ApiError, type ValidationErrorBody } from "./types";

const TOKEN_STORAGE_KEY = "sc_auth_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Same-origin path that next.config.mjs rewrites to the server-only
 * API_BASE_URL, so the backend's address never ships in the client bundle.
 */
export const API_PROXY_PATH = "/api/backend";

export const apiClient = axios.create({
  baseURL: API_PROXY_PATH,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Screens pass list state straight through, and "all" / "" mean "no filter"
 * there. Drop them so the backend only ever sees filters that narrow.
 */
function cleanParams(params: unknown): unknown {
  if (!params || typeof params !== "object" || params instanceof URLSearchParams) return params;
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "" && value !== "all"
    )
  );
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.params = cleanParams(config.params);

  const token = getAuthToken();
  if (token) {
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ValidationErrorBody | { message?: string }>) => {
    const status = error.response?.status ?? 0;

    if (status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sc:unauthorized"));
      }
    }

    const data = error.response?.data;

    const errors =
      data && typeof data === "object" && "errors" in data && data.errors
        ? (data.errors as Record<string, string[]>)
        : undefined;

    // Surface the backend's own wording, in order of usefulness: the first
    // validation field error (422s ship a generic top-level message), then
    // the body's message, then the envelope's error. Never fall through to
    // axios' "Request failed with status code N".
    const firstFieldError = errors
      ? Object.values(errors)
          .flat()
          .find((m): m is string => typeof m === "string" && m.trim().length > 0)
      : undefined;

    const bodyMessage =
      data && typeof data === "object" && "message" in data && typeof data.message === "string" && data.message.trim()
        ? data.message
        : undefined;

    let envelopeMessage: string | undefined;
    if (data && typeof data === "object" && "error" in data) {
      const envelopeError = (data as { error?: unknown }).error;
      if (typeof envelopeError === "string" && envelopeError.trim()) {
        envelopeMessage = envelopeError;
      } else if (
        envelopeError &&
        typeof envelopeError === "object" &&
        "message" in envelopeError &&
        typeof (envelopeError as { message?: unknown }).message === "string"
      ) {
        envelopeMessage = (envelopeError as { message: string }).message;
      }
    }

    const fallback =
      status === 0
        ? "Network error \u2014 check your connection and try again."
        : "Something went wrong. Please try again.";

    const message = firstFieldError ?? bodyMessage ?? envelopeMessage ?? fallback;

    return Promise.reject(
      new ApiError({
        message,
        status,
        code: error.code,
        errors,
        raw: error.response?.data,
      }),
    );
  },
);
