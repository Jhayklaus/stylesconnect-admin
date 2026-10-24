import type { ActivitySegment } from "../types";
export type ShopperStatus = "active" | "inactive" | "deactivated";

export interface Shopper {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  order_count: number;
  /** Naira. */
  total_spend: number;
  status: ShopperStatus;
  /** Null for shoppers who have never ordered. */
  last_order_at: string | null;
  joined_at: string;
}

export interface ShopperListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: ShopperStatus | "all";
  segment?: "all" | "returning" | "new";
  /** Total-spend band. */
  spend?: "all" | "under_50m" | "50m_150m" | "over_150m";
  sort?: "recent" | "name_asc" | "name_desc" | "spend_desc";
}

/** Deltas are null when there's no prior period to compare against. */
export interface ShopperStats {
  total: number;
  active: number;
  inactive: number;
  deactivated: number;
  total_delta: number | null;
  active_delta: number | null;
  inactive_delta: number | null;
  deactivated_delta: number | null;
}

export type { ActivitySegment } from "../types";

export type ActivityKind = "account" | "order" | "payment";

export interface ShopperActivity {
  id: string;
  kind: ActivityKind;
  /** Machine name of the event: "account.logged_in". */
  action: string;
  segments: ActivitySegment[];
  created_at: string;
}

/** GET /admin/shoppers/:id */
export interface ShopperDetail extends Shopper {
  /** Display form with the hash: "#4536546". */
  customer_id: string;
  phone: string | null;
  address: string | null;
  country: string | null;
  date_of_birth: string | null;
  gender: string | null;
  last_login_at: string | null;
  order_stats: {
    total_spend: number;
    order_count: number;
    ongoing: number;
    unfulfilled: number;
  };
  /** Neighbours in the default list order, for the header's prev/next arrows. */
  prev_id: string | null;
  next_id: string | null;
}

export interface ShopperSubListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: string;
  sort?: string;
}
