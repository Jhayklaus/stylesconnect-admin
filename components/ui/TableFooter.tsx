"use client";

import { FilterDropdown } from "./FilterDropdown";
import { Pagination } from "./Pagination";
import { cn } from "@/lib/utils";

export interface TableFooterProps {
  page: number;
  pageCount: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  className?: string;
}

export function TableFooter({
  page,
  pageCount,
  perPage,
  perPageOptions = [7, 10, 25, 50],
  onPageChange,
  onPerPageChange,
  className,
}: TableFooterProps) {
  return (
    // Three equal-ish tracks so the pagination stays optically centred
    // regardless of how wide the side labels get.
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-1 pt-5",
        className
      )}
    >
      <p className="justify-self-start font-jost text-sm leading-5 text-text-500">
        Page {page} of {pageCount}
      </p>
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={onPageChange}
        className="justify-self-center"
      />
      <FilterDropdown
        label={`${perPage} / page`}
        options={perPageOptions.map((n) => ({ value: String(n), label: `${n} / page` }))}
        value={String(perPage)}
        onChange={(v) => onPerPageChange(Number(v))}
        className="justify-self-end"
      />
    </div>
  );
}
