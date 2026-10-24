import type { Column } from "@/components/ui";
import { formatDateTimeShort, formatNaira } from "@/lib/format";
import {
  PAYMENT_KIND_LABEL,
  PAYMENT_METHOD_LABEL,
  type Payment,
} from "@/services/payments";

export const paymentColumns: Column<Payment>[] = [
  { id: "transaction_id", header: "Transaction ID", cell: (row) => row.transaction_id },
  { id: "kind", header: "Description", cell: (row) => PAYMENT_KIND_LABEL[row.kind] },
  {
    id: "method",
    header: "Method",
    cell: (row) => (row.method ? PAYMENT_METHOD_LABEL[row.method] : "—"),
  },
  { id: "amount", header: "Amount", cell: (row) => formatNaira(row.amount) },
  { id: "paid_at", header: "Date", cell: (row) => formatDateTimeShort(row.paid_at) },
];
