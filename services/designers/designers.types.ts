import type { RatingSummary } from "../types";
export type DesignerStatus = "active" | "inactive" | "deactivated";
export type SubscriptionStatus = "active" | "inactive";

export interface Designer {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  active_listings: number;
  subscription: SubscriptionStatus;
  /** Naira, whole units. */
  total_sales: number;
  status: DesignerStatus;
  joined_at: string;
}

/** Mirrors the params the real GET /admin/designers will accept. */
export interface DesignerListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: DesignerStatus | "all";
  subscription?: SubscriptionStatus | "all";
  sort?: "name_asc" | "name_desc" | "sales_desc" | "recent";
}

export interface DesignerStats {
  total: number;
  active: number;
  inactive: number;
  deactivated: number;
  total_delta: number;
  active_delta: number;
  inactive_delta: number;
  deactivated_delta: number;
}

export type { RatingBucket } from "../types";

/** The Reviews tab histogram — the shared shape, named for this domain. */
export type DesignerRating = RatingSummary;

/** GET /admin/designers/:id — the profile screen's left column plus header. */
export interface DesignerDetail extends Designer {
  /** Display form with the hash: "#4536546". */
  customer_id: string;
  phone: string;
  address: string;
  country: string;
  date_of_birth: string;
  gender: string;
  last_login_at: string;
  subscription_plan: string;
  subscription_started_at: string;
  subscription_ends_at: string;
  listing_stats: {
    total_listed: number;
    live: number;
    unlisted: number;
  };
  rating: DesignerRating;
  /** Neighbours in the default list order, for the header's prev/next arrows. */
  prev_id: string | null;
  next_id: string | null;
}

export type DesignerTransactionType = "order" | "subscription";

export interface DesignerTransaction {
  id: string;
  /** Display form: "#AD-HJRT2T". */
  reference: string;
  amount: number;
  type: DesignerTransactionType;
  /** Already display-ready: "Mastercard xxx234", "Bank transfer". */
  payment_method: string;
  status: "paid" | "pending" | "failed";
  created_at: string;
}

export interface DesignerReviewItem {
  id: string;
  /** Display form: "ID-126473637". */
  reference: string;
  rating: number;
  body: string;
  created_at: string;
  reviewer: { id: string; name: string; avatar_url: string | null };
  order: { id: string; product_title: string };
  /** Attached photos; empty when the shopper posted none. */
  images: string[];
}

export interface DesignerSubListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  type?: string;
  period?: "all" | "7d" | "30d" | "90d";
  rating?: string;
  sort?: string;
}
