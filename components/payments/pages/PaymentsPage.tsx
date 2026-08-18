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
  TableFooter,
  Toolbar,
} from "@/components/ui";
import { usePayments } from "@/hooks/payments/usePayments";
import { useListParams } from "@/hooks/useListParams";
import type { PaymentListParams } from "@/services/payments";
import { paymentColumns } from "../paymentColumns";
import { TransactionDrawer } from "../TransactionDrawer";

const CRUMBS: Crumb[] = [
  { label: "Transactions", href: "/transactions" },
  { label: "Payments" },
];

const TABS = [
  { value: "all", label: "All" },
  { value: "order", label: "Orders" },
  { value: "subscription", label: "Subscription" },
];

const METHOD_OPTIONS = [
  { value: "all", label: "All payments" },
  { value: "debit_card", label: "Debit card" },
  { value: "bank_transfer", label: "Bank transfer" },
];

const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function PaymentsPage() {
  const params = useListParams({ filterKeys: ["method", "period"] });
  const [openPaymentId, setOpenPaymentId] = useState<string | null>(null);

  const query: PaymentListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    view: params.tab as PaymentListParams["view"],
    method: params.filters.method as PaymentListParams["method"],
    period: params.filters.period as PaymentListParams["period"],
  };

  const { data, isLoading, error } = usePayments(query);

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        {/* The design puts the tabs and the filter cluster on one row. */}
        <Toolbar
          left={<SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} />}
          right={
            <>
              <SearchInput value={params.q} onChange={params.setQuery} className="w-[330px]" />
              <FilterDropdown
                label="All payments"
                options={METHOD_OPTIONS}
                value={params.filters.method}
                onChange={(v) => params.setFilter("method", v)}
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
          columns={paymentColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          onRowClick={(row) => setOpenPaymentId(row.id)}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="No payments found"
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

      <TransactionDrawer paymentId={openPaymentId} onClose={() => setOpenPaymentId(null)} />
    </>
  );
}
