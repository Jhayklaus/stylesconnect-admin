"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Shared plumbing for the modal and the drawer: portal to <body>, a scrim,
 * Escape to close, background scroll lock, a Tab focus trap, and focus
 * restored to the opener on close.
 */
function OverlayRoot({
  open,
  onClose,
  children,
  panelClassName,
  position,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
  position: "center" | "right";
  labelledBy: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      // Keep Tab inside the dialog — without this, focus walks into the page
      // behind the scrim, which a screen reader still announces.
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Focus the panel itself rather than the first control, so the close
    // button isn't pre-highlighted the moment the dialog appears.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      openerRef.current?.focus();
    };
  }, [open, onKeyDown]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      className={cn(
        "fixed inset-0 z-50 flex",
        position === "center" ? "items-center justify-center p-4 sm:p-6" : "justify-end"
      )}
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-darker/40 animate-fade-in"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-full flex-col overflow-hidden bg-bg-white outline-none",
          position === "center"
            ? "w-full rounded-2xl shadow-popover animate-scale-in"
            : "h-full w-full max-w-[360px] shadow-popover",
          panelClassName
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Small glyph before the title. */
  icon?: ReactNode;
  description?: ReactNode;
  /** Extra controls beside the close button. */
  headerActions?: ReactNode;
  children: ReactNode;
  /** Pinned action row along the bottom. */
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
  /** Applied to the scrolling body — useful for full-bleed layouts. */
  bodyClassName?: string;
}

export type ModalSize = "sm" | "md" | "lg" | "xl";

const MODAL_WIDTH: Record<ModalSize, string> = {
  sm: "max-w-[452px]",
  md: "max-w-[600px]",
  lg: "max-w-[900px]",
  xl: "max-w-6xl",
};

export function Modal({
  open,
  onClose,
  title,
  icon,
  description,
  headerActions,
  children,
  footer,
  size = "sm",
  className,
  bodyClassName,
}: ModalProps) {
  const titleId = `modal-title-${size}`;

  return (
    <OverlayRoot
      open={open}
      onClose={onClose}
      position="center"
      labelledBy={titleId}
      panelClassName={cn(MODAL_WIDTH[size], className)}
    >
      <div className="flex items-start justify-between gap-4 border-b border-stroke-soft px-6 py-5">
        <div className="min-w-0">
          <h2
            id={titleId}
            className="flex items-center gap-2.5 font-inter font-medium text-lg leading-7 text-text-900"
          >
            {icon}
            {title}
          </h2>
          {description && (
            <p className="mt-1 font-jost text-sm leading-5 text-text-500">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {headerActions}
          <IconButton
            label="Close"
            onClick={onClose}
            className="border-0 bg-transparent"
            icon={<X className="h-[18px] w-[18px]" />}
          />
        </div>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-y-auto", bodyClassName)}>{children}</div>

      {footer && (
        <div className="flex items-center justify-end gap-3 border-t border-stroke-soft px-6 py-4">
          {footer}
        </div>
      )}
    </OverlayRoot>
  );
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Right-hand side panel — the transaction details view. */
export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  const titleId = "drawer-title";

  return (
    <OverlayRoot
      open={open}
      onClose={onClose}
      position="right"
      labelledBy={titleId}
      panelClassName={className}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-5">
        <h2 id={titleId} className="font-inter font-medium text-lg leading-7 text-text-900">
          {title}
        </h2>
        <IconButton
          label="Close"
          onClick={onClose}
          className="border-0 bg-transparent"
          icon={<X className="h-[18px] w-[18px]" />}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </OverlayRoot>
  );
}
