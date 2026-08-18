import type { ReturnListParams } from "./returns.types";

export const returnKeys = {
  all: ["returns"] as const,
  lists: () => [...returnKeys.all, "list"] as const,
  list: (params: ReturnListParams) => [...returnKeys.lists(), params] as const,
  detail: (id: string) => [...returnKeys.all, "detail", id] as const,
};
