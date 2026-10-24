import type { Paginated } from "../types";

/** Artificial latency so loading states are actually exercised in development. */
export function delay(ms = 320): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps an in-memory array in the exact `Paginated<T>` the backend returns, so
 * consumers never learn they're reading fixtures.
 */
export function mockPaginate<T>(rows: T[], page = 1, perPage = 7): Paginated<T> {
  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), lastPage);
  const start = (current - 1) * perPage;
  const slice = rows.slice(start, start + perPage);

  return {
    data: slice,
    meta: {
      current_page: current,
      per_page: perPage,
      total,
      last_page: lastPage,
      from: slice.length ? start + 1 : null,
      to: slice.length ? start + slice.length : null,
    },
  };
}

/** Case-insensitive substring match across the given fields. */
export function applySearch<T>(rows: T[], q: string | undefined, fields: (keyof T)[]): T[] {
  const term = q?.trim().toLowerCase();
  if (!term) return rows;
  return rows.filter((row) =>
    fields.some((field) => String(row[field] ?? "").toLowerCase().includes(term))
  );
}

/** No-ops when the value is absent or the catch-all "all". */
export function applyFilter<T>(
  rows: T[],
  value: string | undefined,
  pick: (row: T) => string
): T[] {
  if (!value || value === "all") return rows;
  return rows.filter((row) => pick(row) === value);
}

export function applySort<T>(
  rows: T[],
  sort: string | undefined,
  comparators: Record<string, (a: T, b: T) => number>
): T[] {
  const comparator = sort ? comparators[sort] : undefined;
  return comparator ? [...rows].sort(comparator) : rows;
}
