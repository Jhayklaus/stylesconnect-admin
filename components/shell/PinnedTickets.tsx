import Link from "next/link";
import { Pin } from "lucide-react";

export interface PinnedTicket {
  id: string;
  title: string;
  href: string;
}

// Fixture until the tickets domain is built.
export const PINNED_TICKETS: PinnedTicket[] = [
  { id: "TC-1", title: "Navigation issue", href: "/tickets" },
  { id: "TC-2", title: "Profiled picture doesn't load on mobile", href: "/tickets" },
  { id: "TC-3", title: "Failed login attempt", href: "/tickets" },
];

export function PinnedTickets({ tickets = PINNED_TICKETS }: { tickets?: PinnedTicket[] }) {
  if (!tickets.length) return null;

  return (
    <div className="mt-7">
      <p className="px-3.5 pb-2 font-jost text-[11px] uppercase leading-4 tracking-[0.08em] text-text-300">
        Pinned tickets
      </p>
      <ul className="space-y-0.5">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <Link
              href={ticket.href}
              title={ticket.title}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-jost text-[15px] leading-6 text-text-500 transition-colors hover:bg-bg-white/60 hover:text-text-900"
            >
              <Pin className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span className="min-w-0 truncate">{ticket.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
