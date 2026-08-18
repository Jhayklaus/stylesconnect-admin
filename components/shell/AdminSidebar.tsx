"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { MAIN_MENU } from "./nav.config";
import { PinnedTickets } from "./PinnedTickets";
import { SidebarNavItem, isChildActive } from "./SidebarNavItem";
import { SidebarUserCard } from "./SidebarUserCard";

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  // Only groups the user has explicitly toggled are stored. Everything else is
  // derived from the route during render, so a deep link or back-navigation
  // lands with the right group already open — no state sync needed.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const isOpen = (key: string, routeActive: boolean) => overrides[key] ?? routeActive;

  return (
    <aside
      className={cn(
        "flex h-full w-[300px] shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar-bg px-4 pb-6 pt-6",
        className
      )}
    >
      <BrandMark />

      <div className="mt-6 border-t border-sidebar-border pt-6">
        <p className="px-3.5 pb-2 font-jost text-[11px] uppercase leading-4 tracking-[0.08em] text-text-300">
          Main menu
        </p>
        <nav>
          <ul className="space-y-0.5">
            {MAIN_MENU.map((item) => {
              const routeActive = isChildActive(item, pathname);
              const open = isOpen(item.key, routeActive);
              return (
                <SidebarNavItem
                  key={item.key}
                  item={item}
                  pathname={pathname}
                  open={open}
                  onToggle={(key) => setOverrides((p) => ({ ...p, [key]: !open }))}
                />
              );
            })}
          </ul>
        </nav>
      </div>

      <PinnedTickets />
      <SidebarUserCard name="Sophia Williams" role="Admin" />
    </aside>
  );
}
