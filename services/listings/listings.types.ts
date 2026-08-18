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
