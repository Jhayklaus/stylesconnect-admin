import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchRefund,
  fetchRefundStats,
  fetchRefunds,
  refundKeys,
  type Refund,
  type RefundListParams,
  type RefundStats,
} from "@/services/refunds";
import type { ApiError, Paginated } from "@/services/types";

export function useRefunds(params: RefundListParams) {
  return useQuery<Paginated<Refund>, ApiError>({
    queryKey: refundKeys.list(params),
    queryFn: () => fetchRefunds(params),
    placeholderData: keepPreviousData,
  });
}

export function useRefundStats() {
  return useQuery<RefundStats, ApiError>({
    queryKey: refundKeys.stats(),
    queryFn: fetchRefundStats,
  });
}

export function useRefund(id: string | null) {
  return useQuery<Refund, ApiError>({
    queryKey: refundKeys.detail(id ?? ""),
    queryFn: () => fetchRefund(id!),
    // Only runs once a row has been picked; the drawer mounts closed.
    enabled: Boolean(id),
  });
}
