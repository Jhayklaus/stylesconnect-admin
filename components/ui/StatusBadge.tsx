import { Ban, Check, Clock, X } from "lucide-react";
import {
  toneFor,
  TONE_CLASS,
  TONE_ICON_BG,
  type StatusDomain,
  type StatusTone,
} from "@/lib/statusTone";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  /** Selects the per-domain tone override map. */
  domain?: StatusDomain;
  /** Escape hatch when the map is wrong for one cell. */
  tone?: StatusTone;
  /** Display override; defaults to Title Case of `status`. */
  label?: string;
  showIcon?: boolean;
  /** Small filled dot instead of the glyph chip — the team members table. */
  dot?: boolean;
  className?: string;
}

const TONE_ICON: Partial<Record<StatusTone, typeof Check>> = {
  success: Check,
  danger: X,
  warning: Clock,
};

export function StatusBadge({
  status,
  domain,
  tone,
  label,
  showIcon = true,
  dot,
  className,
}: StatusBadgeProps) {
  const resolved = tone ?? toneFor(status, domain);
  const key = status.trim().toLowerCase();

  // "Deactivated" reads as a deliberate block rather than a neutral state.
  const Icon = key === "deactivated" ? Ban : TONE_ICON[resolved];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1",
        "font-jost font-medium text-xs leading-4",
        TONE_CLASS[resolved],
        className
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", TONE_ICON_BG[resolved])}
        />
      )}
      {!dot && showIcon && Icon && (
        <span
          aria-hidden
          className={cn(
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-white",
            TONE_ICON_BG[resolved]
          )}
        >
          <Icon strokeWidth={3.5} className="h-2.5 w-2.5" />
        </span>
      )}
      {label ?? titleCase(status)}
    </span>
  );
}
