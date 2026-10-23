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
  avatar_url: string | null;
  role: MemberRole;
  status: MemberStatus;
  /** When they joined — drives the "Since June, 2021" subtitle. */
  joined_at: string | null;
  added_at: string;
  /** Null for members who were invited but have never signed in. */
  last_login_at: string | null;
}

/**
 * The list currently comes from /admin/admins, which ignores search and
 * filters, and invite / change role / remove / resend have no backend yet.
 * Flip this when the team endpoints ship — it un-hides the filters, the
 * Invite button and the row menu together.
 */
export const TEAM_ENDPOINTS_LIVE = false;

/** A row from GET /admin/admins — the raw user model. */
export interface AdminRow {
  id: number;
  uuid: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_picture_url: string | null;
  last_login_at: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface MemberListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: MemberStatus | "all";
  role?: MemberRole | "all";
}
