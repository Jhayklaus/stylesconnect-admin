export type PaymentMethod = "debit_card" | "bank_transfer";

/** What the payment was for — the "Description" column. */
export type PaymentKind = "order" | "subscription";

export interface PaymentCustomer {
  id: string;
  name: string;
  avatar_url: string | null;
  email: string;
}

export interface Payment {
  id: string;
  /** The payment gateway's reference: "chk_eXLdQtOyJvjs4P88". */
  transaction_id: string;
  kind: PaymentKind;
  /** Null when the gateway didn't report how the shopper paid. */
  method: PaymentMethod | null;
  /** Naira. */
  amount: number;
  paid_at: string;
  /** The order paid for; null for subscription payments. */
  order: { id: string; order_id: string } | null;
  customer: PaymentCustomer | null;
}

export interface PaymentListParams {
  page?: number;
  per_page?: number;
  q?: string;
  /** The tab: all | order | subscription. */
  view?: "all" | PaymentKind;
  method?: PaymentMethod | "all";
  period?: "all" | "7d" | "30d" | "90d";
}

/**
 * Method labels are sentence case in the designs ("Debit card", not "Debit
 * Card"), so `titleCase` can't produce them. Both the column and the filter
 * dropdown read from here.
 */
export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  debit_card: "Debit card",
  bank_transfer: "Bank transfer",
};

export const PAYMENT_KIND_LABEL: Record<PaymentKind, string> = {
  order: "Order",
  subscription: "Subscription",
};

export interface PaymentSubscription {
  plan: string;
  starts_at: string;
  ends_at: string;
}

/** GET /admin/transactions/payments/:id — the details drawer. */
export interface PaymentDetail extends Payment {
  /** Display form: "Mastercard •• 1038". Null when the gateway didn't send card details. */
  card_label: string | null;
  /** Null for one-off order payments — the drawer hides that section. */
  subscription: PaymentSubscription | null;
  /** The processor's own reference: "STX12349465". */
  transaction_ref: string | null;
  /** Which gateway processed it: "pandascrow". */
  gateway: string;
  description: string;
  fee: number;
  tax: number;
  /**
   * The amount before fee and tax. `amount` on Payment is what was charged,
   * so net + fee + tax === amount.
   */
  net: number;
}
