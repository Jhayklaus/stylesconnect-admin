import { apiClient, clearAuthToken, getAuthToken, setAuthToken } from "../client";
import { ApiError, type ApiEnvelope } from "../types";
import { MOCKS } from "../mock/config";
import { delay } from "../mock/transport";
import { MOCK_ADMIN, MOCK_LOCKED_EMAIL, MOCK_TOKEN } from "./auth.mock";
import type { AdminUser, LoginBody, LoginResponse } from "./auth.types";

/** POST /auth/login */
export async function login(body: LoginBody): Promise<LoginResponse> {
  if (MOCKS.auth) {
    await delay();

    if (body.email.trim().toLowerCase() === MOCK_LOCKED_EMAIL) {
      throw new ApiError({
        message: "These credentials do not match our records.",
        status: 401,
      });
    }

    setAuthToken(MOCK_TOKEN);
    return { token: MOCK_TOKEN, user: { ...MOCK_ADMIN, email: body.email.trim() } };
  }

  const { data } = await apiClient.post<ApiEnvelope<LoginResponse>>("/auth/login", body);
  setAuthToken(data.data.token);
  return data.data;
}

/**
 * GET /auth/me — the session probe on boot.
 *
 * Throws 401 rather than returning null so the query lands in `error` and the
 * axios interceptor's own 401 handling stays the single place that clears the
 * token.
 */
export async function fetchMe(): Promise<AdminUser> {
  if (MOCKS.auth) {
    await delay(200);
    if (!getAuthToken()) {
      throw new ApiError({ message: "Not authenticated", status: 401 });
    }
    return MOCK_ADMIN;
  }

  const { data } = await apiClient.get<ApiEnvelope<AdminUser>>("/auth/me");
  return data.data;
}

/** POST /auth/logout */
export async function logout(): Promise<void> {
  if (MOCKS.auth) {
    await delay(150);
    clearAuthToken();
    return;
  }

  try {
    await apiClient.post("/auth/logout");
  } finally {
    // Drop the token even if the call fails — the user asked to be signed out,
    // and a stale token is worse than an orphaned server session.
    clearAuthToken();
  }
}
