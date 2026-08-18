"use client";

import { ListFilter, UserRound } from "lucide-react";
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
import { useShoppers, useShopperStats } from "@/hooks/shoppers/useShoppers";
import { useListParams } from "@/hooks/useListParams";
import type { ShopperListParams, ShopperStatus } from "@/services/shoppers";
import { shopperColumns } from "../shopperColumns";

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "deactivated", label: "Disabled" },
];

const SEGMENT_OPTIONS = [
  { value: "all", label: "All shoppers" },
  { value: "returning", label: "Returning" },
  { value: "new", label: "New" },
];

const SPEND_OPTIONS = [
  { value: "all", label: "Any spend" },
  { value: "under_50m", label: "Under ₦50m" },
  { value: "50m_150m", label: "₦50m – ₦150m" },
  { value: "over_150m", label: "Over ₦150m" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent order" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "spend_desc", label: "Highest spend" },
];

export function ShoppersPage() {
  const params = useListParams({ filterKeys: ["segment", "spend", "sort"] });

  const query: ShopperListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.tab === "all" ? "all" : (params.tab as ShopperStatus),
    segment: params.filters.segment as ShopperListParams["segment"],
    spend: params.filters.spend as ShopperListParams["spend"],
    sort: params.filters.sort === "all" ? undefined : (params.filters.sort as ShopperListParams["sort"]),
  };

  const { data, isLoading, error } = useShoppers(query);
  const { data: stats, isLoading: statsLoading } = useShopperStats();

  return (
    <>
      <AdminTopBar breadcrumb={[{ label: "Dashboard", href: "/overview" }, { label: "Shoppers" }]} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <StatCardRow
          isLoading={statsLoading}
          items={[
            { label: "Total Shoppers", value: stats?.total, delta: { direction: "up", value: stats?.total_delta ?? 0, variant: "pill" } },
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
                label="All"
                icon={<UserRound className="h-4 w-4" aria-hidden />}
                options={SEGMENT_OPTIONS}
                value={params.filters.segment}
                onChange={(v) => params.setFilter("segment", v)}
              />
              <FilterDropdown
                label="Filter"
                icon={<ListFilter className="h-4 w-4" aria-hidden />}
                options={SPEND_OPTIONS}
                value={params.filters.spend}
                onChange={(v) => params.setFilter("spend", v)}
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
          columns={shopperColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="No shoppers found"
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
