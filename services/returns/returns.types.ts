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

/** Whether the approved refund has actually moved money yet. */
export type SettlementStatus = "settled" | "unsettled";

export const SETTLEMENT_LABEL: Record<SettlementStatus, string> = {
  settled: "Settled",
  unsettled: "Unsettled",
};

export interface ReturnItem {
  /** Display form: "#RAD10010". */
  id: string;
  name: string;
  image_url: string | null;
  quantity: number;
}

export interface ReturnCustomer {
  id: string;
  name: string;
  avatar_url: string | null;
  email: string;
  phone: string;
}

/** The right rail's "Order details" block — the order this return came from. */
export interface ReturnOrderSummary {
  /** Display form: "#RD8345". */
  id: string;
  placed_at: string;
  /** Naira, whole units. */
  total_amount: number;
  total: number;
}

export interface ReturnPayment {
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
}

export interface ReturnDetail extends ReturnRequest {
  /** Display form: "#ARTHYOE" — the order's public reference. */
  reference: string;
  settlement: SettlementStatus;
  /** The store the order was placed with. */
  store: string;
  item: ReturnItem;
  /** The shopper's own words. Long enough that the card clamps it. */
  reason_detail: string;
  /** Photos the shopper attached to the request. */
  media: string[];
  order: ReturnOrderSummary;
  customer: ReturnCustomer;
  payment: ReturnPayment;
}

/** POST body for both decisions — the note is the admin's optional reason. */
export interface ReturnDecisionBody {
  note?: string;
}

