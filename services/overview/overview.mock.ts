import { PEOPLE, daysAgo, emailFor, intBetween, productImage, seeded } from "../mock/seed";
import type {
  OverviewStats,
  RecentOrder,
  RecentTicket,
  RecentTransaction,
  RevenueSeries,
} from "./overview.types";

export const MOCK_OVERVIEW_STATS: OverviewStats = {
  total_orders: 240,
  active_buyers: 890,
  active_designers: 2000,
  pending_verification: 40,
  total_orders_delta: 9.4,
  active_buyers_delta: 9.4,
  active_designers_delta: 9.4,
  pending_verification_delta: 9.4,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Two series that cross over a few times, as in the design.
const PURCHASE = [
  2_000_000, 900_000, 700_000, 4_000_000, 60_000_000, 300_000_000,
  30_000_000, 8_000_000, 3_000_000, 900_000, 40_000_000, 90_000_000,
];
const SUBSCRIPTION = [
  700_000, 3_000_000, 60_000_000, 40_000_000, 9_000_000, 6_000_000,
  4_000_000, 1_500_000, 2_000_000, 8_000_000, 3_000_000, 1_200_000,
];

export const MOCK_REVENUE: RevenueSeries = {
  total: 240_000_000,
  points: MONTHS.map((month, i) => ({
    month,
    purchase: PURCHASE[i],
    subscription: SUBSCRIPTION[i],
  })),
};

const TICKET_SUBJECTS = [
  "Login not working",
  "Payment stuck on processing",
  "Profile picture doesn't load",
  "Order marked delivered too early",
  "Cannot upload listing photos",
  "Refund not received",
];

export const MOCK_RECENT_TICKETS: RecentTicket[] = TICKET_SUBJECTS.map((subject, i) => ({
  id: `TC-${5000 + i}`,
  reference: String(4536546 + i),
  subject,
  created_at: daysAgo(i * 2),
  priority: seeded(`prio-${subject}`) > 0.55 ? "high" : "medium",
  resolved: i < 3,
}));

export const MOCK_RECENT_TRANSACTIONS: RecentTransaction[] = Array.from({ length: 7 }, (_, i) => ({
  id: `TXN-${6000 + i}`,
  reference: `#AD-HJRT2T`,
  customer_email: emailFor(PEOPLE[i]),
  // Alternated rather than coin-flipped so both sources are visible in the fixture.
  source: i % 3 === 0 ? "Order" : "Subscription",
  created_at: daysAgo(i),
  amount: intBetween(15, 250, `txn-${i}`) * 1_000_000,
}));

const CATEGORIES = ["Men clothing", "Women clothing", "Kids clothing", "Accessories"];

export const MOCK_RECENT_ORDERS: RecentOrder[] = Array.from({ length: 6 }, (_, i) => ({
  id: `ORD-${7000 + i}`,
  order_id: `#${48751040 + i}`,
  category: CATEGORIES[i % CATEGORIES.length],
  quantity: intBetween(1, 5, `rq-${i}`),
  image_url: productImage(i),
  status: "pending",
  created_at: daysAgo(i),
}));
