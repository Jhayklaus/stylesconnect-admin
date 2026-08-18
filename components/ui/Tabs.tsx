"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabItem<V extends string = string> {
  value: V;
  label: string;
  count?: number;
}

export interface TabsProps<V extends string> {
  tabs: TabItem<V>[];
  value: V;
  onChange: (value: V) => void;
  className?: string;
}

/** Shared roving-tabindex arrow-key navigation for both tab styles. */
function useTabKeys<V extends string>(
  tabs: TabItem<V>[],
  value: V,
  onChange: (value: V) => void
) {
  const ref = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const index = tabs.findIndex((t) => t.value === value);
    const next =
      e.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    const buttons = ref.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    buttons?.[next]?.focus();
  }

  return { ref, onKeyDown };
}

/** Grey track, active segment is a white pill with a shadow. */
export function SegmentedTabs<V extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabsProps<V>) {
  const { ref, onKeyDown } = useTabKeys(tabs, value, onChange);

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn("inline-flex items-center gap-1 rounded-xl bg-bg-soft p-1", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-lg px-5 py-2 font-jost text-sm leading-5 transition-colors",
              active
                ? "bg-bg-white font-medium text-text-900 shadow-card"
                : "text-text-300 hover:text-text-500"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-text-300">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Active tab carries a primary-coloured underline. */
export function UnderlineTabs<V extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabsProps<V>) {
  const { ref, onKeyDown } = useTabKeys(tabs, value, onChange);

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn("flex items-center gap-7 border-b border-stroke-soft", className)}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              "-mb-px border-b-2 pb-3 font-jost text-sm leading-5 transition-colors",
              active
                ? "border-primary-base font-medium text-text-900"
                : "border-transparent text-text-500 hover:text-text-900"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-text-300">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
