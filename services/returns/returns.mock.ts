import { PEOPLE, daysAgo, emailFor, intBetween, pick, productImage, seeded } from "../mock/seed";
import type {
  RefundType,
  ReturnDetail,
  ReturnRequest,
  ReturnStatus,
  SettlementStatus,
} from "./returns.types";

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

const PRODUCTS = [
  "White linen embroiled t-shirt",
  "Copper grid jacquard shirt",
  "Oversized wool blend coat",
  "Adire silk wrap dress",
  "Raw denim wide-leg trouser",
  "Hand-beaded evening clutch",
];

const STORES = [
  "Atelier Ruma",
  "House of Nkemdi",
  "Lagos Linen Co.",
  "Studio Adire",
  "The Tailor's Room",
];

/** Long enough that the modal's "see more" clamp actually has work to do. */
const REASON_NARRATIVES = [
  "The parcel arrived on time but the piece is a full size smaller than the measurements listed on the product page. I ordered a large based on the size guide and it fits closer to a medium across the shoulders. I would like to send it back for a refund rather than exchange, since the same size is what I already own in another colour.",
  "There is a run in the fabric along the left seam that I did not notice until I took it out of the packaging in daylight. It is about four inches long and sits right where the sleeve meets the body, so it is not something a tailor can hide. Photos of the seam are attached.",
  "The colour is noticeably different from the listing photos — the listing shows a warm copper tone and what arrived reads much closer to a flat rust brown. I understand screens vary, but the difference is large enough that it does not work with the rest of the outfit I bought it for.",
  "I was told at checkout the item would arrive before the 14th for an event, and it landed nine days late. I no longer have a use for it and it has not been worn or removed from its garment bag. Everything including the tags and the dust cover is still in the original packaging.",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** "ARTHYOE" — the seven-letter order reference the design shows. */
function referenceCode(index: number): string {
  return Array.from(
    { length: 7 },
    (_, n) => ALPHABET[Math.floor(seeded(`ref-${index}-${n}`) * ALPHABET.length)]
  ).join("");
}

/**
 * One detail record per list row, so opening any row in the returns table
 * resolves. Deterministic like the rest of the fixture layer.
 */
export const MOCK_RETURN_DETAILS: ReturnDetail[] = MOCK_RETURNS.map((request, i) => {
  const customerName = PEOPLE[i % PEOPLE.length];
  const settlement: SettlementStatus =
    request.status === "refunded" || seeded(`settlement-${i}`) > 0.5 ? "settled" : "unsettled";

  // The refund is what goes back to the shopper; the order it came from is at
  // least that large, so the right rail never shows a total below the refund.
  const subtotal = request.refund_amount;
  const discount = Math.round(seeded(`discount-${i}`) * 12) * 100_000;
  const shipping_fee = intBetween(5, 25, `shipping-${i}`) * 100_000;
  const total = subtotal - discount + shipping_fee;

  return {
    ...request,
    reference: `#${referenceCode(i)}`,
    settlement,
    store: pick(STORES, `store-${i}`),
    item: {
      id: `#RAD${10_000 + intBetween(10, 999, `item-${i}`)}`,
      name: pick(PRODUCTS, `product-${i}`),
      image_url: productImage(i),
      quantity: intBetween(1, 4, `qty-${i}`),
    },
    reason_detail: pick(REASON_NARRATIVES, `narrative-${i}`),
    media: [productImage(i), productImage(i + 1), productImage(i + 2)],
    order: {
      id: `#RD${8000 + intBetween(100, 999, `order-${i}`)}`,
      placed_at: daysAgo(intBetween(200, 260, `order-date-${i}`)),
      total_amount: total,
      total,
    },
    customer: {
      id: String(4_000_000 + intBetween(100_000, 999_999, `customer-${i}`)),
      name: customerName,
      avatar_url: null,
      email: emailFor(customerName),
      phone: `+234${intBetween(700_000_000, 899_999_999, `phone-${i}`)}`,
    },
    payment: { subtotal, discount, shipping_fee, total },
  };
});

