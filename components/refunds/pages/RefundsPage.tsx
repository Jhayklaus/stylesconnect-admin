"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { AdminTopBar, type Crumb } from "@/components/shell";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  SegmentedTabs,
  StatCard,
  TableFooter,
  Toolbar,
} from "@/components/ui";
import { useRefundStats, useRefunds } from "@/hooks/refunds/useRefunds";
import { useListParams } from "@/hooks/useListParams";
import { formatNaira } from "@/lib/format";
import type { RefundListParams } from "@/services/refunds";
import { refundColumns } from "../refundColumns";
import { RefundDrawer } from "../RefundDrawer";

const CRUMBS: Crumb[] = [
  { label: "Transactions", href: "/transactions" },
  { label: "Refunds" },
];

/**
 * Payments is browsed by what was paid for; refunds are worked as a queue, so
 * the tabs track where each one is in its lifecycle instead. "Pending" folds in
 * `processing`, and "Failed" folds in `rejected` — both need the same attention.
 */
const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const SOURCE_OPTIONS = [
  { value: "all", label: "All sources" },
  { value: "order", label: "Order" },
  { value: "subscription", label: "Subscription" },
];

const DESTINATION_OPTIONS = [
  { value: "all", label: "All destinations" },
  { value: "original_method", label: "Original method" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "wallet_credit", label: "Wallet credit" },
];

const PERIOD_OPTIONS = [
  { value: "all", label: "Date requested" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function RefundsPage() {
  const params = useListParams({ filterKeys: ["source", "destination", "period"] });
  const [openRefundId, setOpenRefundId] = useState<string | null>(null);

  const query: RefundListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    view: params.tab as RefundListParams["view"],
    source: params.filters.source as RefundListParams["source"],
    destination: params.filters.destination as RefundListParams["destination"],
    period: params.filters.period as RefundListParams["period"],
  };

  const { data, isLoading, error } = useRefunds(query);
  const { data: stats, isLoading: statsLoading } = useRefundStats();

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        {/* Refunds are money leaving, so the totals matter more than on
            Payments — an operator needs the exposure at a glance. */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: "Total refunded",
              value: stats && formatNaira(stats.total_refunded),
            },
            {
              label: "Pending",
              value: stats && `${stats.pending_count} · ${formatNaira(stats.pending_amount)}`,
            },
            { label: "Failed", value: stats?.failed_count },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-stroke-soft">
              <StatCard label={item.label} value={item.value} isLoading={statsLoading} />
            </div>
          ))}
        </div>

        <Toolbar
          left={<SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} />}
          right={
            <>
              <SearchInput value={params.q} onChange={params.setQuery} className="w-[280px]" />
              <FilterDropdown
                label="All sources"
                options={SOURCE_OPTIONS}
                value={params.filters.source}
                onChange={(v) => params.setFilter("source", v)}
              />
              <FilterDropdown
                label="All destinations"
                options={DESTINATION_OPTIONS}
                value={params.filters.destination}
                onChange={(v) => params.setFilter("destination", v)}
              />
              <FilterDropdown
                label="Date requested"
                icon={<CalendarDays className="h-4 w-4 shrink-0" aria-hidden />}
                options={PERIOD_OPTIONS}
                value={params.filters.period}
                onChange={(v) => params.setFilter("period", v)}
              />
            </>
          }
        />

        <DataTable
          columns={refundColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          onRowClick={(row) => setOpenRefundId(row.id)}
          empty={
            <EmptyState
              title="No refunds found"
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

      <RefundDrawer refundId={openRefundId} onClose={() => setOpenRefundId(null)} />
    </>
  );
}
