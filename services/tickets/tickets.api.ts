import { apiClient } from "../client";
import { ApiError, type ApiEnvelope, type Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, applySearch, applySort, delay, mockPaginate } from "../mock/transport";
import {
  MOCK_TICKETS,
  MOCK_TICKET_STATS,
  mockTicketDetail,
  mockTicketThread,
} from "./tickets.mock";
import type {
  Ticket,
  TicketChannel,
  TicketDetail,
  TicketEntry,
  TicketListParams,
  TicketMessage,
  TicketPriority,
  TicketStats,
  TicketType,
} from "./tickets.types";

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

    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
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

/** GET /admin/tickets/:id */
export async function fetchTicket(id: string): Promise<TicketDetail> {
  if (MOCKS.tickets) {
    await delay();
    const detail = mockTicketDetail(id);
    if (!detail) {
      throw new ApiError({ message: "Ticket not found", status: 404 });
    }
    return detail;
  }

  const { data } = await apiClient.get<ApiEnvelope<TicketDetail>>(`/admin/tickets/${id}`);
  return data.data;
}

/** GET /admin/tickets/:id/thread */
export async function fetchTicketThread(id: string): Promise<TicketEntry[]> {
  if (MOCKS.tickets) {
    await delay();
    return mockTicketThread(id);
  }

  const { data } = await apiClient.get<ApiEnvelope<TicketEntry[]>>(`/admin/tickets/${id}/thread`);
  return data.data;
}

export interface ReplyToTicketBody {
  body: string;
  channel: TicketChannel;
}

/** POST /admin/tickets/:id/replies */
export async function replyToTicket(
  id: string,
  payload: ReplyToTicketBody
): Promise<TicketMessage> {
  if (MOCKS.tickets) {
    await delay();
    return {
      kind: "message",
      id: `TMS-${id}-${Date.now()}`,
      author: { id: "ADM-1", name: "Styleconnect", avatar_url: null },
      is_agent: true,
      body: payload.body,
      created_at: new Date().toISOString(),
    };
  }

  const { data } = await apiClient.post<ApiEnvelope<TicketMessage>>(
    `/admin/tickets/${id}/replies`,
    payload
  );
  return data.data;
}

export interface CreateTicketBody {
  subject: string;
  type: TicketType;
  priority: TicketPriority;
  requester_id: string;
  assignee_id: string | null;
  followers: string[];
  message: string;
  /** Which mailbox/persona the first message is sent as. */
  from: string;
}

/** POST /admin/tickets */
export async function createTicket(payload: CreateTicketBody): Promise<Ticket> {
  if (MOCKS.tickets) {
    await delay();
    return {
      id: `TCK-${Date.now()}`,
      ticket_id: `IKU—${Math.floor(1000 + Math.random() * 99)}`,
      subject: payload.subject,
      status: "open",
      requested_at: new Date().toISOString(),
      customer: { id: payload.requester_id, name: payload.requester_id, avatar_url: null },
      assignee: payload.assignee_id
        ? { id: payload.assignee_id, name: payload.assignee_id, avatar_url: null }
        : null,
    };
  }

  const { data } = await apiClient.post<ApiEnvelope<Ticket>>("/admin/tickets", payload);
  return data.data;
}
