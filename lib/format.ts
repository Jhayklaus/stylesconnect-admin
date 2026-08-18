const NAIRA = "₦";

/** ₦250,000,000 */
export function formatNaira(value: number, opts?: { decimals?: boolean }): string {
  const decimals = opts?.decimals ?? false;
  return (
    NAIRA +
    value.toLocaleString("en-NG", {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    })
  );
}

/** 500m / 100m / 10m / 1m / 500k / 100k — the revenue chart's axis vocabulary. */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${trim(value / 1_000_000_000)}b`;
  if (value >= 1_000_000) return `${trim(value / 1_000_000)}m`;
  if (value >= 1_000) return `${trim(value / 1_000)}k`;
  return String(value);
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
}

/** 12/08/26 */
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
}

/** 12/08/26 11:00 AM */
export function formatDateTimeShort(iso: string): string {
  return `${formatDateShort(iso)} ${formatTime(iso)}`;
}

/** Sept 10 2026 */
export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
}

/** June, 2021 — the "Since ..." subtitle on the team members table. */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getMonth()]}, ${d.getFullYear()}`;
}

/** 3:14 PM */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** 9.4% */
export function formatPercent(value: number): string {
  return `${trim(value)}%`;
}

/** 2,000 */
export function formatCount(value: number): string {
  return value.toLocaleString("en-NG");
}

/** Title Case from a snake/kebab/lower status token. */
export function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
