import type { RefundListParams } from "./refunds.types";

export const refundKeys = {
  all: ["refunds"] as const,
  lists: () => [...refundKeys.all, "list"] as const,
  list: (params: RefundListParams) => [...refundKeys.lists(), params] as const,
  stats: () => [...refundKeys.all, "stats"] as const,
  detail: (id: string) => [...refundKeys.all, "detail", id] as const,
};
