"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authKeys,
  fetchMe,
  login as loginRequest,
  logout as logoutRequest,
  type AdminUser,
  type LoginBody,
} from "@/services/auth";
import { getAuthToken } from "@/services/client";
import type { ApiError } from "@/services/types";

export interface AuthContextValue {
  user: AdminUser | null;
  /** True only while the boot-time session probe is in flight. */
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (body: LoginBody) => Promise<AdminUser>;
  logout: () => Promise<void>;
  isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Skip the probe entirely when there's no token — an anonymous visitor
  // shouldn't pay for a request that can only 401.
  const hasToken = typeof window !== "undefined" && Boolean(getAuthToken());

  const session = useQuery<AdminUser, ApiError>({
    queryKey: authKeys.session(),
    queryFn: fetchMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation<AdminUser, ApiError, LoginBody>({
    mutationFn: async (body) => (await loginRequest(body)).user,
    onSuccess: (user) => queryClient.setQueryData(authKeys.session(), user),
  });

  const logoutMutation = useMutation<void, ApiError, void>({
    mutationFn: logoutRequest,
    // Clear everything, not just the session: cached admin data belongs to the
    // account that just signed out.
    onSettled: () => {
      queryClient.clear();
      router.replace("/login");
    },
  });

  // The axios layer clears the token and fires this on any 401. Reacting here
  // keeps "session expired" handling in one place rather than in every screen.
  useEffect(() => {
    function onUnauthorized() {
      queryClient.clear();
      router.replace("/login");
    }
    window.addEventListener("sc:unauthorized", onUnauthorized);
    return () => window.removeEventListener("sc:unauthorized", onUnauthorized);
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.data ?? null,
      isLoading: hasToken && session.isPending,
      isAuthenticated: Boolean(session.data),
      login: (body) => loginMutation.mutateAsync(body),
      logout: () => logoutMutation.mutateAsync(),
      isLoggingIn: loginMutation.isPending,
    }),
    [hasToken, session.data, session.isPending, loginMutation, logoutMutation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
