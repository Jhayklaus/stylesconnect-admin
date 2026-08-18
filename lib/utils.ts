import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Unlike the consumer app's `cn` (a plain join), this merges conflicting
 * Tailwind classes so a caller's `className` actually wins over a component's
 * defaults — the generic primitives here (DataTable, StatCard, StatusBadge)
 * all rely on override-by-prop.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
