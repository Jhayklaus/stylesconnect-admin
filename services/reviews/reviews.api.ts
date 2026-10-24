import { apiClient } from "../client";
import { ApiError, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, delay, mockPaginate } from "../mock/transport";
import { MOCK_REVIEWS } from "./reviews.mock";
import type { ModerationReview, ReviewListParams, ReviewQueue, ReviewStatus } from "./reviews.types";

const PATH: Record<ReviewQueue, string> = {
  product: "/admin/reviews",
  store: "/admin/store-reviews",
};

type Raw = Record<string, unknown>;

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

/**
 * Builds the display shape from whatever the API sends. Unverified against a
 * real row (production had none), so every field has a fallback — reading the
 * consumer shape (`comment`, `images[].image_url`) and the admin designer-review
 * shape (`body`, `images: string[]`) alike.
 */
function normalizeReview(raw: Raw): ModerationReview {
  const reviewer = (raw.reviewer ?? raw.user ?? {}) as Raw;
  const listing = (raw.listing ?? {}) as Raw;
  const store = (raw.store ?? raw.designer ?? {}) as Raw;
  const images = Array.isArray(raw.images) ? raw.images : [];

  return {
    id: Number(raw.id),
    rating: Number(raw.rating) || 0,
    comment: str(raw.comment) ?? str(raw.body) ?? "",
    status: (str(raw.status) ?? "pending") as ReviewStatus,
    reviewer: {
      name: str(reviewer.name) ?? "Anonymous",
      avatar_url: str(reviewer.avatar_url) ?? str(reviewer.profile_picture_url),
    },
    images: images
      .map((img) => (typeof img === "string" ? img : str((img as Raw)?.image_url)))
      .filter((src): src is string => Boolean(src)),
    subject:
      str(listing.title) ?? str(store.business_name) ?? str(store.name) ?? str(raw.listing_title),
    created_at: str(raw.created_at) ?? new Date(0).toISOString(),
  };
}

/** GET /admin/reviews · GET /admin/store-reviews */
export async function fetchModerationReviews(
  queue: ReviewQueue,
  params: ReviewListParams = {}
): Promise<Paginated<ModerationReview>> {
  if (MOCKS.reviews) {
    await delay();
    const rows = applyFilter(MOCK_REVIEWS[queue], params.status, (r) => r.status);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Raw>>(PATH[queue], { params });
  return { ...data, data: data.data.map(normalizeReview) };
}

/** PATCH /admin/reviews/:id/status · PATCH /admin/store-reviews/:id/status */
export async function setReviewStatus(
  queue: ReviewQueue,
  id: number,
  status: ReviewStatus
): Promise<void> {
  if (MOCKS.reviews) {
    await delay();
    const review = MOCK_REVIEWS[queue].find((r) => r.id === id);
    if (!review) throw new ApiError({ message: "Review not found", status: 404 });
    review.status = status;
    return;
  }

  await apiClient.patch(`${PATH[queue]}/${id}/status`, { status });
}
