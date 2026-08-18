import type { RatingSummary } from "../types";
export type ListingStatus = "published" | "inactive" | "unlisted";
export type ListingReview = "reviewed" | "awaiting_review";

export interface Listing {
  id: string;
  /** Merchant-facing SKU shown in the Product ID column. */
  product_id: string;
  title: string;
  category: string;
  image_url: string;
  in_stock: boolean;
  total_sold: number;
  /** Naira, whole units. */
  unit_price: number;
  status: ListingStatus;
  review_state: ListingReview;
  created_at: string;
}

export interface ListingListParams {
  page?: number;
  per_page?: number;
  q?: string;
  review_state?: ListingReview;
  status?: ListingStatus | "all";
  category?: string;
  sort?: "recent" | "price_desc" | "sold_desc";
}

export interface ListingStore {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface ListingSizes {
  adult: string[];
  kids: string[];
}

/** GET /admin/listings/:id */
export interface ListingDetail extends Listing {
  description: string;
  photos: string[];
  colors: string[];
  /** "Full body, T-shirt" */
  product_type: string;
  /** Who it's cut for — "Unisex", "Women". */
  audience: string;
  sizes: ListingSizes;
  /** Production window, e.g. "2—3 weeks". */
  timeline: string;
  /** Null when the designer marks it always available. */
  stock_quantity: number | null;
  store: ListingStore;
  rating: RatingSummary;
  /** Neighbours in the default list order, for the header's prev/next arrows. */
  prev_id: string | null;
  next_id: string | null;
}

export interface ListingOrderRow {
  id: string;
  /** Display form: "IKU—1045". */
  order_id: string;
  customer: { id: string; name: string; avatar_url: string | null };
  quantity: number;
  amount: number;
  status: "paid" | "pending" | "failed" | "cancelled";
  ordered_at: string;
}
