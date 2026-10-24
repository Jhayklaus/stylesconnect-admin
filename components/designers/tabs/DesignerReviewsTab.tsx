"use client";

import { MoreHorizontal } from "lucide-react";
import {
  CopyButton,
  EmptyState,
  FilterDropdown,
  IconButton,
  Pagination,
  RatingSummary,
  Skeleton,
} from "@/components/ui";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { useDesignerReviews } from "@/hooks/designers/useDesignerDetail";
import { useListParams } from "@/hooks/useListParams";
import type { DesignerDetail, DesignerReviewItem } from "@/services/designers";

const RATING_OPTIONS = [
  { value: "all", label: "Ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All reviews" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

function DesignerReview({ review }: { review: DesignerReviewItem }) {
  return (
    <ReviewCard
      reviewer={review.reviewer}
      createdAt={review.created_at}
      rating={review.rating}
      body={review.body}
      images={review.images}
      meta={
        <span className="inline-flex items-center gap-1.5 font-jost text-sm leading-5 text-text-500">
          {review.reference}
          <CopyButton value={review.reference} label="Review ID" />
        </span>
      }
      context={
        <>
          Order: <span className="text-text-900 underline">{review.order.product_title}</span>
        </>
      }
      actions={
        <IconButton
          label="Review actions"
          size="sm"
          className="border-0 bg-transparent"
          icon={<MoreHorizontal className="h-[18px] w-[18px]" />}
        />
      }
    />
  );
}

export function DesignerReviewsTab({
  designerId,
  detail,
  isLoading: detailLoading,
}: {
  designerId: string;
  detail: DesignerDetail | undefined;
  isLoading?: boolean;
}) {
  const params = useListParams({ perPage: 5, filterKeys: ["rating", "status"] });
  const { data, isLoading, error } = useDesignerReviews(designerId, {
    page: params.page,
    per_page: params.perPage,
    rating: params.filters.rating,
    status: params.filters.status,
  });

  return (
    <div className="flex flex-col gap-6">
      {detailLoading || !detail ? (
        <Skeleton className="h-28 w-full" />
      ) : (
        <RatingSummary rating={detail.rating} title="Ratings" />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Ratings"
          align="start"
          options={RATING_OPTIONS}
          value={params.filters.rating}
          onChange={(v) => params.setFilter("rating", v)}
        />
        <FilterDropdown
          label="All reviews"
          align="start"
          options={STATUS_OPTIONS}
          value={params.filters.status}
          onChange={(v) => params.setFilter("status", v)}
        />
      </div>

      {isLoading && (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {error && <EmptyState title="Couldn't load reviews" description={error.message} />}

      {!isLoading && !error && data && data.data.length === 0 && (
        <EmptyState title="No reviews yet" description="Nobody has reviewed this designer." />
      )}

      {!isLoading && !error && data && data.data.length > 0 && (
        <>
          <div className="flex flex-col gap-6">
            {data.data.map((review) => (
              <DesignerReview key={review.id} review={review} />
            ))}
          </div>
          {data.meta.last_page > 1 && (
            <Pagination
              page={data.meta.current_page}
              pageCount={data.meta.last_page}
              onChange={params.setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
