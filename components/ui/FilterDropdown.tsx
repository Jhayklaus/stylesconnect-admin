"use client";

import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Popover } from "./Popover";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  /** Shown when nothing (or the catch-all) is selected — "Status", "Sort by". */
  label: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
  /** Leading glyph, e.g. a calendar for "Date posted". */
  icon?: ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  icon,
  align = "end",
  className,
}: FilterDropdownProps) {
  const selected = options.find((o) => o.value === value && o.value !== "all");

  return (
    <Popover
      align={align}
      className={className}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-stroke-soft bg-bg-white px-4",
            "font-jost text-sm leading-5 transition-colors hover:bg-beige-lighter",
            selected ? "text-text-900" : "text-text-500"
          )}
        >
          {icon}
          {selected ? selected.label : label}
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
          />
        </button>
      )}
    >
      {(close) => (
        <ul role="listbox" className="max-h-72 overflow-y-auto">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2.5 text-left font-jost text-sm leading-5 transition-colors hover:bg-bg-soft",
                    active ? "font-medium text-primary-base" : "text-text-900"
                  )}
                >
                  {opt.label}
                  {active && <Check className="ml-auto h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Popover>
  );
}
