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
  /** Display form: "#ARTHYOE". */
  reference: string;
  /** The store the order was placed with. */
  store: string;
  /** Display form: "#RAD10010". */
  payment_id: string;
  estimated_delivery_at: string;
  stage: OrderStage;
  product: OrderProduct;
  shipping: OrderShipping;
  /** Naira, whole units. `total` on Order already covers the grand total. */
  shipping_fee: number;
  /**
   * Newest first, as the design stacks it. Named `events` because `timeline`
   * on Order is the promised delivery window ("2—3 weeks").
   */
  events: OrderTimelineEntry[];
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

/** The four steps of the delivery progress bar. */
export type OrderStage = "review" | "preparing" | "shipping" | "delivered";

export const ORDER_STAGES: { value: OrderStage; label: string }[] = [
  { value: "review", label: "Review order" },
  { value: "preparing", label: "Preparing order" },
  { value: "shipping", label: "Shipping" },
  { value: "delivered", label: "Delivered" },
];

export interface OrderMeasurements {
  chest: string;
  waist: string;
  length: string;
}

export interface OrderProduct {
  id: string;
  title: string;
  image_url: string;
  color: string;
  size: string;
  /** Custom-fit numbers, split by garment half. */
  measurements: { top: OrderMeasurements; bottom: OrderMeasurements };
}

export interface OrderShipping {
  tracking_id: string;
  carrier: string;
  origin: string;
  destination: string;
}

export interface OrderTimelineEntry {
  id: string;
  title: string;
  description: string;
  created_at: string;
  /** "pending" renders the hollow spinner, "done" the green check. */
  state: "pending" | "done";
}
