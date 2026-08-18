"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav.config";

export interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
  open: boolean;
  onToggle: (key: string) => void;
}

const rowBase =
  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 font-jost text-[15px] leading-6 transition-colors";
const activeRow = "bg-bg-white text-primary-base shadow-pill-active font-medium";
const idleRow = "text-text-500 hover:bg-bg-white/60 hover:text-text-900";

export function isChildActive(item: NavItem, pathname: string): boolean {
  return item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
}

export function SidebarNavItem({ item, pathname, open, onToggle }: SidebarNavItemProps) {
  const Icon = item.icon;

  // Leaf item.
  if (!item.children) {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <li>
        <Link
          href={item.href!}
          aria-current={active ? "page" : undefined}
          className={cn(rowBase, active ? activeRow : idleRow)}
        >
          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
          {item.label}
        </Link>
      </li>
    );
  }

  // Parent item with a sub-nav.
  const groupActive = isChildActive(item, pathname);

  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(item.key)}
        aria-expanded={open}
        className={cn(rowBase, groupActive && !open ? activeRow : idleRow)}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
        {item.label}
        <ChevronDown
          aria-hidden
          className={cn("ml-auto h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="ml-[27px] mt-1 space-y-1 border-l border-stroke-soft pl-3">
          {item.children.map((child) => {
            const active = pathname === child.href || pathname.startsWith(`${child.href}/`);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-3.5 py-2.5 font-jost text-[15px] leading-6 transition-colors",
                    active ? activeRow : idleRow
                  )}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
