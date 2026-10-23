export type StatusTone = "success" | "danger" | "warning" | "neutral" | "critical" | "info";

/** Background for the small icon chip inside a badge — the tone's *foreground*
 *  colour, so a white glyph reads against it. */
export const TONE_ICON_BG: Record<StatusTone, string> = {
  success: "bg-status-success-fg",
  danger: "bg-status-danger-fg",
  warning: "bg-status-warning-fg",
  neutral: "bg-status-neutral-fg",
  critical: "bg-status-critical-fg",
  info: "bg-status-info-fg",
};

export const TONE_CLASS: Record<StatusTone, string> = {
  success: "bg-status-success-bg text-status-success-fg",
  danger: "bg-status-danger-bg text-status-danger-fg",
  warning: "bg-status-warning-bg text-status-warning-fg",
  neutral: "bg-status-neutral-bg text-status-neutral-fg",
  critical: "bg-status-critical-bg text-status-critical-fg",
  info: "bg-status-info-bg text-status-info-fg",
};

/** Status words whose tone never varies by domain. */
export const DEFAULT_STATUS_TONE: Record<string, StatusTone> = {
  published: "success",
  active: "success",
  paid: "success",
  approved: "success",
  verified: "success",
  delivered: "success",
  completed: "success",
  confirmed: "success",
  resolved: "success",
  open: "success",

  cancelled: "danger",
  failed: "danger",
  declined: "danger",
  rejected: "danger",

  pending: "warning",
  medium: "warning",
  processing: "warning",
  awaiting_review: "warning",

  fulfilled: "neutral",
  unfulfilled: "neutral",
  refunded: "neutral",
  unlisted: "neutral",
  deactivated: "neutral",
  disabled: "neutral",
  invited: "neutral",
  draft: "neutral",
  closed: "neutral",
  low: "neutral",

  high: "critical",
};

/**
 * Per-domain overrides. "Inactive" is deliberately different across screens in
 * the designs: pale red with an ✗ on Listings, amber with a clock on the
 * customer lists. Flagged to the designer — collapse this map if it turns out
 * to be an inconsistency rather than intent.
 */
export const DOMAIN_STATUS_TONE: Record<string, Record<string, StatusTone>> = {
  designer: { inactive: "warning" },
  shopper: { inactive: "warning" },
  listing: { inactive: "danger" },
};

export type StatusDomain = keyof typeof DOMAIN_STATUS_TONE | "order" | "ticket" | "transaction";

export function toneFor(status: string, domain?: StatusDomain): StatusTone {
  const key = status.trim().toLowerCase().replace(/\s+/g, "_");
  return (
    (domain ? DOMAIN_STATUS_TONE[domain]?.[key] : undefined) ??
    DEFAULT_STATUS_TONE[key] ??
    "neutral"
  );
}
