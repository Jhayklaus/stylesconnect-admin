import type { RatingSummary } from "../types";
export type DesignerStatus = "active" | "inactive" | "deactivated";

export interface Designer {
  /** Designer profile uuid — not the user id. */
  id: string;
  /** The store's business name. */
  name: string;
  /** The account holder's full name. */
  owner_name: string;
  email: string;
  avatar_url: string | null;
  active_listings: number;
  /** Naira. */
  total_sales: number;
  is_verified: boolean;
  status: DesignerStatus;
  joined_at: string;
}

/** Mirrors the params the real GET /admin/designers will accept. */
export interface DesignerListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: DesignerStatus | "all";
  sort?: "name_asc" | "name_desc" | "sales_desc" | "recent";
}

/** Deltas are null when there's no prior period to compare against. */
export interface DesignerStats {
  total: number;
  active: number;
  inactive: number;
  deactivated: number;
  total_delta: number | null;
  active_delta: number | null;
  inactive_delta: number | null;
  deactivated_delta: number | null;
}

export type { RatingBucket } from "../types";

/** The Reviews tab histogram — the shared shape, named for this domain. */
export type DesignerRating = RatingSummary;

/** GET /admin/designers/:id — the profile screen's left column plus header. */
export interface DesignerDetail extends Designer {
  /** Display form with the hash: "#4536546". */
  customer_id: string;
  /** The owning user's uuid. */
  user_id: string;
  phone: string | null;
  address: string | null;
  country: string | null;
  date_of_birth: string | null;
  gender: string | null;
  last_login_at: string | null;
  verification_status: string | null;
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

/** Commission-based — there are no subscription payments. */
export type DesignerTransactionType = "order";

export interface DesignerTransaction {
  id: string;
  /** The payment gateway's reference: "chk_eXLdQtOyJvjs4P88". */
  reference: string;
  /** The designer's share of the order. */
  amount: number;
  /** What the shopper paid, delivery included. */
  order_total: number;
  type: DesignerTransactionType;
  /** Display form: "#178A4D41". */
  order_id: string;
  /** Already display-ready: "Mastercard xxx234", "Bank transfer". Null when the gateway didn't say. */
  payment_method: string | null;
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

/** Shared by the profile's three tabs; each endpoint reads only its own keys. */
export interface DesignerSubListParams {
  page?: number;
  per_page?: number;
  q?: string;
  /** listings: published | draft · transactions: paid | pending | failed · reviews: pending | approved | rejected */
  status?: string;
  /** transactions only — "order" is the only value. */
  type?: string;
  /** reviews only, "1"–"5". */
  rating?: string;
  sort?: string;
}
