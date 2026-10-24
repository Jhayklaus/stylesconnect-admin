// Shared API types for Style Connect.
// Envelope, pagination, and error shapes traced from Postman examples.

// Most endpoints wrap their payload as { data, meta, error }.
// Some taxonomy endpoints (categories, types, colors, audiences,
// production-timelines, sizes, sleeve-types) return raw arrays — not enveloped.
export interface ApiEnvelope<T> {
  data: T;
  meta: unknown[] | Record<string, unknown>;
  error: unknown;
}

// Paginated list shape returned by every /admin list endpoint:
// { data: T[], meta: { current_page, per_page, total, last_page, from, to }, error }.
// Unlike stock Laravel resources there is no `links` block.
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

// Validation error shape — from: Designer > Create Listing (422 example).
export interface ValidationErrorBody {
  message: string;
  errors: Record<string, string[]>;
}

// Normalized error thrown by the axios response interceptor.
export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
  raw?: unknown;

  constructor(opts: {
    message: string;
    status: number;
    code?: string;
    errors?: Record<string, string[]>;
    raw?: unknown;
  }) {
    super(opts.message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.errors = opts.errors;
    this.raw = opts.raw;
  }
}

// Generic message-only response, e.g. logout, wishlist add/remove, password reset.
export interface MessageResponse {
  message: string;
}

/** One bar of a 5→1 star histogram. */
export interface RatingBucket {
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
}

export interface RatingSummary {
  average: number;
  total: number;
  /** Ordered 5→1, as the designs stack them. */
  distribution: RatingBucket[];
}

/**
 * A message split into plain and emphasised runs. Pre-segmented by the API so
 * bolded entities survive without client-side template parsing. Used by the
 * shopper activity feed and the ticket thread's system events.
 */
export interface ActivitySegment {
  text: string;
  strong?: boolean;
}
