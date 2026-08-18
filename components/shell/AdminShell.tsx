"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellContextValue {
  openSidebar: () => void;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

/** Lets the page-owned top bar raise the off-canvas nav on narrow viewports. */
export function useAdminShell(): AdminShellContextValue {
  return useContext(AdminShellContext) ?? { openSidebar: () => {} };
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Storing the route the overlay was opened on (rather than a boolean) means
  // navigating away closes it for free — derived during render, no effect.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const mobileOpen = openedOn === pathname;

  return (
    <AdminShellContext.Provider value={{ openSidebar: () => setOpenedOn(pathname) }}>
      <div className="flex h-screen overflow-hidden bg-bg-white">
        {/* Desktop rail. The designs are desktop-only, so this is the real layout. */}
        <AdminSidebar className="hidden lg:flex" />

        {/* Below lg the rail would leave the app with no navigation at all, so
            it becomes an off-canvas overlay instead of simply disappearing. */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpenedOn(null)}
              className="absolute inset-0 bg-charcoal-darker/40 animate-fade-in"
            />
            <AdminSidebar className="relative z-10 animate-slide-in-right" />
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </AdminShellContext.Provider>
  );
}
