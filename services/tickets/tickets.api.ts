import { apiClient } from "../client";
import type { Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import { MOCK_TICKETS, MOCK_TICKET_STATS } from "./tickets.mock";
import type { Ticket, TicketListParams, TicketStats } from "./tickets.types";

/** GET /admin/tickets */
export async function fetchTickets(
  params: TicketListParams = {}
): Promise<Paginated<Ticket>> {
  if (MOCKS.tickets) {
    await delay();
    let rows = MOCK_TICKETS;

    // "Closed" covers both terminal states — resolved tickets are closed too.
    if (params.view === "pending") rows = rows.filter((t) => t.status === "pending");
    if (params.view === "closed")
      rows = rows.filter((t) => t.status === "closed" || t.status === "resolved");

    rows = applySearch(rows, params.q, ["ticket_id", "subject"]);
    rows = applyFilter(rows, params.status, (t) => t.status);
    rows = applySort(rows, params.sort, {
      newest: (a, b) => +new Date(b.requested_at) - +new Date(a.requested_at),
      oldest: (a, b) => +new Date(a.requested_at) - +new Date(b.requested_at),
      subject: (a, b) => a.subject.localeCompare(b.subject),
    });

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7, "/admin/tickets");
  }

  const { data } = await apiClient.get<Paginated<Ticket>>("/admin/tickets", { params });
  return data;
}

/** GET /admin/tickets/stats */
export async function fetchTicketStats(): Promise<TicketStats> {
  if (MOCKS.tickets) {
    await delay();
    return MOCK_TICKET_STATS;
  }

  const { data } = await apiClient.get<TicketStats>("/admin/tickets/stats");
  return data;
}
