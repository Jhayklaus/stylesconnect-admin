export type PaymentStatus = "paid" | "cancelled" | "failed" | "pending";
export type FulfillmentStatus = "fulfilled" | "unfulfilled" | "refunded";

export interface OrderCustomer {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface OrderItem {
  id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: string;
  order_id: string;
  ordered_at: string;
  /** Promised delivery window, shown in the Due date/Timeline column. */
  timeline: string;
  quantity: number;
  /** Naira, whole units. */
  total: number;
  payment_status: PaymentStatus;
  /** Absent when there's no secondary state to show. */
  fulfillment_status: FulfillmentStatus | null;
  customer: OrderCustomer;
}

export interface OrderDetail extends Order {
  customer: OrderCustomer & {
    email: string;
    phone: string;
    address: string;
  };
  payment_method: string;
  shipping_address: string;
  notes: string | null;
  items: OrderItem[];
  prev_id: string | null;
  next_id: string | null;
}

export interface OrderListParams {
  page?: number;
  per_page?: number;
  q?: string;
  /** The tab: all | unfulfilled | paid. */
  view?: "all" | "unfulfilled" | "paid";
  period?: "all" | "7d" | "30d" | "90d";
  fulfillment?: FulfillmentStatus | "all";
  payment_status?: PaymentStatus | "all";
}
