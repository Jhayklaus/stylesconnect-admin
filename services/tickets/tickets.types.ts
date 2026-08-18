import type { ActivitySegment } from "../types";
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

export type TicketPriority = "low" | "medium" | "high";
export type TicketChannel = "email" | "chat" | "phone";
export type TicketType = "incident" | "question" | "problem" | "task";

/** A human reply in the thread. */
export interface TicketMessage {
  kind: "message";
  id: string;
  author: TicketPerson;
  /** Agent replies render with the brand mark rather than a photo. */
  is_agent: boolean;
  body: string;
  created_at: string;
}

/** A system line: "Stylesconnect changed ticket priority to Low". */
export interface TicketEvent {
  kind: "event";
  id: string;
  icon: "created" | "priority" | "type" | "assignment";
  segments: ActivitySegment[];
  created_at: string;
}

export type TicketEntry = TicketMessage | TicketEvent;

/** GET /admin/tickets/:id */
export interface TicketDetail extends Ticket {
  /** Display form: "#TC—0ARTHYOE". */
  reference: string;
  channel: TicketChannel;
  type: TicketType;
  /** The store the ticket was raised against. */
  account: string;
  priority: TicketPriority;
  tags: string[];
  created_at: string;
  /** Neighbours in the default list order, for the header's prev/next arrows. */
  prev_id: string | null;
  next_id: string | null;
}

export const TICKET_TYPE_OPTIONS: { value: TicketType; label: string }[] = [
  { value: "incident", label: "Incident" },
  { value: "question", label: "Question" },
  { value: "problem", label: "Problem" },
  { value: "task", label: "Task" },
];

export const TICKET_PRIORITIES: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
