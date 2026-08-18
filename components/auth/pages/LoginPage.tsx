"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button, TextField } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import type { ApiError } from "@/services/types";

/** Cheap format check — the server remains the authority on whether it exists. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Only ever an internal path — an absolute URL here would be an open redirect.
  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/overview";

  // Someone already signed in has no business on this screen.
  useEffect(() => {
    if (isAuthenticated) router.replace(next);
  }, [isAuthenticated, next, router]);

  const emailError =
    submitted && !looksLikeEmail(email) ? "Enter a valid email address" : undefined;
  const passwordError = submitted && password.length < 8 ? "Use at least 8 characters" : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setFormError(null);

    if (!looksLikeEmail(email) || password.length < 8) return;

    try {
      await login({ email: email.trim(), password });
      router.replace(next);
    } catch (error) {
      setFormError((error as ApiError).message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar-bg px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-base">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/StyleConnect_Monogram_Symbol_White.svg"
              alt=""
              aria-hidden
              className="h-5 w-auto"
            />
          </span>
          <span className="font-inter font-medium text-xl leading-7 text-text-900">
            StyleConnect
          </span>
        </div>

        <div className="rounded-2xl border border-stroke-soft bg-bg-white px-6 py-7 shadow-card sm:px-8">
          <h1 className="font-inter font-medium text-2xl leading-8 text-text-900">
            Sign in to the admin
          </h1>
          <p className="mt-2 font-jost text-sm leading-5 text-text-500">
            Use the account your workspace administrator issued you.
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-lg bg-status-danger-bg px-3.5 py-3"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-status-danger-fg"
                aria-hidden
              />
              <p className="font-jost text-sm leading-5 text-status-danger-fg">{formError}</p>
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <TextField
              label="Email address"
              type="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={setEmail}
              placeholder="you@styleconnect.com"
              error={emailError}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              error={passwordError}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 rounded p-1 text-text-300 transition-colors hover:text-text-900"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              }
            />

            <Button type="submit" size="lg" disabled={isLoggingIn} className="mt-1 w-full">
              {isLoggingIn ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-jost text-xs leading-4 text-text-500">
          Trouble signing in? Contact your workspace administrator.
        </p>
      </div>
    </main>
  );
}
