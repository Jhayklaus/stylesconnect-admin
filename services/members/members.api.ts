import { apiClient } from "../client";
import type { Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_MEMBERS } from "./members.mock";
import type { Member, MemberListParams } from "./members.types";

/** GET /admin/team/members */
export async function fetchMembers(
  params: MemberListParams = {}
): Promise<Paginated<Member>> {
  if (MOCKS.members) {
    await delay();
    let rows = MOCK_MEMBERS;

    rows = applySearch(rows, params.q, ["name", "email", "role"]);
    rows = applyFilter(rows, params.status, (m) => m.status);
    rows = applyFilter(rows, params.role, (m) => m.role);

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, "/admin/team/members");
  }

  const { data } = await apiClient.get<Paginated<Member>>("/admin/team/members", { params });
  return data;
}
