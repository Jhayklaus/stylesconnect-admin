import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_REFUNDS, MOCK_REFUND_STATS } from "./refunds.mock";
import type { Refund, RefundListParams, RefundStats } from "./refunds.types";

const PERIOD_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

/** GET /admin/transactions/refunds */
export async function fetchRefunds(params: RefundListParams = {}): Promise<Paginated<Refund>> {
  if (MOCKS.refunds) {
    await delay();
    let rows = MOCK_REFUNDS;

    // "Pending" covers everything still in flight, which is how an operator
    // reads the tab — a queued and an in-flight refund both need watching.
    if (params.view === "pending") {
      rows = rows.filter((r) => r.status === "pending" || r.status === "processing");
    }
    if (params.view === "completed") rows = rows.filter((r) => r.status === "completed");
    if (params.view === "failed") {
      rows = rows.filter((r) => r.status === "failed" || r.status === "rejected");
    }

    rows = applySearch(rows, params.q, ["refund_id", "transaction_id", "reason"]);
    rows = applyFilter(rows, params.source, (r) => r.source);
    rows = applyFilter(rows, params.destination, (r) => r.destination);

    const days = params.period ? PERIOD_DAYS[params.period] : undefined;
    if (days) {
      const cutoff = Date.now() - days * 86_400_000;
      rows = rows.filter((r) => +new Date(r.requested_at) >= cutoff);
    }

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Refund>>("/admin/transactions/refunds", {
    params,
  });
  return data;
}

/** GET /admin/transactions/refunds/stats */
export async function fetchRefundStats(): Promise<RefundStats> {
  if (MOCKS.refunds) {
    await delay(200);
    return MOCK_REFUND_STATS;
  }

  const { data } = await apiClient.get<ApiEnvelope<RefundStats>>(
    "/admin/transactions/refunds/stats"
  );
  return data.data;
}

/** GET /admin/transactions/refunds/:id */
export async function fetchRefund(id: string): Promise<Refund> {
  if (MOCKS.refunds) {
    await delay();
    const refund = MOCK_REFUNDS.find((r) => r.id === id);
    if (!refund) throw new ApiError({ message: "Refund not found", status: 404 });
    return refund;
  }

  const { data } = await apiClient.get<ApiEnvelope<Refund>>(`/admin/transactions/refunds/${id}`);
  return data.data;
}
