import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchTicketStats,
  fetchTickets,
  ticketKeys,
  type Ticket,
  type TicketListParams,
  type TicketStats,
} from "@/services/tickets";
import type { ApiError, Paginated } from "@/services/types";

export function useTickets(params: TicketListParams) {
  return useQuery<Paginated<Ticket>, ApiError>({
    queryKey: ticketKeys.list(params),
    queryFn: () => fetchTickets(params),
    placeholderData: keepPreviousData,
  });
}

export function useTicketStats() {
  return useQuery<TicketStats, ApiError>({
    queryKey: ticketKeys.stats(),
    queryFn: fetchTicketStats,
  });
}
