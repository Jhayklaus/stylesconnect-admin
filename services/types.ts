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

// Laravel-style pagination — visible on /designer/reviews and /listings/:id/reviews.
// from: Designer > Fetch Designer Listings Reviews
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: { url: string | null; label: string; active: boolean }[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLinks;
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
