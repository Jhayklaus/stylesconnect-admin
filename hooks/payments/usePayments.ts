import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchPaymentDetail,
  fetchPayments,
  paymentKeys,
  type Payment,
  type PaymentDetail,
  type PaymentListParams,
} from "@/services/payments";
import type { ApiError, Paginated } from "@/services/types";

export function usePayments(params: PaymentListParams) {
  return useQuery<Paginated<Payment>, ApiError>({
    queryKey: paymentKeys.list(params),
    queryFn: () => fetchPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function usePaymentDetail(id: string | null) {
  return useQuery<PaymentDetail, ApiError>({
    queryKey: paymentKeys.detail(id ?? ""),
    queryFn: () => fetchPaymentDetail(id!),
    // Only runs once a row has been picked; the drawer mounts closed.
    enabled: Boolean(id),
  });
}
