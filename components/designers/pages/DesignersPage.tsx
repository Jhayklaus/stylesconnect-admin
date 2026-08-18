"use client";

import { ListFilter } from "lucide-react";
import { AdminTopBar } from "@/components/shell";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  SegmentedTabs,
  StatCardRow,
  TableFooter,
  Toolbar,
} from "@/components/ui";
import { useDesigners, useDesignerStats } from "@/hooks/designers/useDesigners";
import { useListParams } from "@/hooks/useListParams";
import type { DesignerListParams, DesignerStatus } from "@/services/designers";
import { designerColumns } from "../designerColumns";

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "deactivated", label: "Disabled" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "sales_desc", label: "Highest sales" },
];

const SUBSCRIPTION_OPTIONS = [
  { value: "all", label: "All subscriptions" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function DesignersPage() {
  const params = useListParams({ filterKeys: ["subscription", "sort"] });

  const query: DesignerListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.tab === "all" ? "all" : (params.tab as DesignerStatus),
    subscription: params.filters.subscription as DesignerListParams["subscription"],
    sort: params.filters.sort === "all" ? undefined : (params.filters.sort as DesignerListParams["sort"]),
  };

  const { data, isLoading, error } = useDesigners(query);
  const { data: stats, isLoading: statsLoading } = useDesignerStats();

  return (
    <>
      <AdminTopBar breadcrumb={[{ label: "Dashboard", href: "/overview" }, { label: "Designers" }]} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <StatCardRow
          isLoading={statsLoading}
          items={[
            { label: "Total designers", value: stats?.total, delta: { direction: "up", value: stats?.total_delta ?? 0, variant: "pill" } },
            { label: "Total Active", value: stats?.active, delta: { direction: "up", value: stats?.active_delta ?? 0, variant: "pill" } },
            { label: "Total inactive", value: stats?.inactive, delta: { direction: "up", value: stats?.inactive_delta ?? 0, variant: "pill" } },
            { label: "Deactivated", value: stats?.deactivated, delta: { direction: "up", value: stats?.deactivated_delta ?? 0, variant: "pill" } },
          ]}
        />

        <Toolbar
          left={<SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} />}
          right={
            <>
              <SearchInput value={params.q} onChange={params.setQuery} className="w-[280px]" />
              <FilterDropdown
                label="Filter"
                icon={<ListFilter className="h-4 w-4" aria-hidden />}
                options={SUBSCRIPTION_OPTIONS}
                value={params.filters.subscription}
                onChange={(v) => params.setFilter("subscription", v)}
              />
              <FilterDropdown
                label="Sort by"
                options={SORT_OPTIONS}
                value={params.filters.sort}
                onChange={(v) => params.setFilter("sort", v)}
              />
            </>
          }
        />

        <DataTable
          columns={designerColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="No designers found"
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
