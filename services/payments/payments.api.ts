import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_PAYMENTS, mockPaymentDetail } from "./payments.mock";
import type { Payment, PaymentDetail, PaymentListParams } from "./payments.types";

const PERIOD_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

/** GET /admin/transactions/payments */
export async function fetchPayments(
  params: PaymentListParams = {}
): Promise<Paginated<Payment>> {
  if (MOCKS.payments) {
    await delay();
    let rows = MOCK_PAYMENTS;

    if (params.view && params.view !== "all") {
      rows = rows.filter((p) => p.kind === params.view);
    }

    rows = applySearch(rows, params.q, ["transaction_id"]);
    rows = applyFilter(rows, params.method, (p) => p.method);

    const days = params.period ? PERIOD_DAYS[params.period] : undefined;
    if (days) {
      const cutoff = Date.now() - days * 86_400_000;
      rows = rows.filter((p) => +new Date(p.paid_at) >= cutoff);
    }

    return mockPaginate(
      rows,
      params.page ?? 1,
      params.per_page ?? 7,
      "/admin/transactions/payments"
    );
  }

  const { data } = await apiClient.get<Paginated<Payment>>("/admin/transactions/payments", {
    params,
  });
  return data;
}

/** GET /admin/transactions/payments/:id */
export async function fetchPaymentDetail(id: string): Promise<PaymentDetail> {
  if (MOCKS.payments) {
    await delay();
    const detail = mockPaymentDetail(id);
    if (!detail) {
      throw new ApiError({ message: "Payment not found", status: 404 });
    }
    return detail;
  }

  const { data } = await apiClient.get<ApiEnvelope<PaymentDetail>>(
    `/admin/transactions/payments/${id}`
  );
  return data.data;
}
