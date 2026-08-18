"use client";

import Image from "next/image";
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
import { useDesignerListings } from "@/hooks/designers/useDesignerDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatCount, formatDateTimeShort, formatNaira } from "@/lib/format";
import type { DesignerDetail } from "@/services/designers";
import type { Listing } from "@/services/listings";

const STATUS_OPTIONS = [
  { value: "all", label: "Filter" },
  { value: "published", label: "Published" },
  { value: "inactive", label: "Inactive" },
  { value: "unlisted", label: "Unlisted" },
];

const SORT_OPTIONS = [
  { value: "all", label: "Sort by" },
  { value: "recent", label: "Newest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "sold_desc", label: "Best selling" },
];

const columns: Column<Listing>[] = [
  {
    id: "title",
    header: "Product",
    width: "w-[280px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.image_url}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-lg object-cover"
        />
        <span className="truncate">{row.title}</span>
      </div>
    ),
  },
  { id: "unit_price", header: "Price", cell: (row) => formatNaira(row.unit_price) },
  { id: "total_sold", header: "Total Sales", cell: (row) => formatCount(row.total_sold) },
  {
    id: "status",
    header: "Status",
    width: "w-[160px]",
    cell: (row) => <StatusBadge status={row.status} domain="listing" />,
  },
  {
    id: "created_at",
    header: "Created on",
    cell: (row) => formatDateTimeShort(row.created_at),
  },
];

export function DesignerListingsTab({
  designerId,
  detail,
  isLoading: detailLoading,
}: {
  designerId: string;
  detail: DesignerDetail | undefined;
  isLoading?: boolean;
}) {
  const params = useListParams({ filterKeys: ["status", "sort"] });
  const { data, isLoading, error } = useDesignerListings(designerId, {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.filters.status,
    sort: params.filters.sort,
  });

  const stats = detail?.listing_stats;

  return (
    <div className="flex flex-col gap-6">
      {/* Separate bordered cards here, unlike the joined row on the list screens. */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total listed", value: stats?.total_listed },
          { label: "Live", value: stats?.live },
          { label: "Unlisted", value: stats?.unlisted },
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
        empty={<EmptyState title="No listings yet" description="This designer hasn't published anything." />}
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
