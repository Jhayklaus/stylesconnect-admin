import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMembers,
  inviteMembers,
  memberKeys,
  removeMember,
  resendInvite,
  updateMemberRole,
  type Member,
  type MemberInvite,
  type MemberListParams,
} from "@/services/members";
import { toast } from "@/lib/toast";
import type { ApiError, Paginated } from "@/services/types";

export function useMembers(params: MemberListParams) {
  return useQuery<Paginated<Member>, ApiError>({
    queryKey: memberKeys.list(params),
    queryFn: () => fetchMembers(params),
    placeholderData: keepPreviousData,
  });
}

export function useInviteMembers() {
  const queryClient = useQueryClient();

  return useMutation<Member[], ApiError, MemberInvite[]>({
    mutationFn: inviteMembers,
    onSuccess: (members) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success(
        members.length === 1 ? "Invite sent" : `${members.length} invites sent`
      );
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation<Member, ApiError, { id: string; role: string }>({
    mutationFn: ({ id, role }) => updateMemberRole(id, role),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success(`${member.name} is now ${member.role}`);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success("Member removed");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useResendInvite() {
  return useMutation<void, ApiError, string>({
    mutationFn: resendInvite,
    onSuccess: () => toast.success("Invite resent"),
    onError: (error) => toast.error(error.message),
  });
}
