import { Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatDateShort } from "@/lib/format";
import type { Ticket } from "@/services/tickets";

export const ticketColumns: Column<Ticket>[] = [
  { id: "ticket_id", header: "Ticket ID", cell: (row) => row.ticket_id },
  {
    id: "subject",
    header: "Subject",
    width: "w-[320px]",
    cell: (row) => (
      <span className="block max-w-[320px] truncate" title={row.subject}>
        {row.subject}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    width: "w-[150px]",
    cell: (row) => <StatusBadge status={row.status} domain="ticket" />,
  },
  {
    id: "requested_at",
    header: "Request date",
    cell: (row) => formatDateShort(row.requested_at),
  },
  {
    id: "customer",
    header: "Customer",
    width: "w-[200px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.customer.avatar_url} name={row.customer.name} size="sm" />
        <span className="truncate">{row.customer.name}</span>
      </div>
    ),
  },
  {
    id: "assignee",
    header: "Assigned to",
    width: "w-[200px]",
    cell: (row) =>
      row.assignee ? (
        <div className="flex items-center gap-3">
          <Avatar src={row.assignee.avatar_url} name={row.assignee.name} size="sm" />
          <span className="truncate">{row.assignee.name}</span>
        </div>
      ) : (
        <span className="text-text-300">Unassigned</span>
      ),
  },
];
