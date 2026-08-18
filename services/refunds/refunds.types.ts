/**
 * Money actually moving back to a customer.
 *
 * Distinct from `services/returns`, which is the *request* to send goods back:
 * a return can be approved without a refund having settled, and a refund can
 * exist without a return (a duplicate charge, a cancelled subscription).
 */
export type RefundStatus = "pending" | "processing" | "completed" | "failed" | "rejected";

/** Where the money lands. */
export type RefundDestination = "original_method" | "bank_transfer" | "wallet_credit";

/** What was charged in the first place. */
export type RefundSource = "order" | "subscription";

export interface RefundCustomer {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface Refund {
  id: string;
  /** Display form: "#RF-8K2QP1". */
  refund_id: string;
  /** The payment being reversed — matches a row on the Payments tab. */
  transaction_id: string;
  source: RefundSource;
  customer: RefundCustomer;
  reason: string;
  /** Naira, whole units. */
  amount: number;
  destination: RefundDestination;
  status: RefundStatus;
  requested_at: string;
  /** Null until the refund settles or fails. */
  processed_at: string | null;
}

export interface RefundListParams {
  page?: number;
  per_page?: number;
  q?: string;
  /** The tab: all | pending | completed | failed. */
  view?: "all" | "pending" | "completed" | "failed";
  source?: RefundSource | "all";
  destination?: RefundDestination | "all";
  period?: "all" | "7d" | "30d" | "90d";
}

/** The cards above the table. */
export interface RefundStats {
  /** Settled refunds only. */
  total_refunded: number;
  pending_count: number;
  pending_amount: number;
  failed_count: number;
}

export const REFUND_DESTINATION_LABEL: Record<RefundDestination, string> = {
  original_method: "Original method",
  bank_transfer: "Bank transfer",
  wallet_credit: "Wallet credit",
};

export const REFUND_SOURCE_LABEL: Record<RefundSource, string> = {
  order: "Order",
  subscription: "Subscription",
};
