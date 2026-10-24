import type { ReviewListParams, ReviewQueue } from "./reviews.types";

export const reviewKeys = {
  all: ["reviews"] as const,
  queue: (queue: ReviewQueue) => [...reviewKeys.all, queue] as const,
  list: (queue: ReviewQueue, params: ReviewListParams) =>
    [...reviewKeys.queue(queue), "list", params] as const,
};
