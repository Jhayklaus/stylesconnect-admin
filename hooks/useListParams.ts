"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface UseListParamsOptions {
  perPage?: number;
  tab?: string;
  /** Extra filter keys to read from / write to the query string. */
  filterKeys?: string[];
}

/**
 * Keeps list state in the URL so tables are shareable and the back button
 * behaves. It also gives each screen a single object to feed the React Query
 * key, instead of a pile of useStates.
 *
 * Callers must sit under a <Suspense> boundary — useSearchParams opts the
 * route out of static prerendering otherwise, which fails `next build`.
 */
export function useListParams({ perPage = 7, tab = "all", filterKeys = [] }: UseListParamsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hoisted so the dependency list stays a list of simple expressions.
  const filterKey = filterKeys.join(",");

  const state = useMemo(() => {
    const filters: Record<string, string> = {};
    for (const key of filterKey ? filterKey.split(",") : []) {
      filters[key] = searchParams.get(key) ?? "all";
    }
    return {
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || perPage,
      q: searchParams.get("q") ?? "",
      tab: searchParams.get("tab") ?? tab,
      filters,
    };
  }, [searchParams, perPage, tab, filterKey]);

  const write = useCallback(
    (patch: Record<string, string | number | undefined>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());
      if (resetPage) next.delete("page");

      for (const [key, value] of Object.entries(patch)) {
        // Defaults stay out of the URL so shared links are readable.
        if (value === undefined || value === "" || value === "all") next.delete(key);
        else next.set(key, String(value));
      }

      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return {
    ...state,
    setPage: (page: number) => write({ page: page > 1 ? page : undefined }, false),
    setPerPage: (n: number) => write({ perPage: n === perPage ? undefined : n }),
    setQuery: (q: string) => write({ q }),
    setTab: (t: string) => write({ tab: t === tab ? undefined : t }),
    setFilter: (key: string, value: string) => write({ [key]: value }),
  };
}
