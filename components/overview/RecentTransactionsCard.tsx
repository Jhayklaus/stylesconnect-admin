import Link from "next/link";
import { Button, Card, CardHeader, DataTable, type Column } from "@/components/ui";
import { formatDateShort, formatNaira } from "@/lib/format";
import type { RecentTransaction } from "@/services/overview";

const columns: Column<RecentTransaction>[] = [
  { id: "reference", header: "ID number", cell: (row) => row.reference },
  {
    id: "customer",
    header: "Customer",
    width: "w-[190px]",
    cell: (row) => <span className="block truncate">{row.customer_email}</span>,
  },
  { id: "source", header: "Source", cell: (row) => row.source },
  { id: "created_at", header: "Date", cell: (row) => formatDateShort(row.created_at) },
  { id: "amount", header: "Amount", cell: (row) => formatNaira(row.amount) },
];

export function RecentTransactionsCard({
  transactions,
  isLoading,
}: {
  transactions?: RecentTransaction[];
  isLoading?: boolean;
}) {
  return (
    <Card className="flex flex-col pb-2">
      <CardHeader
        title="Recent transaction"
        action={
          <Link href="/transactions/payments">
            <Button variant="outline" size="sm">
              See All
            </Button>
          </Link>
        }
      />
      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={transactions}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          skeletonRows={6}
        />
      </div>
    </Card>
  );
}
