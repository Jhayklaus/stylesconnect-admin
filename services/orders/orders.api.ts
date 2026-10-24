import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_ORDERS, mockOrderDetail } from "./orders.mock";
import type { Order, OrderDetail, OrderListParams } from "./orders.types";

const PERIOD_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

/** GET /admin/orders */
export async function fetchOrders(params: OrderListParams = {}): Promise<Paginated<Order>> {
  if (MOCKS.orders) {
    await delay();
    let rows = MOCK_ORDERS;

    if (params.view === "paid") rows = rows.filter((o) => o.payment_status === "paid");
    if (params.view === "unfulfilled")
      rows = rows.filter((o) => o.fulfillment_status === "unfulfilled");

    rows = applySearch(rows, params.q, ["order_id"]);
    rows = applyFilter(rows, params.payment_status, (o) => o.payment_status);
    rows = applyFilter(rows, params.fulfillment, (o) => o.fulfillment_status ?? "");

    const days = params.period ? PERIOD_DAYS[params.period] : undefined;
    if (days) {
      const cutoff = Date.now() - days * 86_400_000;
      rows = rows.filter((o) => +new Date(o.ordered_at) >= cutoff);
    }

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Order>>("/admin/orders", { params });
  return data;
}

/** GET /admin/orders/:id */
export async function fetchOrder(id: string): Promise<OrderDetail> {
  if (MOCKS.orders) {
    await delay();
    const detail = mockOrderDetail(id);
    if (!detail) {
      throw new ApiError({ message: "Order not found", status: 404 });
    }
    return detail;
  }

  const { data } = await apiClient.get<ApiEnvelope<OrderDetail>>(`/admin/orders/${id}`);
  return data.data;
}
