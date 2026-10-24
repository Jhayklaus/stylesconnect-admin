import { apiClient } from "../client";
import { ApiError, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_RETURNS, MOCK_RETURN_DETAILS } from "./returns.mock";
import type {
  ReturnDecisionBody,
  ReturnDetail,
  ReturnListParams,
  ReturnRequest,
} from "./returns.types";

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

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<ReturnRequest>>("/admin/orders/returns", {
    params,
  });
  return data;
}

/** GET /admin/orders/returns/{id} */
export async function fetchReturn(id: string): Promise<ReturnDetail> {
  if (MOCKS.returns) {
    await delay();
    const found = MOCK_RETURN_DETAILS.find((r) => r.id === id);
    if (!found) throw new ApiError({ message: "Return request not found", status: 404 });
    return found;
  }

  const { data } = await apiClient.get<ReturnDetail>(`/admin/orders/returns/${id}`);
  return data;
}

/** POST /admin/orders/returns/{id}/approve */
export async function approveReturn(
  id: string,
  body: ReturnDecisionBody = {}
): Promise<ReturnDetail> {
  return decide(id, "approve", body);
}

/** POST /admin/orders/returns/{id}/reject */
export async function rejectReturn(
  id: string,
  body: ReturnDecisionBody = {}
): Promise<ReturnDetail> {
  return decide(id, "reject", body);
}

async function decide(
  id: string,
  action: "approve" | "reject",
  body: ReturnDecisionBody
): Promise<ReturnDetail> {
  if (MOCKS.returns) {
    await delay();
    const detail = MOCK_RETURN_DETAILS.find((r) => r.id === id);
    if (!detail) throw new ApiError({ message: "Return request not found", status: 404 });

    // Write the decision back into the fixtures so the list behind the modal
    // agrees with it after the refetch. A real endpoint persists server-side
    // and this whole branch goes away with the fixture file.
    //
    // Replace the array slots rather than mutating the objects: React Query's
    // cache holds these very references, so an in-place edit changes the cached
    // data too, structural sharing sees no difference, and the table never
    // re-renders. New objects give it something to detect.
    const status = action === "approve" ? "approved" : "rejected";

    const detailIndex = MOCK_RETURN_DETAILS.indexOf(detail);
    const updated: ReturnDetail = { ...detail, status };
    MOCK_RETURN_DETAILS[detailIndex] = updated;

    const rowIndex = MOCK_RETURNS.findIndex((r) => r.id === id);
    if (rowIndex !== -1) {
      MOCK_RETURNS[rowIndex] = { ...MOCK_RETURNS[rowIndex], status };
    }

    return updated;
  }

  const { data } = await apiClient.post<ReturnDetail>(
    `/admin/orders/returns/${id}/${action}`,
    body
  );
  return data;
}
