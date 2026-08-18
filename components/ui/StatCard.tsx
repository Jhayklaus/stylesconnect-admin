import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCount, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

export interface StatDelta {
  direction: "up" | "down";
  /** Magnitude, e.g. 9.4 */
  value: number;
  /** "last year" | "vs last year" */
  caption?: string;
  /**
   * "text" — bare green arrow + percentage + caption (Overview).
   * "pill" — green rounded pill, caption sits beside it (customer lists).
   */
  variant?: "text" | "pill";
}

export interface StatCardProps {
  label: string;
  /** `undefined` renders an em-dash — "0" would read as a real zero. */
  value: string | number | undefined;
  delta?: StatDelta;
  /** Small glyph shown bottom-left, as on the Overview cards. */
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({ label, value, delta, icon, isLoading, className }: StatCardProps) {
  const up = delta?.direction !== "down";
  const Arrow = up ? ArrowUp : ArrowDown;
  const toneText = up ? "text-status-success-fg" : "text-status-danger-fg";
  const tonePill = up
    ? "bg-status-success-bg text-status-success-fg"
    : "bg-status-danger-bg text-status-danger-fg";

  return (
    <div className={cn("flex flex-col gap-3 px-6 py-5", className)}>
      <p className="font-jost text-sm leading-5 text-text-500">{label}</p>

      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="font-inter font-medium text-[28px] leading-9 text-text-900">
          {value === undefined ? (
            <span className="text-text-300">—</span>
          ) : typeof value === "number" ? (
            formatCount(value)
          ) : (
            value
          )}
        </p>
      )}

      {(delta || icon) && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-text-300">{icon}</span>
          {delta && !isLoading && value !== undefined && (
            <span className="flex items-center gap-1.5 font-jost text-sm leading-5">
              {delta.variant === "pill" ? (
                <>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs leading-4",
                      tonePill
                    )}
                  >
                    <Arrow className="h-3 w-3" aria-hidden />
                    {delta.value}
                  </span>
                  <span className="text-text-500">{delta.caption ?? "vs last year"}</span>
                </>
              ) : (
                <>
                  <span className={cn("inline-flex items-center gap-1 font-medium", toneText)}>
                    <Arrow className="h-3.5 w-3.5" aria-hidden />
                    {formatPercent(delta.value)}
                  </span>
                  <span className="text-text-500">{delta.caption ?? "last year"}</span>
                </>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export interface StatCardRowProps {
  items: StatCardProps[];
  isLoading?: boolean;
  className?: string;
}

// Static map — never interpolate a Tailwind class name.
const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function StatCardRow({ items, isLoading, className }: StatCardRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-stroke-soft rounded-2xl border border-stroke-soft",
        "md:divide-x md:divide-y-0",
        COLS[items.length] ?? COLS[4],
        className
      )}
    >
      {items.map((item) => (
        <StatCard key={item.label} {...item} isLoading={isLoading ?? item.isLoading} />
      ))}
    </div>
  );
}
