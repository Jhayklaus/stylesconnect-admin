import { PEOPLE, daysAgo, emailFor, intBetween, seeded } from "../mock/seed";
import type { Shopper, ShopperStats } from "./shoppers.types";

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
