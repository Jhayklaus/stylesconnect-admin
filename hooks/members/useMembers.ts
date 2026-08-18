import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchMembers,
  memberKeys,
  type Member,
  type MemberListParams,
} from "@/services/members";
import type { ApiError, Paginated } from "@/services/types";

export function useMembers(params: MemberListParams) {
  return useQuery<Paginated<Member>, ApiError>({
    queryKey: memberKeys.list(params),
    queryFn: () => fetchMembers(params),
    placeholderData: keepPreviousData,
  });
}
