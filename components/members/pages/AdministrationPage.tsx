"use client";

import { AdminTopBar, type Crumb } from "@/components/shell";
import {
  Button,
  ComingSoon,
  DataTable,
  EmptyState,
  FilterDropdown,
  SearchInput,
  SegmentedTabs,
  TableFooter,
  Toolbar,
} from "@/components/ui";
import { useMembers } from "@/hooks/members/useMembers";
import { useListParams } from "@/hooks/useListParams";
import { MEMBER_ROLES, type MemberListParams } from "@/services/members";
import { memberColumns } from "../memberColumns";

const CRUMBS: Crumb[] = [{ label: "Team members", href: "/administration" }, { label: "Members" }];

const TABS = [
  { value: "all", label: "Members" },
  { value: "activity", label: "Activity log" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Status" },
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "deactivated", label: "Deactivated" },
];

const ROLE_OPTIONS = [
  { value: "all", label: "Roles" },
  ...MEMBER_ROLES.map((role) => ({ value: role, label: role })),
];

export function AdministrationPage() {
  const params = useListParams({ filterKeys: ["status", "role"] });

  const query: MemberListParams = {
    page: params.page,
    per_page: params.perPage,
    q: params.q || undefined,
    status: params.filters.status as MemberListParams["status"],
    role: params.filters.role as MemberListParams["role"],
  };

  const { data, isLoading, error } = useMembers(query);
  const onActivityTab = params.tab === "activity";

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <Toolbar
          left={<SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} />}
          right={<Button>Invite Member</Button>}
        />

        {onActivityTab ? (
          <ComingSoon
            title="Activity log"
            description="This tab has no design yet — the members table is the only view specified."
          />
        ) : (
          <>
            <Toolbar
              left={
                <SearchInput value={params.q} onChange={params.setQuery} className="w-[330px]" />
              }
              right={
                <>
                  <FilterDropdown
                    label="Status"
                    options={STATUS_OPTIONS}
                    value={params.filters.status}
                    onChange={(v) => params.setFilter("status", v)}
                  />
                  <FilterDropdown
                    label="Roles"
                    options={ROLE_OPTIONS}
                    value={params.filters.role}
                    onChange={(v) => params.setFilter("role", v)}
                  />
                </>
              }
            />

            <DataTable
              columns={memberColumns}
              rows={data?.data}
              rowKey={(row) => row.id}
              isLoading={isLoading}
              error={error}
              skeletonRows={params.perPage}
              empty={
                <EmptyState
                  title="No team members found"
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
          </>
        )}
      </div>
    </>
  );
}
