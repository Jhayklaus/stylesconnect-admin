import { Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatCount, formatNaira } from "@/lib/format";
import type { Designer } from "@/services/designers";

export const designerColumns: Column<Designer>[] = [
  {
    id: "name",
    header: "Name",
    width: "w-[280px]",
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
    width: "w-[280px]",
    cell: (row) => <span className="truncate text-text-900">{row.email}</span>,
  },
  {
    id: "active_listings",
    header: "Active listings",
    cell: (row) => formatCount(row.active_listings),
  },
  {
    id: "subscription",
    header: "Subscription",
    cell: (row) => <StatusBadge status={row.subscription} domain="designer" />,
  },
  {
    id: "total_sales",
    header: "Total sales",
    cell: (row) => formatNaira(row.total_sales),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} domain="designer" />,
  },
];
