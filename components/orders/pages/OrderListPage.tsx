"use client";

import { useRouter } from "next/navigation";
import { AdminTopBar } from "@/components/shell";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  TableFooter,
  Toolbar,
  UnderlineTabs,
} from "@/components/ui";
import { useOrders } from "@/hooks/orders/useOrders";
import { useListParams } from "@/hooks/useListParams";
import type { OrderListParams } from "@/services/orders";
import { orderColumns } from "../orderColumns";

const TABS = [
  { value: "all", label: "All orders" },
  { value: "unfulfilled", label: "Unfulfilled" },
  { value: "paid", label: "Paid" },
];

const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const FULFILLMENT_OPTIONS = [
  { value: "all", label: "All fulfillment" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "unfulfilled", label: "Unfulfilled" },
  { value: "refunded", label: "Refunded" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "All payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderListPage() {
  const router = useRouter();
  const params = useListParams({ filterKeys: ["period", "fulfillment", "payment"] });

  const query: OrderListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    view: params.tab as OrderListParams["view"],
    period: params.filters.period as OrderListParams["period"],
    fulfillment: params.filters.fulfillment as OrderListParams["fulfillment"],
    payment_status: params.filters.payment as OrderListParams["payment_status"],
  };

  const { data, isLoading, error } = useOrders(query);

  return (
    <>
      <AdminTopBar title="Order list" />

      <div className="flex flex-col gap-6 px-8 py-6">
        <UnderlineTabs tabs={TABS} value={params.tab} onChange={params.setTab} />

        <Toolbar
          left={<SearchInput value={params.q} onChange={params.setQuery} className="w-[330px]" />}
          right={
            <>
              <FilterDropdown
                label="Date period"
                options={PERIOD_OPTIONS}
                value={params.filters.period}
                onChange={(v) => params.setFilter("period", v)}
              />
              <FilterDropdown
                label="Fulfillment"
                options={FULFILLMENT_OPTIONS}
                value={params.filters.fulfillment}
                onChange={(v) => params.setFilter("fulfillment", v)}
              />
              <FilterDropdown
                label="Payment status"
                options={PAYMENT_OPTIONS}
                value={params.filters.payment}
                onChange={(v) => params.setFilter("payment", v)}
              />
            </>
          }
        />

        <DataTable
          columns={orderColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/orders/${row.id}`)}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="No orders found"
              description="Try a different search term, tab, or filter."
            />
          }
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
    </>
  );
}
