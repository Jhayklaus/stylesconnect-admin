import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchModerationReviews,
  reviewKeys,
  setReviewStatus,
  type ModerationReview,
  type ReviewListParams,
  type ReviewQueue,
  type ReviewStatus,
} from "@/services/reviews";
import { designerKeys } from "@/services/designers";
import { toast } from "@/lib/toast";
import type { ApiError, Paginated } from "@/services/types";

export function useModerationReviews(queue: ReviewQueue, params: ReviewListParams) {
  return useQuery<Paginated<ModerationReview>, ApiError>({
    queryKey: reviewKeys.list(queue, params),
    queryFn: () => fetchModerationReviews(queue, params),
    placeholderData: keepPreviousData,
  });
}

export function useSetReviewStatus(queue: ReviewQueue) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { id: number; status: ReviewStatus }>({
    mutationFn: ({ id, status }) => setReviewStatus(queue, id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.queue(queue) });
      // Approving or rejecting changes what a designer's profile shows.
      queryClient.invalidateQueries({ queryKey: designerKeys.all });
      toast.success(`Review ${status}`);
    },
    onError: (error) => toast.error(error.message),
  });
}
