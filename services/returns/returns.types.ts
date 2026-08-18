export type ReturnStatus = "pending" | "approved" | "rejected" | "refunded";
export type RefundType = "full" | "partial";

export interface ReturnRequest {
  id: string;
  /** Display form: "IKU—1045". */
  order_id: string;
  requested_at: string;
  /** Why the shopper sent it back — "Out of stock", "Wrong size", ... */
  reason: string;
  /** Naira, whole units. */
  refund_amount: number;
  status: ReturnStatus;
  refund_type: RefundType;
}

export interface ReturnListParams {
  page?: number;
  per_page?: number;
  q?: string;
  /** The tab: all | approved | rejected. */
  view?: "all" | "approved" | "rejected";
  status?: ReturnStatus | "all";
  refund_type?: RefundType | "all";
  period?: "all" | "7d" | "30d" | "90d";
}

export const REFUND_TYPE_LABEL: Record<RefundType, string> = {
  full: "Full refund",
  partial: "Partial refund",
};
