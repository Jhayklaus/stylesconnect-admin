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
