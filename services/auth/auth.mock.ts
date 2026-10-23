import type { AdminUser } from "./auth.types";

/**
 * The signed-in admin while the fixture layer is on. Matches the person shown
 * in the sidebar card across every design frame.
 */
export const MOCK_ADMIN: AdminUser = {
  id: 1,
  user_uuid: "ADM-1",
  name: "Sophia Williams",
  first_name: "Sophia",
  last_name: "Williams",
  email: "sophia.williams@styleconnect.com",
  avatar_url: null,
  roles: ["admin"],
};

/**
 * Any well-formed credentials sign in — there is no real user store yet, and
 * hardcoding a working password would read like a real one. Sign in with this
 * address instead to exercise the rejection path.
 */
export const MOCK_LOCKED_EMAIL = "locked@styleconnect.com";

/** Opaque stand-in for the Sanctum token the API will issue. */
export const MOCK_TOKEN = "mock-session-token";
