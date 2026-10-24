/** Deltas are null when there's no prior period to compare against. */
export interface OverviewStats {
  total_orders: number;
  active_buyers: number;
  active_designers: number;
  pending_verification: number;
  total_orders_delta: number | null;
  active_buyers_delta: number | null;
  active_designers_delta: number | null;
  pending_verification_delta: number | null;
}

export interface RevenuePoint {
  month: string;
  purchase: number;
  subscription: number;
}

export interface RevenueSeries {
  /** Naira. */
  total: number;
  points: RevenuePoint[];
}

export type TicketPriority = "low" | "medium" | "high";

export interface RecentTicket {
  id: string;
  reference: string;
  subject: string;
  created_at: string;
  priority: TicketPriority;
  resolved: boolean;
}

export interface RecentTransaction {
  id: string;
  /** The payment gateway's reference: "chk_eXLdQtOyJvjs4P88". */
  reference: string;
  customer_email: string;
  source: "Subscription" | "Order";
  created_at: string;
  amount: number;
}

export interface RecentOrder {
  id: string;
  order_id: string;
  category: string;
  quantity: number;
  image_url: string | null;
  /** The order's lifecycle status — "pending", "confirmed", "cancelled", … */
  status: string;
  created_at: string;
}

/** Platform money for the selected range. Naira, except the shipment count. */
export interface OverviewFinance {
  item_sales: number;
  commission_earned: number;
  commission_pending: number;
  first_order_commission_waived: number;
  vat_owed: number;
  vat_pending: number;
  delivery_fees_collected: number;
  courier_costs: number;
  delivery_margin: number;
  shipments_missing_cost: number;
  platform_income: number;
  refunds_issued: number;
}

export interface OverviewSummary {
  stats: OverviewStats;
  revenue: RevenueSeries;
  finance: OverviewFinance;
  /** Always empty until the tickets backend ships. */
  tickets: RecentTicket[];
  transactions: RecentTransaction[];
  orders: RecentOrder[];
}

export type RevenueRange = "last_year" | "last_6_months" | "last_30_days";
