import type { TicketListParams } from "./tickets.types";

export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (params: TicketListParams) => [...ticketKeys.lists(), params] as const,
  stats: () => [...ticketKeys.all, "stats"] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
};
