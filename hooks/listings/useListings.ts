import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchListings,
  listingKeys,
  toggleListingFeatured,
  type Listing,
  type ListingListParams,
} from "@/services/listings";
import { toast } from "@/lib/toast";
import type { ApiError, Paginated } from "@/services/types";

export function useListings(params: ListingListParams) {
  return useQuery<Paginated<Listing>, ApiError>({
    queryKey: listingKeys.list(params),
    queryFn: () => fetchListings(params),
    placeholderData: keepPreviousData,
  });
}

/** Flips a listing's featured flag; the caller passes the current value for the toast. */
export function useToggleListingFeatured() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { id: string; featured: boolean }>({
    mutationFn: ({ id }) => toggleListingFeatured(id),
    onSuccess: (_, { featured }) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      toast.success(featured ? "Listing unfeatured" : "Listing featured");
    },
    onError: (error) => toast.error(error.message),
  });
}
