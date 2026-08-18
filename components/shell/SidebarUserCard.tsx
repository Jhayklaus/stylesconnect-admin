"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, Popover, Skeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { primaryRoleLabel } from "@/services/auth";

/** The signed-in admin, with the sign-out action behind the chevron. */
export function SidebarUserCard() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 rounded-2xl border border-stroke-soft bg-bg-white px-3 py-2.5 shadow-card">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto pt-6">
      <Popover
        align="start"
        className="w-full"
        panelClassName="w-full"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-2xl border border-stroke-soft bg-bg-white px-3 py-2.5 text-left shadow-card transition-colors hover:bg-beige-lighter"
          >
            <Avatar src={user.avatar_url} name={user.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-jost font-medium text-sm leading-5 text-text-900">
                {user.name}
              </p>
              <p className="truncate font-jost text-xs leading-4 text-text-500">
                {primaryRoleLabel(user)}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-text-500" aria-hidden />
          </button>
        )}
      >
        {(close) => (
          <button
            type="button"
            onClick={() => {
              close();
              void logout();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-jost text-sm leading-5 text-text-900 transition-colors hover:bg-bg-soft"
          >
            <LogOut className="h-4 w-4 shrink-0 text-text-500" aria-hidden />
            Sign out
          </button>
        )}
      </Popover>
    </div>
  );
}
