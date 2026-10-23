"use client";

import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  StatusBadge,
  TableFooter,
  Toolbar,
  type Column,
} from "@/components/ui";
import { useDesignerTransactions } from "@/hooks/designers/useDesignerDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatDateTimeShort, formatNaira } from "@/lib/format";
import type { DesignerTransaction } from "@/services/designers";

const STATUS_OPTIONS = [
  { value: "all", label: "Status" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const columns: Column<DesignerTransaction>[] = [
  { id: "reference", header: "ID", cell: (row) => row.reference },
  { id: "order_id", header: "Order", cell: (row) => row.order_id },
  { id: "amount", header: "Amount", cell: (row) => formatNaira(row.amount) },
  { id: "payment_method", header: "Payment method", cell: (row) => row.payment_method ?? "—" },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} domain="transaction" />,
  },
  { id: "created_at", header: "Date", cell: (row) => formatDateTimeShort(row.created_at) },
];

export function DesignerTransactionsTab({ designerId }: { designerId: string }) {
  const params = useListParams({ filterKeys: ["status"] });
  const { data, isLoading, error } = useDesignerTransactions(designerId, {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.filters.status,
  });

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        left={<SearchInput value={params.q} onChange={params.setQuery} className="w-[230px]" />}
        right={
          <FilterDropdown
            label="Status"
            options={STATUS_OPTIONS}
            value={params.filters.status}
            onChange={(v) => params.setFilter("status", v)}
          />
        }
      />

      <DataTable
        columns={columns}
        rows={data?.data}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        error={error}
        skeletonRows={params.perPage}
        empty={<EmptyState title="No transactions" description="Nothing has been billed yet." />}
        footer={
          data && (
            <TableFooter
              page={data.meta.current_page}
              pageCount={data.meta.last_page}
              perPage={params.perPage}
              onPageChange={params.setPage}
              onPerPageChange={params.setPerPage}
            />
          )
        }
      />
    </div>
  );
}
