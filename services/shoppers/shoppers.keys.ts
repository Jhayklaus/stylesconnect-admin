import type { ShopperListParams } from "./shoppers.types";

export const shopperKeys = {
  all: ["shoppers"] as const,
  lists: () => [...shopperKeys.all, "list"] as const,
  list: (params: ShopperListParams) => [...shopperKeys.lists(), params] as const,
  stats: () => [...shopperKeys.all, "stats"] as const,
  detail: (id: string) => [...shopperKeys.all, "detail", id] as const,
};
