import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchShopperStats,
  fetchShoppers,
  shopperKeys,
  type Shopper,
  type ShopperListParams,
  type ShopperStats,
} from "@/services/shoppers";
import type { ApiError, Paginated } from "@/services/types";

export function useShoppers(params: ShopperListParams) {
  return useQuery<Paginated<Shopper>, ApiError>({
    queryKey: shopperKeys.list(params),
    queryFn: () => fetchShoppers(params),
    placeholderData: keepPreviousData,
  });
}

export function useShopperStats() {
  return useQuery<ShopperStats, ApiError>({
    queryKey: shopperKeys.stats(),
    queryFn: fetchShopperStats,
  });
}
