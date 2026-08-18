"use client";

import { useState } from "react";
import { Button, FilterDropdown, Modal, TextField } from "@/components/ui";
import { useUpdateMemberRole } from "@/hooks/members/useMembers";
import { MEMBER_ROLES, type Member } from "@/services/members";

const ROLE_OPTIONS = MEMBER_ROLES.map((role) => ({ value: role, label: role }));

export function ChangeRoleModal({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  const [role, setRole] = useState<string>(member?.role ?? MEMBER_ROLES[0]);
  const [lastMemberId, setLastMemberId] = useState(member?.id);
  const update = useUpdateMemberRole();

  // Resync when a different row opens the modal (React's documented pattern).
  if (member && member.id !== lastMemberId) {
    setLastMemberId(member.id);
    setRole(member.role);
  }

  return (
    <Modal
      open={Boolean(member)}
      onClose={onClose}
      title="Change member role"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={update.isPending}
            onClick={() =>
              member &&
              update.mutate({ id: member.id, role }, { onSuccess: onClose })
            }
          >
            {update.isPending ? "Updating" : "Update"}
          </Button>
        </>
      }
    >
      <div className="px-6 py-6">
        <TextField
          label="Email address"
          fieldClassName="[&>label]:sr-only"
          value={member?.email ?? ""}
          onChange={() => undefined}
          readOnly
          placeholder="Email address..."
          trailing={
            <FilterDropdown
              label="Role"
              align="end"
              options={ROLE_OPTIONS}
              value={role}
              onChange={setRole}
              className="shrink-0 [&>button]:h-8 [&>button]:border-0"
            />
          }
        />
      </div>
    </Modal>
  );
}
