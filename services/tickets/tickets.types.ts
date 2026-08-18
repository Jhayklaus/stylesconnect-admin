export type TicketStatus = "open" | "pending" | "closed" | "resolved";

export interface TicketPerson {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface Ticket {
  id: string;
  /** Display form: "IKU—1045". */
  ticket_id: string;
  subject: string;
  status: TicketStatus;
  requested_at: string;
  customer: TicketPerson;
  /** Null until an admin picks it up. */
  assignee: TicketPerson | null;
}

export interface TicketListParams {
  page?: number;
  per_page?: number;
  q?: string;
  /** The tab: all | pending | closed. */
  view?: "all" | "pending" | "closed";
  status?: TicketStatus | "all";
  sort?: "newest" | "oldest" | "subject";
}

/** The three cards above the table. */
export interface TicketStats {
  total: number;
  pending: number;
  overdue: number;
  /** Percentage change against the same period last year. */
  delta: number;
}
