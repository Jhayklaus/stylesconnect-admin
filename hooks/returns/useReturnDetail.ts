import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveReturn,
  fetchReturn,
  rejectReturn,
  returnKeys,
  type ReturnDecisionBody,
  type ReturnDetail,
} from "@/services/returns";
import type { ApiError } from "@/services/types";
import { toast } from "@/lib/toast";

export function useReturnDetail(id: string | null) {
  return useQuery<ReturnDetail, ApiError>({
    queryKey: returnKeys.detail(id ?? ""),
    queryFn: () => fetchReturn(id!),
    // The modal mounts before a row is chosen; don't fetch until there's an id.
    enabled: Boolean(id),
  });
}

export type ReturnDecision = "approve" | "reject";

/**
 * Approve/reject in one hook — the modal's two footer buttons differ only by
 * the verb, and both invalidate the same lists.
 */
export function useReturnDecisionMutation(id: string | null) {
  const queryClient = useQueryClient();

  return useMutation<
    ReturnDetail,
    ApiError,
    { decision: ReturnDecision; body?: ReturnDecisionBody }
  >({
    mutationFn: ({ decision, body }) =>
      decision === "approve" ? approveReturn(id!, body) : rejectReturn(id!, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(returnKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: returnKeys.lists() });
      toast.success(
        updated.status === "approved" ? "Return request approved" : "Return request rejected"
      );
    },
    onError: (error) => toast.error(error.message),
  });
}
