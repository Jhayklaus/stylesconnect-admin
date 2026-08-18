"use client";

import { ArrowDownUp, Bell, ListFilter, Plus } from "lucide-react";
import { AdminTopBar } from "@/components/shell";
import {
  Button,
  DataTable,
  EmptyState,
  FilterDropdown,
  IconButton,
  SearchInput,
  StatCardRow,
  TableFooter,
  Toolbar,
  UnderlineTabs,
} from "@/components/ui";
import { useTicketStats, useTickets } from "@/hooks/tickets/useTickets";
import { useListParams } from "@/hooks/useListParams";
import type { TicketListParams } from "@/services/tickets";
import { ticketColumns } from "../ticketColumns";

const TABS = [
  { value: "all", label: "All tickets" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const SORT_OPTIONS = [
  { value: "all", label: "Default" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "subject", label: "Subject A–Z" },
];

export function TicketsPage() {
  const params = useListParams({ filterKeys: ["status", "sort"] });

  const query: TicketListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    view: params.tab as TicketListParams["view"],
    status: params.filters.status as TicketListParams["status"],
    sort: params.filters.sort as TicketListParams["sort"],
  };

  const { data, isLoading, error } = useTickets(query);
  const { data: stats, isLoading: statsLoading } = useTicketStats();

  return (
    <>
      <AdminTopBar
        title="Ticket List"
        actions={
          <>
            <IconButton label="Notifications" dot icon={<Bell className="h-[18px] w-[18px]" />} />
            <Button leadingIcon={<Plus className="h-4 w-4" aria-hidden />}>Add ticket</Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 px-8 py-6">
        <StatCardRow
          isLoading={statsLoading}
          items={[
            {
              label: "Tickets",
              value: stats?.total,
              delta: { direction: "up", value: stats?.delta ?? 0, variant: "pill" },
            },
            {
              label: "Pending",
              value: stats?.pending,
              delta: { direction: "up", value: stats?.delta ?? 0, variant: "pill" },
            },
            {
              label: "Overdue",
              value: stats?.overdue,
              delta: { direction: "up", value: stats?.delta ?? 0, variant: "pill" },
            },
          ]}
        />

        <UnderlineTabs tabs={TABS} value={params.tab} onChange={params.setTab} />

        <Toolbar
          left={<SearchInput value={params.q} onChange={params.setQuery} className="w-[330px]" />}
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
          columns={ticketColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="No tickets found"
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
