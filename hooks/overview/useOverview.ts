import { useQuery } from "@tanstack/react-query";
import {
  fetchOverview,
  overviewKeys,
  type OverviewSummary,
  type RevenueRange,
} from "@/services/overview";
import type { ApiError } from "@/services/types";

export function useOverview(range: RevenueRange = "last_year") {
  return useQuery<OverviewSummary, ApiError>({
    queryKey: overviewKeys.summary(range),
    queryFn: () => fetchOverview(range),
  });
}
