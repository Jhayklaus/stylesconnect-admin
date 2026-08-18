import { MOCK_LISTINGS } from "../listings/listings.mock";
import type { Listing } from "../listings/listings.types";
import { PEOPLE, daysAgo, emailFor, intBetween, pick, productImage, seeded } from "../mock/seed";
import type {
  Designer,
  DesignerDetail,
  DesignerReviewItem,
  DesignerStats,
  DesignerTransaction,
  RatingBucket,
} from "./designers.types";

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

const COUNTRIES = ["Nigeria", "Ghana", "Kenya"];
const GENDERS = ["Male", "Female"];
const STREETS = [
  "Plot 2, 14 Ikeji street, Arewa estate, Ilupeju, Lagos",
  "18 Awolowo Road, Ikoyi, Lagos",
  "7B Gana Street, Maitama, Abuja",
];
const CARDS = ["Mastercard xxx234", "Visa xxx234", "Bank transfer", "Verve xxx881"];

const REVIEW_BODIES = [
  "I recently purchased the white ladies top on Tuesday but the fittings didn't work as i expected. The designer refused to take into account my complaint. please, help",
  "Fabric quality is excellent and the stitching held up after several washes. Delivery was two days later than promised though.",
  "Exactly as pictured. The measurements guide was accurate and the tailoring is clean.",
  "Ordered a custom fit and the sleeves came in far too short. Reached out twice with no reply.",
];

/** GET /admin/designers/:id — the list row widened with profile detail. */
export function mockDesignerDetail(id: string): DesignerDetail | undefined {
  const base = MOCK_DESIGNERS.find((d) => d.id === id);
  if (!base) return undefined;

  const seed = `detail-${id}`;
  const index = MOCK_DESIGNERS.findIndex((d) => d.id === id);
  const live = intBetween(4, 60, `live-${id}`);
  const unlisted = intBetween(2, 90, `unlisted-${id}`);

  const distribution: RatingBucket[] = ([5, 4, 3, 2, 1] as const).map((stars) => ({
    stars,
    count: intBetween(4, 900, `rating-${id}-${stars}`),
  }));
  const total = distribution.reduce((sum, b) => sum + b.count, 0);
  const weighted = distribution.reduce((sum, b) => sum + b.stars * b.count, 0);

  return {
    ...base,
    customer_id: `#${intBetween(1_000_000, 9_999_999, seed)}`,
    phone: `+234${intBetween(7_000_000_000, 9_099_999_999, `phone-${id}`)}`,
    address: pick(STREETS, `address-${id}`),
    country: pick(COUNTRIES, `country-${id}`),
    date_of_birth: daysAgo(intBetween(7_000, 14_000, `dob-${id}`)),
    gender: pick(GENDERS, `gender-${id}`),
    last_login_at: daysAgo(intBetween(0, 20, `lastlogin-${id}`)),
    subscription_plan: base.subscription === "active" ? "Active (3 months)" : "Inactive",
    subscription_started_at: base.joined_at,
    subscription_ends_at: daysAgo(-intBetween(10, 200, `subend-${id}`)),
    listing_stats: { total_listed: live + unlisted, live, unlisted },
    prev_id: index > 0 ? MOCK_DESIGNERS[index - 1].id : null,
    next_id: index < MOCK_DESIGNERS.length - 1 ? MOCK_DESIGNERS[index + 1].id : null,
    rating: {
      average: Math.round((weighted / total) * 10) / 10,
      total,
      distribution,
    },
  };
}

export function mockDesignerTransactions(id: string): DesignerTransaction[] {
  return Array.from({ length: 18 }, (_, i) => {
    const roll = seeded(`dtxn-status-${id}-${i}`);
    return {
      id: `DTX-${id}-${i}`,
      reference: `#AD-${String(intBetween(100_000, 999_999, `dtxn-${id}-${i}`)).slice(0, 6)}`,
      amount: intBetween(45, 320, `dtxn-amount-${id}-${i}`) * 1_000,
      type: seeded(`dtxn-type-${id}-${i}`) > 0.5 ? "subscription" : "order",
      payment_method: pick(CARDS, `dtxn-card-${id}-${i}`),
      status: roll > 0.86 ? "failed" : roll > 0.7 ? "pending" : "paid",
      created_at: daysAgo(intBetween(0, 200, `dtxn-date-${id}-${i}`)),
    } satisfies DesignerTransaction;
  });
}

export function mockDesignerReviews(id: string): DesignerReviewItem[] {
  return Array.from({ length: 12 }, (_, i) => {
    const reviewer = PEOPLE[(i * 5) % PEOPLE.length];
    return {
      id: `DRV-${id}-${i}`,
      reference: `ID-${intBetween(100_000_000, 999_999_999, `rev-${id}-${i}`)}`,
      rating: intBetween(1, 5, `rev-stars-${id}-${i}`),
      body: pick(REVIEW_BODIES, `rev-body-${id}-${i}`),
      created_at: daysAgo(intBetween(0, 300, `rev-date-${id}-${i}`)),
      reviewer: { id: `CUS-${i}`, name: reviewer, avatar_url: null },
      order: { id: `IKU—${1000 + i}`, product_title: "Ladies boyfriend jeans" },
      // Roughly half the reviews carry photos, matching the design.
      images:
        seeded(`rev-img-${id}-${i}`) > 0.5
          ? Array.from({ length: 3 }, (_, n) => productImage(n))
          : [],
    } satisfies DesignerReviewItem;
  });
}

/**
 * The designer's own catalogue. Fixture-to-fixture import: both files are
 * deleted together when the real endpoints land.
 */
export function mockDesignerListings(id: string): Listing[] {
  const offset = MOCK_DESIGNERS.findIndex((d) => d.id === id);
  const size = intBetween(5, 16, `dlist-size-${id}`);
  return Array.from({ length: size }, (_, i) => MOCK_LISTINGS[(offset + i * 3) % MOCK_LISTINGS.length]);
}
