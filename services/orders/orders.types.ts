export type PaymentStatus = "paid" | "cancelled" | "failed" | "pending";
export type FulfillmentStatus = "fulfilled" | "unfulfilled" | "refunded";

export interface OrderCustomer {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface Order {
  id: string;
  /** Display form: "#178A4D41". */
  order_id: string;
  ordered_at: string;
  /** Promised delivery window, shown in the Due date/Timeline column. */
  timeline: string | null;
  estimated_delivery_at: string | null;
  quantity: number;
  /** Naira, delivery included. */
  total: number;
  /** The order's lifecycle status — "pending", "confirmed", "cancelled", … */
  status: string;
  payment_status: PaymentStatus;
  /** Absent when there's no secondary state to show. */
  fulfillment_status: FulfillmentStatus | null;
  customer: OrderCustomer;
}

export interface OrderDetail extends Order {
  customer: OrderCustomer & {
    email: string;
    phone: string | null;
    address: string | null;
  };
  /** Null when the gateway didn't report one. */
  payment_method: string | null;
  shipping_address: string | null;
  notes: string | null;
  /** Every line on the order; `product` is the first. */
  items: OrderItem[];
  /** The payment gateway's reference: "chk_eXLdQtOyJvjs4P88". */
  reference: string | null;
  /** The store the order was placed with. */
  store: string;
  /** The payment's uuid — opens it on the Payments screen. */
  payment_id: string | null;
  stage: OrderStage;
  product: OrderItem;
  shipping: OrderShipping;
  /** Naira. `total` on Order is the grand total. */
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  tax_amount: number;
  cancel_reason: string | null;
  can_cancel_and_refund: boolean;
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

/** One custom-fit number: { type: "chest", measurement: "70" }. Unitless as sent. */
export interface OrderMeasurement {
  /** Free-form body part — "chest", "waist", "shoulder", "length", … */
  type: string;
  measurement: string;
}

export interface OrderItem {
  id: string;
  /** `title` and `name` carry the same value; the API sends both. */
  title: string;
  name: string;
  listing_id: string;
  image_url: string | null;
  store: string;
  color: string | null;
  size: string | null;
  /** Custom-fit numbers, in the order the shopper entered them. Null for standard sizes. */
  measurements: OrderMeasurement[] | null;
  quantity: number;
  unit_price: number;
  total: number;
}

/** Every field is null until the order is handed to a courier. */
export interface OrderShipping {
  tracking_id: string | null;
  tracking_url: string | null;
  carrier: string | null;
  status: string | null;
  origin: string | null;
  destination: string | null;
}

export interface OrderTimelineEntry {
  id: string;
  title: string;
  description: string;
  /** The stage this entry marks: "confirmed", "delivered", … */
  status: string;
  /** Null for steps that haven't happened yet. */
  created_at: string | null;
  /** "pending" renders the hollow spinner, "done" the green check. */
  state: "pending" | "done";
}
