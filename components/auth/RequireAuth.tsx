"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Client-side gate for the admin shell.
 *
 * This hides the UI, it does not secure it — the data behind it is only as
 * protected as the API. Every admin endpoint must still reject an unauthorised
 * token on the server.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    // Carry the attempted path so sign-in can return the user to it.
    const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login${next}`);
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-white">
        <span className="sr-only">Checking your session</span>
        <span
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-2 border-stroke-soft border-t-primary-base"
        />
      </div>
    );
  }

  // Render nothing during the redirect rather than flashing the shell.
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
