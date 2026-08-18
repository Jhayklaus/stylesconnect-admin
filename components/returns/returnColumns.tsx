import { StatusBadge, type Column } from "@/components/ui";
import { formatDateShort, formatNaira } from "@/lib/format";
import { REFUND_TYPE_LABEL, type ReturnRequest } from "@/services/returns";

export const returnColumns: Column<ReturnRequest>[] = [
  { id: "order_id", header: "Order ID", cell: (row) => row.order_id },
  {
    id: "requested_at",
    header: "Request date",
    cell: (row) => formatDateShort(row.requested_at),
  },
  {
    id: "refund_amount",
    header: "Refund amount",
    cell: (row) => formatNaira(row.refund_amount),
  },
  {
    id: "status",
    header: "Request Status",
    width: "w-[180px]",
    cell: (row) => <StatusBadge status={row.status} domain="order" />,
  },
  {
    id: "refund_type",
    header: "Refund type",
    width: "w-[180px]",
    cell: (row) => REFUND_TYPE_LABEL[row.refund_type],
  },
];
