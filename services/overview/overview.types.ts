export interface OverviewStats {
  total_orders: number;
  active_buyers: number;
  active_designers: number;
  pending_verification: number;
  total_orders_delta: number;
  active_buyers_delta: number;
  active_designers_delta: number;
  pending_verification_delta: number;
}

export interface RevenuePoint {
  month: string;
  purchase: number;
  subscription: number;
}

export interface RevenueSeries {
  /** Naira, whole units. */
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
  image_url: string;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
}

export interface OverviewSummary {
  stats: OverviewStats;
  revenue: RevenueSeries;
  tickets: RecentTicket[];
  transactions: RecentTransaction[];
  orders: RecentOrder[];
}

export type RevenueRange = "last_year" | "last_6_months" | "last_30_days";
