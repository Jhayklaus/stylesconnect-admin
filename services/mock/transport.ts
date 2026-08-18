import type { Paginated, PaginationMeta } from "../types";

/** Artificial latency so loading states are actually exercised in development. */
export function delay(ms = 320): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildLinkLabels(current: number, lastPage: number) {
  const labels: PaginationMeta["links"] = [
    { url: current > 1 ? `?page=${current - 1}` : null, label: "&laquo; Previous", active: false },
  ];
  for (let page = 1; page <= lastPage; page++) {
    labels.push({ url: `?page=${page}`, label: String(page), active: page === current });
  }
  labels.push({
    url: current < lastPage ? `?page=${current + 1}` : null,
    label: "Next &raquo;",
    active: false,
  });
  return labels;
}

/**
 * Wraps an in-memory array in the exact Laravel-shaped `Paginated<T>` the
 * backend returns, so consumers never learn they're reading fixtures.
 */
export function mockPaginate<T>(
  rows: T[],
  page = 1,
  perPage = 7,
  path = "/mock"
): Paginated<T> {
  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), lastPage);
  const start = (current - 1) * perPage;
  const slice = rows.slice(start, start + perPage);

  return {
    data: slice,
    links: {
      first: `${path}?page=1`,
      last: `${path}?page=${lastPage}`,
      prev: current > 1 ? `${path}?page=${current - 1}` : null,
      next: current < lastPage ? `${path}?page=${current + 1}` : null,
    },
    meta: {
      current_page: current,
      from: slice.length ? start + 1 : null,
      last_page: lastPage,
      links: buildLinkLabels(current, lastPage),
      path,
      per_page: perPage,
      to: slice.length ? start + slice.length : null,
      total,
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
