"use client";

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
import { useReturns } from "@/hooks/returns/useReturns";
import { useListParams } from "@/hooks/useListParams";
import type { ReturnListParams } from "@/services/returns";
import { returnColumns } from "../returnColumns";

const TABS = [
  { value: "all", label: "All requests" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const PERIOD_OPTIONS = [
  { value: "all", label: "Date period" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Request status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "refunded", label: "Refunded" },
];

const REFUND_TYPE_OPTIONS = [
  { value: "all", label: "Refund type" },
  { value: "full", label: "Full refund" },
  { value: "partial", label: "Partial refund" },
];

export function ReturnsPage() {
  const params = useListParams({ filterKeys: ["period", "status", "refundType"] });

  const query: ReturnListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    view: params.tab as ReturnListParams["view"],
    period: params.filters.period as ReturnListParams["period"],
    status: params.filters.status as ReturnListParams["status"],
    refund_type: params.filters.refundType as ReturnListParams["refund_type"],
  };

  const { data, isLoading, error } = useReturns(query);

  return (
    <>
      <AdminTopBar title="Return" />

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
                label="Request status"
                options={STATUS_OPTIONS}
                value={params.filters.status}
                onChange={(v) => params.setFilter("status", v)}
              />
              <FilterDropdown
                label="Refund type"
                options={REFUND_TYPE_OPTIONS}
                value={params.filters.refundType}
                onChange={(v) => params.setFilter("refundType", v)}
              />
            </>
          }
        />

        <DataTable
          columns={returnColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="No return requests found"
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
