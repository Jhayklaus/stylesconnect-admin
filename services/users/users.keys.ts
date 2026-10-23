import type { UserListParams, WaitlistParams } from "./users.types";

export const userKeys = {
  all: ["users"] as const,
  list: (params: UserListParams) => [...userKeys.all, "list", params] as const,
  waitlist: (params: WaitlistParams) => [...userKeys.all, "waitlist", params] as const,
};
