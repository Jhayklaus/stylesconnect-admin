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
  /** "customer" (a shopper), "designer", "admin" — can be several, or none. */
  roles: string[];
  created_at: string;
}

export type WaitlistType = "customer" | "designer";

/**
 * Production's waitlist was empty when this was written. Shaped from the
 * consumer app's join form (POST /waitlist); `users.api.ts` reads every field
 * defensively. Re-check against a real row.
 */
export interface WaitlistEntry {
  id: string;
  type: WaitlistType;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  created_at: string;
}

export interface UserListParams {
  page?: number;
  per_page?: number;
}

export interface WaitlistParams extends UserListParams {
  type?: WaitlistType | "all";
}
