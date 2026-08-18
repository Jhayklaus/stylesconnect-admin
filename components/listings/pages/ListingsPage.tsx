"use client";

import { useState } from "react";
import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminTopBar } from "@/components/shell";
import {
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  SegmentedTabs,
  TableFooter,
  Toolbar,
} from "@/components/ui";
import { useListings } from "@/hooks/listings/useListings";
import { useListParams } from "@/hooks/useListParams";
import type { ListingListParams, ListingReview, ListingStatus } from "@/services/listings";
import { listingColumns } from "../listingColumns";

const TABS = [
  { value: "reviewed", label: "Reviewed" },
  { value: "awaiting_review", label: "Awaiting review" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "inactive", label: "Inactive" },
  { value: "unlisted", label: "Unlisted" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "Shirts", label: "Shirts" },
  { value: "Jeans", label: "Jeans" },
  { value: "Dresses", label: "Dresses" },
  { value: "Outerwear", label: "Outerwear" },
  { value: "Accessories", label: "Accessories" },
  { value: "Footwear", label: "Footwear" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "price_desc", label: "Highest price" },
  { value: "sold_desc", label: "Best selling" },
];

export function ListingsPage() {
  const router = useRouter();
  const params = useListParams({ tab: "reviewed", filterKeys: ["status", "category", "sort"] });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query: ListingListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    review_state: params.tab as ListingReview,
    status: params.filters.status as ListingStatus | "all",
    category: params.filters.category,
    sort: params.filters.sort === "all" ? undefined : (params.filters.sort as ListingListParams["sort"]),
  };

  const { data, isLoading, error } = useListings(query);

  return (
    <>
      <AdminTopBar title="Listings" />

      <div className="flex flex-col gap-6 px-8 py-6">
        <SegmentedTabs
          tabs={TABS}
          value={params.tab}
          onChange={(v) => {
            setSelectedIds([]);
            params.setTab(v);
          }}
          className="self-start"
        />

        <Toolbar
          left={<SearchInput value={params.q} onChange={params.setQuery} className="w-[330px]" />}
          right={
            <>
              <FilterDropdown
                label="Status"
                options={STATUS_OPTIONS}
                value={params.filters.status}
                onChange={(v) => params.setFilter("status", v)}
              />
              <FilterDropdown
                label="Category"
                options={CATEGORY_OPTIONS}
                value={params.filters.category}
                onChange={(v) => params.setFilter("category", v)}
              />
              <FilterDropdown
                label="Filter"
                icon={<ListFilter className="h-4 w-4" aria-hidden />}
                options={SORT_OPTIONS}
                value={params.filters.sort}
                onChange={(v) => params.setFilter("sort", v)}
              />
            </>
          }
        />

        <DataTable
          columns={listingColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/listings/${row.id}`)}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          selection={{ selectedIds, onChange: setSelectedIds }}
          empty={
            <EmptyState
              title="No listings found"
              description="Try a different search term or filter."
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
