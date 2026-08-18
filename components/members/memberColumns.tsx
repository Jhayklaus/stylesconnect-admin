import { Mail, Trash2, UserRound } from "lucide-react";
import { ActionMenu, Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatDateShort, formatDateTimeShort, formatMonthYear } from "@/lib/format";
import type { Member } from "@/services/members";

export type MemberAction = "resend" | "role" | "remove";

/**
 * A factory rather than a constant: the trailing menu needs the page's
 * handlers, and the cell JSX still stays out of the page component.
 */
export function memberColumns(
  onAction: (action: MemberAction, member: Member) => void
): Column<Member>[] {
  return [
  {
    id: "name",
    header: "Name",
    width: "w-[320px]",
    // Invited members have no tenure yet, so the design shows their email
    // instead of the "Since ..." line.
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={null} name={row.name} size="md" />
        <div className="min-w-0">
          <p className="truncate text-text-900">{row.name}</p>
          <p className="truncate font-jost text-xs leading-4 text-text-500">
            {row.joined_at ? `Since ${formatMonthYear(row.joined_at)}` : row.email}
          </p>
        </div>
      </div>
    ),
  },
  { id: "role", header: "Roles", cell: (row) => row.role },
  {
    id: "status",
    header: "Status",
    width: "w-[140px]",
    cell: (row) => <StatusBadge status={row.status} dot />,
  },
  { id: "added_at", header: "Date added", cell: (row) => formatDateShort(row.added_at) },
  {
    id: "last_login_at",
    header: "Last login",
    cell: (row) =>
      row.last_login_at ? (
        formatDateTimeShort(row.last_login_at)
      ) : (
        <span className="text-text-300" aria-label="Never signed in">
          - - - - - - -
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      width: "w-[64px]",
      align: "right",
      cell: (row) => (
        <ActionMenu
          label={`Actions for ${row.name}`}
          onSelect={(value) => onAction(value as MemberAction, row)}
          items={[
            {
              value: "resend",
              label: "Resend invite",
              icon: <Mail className="h-4 w-4" aria-hidden />,
              // Only pending invites can be resent.
              disabled: row.status !== "invited",
              checked: row.status === "invited",
            },
            {
              value: "role",
              label: "Change role",
              icon: <UserRound className="h-4 w-4" aria-hidden />,
            },
            {
              value: "remove",
              label: "Remove member",
              icon: <Trash2 className="h-4 w-4" aria-hidden />,
              danger: true,
            },
          ]}
        />
      ),
    },
  ];
}
