/** GET /admin/users — every account, regardless of role. */
export interface PlatformUser {
  uuid: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  gender: string | null;
  profile_picture_url: string | null;
  is_email_verified: boolean;
  /** "designer", "shopper", "admin". */
  roles: string[];
  created_at: string;
}

/**
 * Production's waitlist was empty when this was written, so only the id is
 * certain — widen from a real payload before building the screen.
 */
export interface WaitlistEntry {
  id: number | string;
  [field: string]: unknown;
}

export interface UserListParams {
  page?: number;
  per_page?: number;
}

export interface WaitlistParams extends UserListParams {
  type?: string;
}
