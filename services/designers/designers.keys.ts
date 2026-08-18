import type { DesignerListParams } from "./designers.types";

export const designerKeys = {
  all: ["designers"] as const,
  lists: () => [...designerKeys.all, "list"] as const,
  list: (params: DesignerListParams) => [...designerKeys.lists(), params] as const,
  stats: () => [...designerKeys.all, "stats"] as const,
  detail: (id: string) => [...designerKeys.all, "detail", id] as const,
};
