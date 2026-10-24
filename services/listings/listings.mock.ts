import { PEOPLE, daysAgo, emailFor, intBetween, pick, productImage, seeded } from "../mock/seed";
import type { RatingBucket } from "../types";
import type { Listing, ListingDetail, ListingOrderRow } from "./listings.types";

const TITLES = [
  "White Linen embroiled t-shirt", "Ladies boyfriend jeans", "Ankara wrap dress",
  "Tailored linen blazer", "Adire silk scarf", "Kaftan two-piece set",
  "Crochet bucket hat", "Oversized denim jacket", "Agbada ceremonial robe",
  "Ruched satin midi dress", "Cotton pique polo", "Pleated palazzo trousers",
  "Beaded evening clutch", "Aso-oke head wrap", "Slim-fit chino shorts",
  "Embroidered kimono", "Leather crossbody bag", "Corduroy overshirt",
  "Ribbed knit bodysuit", "Wide-leg jumpsuit", "Kente panel skirt",
  "Cashmere-blend cardigan", "Utility cargo trousers", "Puff-sleeve blouse",
  "Suede ankle boots", "Reversible bomber jacket", "Tie-dye lounge set",
  "Halter neck maxi dress", "Structured tote bag", "Herringbone waistcoat",
];

const CATEGORIES = ["Tops", "Bottoms", "Full body"];

export const MOCK_LISTINGS: Listing[] = TITLES.map((title, i) => {
  const roll = seeded(`listing-status-${title}`);
  const status: Listing["status"] = roll > 0.7 ? "draft" : "published";

  return {
    id: `LST-${String(3000 + i)}`,
    product_id: `IKU—${1000 + intBetween(10, 99, `sku-${title}`)}`,
    title,
    category: CATEGORIES[i % CATEGORIES.length],
    image_url: productImage(i),
    in_stock: seeded(`stock-${title}`) > 0.45,
    total_sold: intBetween(0, 240, `sold-${title}`),
    unit_price: intBetween(15, 250, `price-${title}`) * 1_000_000,
    status,
    review_state: "reviewed",
    is_featured: seeded(`featured-${title}`) > 0.8,
    created_at: daysAgo(intBetween(1, 500, `created-${title}`)),
  };
});

const ADULT_SIZES = ["Small", "Medium", "Large", "XLarge", "2XLarge", "3XLarge"];
const KIDS_SIZES = ["2–3y", "4–5y", "6–7y", "8–9y"];
const COLOR_SETS = [
  ["White", "Brown"],
  ["Black", "Ecru", "Sand"],
  ["Indigo", "Rust"],
];
const PRODUCT_TYPES = ["Full body, T-shirt", "Full body, Dress", "Two piece, Set"];
const AUDIENCES = ["Unisex", "Women", "Men"];
const TIMELINES = ["2—3 weeks", "1—2 weeks", "3—5 days"];

const DESCRIPTION =
  "A bold reinterpretation of our signature grid design. Crafted from luxurious jacquard fabric, this short-sleeve button-down features a rich copper-toned grid pattern that radiates warmth and sophistication. A vibrant chest pocket adds a playful contrast, making this shirt a standout piece for any occasion.";

export function mockListingDetail(id: string): ListingDetail | undefined {
  const base = MOCK_LISTINGS.find((l) => l.id === id);
  if (!base) return undefined;

  const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
  const storeName = PEOPLE[index % PEOPLE.length];

  const distribution: RatingBucket[] = ([5, 4, 3, 2, 1] as const).map((stars) => ({
    stars,
    count: intBetween(4, 900, `lrating-${id}-${stars}`),
  }));
  const total = distribution.reduce((sum, b) => sum + b.count, 0);
  const weighted = distribution.reduce((sum, b) => sum + b.stars * b.count, 0);

  return {
    ...base,
    description: DESCRIPTION,
    photos: Array.from({ length: 6 }, (_, i) => productImage(i)),
    colors: pick(COLOR_SETS, `colors-${id}`),
    product_type: pick(PRODUCT_TYPES, `ptype-${id}`),
    audience: pick(AUDIENCES, `audience-${id}`),
    sleeve_type: pick(["Short Sleeve", "Long Sleeve", null], `sleeve-${id}`),
    sizes: { adult: ADULT_SIZES, kids: KIDS_SIZES },
    timeline: pick(TIMELINES, `ltimeline-${id}`),
    stock_quantity: base.in_stock ? null : 0,
    store: {
      id: `DSG-${1000 + (index % 43)}`,
      name: storeName,
      phone: `+234${intBetween(7_000_000_000, 9_099_999_999, `lphone-${id}`)}`,
      email: emailFor(storeName),
      address: "Plot 2, 14 Ikeji street, Arewa estate, Ilupeju, Lagos",
    },
    rating: {
      average: Math.round((weighted / total) * 10) / 10,
      total,
      distribution,
    },
    prev_id: index > 0 ? MOCK_LISTINGS[index - 1].id : null,
    next_id: index < MOCK_LISTINGS.length - 1 ? MOCK_LISTINGS[index + 1].id : null,
  };
}

export function mockListingOrders(id: string): ListingOrderRow[] {
  const size = intBetween(5, 18, `lorders-${id}`);
  return Array.from({ length: size }, (_, i) => {
    const roll = seeded(`lorder-status-${id}-${i}`);
    const name = PEOPLE[(i * 4) % PEOPLE.length];
    return {
      id: `LOR-${id}-${i}`,
      order_id: `IKU—${1000 + intBetween(10, 99, `lorder-${id}-${i}`)}`,
      customer: { id: `CUS-${i}`, name, avatar_url: null },
      quantity: intBetween(1, 12, `lqty-${id}-${i}`),
      amount: intBetween(45, 320, `lamount-${id}-${i}`) * 1_000_000,
      status: roll > 0.86 ? "cancelled" : roll > 0.72 ? "failed" : roll > 0.55 ? "pending" : "paid",
      ordered_at: daysAgo(intBetween(0, 200, `ldate-${id}-${i}`)),
    } satisfies ListingOrderRow;
  });
}
