"use client";

import { useRouter } from "next/navigation";
import { AdminTopBar } from "@/components/shell";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  SegmentedTabs,
  StatCardRow,
  statDelta,
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

export function DesignersPage() {
  const router = useRouter();
  const params = useListParams({ filterKeys: ["sort"] });

  const query: DesignerListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.tab === "all" ? "all" : (params.tab as DesignerStatus),
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
            { label: "Total designers", value: stats?.total, delta: statDelta(stats?.total_delta, "pill") },
            { label: "Total Active", value: stats?.active, delta: statDelta(stats?.active_delta, "pill") },
            { label: "Total inactive", value: stats?.inactive, delta: statDelta(stats?.inactive_delta, "pill") },
            { label: "Deactivated", value: stats?.deactivated, delta: statDelta(stats?.deactivated_delta, "pill") },
          ]}
        />

        <Toolbar
          left={<SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} />}
          right={
            <>
              <SearchInput value={params.q} onChange={params.setQuery} className="w-[280px]" />
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
          onRowClick={(row) => router.push(`/customers/designers/${row.id}`)}
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
