import { PEOPLE, daysAgo, intBetween, pick, seeded } from "../mock/seed";
import type {
  Refund,
  RefundDestination,
  RefundSource,
  RefundStats,
  RefundStatus,
} from "./refunds.types";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789".split("");

const REASONS = [
  "Item not as described",
  "Damaged on arrival",
  "Duplicate charge",
  "Order cancelled before dispatch",
  "Subscription cancelled early",
  "Wrong size delivered",
  "Late delivery",
];

function reference(prefix: string, seed: string): string {
  const code = Array.from({ length: 6 }, (_, i) => pick(CODE_ALPHABET, `${seed}-${i}`)).join("");
  return `#${prefix}-${code}`;
}

export const MOCK_REFUNDS: Refund[] = Array.from({ length: 28 }, (_, i) => {
  const roll = seeded(`refund-status-${i}`);
  // Bands chosen so all five states actually appear across these 28 seeds —
  // the rolls have a gap between 0.80 and 0.93, so a band inside it stays empty.
  const status: RefundStatus =
    roll > 0.9
      ? "rejected"
      : roll > 0.75
        ? "failed"
        : roll > 0.58
          ? "processing"
          : roll > 0.3
            ? "pending"
            : "completed";

  const source: RefundSource = seeded(`refund-source-${i}`) > 0.62 ? "subscription" : "order";
  const destination: RefundDestination = pick(
    ["original_method", "bank_transfer", "wallet_credit"] as RefundDestination[],
    `refund-dest-${i}`
  );

  // Held as day offsets so settlement can be derived from the request rather
  // than drawn independently — otherwise a refund can settle before it exists.
  const requestedDaysAgo = intBetween(3, 180, `refund-requested-${i}`);
  const settlementLag = intBetween(1, 12, `refund-lag-${i}`);
  const requested_at = daysAgo(requestedDaysAgo);

  // Only terminal states carry a processed timestamp.
  const settled = status === "completed" || status === "failed" || status === "rejected";

  return {
    id: `RFD-${String(9000 + i)}`,
    refund_id: reference("RF", `refund-${i}`),
    transaction_id: reference("AD", `refund-txn-${i}`),
    source,
    customer: {
      id: `CUS-${4000 + i}`,
      name: PEOPLE[(i * 2) % PEOPLE.length],
      avatar_url: null,
    },
    reason: pick(REASONS, `refund-reason-${i}`),
    // Subscriptions refund a flat plan price; orders vary with basket size.
    amount:
      source === "subscription"
        ? 250_000
        : intBetween(35, 940, `refund-amount-${i}`) * 1_000,
    destination,
    status,
    requested_at,
    // Fewer days ago than the request === later in time.
    processed_at: settled ? daysAgo(Math.max(0, requestedDaysAgo - settlementLag)) : null,
  };
});

export const MOCK_REFUND_STATS: RefundStats = {
  total_refunded: MOCK_REFUNDS.filter((r) => r.status === "completed").reduce(
    (sum, r) => sum + r.amount,
    0
  ),
  pending_count: MOCK_REFUNDS.filter((r) => r.status === "pending" || r.status === "processing")
    .length,
  pending_amount: MOCK_REFUNDS.filter(
    (r) => r.status === "pending" || r.status === "processing"
  ).reduce((sum, r) => sum + r.amount, 0),
  failed_count: MOCK_REFUNDS.filter((r) => r.status === "failed").length,
};
