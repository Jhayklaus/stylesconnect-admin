import { Avatar, StatusBadge, type Column } from "@/components/ui";
import { formatDateShort, titleCase } from "@/lib/format";
import type { PlatformUser, WaitlistEntry } from "@/services/users";

/** The API calls shoppers "customer"; the rest of the admin says "Shopper". */
export function roleLabel(role: string): string {
  return role === "customer" ? "Shopper" : titleCase(role);
}

export const userColumns: Column<PlatformUser>[] = [
  {
    id: "name",
    header: "Name",
    width: "w-[280px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.profile_picture_url} name={row.name} size="sm" />
        <span className="truncate text-text-900">{row.name}</span>
      </div>
    ),
  },
  {
    id: "email",
    header: "Email",
    width: "w-[260px]",
    cell: (row) => <span className="truncate text-text-900">{row.email}</span>,
  },
  { id: "phone", header: "Phone", cell: (row) => row.phone_number ?? "—" },
  {
    id: "roles",
    header: "Roles",
    cell: (row) =>
      row.roles.length ? (
        row.roles.map(roleLabel).join(", ")
      ) : (
        <span className="text-text-300">No role</span>
      ),
  },
  {
    id: "verified",
    header: "Email",
    cell: (row) => (
      <StatusBadge
        status={row.is_email_verified ? "verified" : "unverified"}
        showIcon={row.is_email_verified}
      />
    ),
  },
  { id: "created_at", header: "Joined", cell: (row) => formatDateShort(row.created_at) },
];

export const waitlistColumns: Column<WaitlistEntry>[] = [
  {
    id: "name",
    header: "Name",
    width: "w-[260px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={null} name={row.full_name} size="sm" />
        <span className="truncate text-text-900">{row.full_name}</span>
      </div>
    ),
  },
  {
    id: "email",
    header: "Email",
    width: "w-[260px]",
    cell: (row) => <span className="truncate text-text-900">{row.email}</span>,
  },
  { id: "phone", header: "Phone", cell: (row) => row.phone ?? "—" },
  { id: "city", header: "City", cell: (row) => row.city ?? "—" },
  {
    id: "type",
    header: "Joining as",
    cell: (row) => <StatusBadge status={roleLabel(row.type)} tone="neutral" showIcon={false} />,
  },
  { id: "created_at", header: "Signed up", cell: (row) => formatDateShort(row.created_at) },
];
