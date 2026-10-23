import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import { MOCK_LISTINGS, mockListingDetail, mockListingOrders } from "./listings.mock";
import type {
  Listing,
  ListingDetail,
  ListingListParams,
  ListingOrderRow,
} from "./listings.types";

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
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Listing>>("/admin/listings", { params });
  return data;
}

/** GET /admin/listings/:id */
export async function fetchListing(id: string): Promise<ListingDetail> {
  if (MOCKS.listings) {
    await delay();
    const detail = mockListingDetail(id);
    if (!detail) {
      throw new ApiError({ message: "Listing not found", status: 404 });
    }
    return detail;
  }

  const { data } = await apiClient.get<ApiEnvelope<ListingDetail>>(`/admin/listings/${id}`);
  return data.data;
}

/** GET /admin/listings/:id/orders */
export async function fetchListingOrders(
  id: string,
  params: { page?: number; per_page?: number; q?: string; status?: string } = {}
): Promise<Paginated<ListingOrderRow>> {
  if (MOCKS.listings) {
    await delay();
    let rows = mockListingOrders(id);
    rows = applySearch(rows, params.q, ["order_id"]);
    rows = applyFilter(rows, params.status, (o) => o.status);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<ListingOrderRow>>(
    `/admin/listings/${id}/orders`,
    { params }
  );
  return data;
}

/** PATCH /admin/listings/:id/feature — flips `is_featured`. */
export async function toggleListingFeatured(id: string): Promise<void> {
  if (MOCKS.listings) {
    await delay();
    const listing = MOCK_LISTINGS.find((l) => l.id === id);
    if (!listing) throw new ApiError({ message: "Listing not found", status: 404 });
    listing.is_featured = !listing.is_featured;
    return;
  }

  await apiClient.patch(`/admin/listings/${id}/feature`);
}
