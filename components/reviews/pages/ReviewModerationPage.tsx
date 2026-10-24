"use client";

import { useState } from "react";
import { AdminTopBar, type Crumb } from "@/components/shell";
import {
  Button,
  ConfirmModal,
  EmptyState,
  Pagination,
  SegmentedTabs,
  Skeleton,
} from "@/components/ui";
import { useModerationReviews, useSetReviewStatus } from "@/hooks/reviews/useModerationReviews";
import { useListParams } from "@/hooks/useListParams";
import {
  REVIEW_QUEUE_LABEL,
  type ModerationReview,
  type ReviewQueue,
  type ReviewStatus,
} from "@/services/reviews";
import { ReviewCard } from "../ReviewCard";

const TABS: { value: ReviewStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const EMPTY_COPY: Record<ReviewStatus, string> = {
  pending: "Nothing waiting for moderation. New reviews land here first.",
  approved: "No approved reviews yet.",
  rejected: "No rejected reviews.",
};

export function ReviewModerationPage({ queue }: { queue: ReviewQueue }) {
  const params = useListParams({ tab: "pending", perPage: 5 });
  const status = params.tab as ReviewStatus;
  const { data, isLoading, error } = useModerationReviews(queue, {
    page: params.page,
    per_page: params.perPage,
    status,
  });
  const setStatus = useSetReviewStatus(queue);
  const [rejecting, setRejecting] = useState<ModerationReview | null>(null);

  const crumbs: Crumb[] = [{ label: "Reviews" }, { label: REVIEW_QUEUE_LABEL[queue] }];
  const busyId = setStatus.isPending ? setStatus.variables?.id : undefined;

  function actionsFor(review: ModerationReview) {
    const busy = busyId === review.id;
    return (
      <>
        {review.status !== "rejected" && (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => setRejecting(review)}>
            Reject
          </Button>
        )}
        {review.status !== "approved" && (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => setStatus.mutate({ id: review.id, status: "approved" })}
          >
            {busy ? "Saving…" : "Approve"}
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <AdminTopBar breadcrumb={crumbs} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} className="self-start" />

        {isLoading && (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {error && <EmptyState title="Couldn't load reviews" description={error.message} />}

        {!isLoading && !error && data?.data.length === 0 && (
          <EmptyState title="No reviews" description={EMPTY_COPY[status]} />
        )}

        {!isLoading && !error && data && data.data.length > 0 && (
          <>
            <div className="flex flex-col gap-6">
              {data.data.map((review) => (
                <ReviewCard
                  key={review.id}
                  reviewer={review.reviewer}
                  createdAt={review.created_at}
                  rating={review.rating}
                  body={review.comment}
                  images={review.images}
                  meta={
                    <span className="font-jost text-sm leading-5 text-text-500">#{review.id}</span>
                  }
                  context={
                    review.subject && (
                      <>
                        {queue === "product" ? "Product" : "Store"}:{" "}
                        <span className="text-text-900">{review.subject}</span>
                      </>
                    )
                  }
                  actions={actionsFor(review)}
                />
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

      <ConfirmModal
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title="Reject this review?"
        description="It will be hidden from the storefront. You can approve it again later from the Rejected tab."
        confirmLabel="Reject review"
        danger
        isPending={setStatus.isPending}
        onConfirm={() =>
          rejecting &&
          setStatus.mutate(
            { id: rejecting.id, status: "rejected" },
            { onSuccess: () => setRejecting(null) }
          )
        }
      />
    </>
  );
}
