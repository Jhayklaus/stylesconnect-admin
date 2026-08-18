import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchReturns,
  returnKeys,
  type ReturnListParams,
  type ReturnRequest,
} from "@/services/returns";
import type { ApiError, Paginated } from "@/services/types";

export function useReturns(params: ReturnListParams) {
  return useQuery<Paginated<ReturnRequest>, ApiError>({
    queryKey: returnKeys.list(params),
    queryFn: () => fetchReturns(params),
    placeholderData: keepPreviousData,
  });
}
