import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchOrders, orderKeys, type Order, type OrderListParams } from "@/services/orders";
import type { ApiError, Paginated } from "@/services/types";

export function useOrders(params: OrderListParams) {
  return useQuery<Paginated<Order>, ApiError>({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    placeholderData: keepPreviousData,
  });
}
