export type ShopperStatus = "active" | "inactive" | "deactivated";

export interface Shopper {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  order_count: number;
  /** Naira, whole units. */
  total_spend: number;
  status: ShopperStatus;
  last_order_at: string;
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

export interface ShopperStats {
  total: number;
  active: number;
  inactive: number;
  deactivated: number;
  total_delta: number;
  active_delta: number;
  inactive_delta: number;
  deactivated_delta: number;
}
