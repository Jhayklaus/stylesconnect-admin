"use client";

import { CalendarDays } from "lucide-react";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  TableFooter,
  Toolbar,
  type Column,
} from "@/components/ui";
import { useDesignerTransactions } from "@/hooks/designers/useDesignerDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatDateTimeShort, formatNaira, titleCase } from "@/lib/format";
import type { DesignerTransaction } from "@/services/designers";

const TYPE_OPTIONS = [
  { value: "all", label: "All transactions" },
  { value: "order", label: "Order" },
  { value: "subscription", label: "Subscription" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Status" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const PERIOD_OPTIONS = [
  { value: "all", label: "Date posted" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const columns: Column<DesignerTransaction>[] = [
  { id: "reference", header: "ID", cell: (row) => row.reference },
  { id: "amount", header: "Amount", cell: (row) => formatNaira(row.amount) },
  { id: "type", header: "Type", cell: (row) => titleCase(row.type) },
  { id: "payment_method", header: "Payment method", cell: (row) => row.payment_method },
  { id: "created_at", header: "Date", cell: (row) => formatDateTimeShort(row.created_at) },
];

export function DesignerTransactionsTab({ designerId }: { designerId: string }) {
  const params = useListParams({ filterKeys: ["type", "status", "period"] });
  const { data, isLoading, error } = useDesignerTransactions(designerId, {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    type: params.filters.type,
    status: params.filters.status,
    period: params.filters.period as "all" | "7d" | "30d" | "90d",
  });

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        left={<SearchInput value={params.q} onChange={params.setQuery} className="w-[230px]" />}
        right={
          <>
            <FilterDropdown
              label="All transactions"
              options={TYPE_OPTIONS}
              value={params.filters.type}
              onChange={(v) => params.setFilter("type", v)}
            />
            <FilterDropdown
              label="Status"
              options={STATUS_OPTIONS}
              value={params.filters.status}
              onChange={(v) => params.setFilter("status", v)}
            />
            <FilterDropdown
              label="Date posted"
              icon={<CalendarDays className="h-4 w-4 shrink-0" aria-hidden />}
              options={PERIOD_OPTIONS}
              value={params.filters.period}
              onChange={(v) => params.setFilter("period", v)}
            />
          </>
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
