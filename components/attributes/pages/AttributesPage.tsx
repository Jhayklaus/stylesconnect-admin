"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AdminTopBar, type Crumb } from "@/components/shell";
import {
  Button,
  ConfirmModal,
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  SegmentedTabs,
  TableFooter,
  Toolbar,
  pageCountOf,
  paginate,
} from "@/components/ui";
import { useAttributes, useDeleteAttribute } from "@/hooks/attributes/useAttributes";
import { useListParams } from "@/hooks/useListParams";
import { attributeColumns, type AttributeAction } from "../attributeColumns";
import { ATTRIBUTE_TABS, attributeTab, type AnyAttribute } from "../attributeConfig";
import { AttributeFormModal } from "../AttributeFormModal";

const CRUMBS: Crumb[] = [{ label: "Listings", href: "/listings" }, { label: "Attributes" }];

const TABS = ATTRIBUTE_TABS.map((t) => ({ value: t.resource, label: t.label }));

/**
 * The option lists designers pick from when creating a listing. The API
 * returns each list whole, so search and paging happen here.
 */
export function AttributesPage() {
  const params = useListParams({ tab: "categories", filterKeys: ["category"] });
  const tab = attributeTab(params.tab);
  const { resource } = tab;

  const { data, isLoading, error } = useAttributes(
    resource,
    resource === "types" ? { category: params.filters.category } : {}
  );
  const { data: categories } = useAttributes("categories");
  const remove = useDeleteAttribute(resource);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AnyAttribute | null>(null);
  const [deleting, setDeleting] = useState<AnyAttribute | null>(null);

  const term = params.q.trim().toLowerCase();
  const rows = ((data ?? []) as AnyAttribute[]).filter(
    (row) => !term || row.name.toLowerCase().includes(term) || row.slug.includes(term)
  );
  const pageCount = pageCountOf(rows.length, params.perPage);
  const page = Math.min(params.page, pageCount);

  function onAction(action: AttributeAction, row: AnyAttribute) {
    if (action === "edit") {
      setEditing(row);
      setFormOpen(true);
    }
    if (action === "delete") setDeleting(row);
  }

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <SegmentedTabs tabs={TABS} value={resource} onChange={params.setTab} className="self-start" />

        <Toolbar
          left={
            <>
              <SearchInput value={params.q} onChange={params.setQuery} className="w-[280px]" />
              {resource === "types" && (
                <FilterDropdown
                  label="All categories"
                  align="start"
                  options={[
                    { value: "all", label: "All categories" },
                    ...(categories ?? []).map((c) => ({ value: c.slug, label: c.name })),
                  ]}
                  value={params.filters.category}
                  onChange={(v) => params.setFilter("category", v)}
                />
              )}
            </>
          }
          right={
            <Button
              leadingIcon={<Plus className="h-4 w-4" aria-hidden />}
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Add {tab.singular}
            </Button>
          }
        />

        <DataTable
          columns={attributeColumns(resource, onAction)}
          rows={data && paginate(rows, page, params.perPage)}
          rowKey={(row) => String(row.id)}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title={term ? `No ${tab.label.toLowerCase()} match` : `No ${tab.label.toLowerCase()} yet`}
              description={
                term ? "Try a different search term." : `Add the first ${tab.singular} to get started.`
              }
            />
          }
          footer={
            rows.length > 0 && (
              <TableFooter
                page={page}
                pageCount={pageCount}
                perPage={params.perPage}
                onPageChange={params.setPage}
                onPerPageChange={params.setPerPage}
              />
            )
          }
        />
      </div>

      <AttributeFormModal
        tab={tab}
        open={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete ${tab.singular}?`}
        description={
          deleting && (
            <>
              <span className="font-medium text-text-900">{deleting.name}</span> will no longer be
              offered when designers create listings. Listings already using it may block the delete.
            </>
          )
        }
        confirmLabel="Delete"
        danger
        isPending={remove.isPending}
        onConfirm={() =>
          deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
      />
    </>
  );
}
