import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, delay, mockPaginate } from "../mock/transport";
import { MOCK_MEMBERS } from "./members.mock";
import type { AdminRow, Member, MemberListParams, MemberRole } from "./members.types";

/**
 * /admin/admins returns bare user rows with no role or invite state — every
 * row is a signed-up admin, so role and status are fixed until the team
 * endpoints land.
 */
function toMember(row: AdminRow): Member {
  const name = [row.first_name, row.last_name].filter(Boolean).join(" ") || row.email;
  return {
    id: row.uuid,
    name,
    email: row.email,
    avatar_url: row.profile_picture_url,
    role: "Admin",
    status: row.deleted_at ? "deactivated" : "active",
    joined_at: row.created_at,
    added_at: row.created_at,
    last_login_at: row.last_login_at,
  };
}

/**
 * GET /admin/admins — paginates, but ignores search and filters for now,
 * which is why the page hides them.
 */
export async function fetchMembers(
  params: MemberListParams = {}
): Promise<Paginated<Member>> {
  if (MOCKS.members) {
    await delay();
    let rows = MOCK_MEMBERS;

    rows = applySearch(rows, params.q, ["name", "email", "role"]);
    rows = applyFilter(rows, params.status, (m) => m.status);
    rows = applyFilter(rows, params.role, (m) => m.role);

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<AdminRow>>("/admin/admins", {
    params: { page: params.page, per_page: params.per_page },
  });
  return { ...data, data: data.data.map(toMember) };
}

export interface MemberInvite {
  email: string;
  role: MemberRole;
}

// The four calls below target endpoints that don't exist yet; the UI is
// hidden behind TEAM_ENDPOINTS_LIVE until they do.

/** POST /admin/team/invites */
export async function inviteMembers(invites: MemberInvite[]): Promise<Member[]> {
  if (MOCKS.members) {
    await delay();
    return invites.map((invite, i) => ({
      id: `MEM-invite-${Date.now()}-${i}`,
      name: invite.email.split("@")[0],
      email: invite.email,
      avatar_url: null,
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
