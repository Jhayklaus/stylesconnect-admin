import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchWaitlist,
  userKeys,
  type PlatformUser,
  type UserListParams,
  type WaitlistEntry,
  type WaitlistParams,
} from "@/services/users";
import type { ApiError, Paginated } from "@/services/types";

export function useUsers(params: UserListParams) {
  return useQuery<Paginated<PlatformUser>, ApiError>({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useWaitlist(params: WaitlistParams) {
  return useQuery<Paginated<WaitlistEntry>, ApiError>({
    queryKey: userKeys.waitlist(params),
    queryFn: () => fetchWaitlist(params),
    placeholderData: keepPreviousData,
  });
}
