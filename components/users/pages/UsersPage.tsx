"use client";

import { useRouter } from "next/navigation";
import { AdminTopBar, type Crumb } from "@/components/shell";
import { DataTable, EmptyState, TableFooter } from "@/components/ui";
import { useUsers } from "@/hooks/users/useUsers";
import { useListParams } from "@/hooks/useListParams";
import { userColumns } from "../userColumns";

const CRUMBS: Crumb[] = [{ label: "Customers" }, { label: "All users" }];

/**
 * Every account on the platform, whatever its role. Read-only, and without
 * search or role filters because GET /admin/users doesn't honour them yet.
 */
export function UsersPage() {
  const router = useRouter();
  const params = useListParams();
  const { data, isLoading, error } = useUsers({ page: params.page, per_page: params.perPage });

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <DataTable
          columns={userColumns}
          rows={data?.data}
          rowKey={(row) => row.uuid}
          // A shopper's profile is keyed by their user uuid, so those rows can
          // open it. Designer profiles use a separate id, so they don't.
          onRowClick={(row) => {
            if (row.roles.includes("customer")) router.push(`/customers/shoppers/${row.uuid}`);
          }}
          isLoading={isLoading}
          error={error}
          skeletonRows={params.perPage}
          empty={<EmptyState title="No users yet" description="Accounts appear here as people sign up." />}
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
