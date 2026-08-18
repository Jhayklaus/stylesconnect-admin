import { PEOPLE, daysAgo, intBetween, pick, seeded } from "../mock/seed";
import type { FulfillmentStatus, Order, PaymentStatus } from "./orders.types";

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
