import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface InfoRow {
  label: string;
  value: ReactNode;
}

export interface InfoSection {
  title: string;
  rows: InfoRow[];
}

/** Email and phone sit in a bordered chip in the designs, not as plain text. */
export function InfoChip({ href, children }: { href?: string; children: ReactNode }) {
  const className =
    "inline-block max-w-full truncate rounded-md border border-stroke-soft px-2 py-1 font-jost text-sm leading-5 text-primary-base";
  return href ? (
    <a href={href} className={cn(className, "hover:bg-beige-lighter")}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}

export interface ProfileInfoPanelProps {
  sections: InfoSection[];
  isLoading?: boolean;
  className?: string;
}

/** The left rail of the customer profile screens. */
export function ProfileInfoPanel({ sections, isLoading, className }: ProfileInfoPanelProps) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s} className="flex flex-col gap-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 4 }).map((_, r) => (
              <Skeleton key={r} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-4">
          <h2 className="font-inter font-medium text-base leading-6 text-text-900">
            {section.title}
          </h2>
          <dl className="flex flex-col gap-3">
            {section.rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[120px_1fr] items-start gap-2">
                <dt className="font-jost text-sm leading-5 text-text-500">{row.label}</dt>
                <dd className="flex gap-1.5 font-jost text-sm leading-5 text-text-900">
                  <span className="text-text-500" aria-hidden>
                    :
                  </span>
                  <span className="min-w-0">{row.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
