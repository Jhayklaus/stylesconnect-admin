"use client";

import Image from "next/image";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import {
  Avatar,
  CopyButton,
  EmptyState,
  FilterDropdown,
  IconButton,
  Pagination,
  Rating,
  RatingSummary,
  Skeleton,
} from "@/components/ui";
import { useDesignerReviews } from "@/hooks/designers/useDesignerDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatDateShort, formatTime } from "@/lib/format";
import type { DesignerDetail, DesignerReviewItem } from "@/services/designers";

const RATING_OPTIONS = [
  { value: "all", label: "Ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const PRODUCT_OPTIONS = [{ value: "all", label: "All products" }];

const PERIOD_OPTIONS = [
  { value: "all", label: "Date posted" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

function ReviewCard({ review }: { review: DesignerReviewItem }) {
  return (
    <article className="flex flex-col gap-3 border-b border-stroke-soft pb-6 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={review.reviewer.avatar_url} name={review.reviewer.name} size="sm" />
          <span className="font-jost font-medium text-sm leading-5 text-text-900">
            {review.reviewer.name}
          </span>
          <span className="font-jost text-sm leading-5 text-text-300">
            • {formatDateShort(review.created_at)} {formatTime(review.created_at)}
          </span>
        </div>
        <IconButton
          label="Review actions"
          size="sm"
          className="border-0 bg-transparent"
          icon={<MoreHorizontal className="h-[18px] w-[18px]" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 font-jost text-sm leading-5 text-text-500">
          {review.reference}
          <CopyButton value={review.reference} label="Review ID" />
        </span>
        <Rating value={review.rating} size="sm" />
      </div>

      <p className="border-l-2 border-stroke-soft pl-3 font-jost text-sm leading-5 text-text-500">
        Order: <span className="text-text-900 underline">{review.order.product_title}</span>
      </p>

      <p className="font-jost text-sm leading-5 text-text-900">{review.body}</p>

      {review.images.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {review.images.map((src, i) => (
            <li key={`${review.id}-img-${i}`}>
              <Image
                src={src}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg border border-stroke-soft object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </article>
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
  const params = useListParams({ perPage: 5, filterKeys: ["rating", "product", "period"] });
  const { data, isLoading, error } = useDesignerReviews(designerId, {
    page: params.page,
    per_page: params.perPage,
    rating: params.filters.rating,
    period: params.filters.period as "all" | "7d" | "30d" | "90d",
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
          label="All products"
          align="start"
          options={PRODUCT_OPTIONS}
          value={params.filters.product}
          onChange={(v) => params.setFilter("product", v)}
        />
        <FilterDropdown
          label="Date posted"
          align="start"
          icon={<CalendarDays className="h-4 w-4 shrink-0" aria-hidden />}
          options={PERIOD_OPTIONS}
          value={params.filters.period}
          onChange={(v) => params.setFilter("period", v)}
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
              <ReviewCard key={review.id} review={review} />
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
