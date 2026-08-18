import { Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatCount, formatDateShort, formatNaira } from "@/lib/format";
import type { Order } from "@/services/orders";

export const orderColumns: Column<Order>[] = [
  { id: "order_id", header: "Order ID", cell: (row) => row.order_id },
  { id: "ordered_at", header: "Order date", cell: (row) => formatDateShort(row.ordered_at) },
  { id: "timeline", header: "Due date/Timeline", cell: (row) => row.timeline },
  { id: "quantity", header: "Quantity", cell: (row) => formatCount(row.quantity) },
  { id: "total", header: "Total", cell: (row) => formatNaira(row.total) },
  {
    id: "status",
    header: "Status",
    width: "w-[240px]",
    // Rows can carry a payment state and a fulfilment state side by side,
    // e.g. "Cancelled" + "Refunded".
    cell: (row) => (
      <div className="flex items-center gap-1.5">
        <StatusBadge status={row.payment_status} domain="order" />
        {row.fulfillment_status && (
          <StatusBadge status={row.fulfillment_status} domain="order" showIcon={false} />
        )}
      </div>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    width: "w-[220px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.customer.avatar_url} name={row.customer.name} size="sm" />
        <span className="truncate">{row.customer.name}</span>
      </div>
    ),
  },
];
