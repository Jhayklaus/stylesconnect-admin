import {
  ArrowLeftRight,
  LayoutGrid,
  Package,
  Settings,
  ShoppingBag,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
// Coupons and Analytics are parked — restore these imports together with the
// commented entries at the bottom of MAIN_MENU.
// import { ChartNoAxesCombined, TicketPercent } from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Leaf items link directly; parents expand to `children`. */
  href?: string;
  children?: NavChild[];
}

/**
 * Single source of truth for the sidebar.
 *
 * The Figma frames disagree with each other — Overview.png shows
 * Tickets/Coupons/Administration but no Team members, while payments.png shows
 * the reverse. This was the union of both; Coupons and Analytics have since
 * been parked. Every href here is backed by a real route (some are "coming
 * soon" stubs) so no nav item dead-ends.
 */
export const MAIN_MENU: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid, href: "/overview" },
  {
    key: "customers",
    label: "Customers",
    icon: Users,
    children: [
      { label: "Designers", href: "/customers/designers" },
      { label: "Shoppers", href: "/customers/shoppers" },
      { label: "Verification", href: "/customers/verification" },
    ],
  },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingBag,
    children: [
      { label: "Order list", href: "/orders/list" },
      { label: "Returns", href: "/orders/returns" },
    ],
  },
  { key: "listings", label: "Listings", icon: Package, href: "/listings" },
  {
    key: "transactions",
    label: "Transaction",
    icon: ArrowLeftRight,
    children: [
      { label: "Payments", href: "/transactions/payments" },
      { label: "Refunds", href: "/transactions/refunds" },
    ],
  },
  { key: "tickets", label: "Tickets", icon: Ticket, href: "/tickets" },
  // Parked for now. The /coupons and /analytics routes still exist as stubs,
  // so restoring these two lines (and their icon imports above) is all it takes.
  // { key: "coupons", label: "Coupons", icon: TicketPercent, href: "/coupons" },
  // { key: "analytics", label: "Analytics", icon: ChartNoAxesCombined, href: "/analytics" },
  // Route stays /administration; only the label changed.
  { key: "administration", label: "Team management", icon: Settings, href: "/administration" },
];
