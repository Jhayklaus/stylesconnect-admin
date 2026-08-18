import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  designerKeys,
  fetchDesignerStats,
  fetchDesigners,
  type Designer,
  type DesignerListParams,
  type DesignerStats,
} from "@/services/designers";
import type { ApiError, Paginated } from "@/services/types";

export function useDesigners(params: DesignerListParams) {
  return useQuery<Paginated<Designer>, ApiError>({
    queryKey: designerKeys.list(params),
    queryFn: () => fetchDesigners(params),
    // Keeps the previous page on screen while the next one loads, so paging
    // and filtering don't flash an empty table.
    placeholderData: keepPreviousData,
  });
}

export function useDesignerStats() {
  return useQuery<DesignerStats, ApiError>({
    queryKey: designerKeys.stats(),
    queryFn: fetchDesignerStats,
  });
}
