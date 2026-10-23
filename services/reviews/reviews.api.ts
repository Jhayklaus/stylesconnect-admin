import { apiClient } from "../client";
import type { Paginated } from "../types";
import type { ModerationReview, ReviewListParams, ReviewQueue, ReviewStatus } from "./reviews.types";

const PATH: Record<ReviewQueue, string> = {
  product: "/admin/reviews",
  store: "/admin/store-reviews",
};

/** GET /admin/reviews · GET /admin/store-reviews */
export async function fetchModerationReviews(
  queue: ReviewQueue,
  params: ReviewListParams = {}
): Promise<Paginated<ModerationReview>> {
  const { data } = await apiClient.get<Paginated<ModerationReview>>(PATH[queue], { params });
  return data;
}

/** PATCH /admin/reviews/:id/status · PATCH /admin/store-reviews/:id/status */
export async function setReviewStatus(
  queue: ReviewQueue,
  id: number,
  status: ReviewStatus
): Promise<void> {
  await apiClient.patch(`${PATH[queue]}/${id}/status`, { status });
}
