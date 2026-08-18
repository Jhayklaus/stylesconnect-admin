export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  /**
   * Server-owned. The sidebar label and any future permission checks derive
   * from here — never from client storage, which is why the consumer app's
   * localStorage `mock_auth_role` was deliberately not carried over.
   */
  roles: string[];
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

/** Title-cased primary role for display — "Admin", "Support". */
export function primaryRoleLabel(user: AdminUser | null | undefined): string {
  const role = user?.roles?.[0];
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/[_-]+/g, " ");
}
