"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/lib/auth";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={client}>
      {/* Inside the query provider: the session is itself a query. */}
      <AuthProvider>{children}</AuthProvider>
      {process.env.NODE_ENV !== "production" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
