"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Modal } from "./Overlay";

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  /** Red confirm button, for deletes and rejections. */
  danger?: boolean;
  isPending?: boolean;
}

/** The "are you sure?" step in front of a destructive or hard-to-undo action. */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger,
  isPending,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "filled"} onClick={onConfirm} disabled={isPending}>
            {isPending ? "Working…" : confirmLabel}
          </Button>
        </>
      }
    >
      {description && (
        <p className="px-6 py-5 font-jost text-sm leading-5 text-text-500">{description}</p>
      )}
    </Modal>
  );
}
