import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchPayments,
  paymentKeys,
  type Payment,
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
