import { PEOPLE, daysAgo, emailFor, intBetween, pick, seeded } from "../mock/seed";
import type { Payment, PaymentDetail, PaymentKind, PaymentMethod } from "./payments.types";

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
    order:
      kind === "order"
        ? { id: `ORD-${4000 + i}`, order_id: `#${intBetween(10_000_000, 99_999_999, `payorder-${i}`)}` }
        : null,
    customer: {
      id: `SHP-${2000 + (i % PEOPLE.length)}`,
      name: PEOPLE[i % PEOPLE.length],
      avatar_url: null,
      email: emailFor(PEOPLE[i % PEOPLE.length]),
    },
  };
});

const CARD_LABELS = ["Mastercard •• 1038", "Visa •• 4417", "Verve •• 8802"];

export function mockPaymentDetail(id: string): PaymentDetail | undefined {
  const base = MOCK_PAYMENTS.find((p) => p.id === id);
  if (!base) return undefined;

  // Derived so the summary reconciles with the headline figure — the design's
  // own numbers (fee 900 + tax 400 + total 5,000 against a ₦5,900 header) don't.
  const fee = Math.round(base.amount * 0.015);
  const tax = Math.round(base.amount * 0.0075);
  const net = base.amount - fee - tax;

  return {
    ...base,
    card_label: pick(CARD_LABELS, `card-${id}`),
    subscription:
      base.kind === "subscription"
        ? {
            plan: "3 months",
            starts_at: base.paid_at,
            ends_at: daysAgo(-intBetween(30, 120, `subend-${id}`)),
          }
        : null,
    transaction_ref: `STX${intBetween(10_000_000, 99_999_999, `txnref-${id}`)}`,
    gateway: "pandascrow",
    description:
      base.kind === "subscription" ? "Payment for subscription" : "Payment for order",
    fee,
    tax,
    net,
  };
}
