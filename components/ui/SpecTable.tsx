import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  label: ReactNode;
  value: ReactNode;
}

export interface SpecTableProps {
  title: string;
  rows: SpecRow[];
  className?: string;
}

/**
 * A bordered card with a tinted caption bar and label/value rows — the
 * "Title and description", "Inventory" and "Features" blocks on the product
 * detail screen.
 */
export function SpecTable({ title, rows, className }: SpecTableProps) {
  return (
    <section
      className={cn("overflow-hidden rounded-xl border border-stroke-soft", className)}
    >
      <h3 className="bg-bg-soft px-5 py-3 font-jost font-medium text-sm leading-5 text-text-900">
        {title}
      </h3>
      <dl className="divide-y divide-stroke-soft">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
            <dt className="px-5 py-3.5 font-jost text-sm leading-5 text-text-500 sm:border-r sm:border-stroke-soft">
              {row.label}
            </dt>
            <dd className="px-5 py-3.5 font-jost text-sm leading-5 text-text-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Small neutral chip used for colours and sizes in the Features block. */
export function SpecChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-stroke-soft px-2.5 py-1 font-jost text-xs leading-4 text-text-900">
      {children}
    </span>
  );
}
