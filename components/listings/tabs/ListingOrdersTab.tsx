"use client";

import { ListFilter } from "lucide-react";
import {
  Avatar,
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  StatusBadge,
  TableFooter,
  Toolbar,
  type Column,
} from "@/components/ui";
import { useListingOrders } from "@/hooks/listings/useListingDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatCount, formatDateTimeShort, formatNaira } from "@/lib/format";
import type { ListingOrderRow } from "@/services/listings";

const STATUS_OPTIONS = [
  { value: "all", label: "Filter" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const columns: Column<ListingOrderRow>[] = [
  { id: "order_id", header: "Order ID", cell: (row) => row.order_id },
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
  { id: "quantity", header: "Quantity", cell: (row) => formatCount(row.quantity) },
  { id: "amount", header: "Amount", cell: (row) => formatNaira(row.amount) },
  {
    id: "status",
    header: "Status",
    width: "w-[150px]",
    cell: (row) => <StatusBadge status={row.status} domain="order" />,
  },
  { id: "ordered_at", header: "Date", cell: (row) => formatDateTimeShort(row.ordered_at) },
];

export function ListingOrdersTab({ listingId }: { listingId: string }) {
  const params = useListParams({ filterKeys: ["status"] });
  const { data, isLoading, error } = useListingOrders(listingId, {
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
            label="Filter"
            icon={<ListFilter className="h-4 w-4 shrink-0" aria-hidden />}
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
        empty={<EmptyState title="No orders yet" description="Nobody has ordered this product." />}
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
