import { MutationCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/services/types";
import { toast } from "@/lib/toast";

// Per-mutation opt-ins, e.g. useMutation({ ..., meta: { successMessage: "Saved" } }).
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /** Shown as a success toast when the mutation succeeds. */
      successMessage?: string;
      /** Skip the automatic error toast (the caller renders its own UI). */
      silentError?: boolean;
    };
  }
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silentError) return;
        // 401s already trigger the global sign-out + login modal.
        if (error instanceof ApiError && error.status === 401) return;
        toast.error(error instanceof Error ? error.message : "Something went wrong.");
      },
      onSuccess: (_data, _variables, _context, mutation) => {
        const message = mutation.meta?.successMessage;
        if (message) toast.success(message);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
