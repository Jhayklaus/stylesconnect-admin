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

function matches(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The child whose href is the longest match for the path. Plain prefix
 * matching would light up both "All listings" (/listings) and "Attributes"
 * (/listings/attributes) on the attributes screen.
 */
function activeChildHref(item: NavItem, pathname: string): string | undefined {
  return item.children
    ?.filter((c) => matches(c.href, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export function isChildActive(item: NavItem, pathname: string): boolean {
  return activeChildHref(item, pathname) !== undefined;
}

export function SidebarNavItem({ item, pathname, open, onToggle }: SidebarNavItemProps) {
  const Icon = item.icon;

  // Leaf item.
  if (!item.children) {
    const active = matches(item.href!, pathname);
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
  const activeHref = activeChildHref(item, pathname);
  const groupActive = activeHref !== undefined;

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
            const active = child.href === activeHref;
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
