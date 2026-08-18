import type { RevenueRange } from "./overview.types";

export const overviewKeys = {
  all: ["overview"] as const,
  summary: (range: RevenueRange) => [...overviewKeys.all, "summary", range] as const,
};
