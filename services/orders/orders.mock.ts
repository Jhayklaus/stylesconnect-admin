import { PEOPLE, daysAgo, intBetween, pick, productImage, seeded } from "../mock/seed";
import type {
  FulfillmentStatus,
  Order,
  OrderDetail,
  OrderTimelineEntry,
  PaymentStatus,
} from "./orders.types";

const TIMELINES = ["2—3 weeks", "1—2 weeks", "3—5 days", "4—6 weeks"];

export const MOCK_ORDERS: Order[] = Array.from({ length: 38 }, (_, i) => {
  const seed = `order-${i}`;
  const roll = seeded(seed);
  const payment_status: PaymentStatus =
    roll > 0.82 ? "cancelled" : roll > 0.68 ? "failed" : roll > 0.58 ? "pending" : "paid";

  // Cancelled and failed orders carry a refund; paid ones may be fulfilled.
  let fulfillment_status: FulfillmentStatus | null = null;
  if (payment_status === "cancelled" || payment_status === "failed") {
    fulfillment_status = seeded(`refund-${i}`) > 0.35 ? "refunded" : null;
  } else if (payment_status === "paid") {
    fulfillment_status = seeded(`fulfil-${i}`) > 0.5 ? "fulfilled" : "unfulfilled";
  }

  const customerName = PEOPLE[i % PEOPLE.length];

  return {
    id: `ORD-${String(4000 + i)}`,
    order_id: `IKU—${1000 + intBetween(10, 99, seed)}`,
    ordered_at: daysAgo(intBetween(1, 240, seed)),
    timeline: pick(TIMELINES, `timeline-${i}`),
    quantity: intBetween(1, 92, `qty-${i}`),
    total: intBetween(15, 250, `total-${i}`) * 1_000_000,
    payment_status,
    fulfillment_status,
    customer: {
      id: `SHP-${2000 + (i % PEOPLE.length)}`,
      name: customerName,
      avatar_url: null,
    },
  };
});

export function mockOrderDetail(id: string): OrderDetail | undefined {
  const base = MOCK_ORDERS.find((order) => order.id === id);
  if (!base) return undefined;

  const index = MOCK_ORDERS.findIndex((order) => order.id === id);
  const customerName = base.customer.name;
  const itemCount = Math.max(2, Math.min(5, intBetween(2, 5, `items-${id}`)));

  return {
    ...base,
    customer: {
      ...base.customer,
      email: `${customerName.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
      phone: `+234${intBetween(7_000_000_000, 9_099_999_999, `phone-${id}`)}`,
      address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    },
    reference: `#${["ARTHYOE", "RQMZ4TL", "KPD91XB", "WYT3NRA"][index % 4]}`,
    store: ["Pine & Peak", "Aso Atelier", "Lagos Linen Co."][index % 3],
    payment_id: `#RAD${String(10_000 + intBetween(10, 999, `payid-${id}`))}`,
    estimated_delivery_at: daysAgo(-intBetween(2, 21, `eta-${id}`)),
    stage: (["review", "preparing", "shipping", "delivered"] as const)[
      intBetween(0, 3, `stage-${id}`)
    ],
    product: {
      id: `${id}-product`,
      title: "White Linen embroiled t-shirt",
      image_url: productImage(index),
      color: ["Black", "White", "Indigo"][index % 3],
      size: ["Small", "Medium", "Large", "XLarge"][index % 4],
      measurements: {
        top: { chest: "24Cm", waist: "240Cm", length: "240Cm" },
        bottom: { chest: "24Cm", waist: "240Cm", length: "240Cm" },
      },
    },
    shipping: {
      tracking_id: `TMHJWYRAD${String(10_000 + intBetween(10, 999, `track-${id}`))}`,
      carrier: "FedEx",
      origin: "Plot 2, 14 Ikeji street, Arewa estate, Ilupeju, Lagos",
      destination: "12 Admiralty Way, Lekki Phase 1, Lagos",
    },
    shipping_fee: intBetween(5, 25, `shipfee-${id}`) * 100_000,
    events: orderTimeline(id),
    payment_method: "Bank transfer",
    shipping_address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    notes: "Please package with care and include the garment bag.",
    items: Array.from({ length: itemCount }, (_, i) => ({
      id: `${id}-item-${i}`,
      name: ["White Linen Shirt", "Aso-oke Wrap Dress", "Linen Blazer", "Structured Tote"][i % 4],
      image_url: null,
      quantity: intBetween(1, 3, `item-qty-${id}-${i}`),
      unit_price: intBetween(18, 90, `item-price-${id}-${i}`) * 1_000_000,
      total: intBetween(18, 90, `item-total-${id}-${i}`) * 1_000_000,
    })),
    prev_id: index > 0 ? MOCK_ORDERS[index - 1].id : null,
    next_id: index < MOCK_ORDERS.length - 1 ? MOCK_ORDERS[index + 1].id : null,
  };
}

/**
 * Reverse-chronological, with the not-yet-reached step first — the design shows
 * "Delivered" at the top carrying a hollow spinner while the rest are ticked.
 */
function orderTimeline(id: string): OrderTimelineEntry[] {
  const steps: Omit<OrderTimelineEntry, "id" | "created_at">[] = [
    {
      title: "Delivered",
      description: "Customer has confirmed receipt of item",
      state: "pending",
    },
    {
      title: "Order has been shipped",
      description: "Via fedEx shipping service • TRAYETMN",
      state: "done",
    },
    {
      title: "Order has been processed",
      description: "Packed and ready for shipment by the designer",
      state: "done",
    },
    {
      title: "Order processing",
      description: "Order is now being prepared by the designer",
      state: "done",
    },
    {
      title: "Payment confirmed",
      description: "Via Paystack payment gateway • Mastercard ***3245",
      state: "done",
    },
  ];

  return steps.map((step, i) => ({
    ...step,
    id: `${id}-event-${i}`,
    // Oldest at the bottom: later entries in the list are further in the past.
    created_at: daysAgo(intBetween(1, 6, `event-${id}-${i}`) * (i + 1)),
  }));
}
