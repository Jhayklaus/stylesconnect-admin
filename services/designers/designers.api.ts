import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import type { Listing } from "../listings/listings.types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import {
  MOCK_DESIGNERS,
  MOCK_DESIGNER_STATS,
  mockDesignerDetail,
  mockDesignerListings,
  mockDesignerReviews,
  mockDesignerTransactions,
} from "./designers.mock";
import type {
  Designer,
  DesignerDetail,
  DesignerListParams,
  DesignerReviewItem,
  DesignerStats,
  DesignerSubListParams,
  DesignerTransaction,
} from "./designers.types";

const SORTS: Record<string, (a: Designer, b: Designer) => number> = {
  name_asc: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
  sales_desc: (a, b) => b.total_sales - a.total_sales,
  recent: (a, b) => +new Date(b.joined_at) - +new Date(a.joined_at),
};

/** GET /admin/designers */
export async function fetchDesigners(
  params: DesignerListParams = {}
): Promise<Paginated<Designer>> {
  if (MOCKS.designers) {
    await delay();
    let rows = MOCK_DESIGNERS;
    rows = applySearch(rows, params.q, ["name", "email"]);
    rows = applyFilter(rows, params.status, (d) => d.status);
    rows = applyFilter(rows, params.subscription, (d) => d.subscription);
    rows = applySort(rows, params.sort, SORTS);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, "/admin/designers");
  }

  const { data } = await apiClient.get<Paginated<Designer>>("/admin/designers", { params });
  return data;
}

/** GET /admin/designers/stats */
export async function fetchDesignerStats(): Promise<DesignerStats> {
  if (MOCKS.designers) {
    await delay(200);
    return MOCK_DESIGNER_STATS;
  }

  const { data } = await apiClient.get<ApiEnvelope<DesignerStats>>("/admin/designers/stats");
  return data.data;
}

/** GET /admin/designers/:id */
export async function fetchDesigner(id: string): Promise<DesignerDetail> {
  if (MOCKS.designers) {
    await delay();
    const detail = mockDesignerDetail(id);
    if (!detail) {
      throw new ApiError({ message: "Designer not found", status: 404 });
    }
    return detail;
  }

  const { data } = await apiClient.get<ApiEnvelope<DesignerDetail>>(`/admin/designers/${id}`);
  return data.data;
}

/** GET /admin/designers/:id/listings */
export async function fetchDesignerListings(
  id: string,
  params: DesignerSubListParams = {}
): Promise<Paginated<Listing>> {
  if (MOCKS.designers) {
    await delay();
    let rows = mockDesignerListings(id);
    rows = applySearch(rows, params.q, ["title"]);
    rows = applyFilter(rows, params.status, (l) => l.status);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, `/admin/designers/${id}/listings`);
  }

  const { data } = await apiClient.get<Paginated<Listing>>(`/admin/designers/${id}/listings`, {
    params,
  });
  return data;
}

/** GET /admin/designers/:id/transactions */
export async function fetchDesignerTransactions(
  id: string,
  params: DesignerSubListParams = {}
): Promise<Paginated<DesignerTransaction>> {
  if (MOCKS.designers) {
    await delay();
    let rows = mockDesignerTransactions(id);
    rows = applySearch(rows, params.q, ["reference", "payment_method"]);
    rows = applyFilter(rows, params.type, (t) => t.type);
    rows = applyFilter(rows, params.status, (t) => t.status);
    return mockPaginate(
      rows,
      params.page ?? 1,
      params.per_page ?? 7,
      `/admin/designers/${id}/transactions`
    );
  }

  const { data } = await apiClient.get<Paginated<DesignerTransaction>>(
    `/admin/designers/${id}/transactions`,
    { params }
  );
  return data;
}

/** GET /admin/designers/:id/reviews */
export async function fetchDesignerReviews(
  id: string,
  params: DesignerSubListParams = {}
): Promise<Paginated<DesignerReviewItem>> {
  if (MOCKS.designers) {
    await delay();
    let rows = mockDesignerReviews(id);
    rows = applySearch(rows, params.q, ["body", "reference"]);
    if (params.rating && params.rating !== "all") {
      rows = rows.filter((r) => r.rating === Number(params.rating));
    }
    return mockPaginate(
      rows,
      params.page ?? 1,
      params.per_page ?? 5,
      `/admin/designers/${id}/reviews`
    );
  }

  const { data } = await apiClient.get<Paginated<DesignerReviewItem>>(
    `/admin/designers/${id}/reviews`,
    { params }
  );
  return data;
}
