import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";
import { MOCKS } from "../mock/config";
import { delay } from "../mock/transport";
import {
  MOCK_FINANCE,
  MOCK_OVERVIEW_STATS,
  MOCK_RECENT_ORDERS,
  MOCK_RECENT_TICKETS,
  MOCK_RECENT_TRANSACTIONS,
  MOCK_REVENUE,
} from "./overview.mock";
import type { OverviewSummary, RevenueRange } from "./overview.types";

/**
 * GET /admin/overview
 *
 * One composed payload rather than five round trips — the dashboard renders
 * as a unit, so a single request keeps the shell from popping in piecemeal.
 */
export async function fetchOverview(
  range: RevenueRange = "last_year"
): Promise<OverviewSummary> {
  if (MOCKS.overview) {
    await delay();
    return {
      stats: MOCK_OVERVIEW_STATS,
      revenue: MOCK_REVENUE,
      finance: MOCK_FINANCE,
      tickets: MOCK_RECENT_TICKETS,
      transactions: MOCK_RECENT_TRANSACTIONS,
      orders: MOCK_RECENT_ORDERS,
    };
  }

  const { data } = await apiClient.get<ApiEnvelope<OverviewSummary>>("/admin/overview", {
    params: { range },
  });
  return data.data;
}
