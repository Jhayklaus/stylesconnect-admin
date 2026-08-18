export type MemberStatus = "active" | "invited" | "deactivated";

/** Free text in the designs rather than a fixed enum — kept as a string. */
export type MemberRole = string;

/**
 * Roles offered in the Roles filter. Lives here rather than in the fixture
 * file because the filter still needs it once `members.mock.ts` is deleted.
 */
export const MEMBER_ROLES = ["Dev ops/IT", "Operation", "Customer support", "Admin"];

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  /** When they joined — drives the "Since June, 2021" subtitle. */
  joined_at: string | null;
  added_at: string;
  /** Null for members who were invited but have never signed in. */
  last_login_at: string | null;
}

export interface MemberListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: MemberStatus | "all";
  role?: MemberRole | "all";
}
