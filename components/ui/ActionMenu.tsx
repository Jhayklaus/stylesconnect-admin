"use client";

import type { ReactNode } from "react";
import { Check, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";
import { Popover } from "./Popover";

export interface ActionMenuItem {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Renders a trailing check — "Resend invite" in the designs. */
  checked?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  onSelect: (value: string) => void;
  /** Accessible name for the default kebab trigger. */
  label?: string;
  align?: "start" | "end";
  className?: string;
}

/** The per-row "⋮" menu. */
export function ActionMenu({
  items,
  onSelect,
  label = "Row actions",
  align = "end",
  className,
}: ActionMenuProps) {
  return (
    <Popover
      align={align}
      className={className}
      panelClassName="min-w-[200px]"
      trigger={({ toggle }) => (
        <IconButton
          label={label}
          size="sm"
          onClick={toggle}
          className="border-0 bg-transparent"
          icon={<MoreVertical className="h-[18px] w-[18px]" />}
        />
      )}
    >
      {(close) => (
        <ul role="menu">
          {items.map((item) => (
            <li key={item.value} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  close();
                  onSelect(item.value);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-jost text-sm leading-5",
                  "transition-colors hover:bg-bg-soft disabled:opacity-50 disabled:pointer-events-none",
                  item.danger ? "text-status-danger-fg" : "text-text-900"
                )}
              >
                {item.icon && <span className="shrink-0 text-text-500">{item.icon}</span>}
                <span className="flex-1 truncate">{item.label}</span>
                {item.checked && <Check className="h-4 w-4 shrink-0 text-text-500" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
