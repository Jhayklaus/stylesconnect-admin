"use client";

import { useState } from "react";
import { CirclePlus, CircleX } from "lucide-react";
import { Button, FilterDropdown, Modal, TextField } from "@/components/ui";
import { useInviteMembers } from "@/hooks/members/useMembers";
import { toast } from "@/lib/toast";
import { MEMBER_ROLES } from "@/services/members";

const ROLE_OPTIONS = MEMBER_ROLES.map((role) => ({ value: role, label: role }));

interface InviteRow {
  key: number;
  email: string;
  role: string;
}

let nextKey = 0;
const blankRow = (): InviteRow => ({ key: nextKey++, email: "", role: MEMBER_ROLES[0] });

export function InviteMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rows, setRows] = useState<InviteRow[]>([blankRow()]);
  const [submitted, setSubmitted] = useState(false);
  const invite = useInviteMembers();

  function patchRow(key: number, patch: Partial<InviteRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function submit() {
    setSubmitted(true);
    const filled = rows.filter((row) => row.email.trim());

    if (filled.length === 0) {
      toast.error("Add at least one email address");
      return;
    }
    if (filled.some((row) => !row.email.includes("@"))) {
      toast.error("Check the email addresses");
      return;
    }

    invite.mutate(
      filled.map((row) => ({ email: row.email.trim(), role: row.role })),
      {
        onSuccess: () => {
          setRows([blankRow()]);
          setSubmitted(false);
          onClose();
        },
      }
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite Team member"
      description="Invite team members to work on some task"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={invite.isPending}>
            {invite.isPending ? "Sending" : "Send invite"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 px-6 py-6">
        {rows.map((row, index) => (
          <div key={row.key} className="flex flex-col gap-2">
            <TextField
              label={index === 0 ? "Email address" : `Email address ${index + 1}`}
              // Only the first row shows a visible label in the design.
              fieldClassName={index === 0 ? "[&>label]:sr-only" : "[&>label]:sr-only"}
              type="email"
              value={row.email}
              onChange={(email) => patchRow(row.key, { email })}
              placeholder="Email address..."
              error={
                submitted && row.email.trim() && !row.email.includes("@")
                  ? "Enter a valid email"
                  : undefined
              }
              trailing={
                <FilterDropdown
                  label="Role"
                  align="end"
                  options={ROLE_OPTIONS}
                  value={row.role}
                  onChange={(role) => patchRow(row.key, { role })}
                  className="shrink-0 [&>button]:h-8 [&>button]:border-0"
                />
              }
            />

            {/* The first row is always required, so only the extras are removable. */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                className="inline-flex w-fit items-center gap-1.5 font-jost text-sm leading-5 text-status-danger-fg"
              >
                <CircleX className="h-4 w-4" aria-hidden />
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, blankRow()])}
          className="inline-flex w-fit items-center gap-1.5 font-jost text-sm leading-5 text-primary-base"
        >
          <CirclePlus className="h-4 w-4" aria-hidden />
          Add more member
        </button>
      </div>
    </Modal>
  );
}
