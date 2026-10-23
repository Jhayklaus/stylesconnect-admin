import { Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatCount, formatDateShort, formatNaira } from "@/lib/format";
import type { Shopper } from "@/services/shoppers";

export const shopperColumns: Column<Shopper>[] = [
  {
    id: "name",
    header: "Name",
    width: "w-[260px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatar_url} name={row.name} size="sm" />
        <span className="truncate">{row.name}</span>
      </div>
    ),
  },
  {
    id: "email",
    header: "Email",
    width: "w-[260px]",
    cell: (row) => <span className="truncate">{row.email}</span>,
  },
  { id: "order_count", header: "No. of order", cell: (row) => formatCount(row.order_count) },
  { id: "total_spend", header: "Total spend", cell: (row) => formatNaira(row.total_spend) },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} domain="shopper" />,
  },
  {
    id: "last_order_at",
    header: "Last order",
    cell: (row) => (row.last_order_at ? formatDateShort(row.last_order_at) : "—"),
  },
];
