import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li className="flex items-center text-text-500">
          <LayoutGrid className="h-[18px] w-[18px]" aria-hidden />
        </li>
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="font-jost text-[15px] leading-6 text-text-500 transition-colors hover:text-text-900"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "font-jost text-[15px] leading-6",
                    last ? "font-medium text-text-900" : "text-text-500"
                  )}
                >
                  {crumb.label}
                </span>
              )}
              {!last && (
                <ChevronRight className="h-4 w-4 shrink-0 text-text-300" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
