import { PEOPLE, daysAgo, emailFor, intBetween, seeded } from "../mock/seed";
import type { Designer, DesignerStats } from "./designers.types";

// 43 rows — more than one page at every per-page option, so pagination,
// empty-search, and filtered-to-zero states are all reachable in the UI.
export const MOCK_DESIGNERS: Designer[] = PEOPLE.map((name, i) => {
  const roll = seeded(`designer-status-${name}`);
  const status: Designer["status"] =
    roll > 0.86 ? "deactivated" : roll > 0.68 ? "inactive" : "active";

  return {
    id: `DSG-${String(1000 + i)}`,
    name,
    email: emailFor(name),
    avatar_url: null,
    active_listings: intBetween(0, 96, `listings-${name}`),
    subscription: seeded(`sub-${name}`) > 0.55 ? "inactive" : "active",
    total_sales: intBetween(1, 250, `sales-${name}`) * 1_000_000,
    status,
    joined_at: daysAgo(intBetween(3, 900, `joined-${name}`)),
  };
});

export const MOCK_DESIGNER_STATS: DesignerStats = {
  total: 240,
  active: 224,
  inactive: 12,
  deactivated: 4,
  total_delta: 9.4,
  active_delta: 9.4,
  inactive_delta: 9.4,
  deactivated_delta: 9.4,
};
