import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import type { Order } from "../orders/orders.types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import {
  MOCK_SHOPPERS,
  MOCK_SHOPPER_STATS,
  mockShopperActivity,
  mockShopperDetail,
  mockShopperOrders,
} from "./shoppers.mock";
import type {
  Shopper,
  ShopperActivity,
  ShopperDetail,
  ShopperListParams,
  ShopperStats,
  ShopperSubListParams,
} from "./shoppers.types";

const SORTS: Record<string, (a: Shopper, b: Shopper) => number> = {
  name_asc: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
  spend_desc: (a, b) => b.total_spend - a.total_spend,
  recent: (a, b) => +new Date(b.last_order_at ?? 0) - +new Date(a.last_order_at ?? 0),
};

/** GET /admin/shoppers */
export async function fetchShoppers(
  params: ShopperListParams = {}
): Promise<Paginated<Shopper>> {
  if (MOCKS.shoppers) {
    await delay();
    let rows = MOCK_SHOPPERS;
    rows = applySearch(rows, params.q, ["name", "email"]);
    rows = applyFilter(rows, params.status, (s) => s.status);
    if (params.segment === "returning") rows = rows.filter((s) => s.order_count > 1);
    if (params.segment === "new") rows = rows.filter((s) => s.order_count <= 1);

    if (params.spend === "under_50m") rows = rows.filter((s) => s.total_spend < 50_000_000);
    if (params.spend === "50m_150m")
      rows = rows.filter((s) => s.total_spend >= 50_000_000 && s.total_spend <= 150_000_000);
    if (params.spend === "over_150m") rows = rows.filter((s) => s.total_spend > 150_000_000);
    rows = applySort(rows, params.sort, SORTS);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Shopper>>("/admin/shoppers", { params });
  return data;
}

/** GET /admin/shoppers/stats */
export async function fetchShopperStats(): Promise<ShopperStats> {
  if (MOCKS.shoppers) {
    await delay(200);
    return MOCK_SHOPPER_STATS;
  }

  const { data } = await apiClient.get<ApiEnvelope<ShopperStats>>("/admin/shoppers/stats");
  return data.data;
}

/** GET /admin/shoppers/:id */
export async function fetchShopper(id: string): Promise<ShopperDetail> {
  if (MOCKS.shoppers) {
    await delay();
    const detail = mockShopperDetail(id);
    if (!detail) {
      throw new ApiError({ message: "Shopper not found", status: 404 });
    }
    return detail;
  }

  const { data } = await apiClient.get<ApiEnvelope<ShopperDetail>>(`/admin/shoppers/${id}`);
  return data.data;
}

/** GET /admin/shoppers/:id/orders */
export async function fetchShopperOrders(
  id: string,
  params: ShopperSubListParams = {}
): Promise<Paginated<Order>> {
  if (MOCKS.shoppers) {
    await delay();
    let rows = mockShopperOrders(id);
    rows = applySearch(rows, params.q, ["order_id"]);
    rows = applyFilter(rows, params.status, (o) => o.payment_status);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Order>>(`/admin/shoppers/${id}/orders`, {
    params,
  });
  return data;
}

/** GET /admin/shoppers/:id/activity */
export async function fetchShopperActivity(id: string): Promise<ShopperActivity[]> {
  if (MOCKS.shoppers) {
    await delay();
    return mockShopperActivity(id);
  }

  const { data } = await apiClient.get<ApiEnvelope<ShopperActivity[]>>(
    `/admin/shoppers/${id}/activity`
  );
  return data.data;
}
