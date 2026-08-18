import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchListings,
  listingKeys,
  type Listing,
  type ListingListParams,
} from "@/services/listings";
import type { ApiError, Paginated } from "@/services/types";

export function useListings(params: ListingListParams) {
  return useQuery<Paginated<Listing>, ApiError>({
    queryKey: listingKeys.list(params),
    queryFn: () => fetchListings(params),
    placeholderData: keepPreviousData,
  });
}
