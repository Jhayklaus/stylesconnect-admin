"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeToToasts, type ToastData } from "@/lib/toast";
import { cn } from "@/lib/utils";

const AUTO_DISMISS_MS = 5_000;
const EXIT_MS = 220;
const MAX_VISIBLE = 3;

interface ShownToast extends ToastData {
  leaving: boolean;
}

// Global toast stack (top-center, under the sticky header). Mounted once in
// the root layout; fed by lib/toast's emitter.
export function Toaster() {
  const [toasts, setToasts] = useState<ShownToast[]>([]);
  // Mirror of the state list so the subscription callback and timers can read
  // the current stack without re-subscribing on every change.
  const listRef = useRef<ShownToast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  // Filled by the effect below; used by the close buttons.
  const dismissRef = useRef<(id: number) => void>(() => {});

  useEffect(() => {
    const timerMap = timers.current;

    function sync(next: ShownToast[]) {
      listRef.current = next;
      setToasts(next);
    }

    function remove(id: number) {
      const timer = timerMap.get(id);
      if (timer) clearTimeout(timer);
      timerMap.delete(id);
      sync(listRef.current.filter((t) => t.id !== id));
    }

    function dismiss(id: number) {
      if (!listRef.current.some((t) => t.id === id && !t.leaving)) return;
      sync(listRef.current.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      timerMap.set(
        id,
        setTimeout(() => remove(id), EXIT_MS),
      );
    }

    function scheduleDismiss(id: number) {
      const existing = timerMap.get(id);
      if (existing) clearTimeout(existing);
      timerMap.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );
    }

    const unsubscribe = subscribeToToasts((incoming) => {
      // Same message already on screen (e.g. several mutations failing the
      // same way) — just restart its timer instead of stacking duplicates.
      const duplicate = listRef.current.find(
        (t) => !t.leaving && t.kind === incoming.kind && t.message === incoming.message,
      );
      if (duplicate) {
        scheduleDismiss(duplicate.id);
        return;
      }
      const next = [...listRef.current, { ...incoming, leaving: false }];
      // Cap the stack — silently drop the oldest.
      const overflow = next.length - MAX_VISIBLE;
      if (overflow > 0) {
        next.slice(0, overflow).forEach((t) => {
          const timer = timerMap.get(t.id);
          if (timer) clearTimeout(timer);
          timerMap.delete(t.id);
        });
      }
      sync(next.slice(Math.max(0, overflow)));
      scheduleDismiss(incoming.id);
    });

    // Expose dismiss for the close buttons rendered below.
    dismissRef.current = dismiss;

    return () => {
      unsubscribe();
      timerMap.forEach(clearTimeout);
      timerMap.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 inset-x-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex items-center gap-3 w-full sm:w-auto sm:min-w-[320px] sm:max-w-[440px]",
            "bg-white/95 backdrop-blur-md border border-stroke-soft rounded-2xl",
            "shadow-[0_12px_32px_-8px_rgba(20,11,10,0.22)] pl-3 pr-2 py-3",
            "transition-all duration-200",
            t.leaving ? "opacity-0 -translate-y-2 scale-[0.98]" : "animate-toast-in",
          )}
        >
          <span
            className={cn(
              "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              t.kind === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500",
            )}
          >
            {t.kind === "success" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4.5M12 15.8v.2" />
              </svg>
            )}
          </span>
          <p className="flex-1 font-jost text-sm text-text-900 leading-5 py-0.5">{t.message}</p>
          <button
            onClick={() => dismissRef.current(t.id)}
            aria-label="Dismiss"
            className="shrink-0 p-1.5 rounded-full text-text-500 hover:text-text-900 hover:bg-bg-soft transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
