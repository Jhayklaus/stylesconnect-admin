import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchListing,
  fetchListingOrders,
  listingKeys,
  type ListingDetail,
  type ListingOrderRow,
} from "@/services/listings";
import type { ApiError, Paginated } from "@/services/types";

export function useListing(id: string) {
  return useQuery<ListingDetail, ApiError>({
    queryKey: listingKeys.detail(id),
    queryFn: () => fetchListing(id),
  });
}

export function useListingOrders(
  id: string,
  params: { page?: number; per_page?: number; q?: string; status?: string }
) {
  return useQuery<Paginated<ListingOrderRow>, ApiError>({
    queryKey: listingKeys.orders(id, params),
    queryFn: () => fetchListingOrders(id, params),
    placeholderData: keepPreviousData,
  });
}
