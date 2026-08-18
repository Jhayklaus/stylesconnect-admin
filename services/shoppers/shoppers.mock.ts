import { MOCK_ORDERS } from "../orders/orders.mock";
import type { Order } from "../orders/orders.types";
import { PEOPLE, daysAgo, emailFor, intBetween, pick, seeded } from "../mock/seed";
import type {
  Shopper,
  ShopperActivity,
  ShopperDetail,
  ShopperStats,
} from "./shoppers.types";

export const MOCK_SHOPPERS: Shopper[] = PEOPLE.map((name, i) => {
  const roll = seeded(`shopper-status-${name}`);
  const status: Shopper["status"] =
    roll > 0.88 ? "deactivated" : roll > 0.71 ? "inactive" : "active";

  return {
    id: `SHP-${String(2000 + i)}`,
    name,
    email: emailFor(name),
    avatar_url: null,
    order_count: intBetween(0, 92, `orders-${name}`),
    total_spend: intBetween(1, 250, `spend-${name}`) * 1_000_000,
    status,
    last_order_at: daysAgo(intBetween(1, 400, `lastorder-${name}`)),
  };
});

export const MOCK_SHOPPER_STATS: ShopperStats = {
  total: 24000,
  active: 23900,
  inactive: 90,
  deactivated: 10,
  total_delta: 9.4,
  active_delta: 9.4,
  inactive_delta: 9.4,
  deactivated_delta: 9.4,
};

const SHOPPER_COUNTRIES = ["Nigeria", "Ghana", "Kenya"];
const SHOPPER_GENDERS = ["Male", "Female"];
const SHOPPER_STREETS = [
  "Plot 2, 14 Ikeji street, Arewa estate, Ilupeju, Lagos",
  "12 Admiralty Way, Lekki Phase 1, Lagos",
  "44 Zaria Road, Kaduna",
];

export function mockShopperDetail(id: string): ShopperDetail | undefined {
  const base = MOCK_SHOPPERS.find((s) => s.id === id);
  if (!base) return undefined;

  const index = MOCK_SHOPPERS.findIndex((s) => s.id === id);
  const ongoing = intBetween(0, 40, `ongoing-${id}`);

  return {
    ...base,
    customer_id: `#${intBetween(1_000_000, 9_999_999, `sdetail-${id}`)}`,
    phone: `+234${intBetween(7_000_000_000, 9_099_999_999, `sphone-${id}`)}`,
    address: pick(SHOPPER_STREETS, `saddress-${id}`),
    country: pick(SHOPPER_COUNTRIES, `scountry-${id}`),
    date_of_birth: daysAgo(intBetween(7_000, 14_000, `sdob-${id}`)),
    gender: pick(SHOPPER_GENDERS, `sgender-${id}`),
    last_login_at: daysAgo(intBetween(0, 20, `slastlogin-${id}`)),
    order_stats: {
      total_spend: base.total_spend,
      order_count: base.order_count,
      ongoing,
      unfulfilled: intBetween(0, 30, `unfulfilled-${id}`),
    },
    prev_id: index > 0 ? MOCK_SHOPPERS[index - 1].id : null,
    next_id: index < MOCK_SHOPPERS.length - 1 ? MOCK_SHOPPERS[index + 1].id : null,
  };
}

export function mockShopperOrders(id: string): Order[] {
  const offset = MOCK_SHOPPERS.findIndex((s) => s.id === id);
  const size = intBetween(4, 15, `sorders-size-${id}`);
  return Array.from({ length: size }, (_, i) => MOCK_ORDERS[(offset + i * 2) % MOCK_ORDERS.length]);
}

export function mockShopperActivity(id: string): ShopperActivity[] {
  const name = MOCK_SHOPPERS.find((s) => s.id === id)?.name ?? "This shopper";
  // Unlike the tables, this feed is anchored to now: the design groups the
  // newest entries under "Today", which a fixed anchor would never produce.
  const now = new Date().toISOString();

  return [
    {
      id: `ACT-${id}-1`,
      kind: "account",
      segments: [
        { text: "Account name changed from " },
        { text: "Mark Andrew", strong: true },
        { text: " to " },
        { text: name, strong: true },
      ],
      created_at: now,
    },
    {
      id: `ACT-${id}-2`,
      kind: "account",
      segments: [{ text: "Password changed successfully" }],
      created_at: now,
    },
    {
      id: `ACT-${id}-3`,
      kind: "order",
      segments: [
        { text: "Order " },
        { text: "ID-264ETY", strong: true },
        { text: " marked as ready for shipping" },
      ],
      created_at: now,
    },
    {
      id: `ACT-${id}-4`,
      kind: "payment",
      segments: [
        { text: "Total of " },
        { text: "₦500,00", strong: true },
        { text: " transferred to " },
        { text: "Guarantee trust bank 101245120", strong: true },
      ],
      created_at: now,
    },
    {
      id: `ACT-${id}-5`,
      kind: "order",
      segments: [
        { text: "Confirmed request order for " },
        { text: "ID-264ETY", strong: true },
      ],
      created_at: daysAgo(intBetween(20, 90, `act-old-${id}`)),
    },
  ];
}
