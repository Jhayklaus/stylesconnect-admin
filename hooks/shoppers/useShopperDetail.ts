import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchShopper,
  fetchShopperActivity,
  fetchShopperOrders,
  shopperKeys,
  type ShopperActivity,
  type ShopperDetail,
  type ShopperSubListParams,
} from "@/services/shoppers";
import type { Order } from "@/services/orders";
import type { ApiError, Paginated } from "@/services/types";

export function useShopper(id: string) {
  return useQuery<ShopperDetail, ApiError>({
    queryKey: shopperKeys.detail(id),
    queryFn: () => fetchShopper(id),
  });
}

export function useShopperOrders(id: string, params: ShopperSubListParams) {
  return useQuery<Paginated<Order>, ApiError>({
    queryKey: shopperKeys.orders(id, params),
    queryFn: () => fetchShopperOrders(id, params),
    placeholderData: keepPreviousData,
  });
}

export function useShopperActivity(id: string) {
  return useQuery<ShopperActivity[], ApiError>({
    queryKey: shopperKeys.activity(id),
    queryFn: () => fetchShopperActivity(id),
  });
}
