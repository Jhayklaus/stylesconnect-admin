import { PEOPLE, daysAgo, intBetween, pick, productImage, seeded } from "../mock/seed";
import type { ModerationReview, ReviewQueue, ReviewStatus } from "./reviews.types";

const COMMENTS = [
  "Fabric quality is excellent and the stitching held up after several washes.",
  "Exactly as pictured. The measurements guide was accurate and the tailoring is clean.",
  "Ordered a custom fit and the sleeves came in far too short. Reached out twice with no reply.",
  "Lovely colour but it took three weeks longer than the timeline said.",
];
const LISTINGS = ["Retro Jersey", "Ankara wrap dress", "Tailored linen blazer", "Kaftan two-piece set"];
const STORES = ["Styleconnect", "Aso Atelier", "Lagos Linen Co."];
const STATUSES: ReviewStatus[] = ["pending", "approved", "rejected"];

function build(queue: ReviewQueue): ModerationReview[] {
  return Array.from({ length: 16 }, (_, i) => {
    const seed = `${queue}-review-${i}`;
    return {
      id: (queue === "product" ? 100 : 500) + i,
      rating: intBetween(1, 5, `${seed}-rating`),
      comment: pick(COMMENTS, `${seed}-comment`),
      status: STATUSES[i % 3],
      reviewer: { name: PEOPLE[(i * 7) % PEOPLE.length], avatar_url: null },
      images:
        queue === "product" && seeded(`${seed}-img`) > 0.6
          ? Array.from({ length: 2 }, (_, n) => productImage(i + n))
          : [],
      subject: pick(queue === "product" ? LISTINGS : STORES, `${seed}-subject`),
      created_at: daysAgo(intBetween(0, 60, `${seed}-date`)),
    };
  });
}

/** Mutable so status changes stick while fixtures are on. */
export const MOCK_REVIEWS: Record<ReviewQueue, ModerationReview[]> = {
  product: build("product"),
  store: build("store"),
};
