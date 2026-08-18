import type { PaymentListParams } from "./payments.types";

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (params: PaymentListParams) => [...paymentKeys.lists(), params] as const,
  detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
};
