"use client";

import { ArrowDownUp, ListFilter } from "lucide-react";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  StatCard,
  StatusBadge,
  TableFooter,
  Toolbar,
  type Column,
} from "@/components/ui";
import { useShopperOrders } from "@/hooks/shoppers/useShopperDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatCount, formatDateShort, formatNaira } from "@/lib/format";
import type { Order } from "@/services/orders";
import type { ShopperDetail } from "@/services/shoppers";

const STATUS_OPTIONS = [
  { value: "all", label: "Filter" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "all", label: "Sort by" },
  { value: "recent", label: "Newest first" },
  { value: "total_desc", label: "Amount: high to low" },
];

const columns: Column<Order>[] = [
  { id: "order_id", header: "Order ID", cell: (row) => row.order_id },
  { id: "ordered_at", header: "Date", cell: (row) => formatDateShort(row.ordered_at) },
  { id: "quantity", header: "Items", cell: (row) => formatCount(row.quantity) },
  { id: "total", header: "Amount", cell: (row) => formatNaira(row.total) },
  {
    id: "status",
    header: "Status",
    width: "w-[240px]",
    cell: (row) => (
      <div className="flex items-center gap-1.5">
        <StatusBadge status={row.payment_status} domain="order" />
        {row.fulfillment_status && (
          <StatusBadge status={row.fulfillment_status} domain="order" showIcon={false} />
        )}
      </div>
    ),
  },
];

export function ShopperOrdersTab({
  shopperId,
  detail,
  isLoading: detailLoading,
}: {
  shopperId: string;
  detail: ShopperDetail | undefined;
  isLoading?: boolean;
}) {
  const params = useListParams({ filterKeys: ["status", "sort"] });
  const { data, isLoading, error } = useShopperOrders(shopperId, {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.filters.status,
    sort: params.filters.sort,
  });

  const stats = detail?.order_stats;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total spend", value: stats && formatNaira(stats.total_spend) },
          { label: "No. of orders", value: stats?.order_count },
          { label: "Ongoing", value: stats?.ongoing },
          { label: "Unfulfilled", value: stats?.unfulfilled },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-stroke-soft">
            <StatCard label={item.label} value={item.value} isLoading={detailLoading} />
          </div>
        ))}
      </div>

      <Toolbar
        left={<SearchInput value={params.q} onChange={params.setQuery} className="w-[230px]" />}
        right={
          <>
            <FilterDropdown
              label="Filter"
              icon={<ListFilter className="h-4 w-4 shrink-0" aria-hidden />}
              options={STATUS_OPTIONS}
              value={params.filters.status}
              onChange={(v) => params.setFilter("status", v)}
            />
            <FilterDropdown
              label="Sort by"
              icon={<ArrowDownUp className="h-4 w-4 shrink-0" aria-hidden />}
              options={SORT_OPTIONS}
              value={params.filters.sort}
              onChange={(v) => params.setFilter("sort", v)}
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
        empty={<EmptyState title="No orders yet" description="This shopper hasn't ordered anything." />}
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
