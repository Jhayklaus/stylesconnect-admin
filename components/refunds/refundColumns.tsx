import { Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatDateShort, formatNaira } from "@/lib/format";
import type { Refund } from "@/services/refunds";

export const refundColumns: Column<Refund>[] = [
  { id: "refund_id", header: "Refund ID", cell: (row) => row.refund_id },
  {
    id: "transaction_id",
    header: "Transaction ID",
    cell: (row) => <span className="text-text-500">{row.transaction_id}</span>,
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
    id: "reason",
    header: "Reason",
    width: "w-[200px]",
    cell: (row) => (
      <span className="block max-w-[200px] truncate" title={row.reason}>
        {row.reason}
      </span>
    ),
  },
  { id: "amount", header: "Amount", cell: (row) => formatNaira(row.amount) },
  {
    id: "status",
    header: "Status",
    width: "w-[150px]",
    cell: (row) => <StatusBadge status={row.status} domain="transaction" />,
  },
  {
    id: "requested_at",
    header: "Requested",
    cell: (row) => formatDateShort(row.requested_at),
  },
];
