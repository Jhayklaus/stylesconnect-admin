import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  fetchTicket,
  fetchTicketThread,
  replyToTicket,
  ticketKeys,
  type CreateTicketBody,
  type ReplyToTicketBody,
  type Ticket,
  type TicketDetail,
  type TicketEntry,
} from "@/services/tickets";
import type { ApiError } from "@/services/types";
import { toast } from "@/lib/toast";

export function useTicket(id: string) {
  return useQuery<TicketDetail, ApiError>({
    queryKey: ticketKeys.detail(id),
    queryFn: () => fetchTicket(id),
  });
}

export function useTicketThread(id: string) {
  return useQuery<TicketEntry[], ApiError>({
    queryKey: ticketKeys.thread(id),
    queryFn: () => fetchTicketThread(id),
  });
}

export function useReplyToTicket(id: string) {
  const queryClient = useQueryClient();

  return useMutation<TicketEntry, ApiError, ReplyToTicketBody>({
    mutationFn: (payload) => replyToTicket(id, payload),
    // Append rather than refetch: the fixture thread is regenerated per call,
    // so a refetch would drop the reply that was just sent.
    onSuccess: (entry) => {
      queryClient.setQueryData<TicketEntry[]>(ticketKeys.thread(id), (prev) =>
        prev ? [...prev, entry] : [entry]
      );
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation<Ticket, ApiError, CreateTicketBody>({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success("Ticket created");
    },
    onError: (error) => toast.error(error.message),
  });
}
