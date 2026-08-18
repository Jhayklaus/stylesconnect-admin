"use client";

import type { ReactNode } from "react";
import { Bell, Menu, Zap } from "lucide-react";
import { IconButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAdminShell } from "./AdminShell";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export interface AdminTopBarProps {
  /** Plain page title mode — "Listings", "Order list". */
  title?: string;
  /** Breadcrumb mode. Mutually exclusive with `title`. */
  breadcrumb?: Crumb[];
  /** Right-hand slot. Omit for the default bolt + bell cluster. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Rendered by each page rather than by the layout: the designs alternate
 * between breadcrumb and bare-title modes and swap the right-hand slot per
 * screen, so the header is page-owned data. A layout-level version would need
 * a pathname→config lookup table that drifts as routes are added.
 */
export function AdminTopBar({ title, breadcrumb, actions, className }: AdminTopBarProps) {
  const { openSidebar } = useAdminShell();

  return (
    <header
      className={cn(
        "flex h-[76px] shrink-0 items-center justify-between gap-4 border-b border-stroke-soft px-8",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          label="Open navigation"
          onClick={openSidebar}
          icon={<Menu className="h-[18px] w-[18px]" />}
          className="lg:hidden"
        />
        {breadcrumb ? (
          <Breadcrumb items={breadcrumb} />
        ) : (
          <h1 className="font-inter font-medium text-xl leading-7 text-text-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {actions ?? (
          <>
            <IconButton label="Quick actions" icon={<Zap className="h-[18px] w-[18px]" />} />
            <IconButton label="Notifications" dot icon={<Bell className="h-[18px] w-[18px]" />} />
          </>
        )}
      </div>
    </header>
  );
}
