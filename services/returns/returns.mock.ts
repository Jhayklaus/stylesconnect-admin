import { daysAgo, intBetween, pick, seeded } from "../mock/seed";
import type { RefundType, ReturnRequest, ReturnStatus } from "./returns.types";

const REASONS = [
  "Out of stock",
  "Wrong size delivered",
  "Item not as described",
  "Damaged on arrival",
  "Changed my mind",
  "Late delivery",
];

export const MOCK_RETURNS: ReturnRequest[] = Array.from({ length: 32 }, (_, i) => {
  const roll = seeded(`return-status-${i}`);
  const status: ReturnStatus =
    roll > 0.82 ? "refunded" : roll > 0.62 ? "rejected" : roll > 0.34 ? "approved" : "pending";
  const refund_type: RefundType = seeded(`refund-type-${i}`) > 0.7 ? "partial" : "full";

  // A partial refund returns a slice of the order, not a different order of
  // magnitude — keep both on the same scale so the column reads sensibly.
  const orderValue = intBetween(35, 260, `amount-${i}`) * 1_000_000;
  const refund_amount =
    refund_type === "partial"
      ? Math.round((orderValue * intBetween(25, 70, `share-${i}`)) / 100 / 1_000_000) * 1_000_000
      : orderValue;

  return {
    id: `RET-${String(5000 + i)}`,
    order_id: `IKU—${1000 + intBetween(10, 99, `return-${i}`)}`,
    requested_at: daysAgo(intBetween(0, 200, `return-date-${i}`)),
    reason: pick(REASONS, `reason-${i}`),
    refund_amount,
    status,
    refund_type,
  };
});
