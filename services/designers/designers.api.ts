import { apiClient } from "../client";
import type { ApiEnvelope, Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import { MOCK_DESIGNERS, MOCK_DESIGNER_STATS } from "./designers.mock";
import type { Designer, DesignerListParams, DesignerStats } from "./designers.types";

const SORTS: Record<string, (a: Designer, b: Designer) => number> = {
  name_asc: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
  sales_desc: (a, b) => b.total_sales - a.total_sales,
  recent: (a, b) => +new Date(b.joined_at) - +new Date(a.joined_at),
};

/** GET /admin/designers */
export async function fetchDesigners(
  params: DesignerListParams = {}
): Promise<Paginated<Designer>> {
  if (MOCKS.designers) {
    await delay();
    let rows = MOCK_DESIGNERS;
    rows = applySearch(rows, params.q, ["name", "email"]);
    rows = applyFilter(rows, params.status, (d) => d.status);
    rows = applyFilter(rows, params.subscription, (d) => d.subscription);
    rows = applySort(rows, params.sort, SORTS);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, "/admin/designers");
  }

  const { data } = await apiClient.get<Paginated<Designer>>("/admin/designers", { params });
  return data;
}

/** GET /admin/designers/stats */
export async function fetchDesignerStats(): Promise<DesignerStats> {
  if (MOCKS.designers) {
    await delay(200);
    return MOCK_DESIGNER_STATS;
  }

  const { data } = await apiClient.get<ApiEnvelope<DesignerStats>>("/admin/designers/stats");
  return data.data;
}
