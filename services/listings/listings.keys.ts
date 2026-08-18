import type { ListingListParams } from "./listings.types";

export const listingKeys = {
  all: ["listings"] as const,
  lists: () => [...listingKeys.all, "list"] as const,
  list: (params: ListingListParams) => [...listingKeys.lists(), params] as const,
  orders: (id: string, params: unknown) =>
    [...listingKeys.all, "detail", id, "orders", params] as const,
  detail: (id: string) => [...listingKeys.all, "detail", id] as const,
};
