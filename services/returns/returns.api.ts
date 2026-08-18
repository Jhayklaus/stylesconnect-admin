import { apiClient } from "../client";
import type { Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_RETURNS } from "./returns.mock";
import type { ReturnListParams, ReturnRequest } from "./returns.types";

const PERIOD_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

/** GET /admin/orders/returns */
export async function fetchReturns(
  params: ReturnListParams = {}
): Promise<Paginated<ReturnRequest>> {
  if (MOCKS.returns) {
    await delay();
    let rows = MOCK_RETURNS;

    if (params.view && params.view !== "all") {
      rows = rows.filter((r) => r.status === params.view);
    }

    rows = applySearch(rows, params.q, ["order_id", "reason"]);
    rows = applyFilter(rows, params.status, (r) => r.status);
    rows = applyFilter(rows, params.refund_type, (r) => r.refund_type);

    const days = params.period ? PERIOD_DAYS[params.period] : undefined;
    if (days) {
      const cutoff = Date.now() - days * 86_400_000;
      rows = rows.filter((r) => +new Date(r.requested_at) >= cutoff);
    }

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, "/admin/orders/returns");
  }

  const { data } = await apiClient.get<Paginated<ReturnRequest>>("/admin/orders/returns", {
    params,
  });
  return data;
}
