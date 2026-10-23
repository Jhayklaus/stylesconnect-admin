import { apiClient } from "../client";
import type { Paginated } from "../types";
import type { PlatformUser, UserListParams, WaitlistEntry, WaitlistParams } from "./users.types";

/** GET /admin/users */
export async function fetchUsers(params: UserListParams = {}): Promise<Paginated<PlatformUser>> {
  const { data } = await apiClient.get<Paginated<PlatformUser>>("/admin/users", { params });
  return data;
}

/** GET /admin/waitlist */
export async function fetchWaitlist(params: WaitlistParams = {}): Promise<Paginated<WaitlistEntry>> {
  const { data } = await apiClient.get<Paginated<WaitlistEntry>>("/admin/waitlist", { params });
  return data;
}
