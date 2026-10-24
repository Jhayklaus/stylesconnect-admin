"use client";

import { AdminTopBar, type Crumb } from "@/components/shell";
import { DataTable, EmptyState, SegmentedTabs, TableFooter } from "@/components/ui";
import { useWaitlist } from "@/hooks/users/useUsers";
import { useListParams } from "@/hooks/useListParams";
import type { WaitlistType } from "@/services/users";
import { waitlistColumns } from "../userColumns";

const CRUMBS: Crumb[] = [{ label: "Customers" }, { label: "Waitlist" }];

const TABS = [
  { value: "all", label: "All" },
  { value: "customer", label: "Shoppers" },
  { value: "designer", label: "Designers" },
];

/** People who signed up before launch. Read-only. */
export function WaitlistPage() {
  const params = useListParams();
  const { data, isLoading, error } = useWaitlist({
    page: params.page,
    per_page: params.perPage,
    type: params.tab as WaitlistType | "all",
  });

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} className="self-start" />

        <DataTable
          columns={waitlistColumns}
          rows={data?.data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={
            <EmptyState
              title="The waitlist is empty"
              description="Sign-ups from the pre-launch page will show up here."
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
