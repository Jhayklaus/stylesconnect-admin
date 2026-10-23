export type ReviewStatus = "pending" | "approved" | "rejected";

/** Which queue: product reviews (/admin/reviews) or store reviews (/admin/store-reviews). */
export type ReviewQueue = "product" | "store";

/**
 * A row in either moderation queue. Production had no reviews when this was
 * written, so only the fields the API contract guarantees are typed — widen
 * this from a real payload before building the moderation screen.
 */
export interface ModerationReview {
  /** Numeric, unlike most admin resources. */
  id: number;
  status: ReviewStatus;
  created_at: string;
  [field: string]: unknown;
}

export interface ReviewListParams {
  page?: number;
  per_page?: number;
  status?: ReviewStatus | "all";
}
