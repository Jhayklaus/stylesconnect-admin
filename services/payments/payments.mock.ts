import { daysAgo, intBetween, pick, seeded } from "../mock/seed";
import type { Payment, PaymentKind, PaymentMethod } from "./payments.types";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789".split("");

/** "#AD-HJRT2T" — the admin transaction reference shown in the designs. */
function reference(seed: string): string {
  const code = Array.from({ length: 6 }, (_, i) => pick(CODE_ALPHABET, `${seed}-${i}`)).join("");
  return `#AD-${code}`;
}

export const MOCK_PAYMENTS: Payment[] = Array.from({ length: 24 }, (_, i) => {
  const seed = `payment-${i}`;
  const kind: PaymentKind = seeded(`kind-${i}`) > 0.55 ? "subscription" : "order";
  const method: PaymentMethod = seeded(`method-${i}`) > 0.5 ? "bank_transfer" : "debit_card";

  return {
    id: `PAY-${String(7000 + i)}`,
    transaction_id: reference(seed),
    kind,
    method,
    // Subscriptions are flat-rate; order payments vary with basket size.
    amount:
      kind === "subscription"
        ? 250_000
        : intBetween(45, 980, `amount-${i}`) * 1_000,
    paid_at: daysAgo(intBetween(0, 180, `paid-${i}`)),
  };
});
