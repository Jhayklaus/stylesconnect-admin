import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_MEMBERS } from "./members.mock";
import type { Member, MemberListParams, MemberRole } from "./members.types";

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

export interface MemberInvite {
  email: string;
  role: MemberRole;
}

/** POST /admin/team/invites */
export async function inviteMembers(invites: MemberInvite[]): Promise<Member[]> {
  if (MOCKS.members) {
    await delay();
    return invites.map((invite, i) => ({
      id: `MEM-invite-${Date.now()}-${i}`,
      name: invite.email.split("@")[0],
      email: invite.email,
      role: invite.role,
      status: "invited" as const,
      joined_at: null,
      added_at: new Date().toISOString(),
      last_login_at: null,
    }));
  }

  const { data } = await apiClient.post<ApiEnvelope<Member[]>>("/admin/team/invites", { invites });
  return data.data;
}

/** PATCH /admin/team/members/:id */
export async function updateMemberRole(id: string, role: MemberRole): Promise<Member> {
  if (MOCKS.members) {
    await delay();
    const member = MOCK_MEMBERS.find((m) => m.id === id);
    if (!member) throw new ApiError({ message: "Member not found", status: 404 });
    return { ...member, role };
  }

  const { data } = await apiClient.patch<ApiEnvelope<Member>>(`/admin/team/members/${id}`, {
    role,
  });
  return data.data;
}

/** DELETE /admin/team/members/:id */
export async function removeMember(id: string): Promise<void> {
  if (MOCKS.members) {
    await delay();
    return;
  }

  await apiClient.delete(`/admin/team/members/${id}`);
}

/** POST /admin/team/members/:id/resend-invite */
export async function resendInvite(id: string): Promise<void> {
  if (MOCKS.members) {
    await delay();
    return;
  }

  await apiClient.post(`/admin/team/members/${id}/resend-invite`);
}
