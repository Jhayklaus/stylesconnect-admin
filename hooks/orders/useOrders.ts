import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchOrder,
  fetchOrders,
  orderKeys,
  type Order,
  type OrderDetail,
  type OrderListParams,
} from "@/services/orders";
import type { ApiError, Paginated } from "@/services/types";

export function useOrders(params: OrderListParams) {
  return useQuery<Paginated<Order>, ApiError>({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: string) {
  return useQuery<OrderDetail, ApiError>({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
  });
}
