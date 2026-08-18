"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const PAGE_SIZE = 7;

export function paginate<T>(items: T[], page: number, perPage: number = PAGE_SIZE): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

export function pageCountOf(total: number, perPage: number = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / perPage));
}

// 1 … 4 [5] 6 … 12 — full list when 7 pages or fewer.
// Ported from the consumer app's Pagination.
function pageList(page: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const wanted = [1, page - 1, page, page + 1, count].filter((p) => p >= 1 && p <= count);
  const unique = [...new Set(wanted)].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < unique.length; i++) {
    if (i > 0 && unique[i] - unique[i - 1] > 1) out.push("…");
    out.push(unique[i]);
  }
  return out;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Adds the « / » jump-to-first/last buttons. */
  withEdges?: boolean;
  className?: string;
}

const cellBase =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 font-jost text-sm leading-5 transition-colors disabled:opacity-40 disabled:pointer-events-none";

export function Pagination({
  page,
  pageCount,
  onChange,
  withEdges = true,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const go = (p: number) => onChange(Math.min(Math.max(1, p), pageCount));

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      {withEdges && (
        <button
          type="button"
          aria-label="First page"
          disabled={page === 1}
          onClick={() => go(1)}
          className={cn(cellBase, "border border-stroke-soft text-text-500 hover:bg-bg-soft")}
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden />
        </button>
      )}
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => go(page - 1)}
        className={cn(cellBase, "border border-stroke-soft text-text-500 hover:bg-bg-soft")}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      {pageList(page, pageCount).map((entry, i) =>
        entry === "…" ? (
          <span key={`gap-${i}`} className={cn(cellBase, "text-text-300")} aria-hidden>
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => go(entry)}
            className={cn(
              cellBase,
              "border",
              entry === page
                ? "border-stroke-soft bg-bg-soft font-medium text-text-900"
                : "border-stroke-soft text-text-500 hover:bg-bg-soft"
            )}
          >
            {entry}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => go(page + 1)}
        className={cn(cellBase, "border border-stroke-soft text-text-500 hover:bg-bg-soft")}
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
      {withEdges && (
        <button
          type="button"
          aria-label="Last page"
          disabled={page === pageCount}
          onClick={() => go(pageCount)}
          className={cn(cellBase, "border border-stroke-soft text-text-500 hover:bg-bg-soft")}
        >
          <ChevronsRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </nav>
  );
}
