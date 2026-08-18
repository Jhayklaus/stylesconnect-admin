"use client";

import { AlertCircle } from "lucide-react";
import { Checkbox } from "../Checkbox";
import { EmptyState } from "../EmptyState";
import { Skeleton } from "../Skeleton";
import { cn } from "@/lib/utils";
import type { Column, DataTableProps } from "./DataTable.types";

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

function cellAlign<T>(col: Column<T>) {
  return alignClass[col.align ?? "left"];
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  error,
  skeletonRows = 7,
  empty,
  selection,
  onRowClick,
  footer,
  className,
}: DataTableProps<T>) {
  const pageIds = (rows ?? []).map(rowKey);
  const selectedOnPage = pageIds.filter((id) => selection?.selectedIds.includes(id));
  const allSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  function toggleAll() {
    if (!selection) return;
    const others = selection.selectedIds.filter((id) => !pageIds.includes(id));
    selection.onChange(allSelected ? others : [...others, ...pageIds]);
  }

  function toggleRow(id: string) {
    if (!selection) return;
    selection.onChange(
      selection.selectedIds.includes(id)
        ? selection.selectedIds.filter((x) => x !== id)
        : [...selection.selectedIds, id]
    );
  }

  const colSpan = columns.length + (selection ? 1 : 0);
  const showBody = !isLoading && !error && (rows?.length ?? 0) > 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Designs are desktop-only; keep wide tables scrolling inside their own
          container rather than breaking the page layout. */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {selection && (
                <th
                  scope="col"
                  className="w-12 rounded-l-xl bg-bg-soft py-3 pl-5 pr-2 text-left align-middle"
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows on this page"
                  />
                </th>
              )}
              {columns.map((col, i) => (
                <th
                  key={col.id}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap bg-bg-soft px-4 py-3.5 font-jost text-sm font-normal leading-5 text-text-500",
                    cellAlign(col),
                    col.width,
                    !selection && i === 0 && "rounded-l-xl pl-5",
                    i === columns.length - 1 && "rounded-r-xl pr-5",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading &&
              Array.from({ length: skeletonRows }).map((_, r) => (
                <tr key={`skeleton-${r}`}>
                  {selection && (
                    <td className="border-b border-stroke-soft py-4 pl-5 pr-2">
                      <Skeleton className="h-[18px] w-[18px] rounded-[5px]" />
                    </td>
                  )}
                  {columns.map((col, i) => (
                    <td
                      key={col.id}
                      className={cn(
                        "border-b border-stroke-soft px-4 py-4",
                        !selection && i === 0 && "pl-5",
                        i === columns.length - 1 && "pr-5"
                      )}
                    >
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </td>
                  ))}
                </tr>
              ))}

            {showBody &&
              rows!.map((row, index) => {
                const id = rowKey(row);
                const selected = selection?.selectedIds.includes(id) ?? false;
                return (
                  <tr
                    key={id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    className={cn(
                      "transition-colors",
                      onRowClick && "cursor-pointer hover:bg-beige-lighter",
                      selected && "bg-beige-lighter"
                    )}
                  >
                    {selection && (
                      <td
                        className="border-b border-stroke-soft py-4 pl-5 pr-2 align-middle"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selected}
                          onChange={() => toggleRow(id)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col, i) => (
                      <td
                        key={col.id}
                        className={cn(
                          "border-b border-stroke-soft px-4 py-4 align-middle",
                          "font-jost text-sm leading-5 text-text-900",
                          cellAlign(col),
                          !selection && i === 0 && "pl-5",
                          i === columns.length - 1 && "pr-5",
                          col.cellClassName
                        )}
                      >
                        {col.cell(row, index)}
                      </td>
                    ))}
                  </tr>
                );
              })}

            {error && (
              <tr>
                <td colSpan={colSpan}>
                  <EmptyState
                    icon={<AlertCircle className="h-5 w-5" aria-hidden />}
                    title="Couldn't load this list"
                    description={error.message}
                  />
                </td>
              </tr>
            )}

            {!isLoading && !error && (rows?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={colSpan}>
                  {empty ?? (
                    <EmptyState
                      title="Nothing to show"
                      description="Try adjusting your search or filters."
                    />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {footer}
    </div>
  );
}
