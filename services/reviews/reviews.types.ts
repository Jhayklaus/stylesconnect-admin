export type ReviewStatus = "pending" | "approved" | "rejected";

/** Which queue: product reviews (/admin/reviews) or store reviews (/admin/store-reviews). */
export type ReviewQueue = "product" | "store";

/**
 * A row in either moderation queue, normalised for display.
 *
 * Production had no reviews when this was written, so `reviews.api.ts` builds
 * this defensively from the consumer app's review shape (`comment`,
 * `reviewer.name`, `images[].image_url`). Re-check against a real payload once
 * reviews exist.
 */
export interface ModerationReview {
  /** Numeric, unlike most admin resources — it's what the status PATCH takes. */
  id: number;
  rating: number;
  comment: string;
  status: ReviewStatus;
  reviewer: { name: string; avatar_url: string | null };
  images: string[];
  /** The listing title or store name being reviewed, when the API says. */
  subject: string | null;
  created_at: string;
}

export interface ReviewListParams {
  page?: number;
  per_page?: number;
  status?: ReviewStatus | "all";
}

export const REVIEW_QUEUE_LABEL: Record<ReviewQueue, string> = {
  product: "Product reviews",
  store: "Store reviews",
};
