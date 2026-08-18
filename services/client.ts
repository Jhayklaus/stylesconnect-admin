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

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
