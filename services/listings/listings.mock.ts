import { daysAgo, intBetween, productImage, seeded } from "../mock/seed";
import type { Listing } from "./listings.types";

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

const CATEGORIES = ["Shirts", "Jeans", "Dresses", "Outerwear", "Accessories", "Footwear"];

export const MOCK_LISTINGS: Listing[] = TITLES.map((title, i) => {
  const roll = seeded(`listing-status-${title}`);
  const status: Listing["status"] =
    roll > 0.82 ? "unlisted" : roll > 0.62 ? "inactive" : "published";

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
    review_state: seeded(`review-${title}`) > 0.7 ? "awaiting_review" : "reviewed",
    created_at: daysAgo(intBetween(1, 500, `created-${title}`)),
  };
});
