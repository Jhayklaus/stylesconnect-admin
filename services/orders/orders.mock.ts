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
    estimated_delivery_at: daysAgo(-intBetween(2, 21, `eta-${i}`)),
    quantity: intBetween(1, 92, `qty-${i}`),
    total: intBetween(15, 250, `total-${i}`) * 1_000_000,
    status: payment_status === "paid" ? "confirmed" : payment_status,
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
  const store = ["Pine & Peak", "Aso Atelier", "Lagos Linen Co."][index % 3];
  const items = Array.from({ length: itemCount }, (_, i) => {
    const name = ["White Linen Shirt", "Aso-oke Wrap Dress", "Linen Blazer", "Structured Tote"][i % 4];
    const quantity = intBetween(1, 3, `item-qty-${id}-${i}`);
    const unitPrice = intBetween(18, 90, `item-price-${id}-${i}`) * 1_000_000;
    return {
      id: `${id}-item-${i}`,
      title: name,
      name,
      listing_id: `LST-${3000 + ((index + i) % 30)}`,
      image_url: productImage(index + i),
      store,
      color: ["Black", "White", "Indigo"][(index + i) % 3],
      size: ["Small", "Medium", "Large", "XLarge"][(index + i) % 4],
      measurements:
        i === 0
          ? [
              { type: "chest", measurement: "70" },
              { type: "waist", measurement: "55" },
              { type: "shoulder", measurement: "30" },
              { type: "length", measurement: "39.11" },
            ]
          : null,
      quantity,
      unit_price: unitPrice,
      total: quantity * unitPrice,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const shippingFee = intBetween(5, 25, `shipfee-${id}`) * 100_000;

  return {
    ...base,
    customer: {
      ...base.customer,
      email: `${customerName.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
      phone: `+234${intBetween(7_000_000_000, 9_099_999_999, `phone-${id}`)}`,
      address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    },
    reference: `chk_${["ARTHYOE", "RQMZ4TL", "KPD91XB", "WYT3NRA"][index % 4]}`,
    store,
    payment_id: `PAY-${id}`,
    total: subtotal + shippingFee,
    stage: (["review", "preparing", "shipping", "delivered"] as const)[
      intBetween(0, 3, `stage-${id}`)
    ],
    product: items[0],
    shipping: {
      tracking_id: `TMHJWYRAD${String(10_000 + intBetween(10, 999, `track-${id}`))}`,
      tracking_url: null,
      carrier: "FedEx",
      status: null,
      origin: "Plot 2, 14 Ikeji street, Arewa estate, Ilupeju, Lagos",
      destination: "12 Admiralty Way, Lekki Phase 1, Lagos",
    },
    subtotal,
    shipping_fee: shippingFee,
    discount_amount: 0,
    tax_amount: 0,
    cancel_reason: null,
    can_cancel_and_refund: base.payment_status === "paid",
    events: orderTimeline(id),
    payment_method: "Bank transfer",
    shipping_address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    notes: "Please package with care and include the garment bag.",
    items,
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
      status: "delivered",
      description: "Customer has confirmed receipt of item",
      state: "pending",
    },
    {
      title: "Order has been shipped",
      status: "shipped",
      description: "Via fedEx shipping service • TRAYETMN",
      state: "done",
    },
    {
      title: "Order has been processed",
      status: "processed",
      description: "Packed and ready for shipment by the designer",
      state: "done",
    },
    {
      title: "Order processing",
      status: "processing",
      description: "Order is now being prepared by the designer",
      state: "done",
    },
    {
      title: "Payment confirmed",
      status: "confirmed",
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
