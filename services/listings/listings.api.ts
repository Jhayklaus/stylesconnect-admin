import { apiClient } from "../client";
import type { Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import { MOCK_LISTINGS } from "./listings.mock";
import type { Listing, ListingListParams } from "./listings.types";

const SORTS: Record<string, (a: Listing, b: Listing) => number> = {
  recent: (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  price_desc: (a, b) => b.unit_price - a.unit_price,
  sold_desc: (a, b) => b.total_sold - a.total_sold,
};

/** GET /admin/listings */
export async function fetchListings(
  params: ListingListParams = {}
): Promise<Paginated<Listing>> {
  if (MOCKS.listings) {
    await delay();
    let rows = MOCK_LISTINGS;
    if (params.review_state) rows = rows.filter((l) => l.review_state === params.review_state);
    rows = applySearch(rows, params.q, ["title", "product_id", "category"]);
    rows = applyFilter(rows, params.status, (l) => l.status);
    rows = applyFilter(rows, params.category, (l) => l.category);
    rows = applySort(rows, params.sort, SORTS);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, "/admin/listings");
  }

  const { data } = await apiClient.get<Paginated<Listing>>("/admin/listings", { params });
  return data;
}
