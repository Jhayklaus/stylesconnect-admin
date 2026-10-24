"use client";

import { useState } from "react";
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
import { useMembers, useRemoveMember, useResendInvite } from "@/hooks/members/useMembers";
import { useListParams } from "@/hooks/useListParams";
import {
  TEAM_ENDPOINTS_LIVE,
  MEMBER_ROLES,
  type Member,
  type MemberListParams,
} from "@/services/members";
import { memberColumns, type MemberAction } from "../memberColumns";
import { ChangeRoleModal } from "../ChangeRoleModal";
import { InviteMemberModal } from "../InviteMemberModal";

// Matches the sidebar label rather than the frame's "Team members", so the
// breadcrumb root and the nav item read the same.
const CRUMBS: Crumb[] = [
  { label: "Team management", href: "/administration" },
  { label: "Members" },
];

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
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<Member | null>(null);
  const resend = useResendInvite();
  const remove = useRemoveMember();

  function onAction(action: MemberAction, member: Member) {
    if (action === "resend") resend.mutate(member.id);
    if (action === "role") setRoleTarget(member);
    if (action === "remove") remove.mutate(member.id);
  }
  const onActivityTab = params.tab === "activity";

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <Toolbar
          left={<SegmentedTabs tabs={TABS} value={params.tab} onChange={params.setTab} />}
          right={
            TEAM_ENDPOINTS_LIVE && (
              <Button onClick={() => setInviteOpen(true)}>Invite Member</Button>
            )
          }
        />

        {onActivityTab ? (
          <ComingSoon
            title="Activity log"
            description="This tab has no design yet — the members table is the only view specified."
          />
        ) : (
          <>
            {/* Hidden until the backend honours search and filters. */}
            {TEAM_ENDPOINTS_LIVE && (
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
            )}

            <DataTable
              columns={memberColumns(onAction)}
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

      <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ChangeRoleModal member={roleTarget} onClose={() => setRoleTarget(null)} />
    </>
  );
}
