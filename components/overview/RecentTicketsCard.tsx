import Link from "next/link";
import { ChevronRight, Circle, CircleCheck } from "lucide-react";
import { Button, Card, CardHeader, Skeleton, StatusBadge } from "@/components/ui";
import { formatDateLong } from "@/lib/format";
import type { RecentTicket } from "@/services/overview";

export function RecentTicketsCard({
  tickets,
  isLoading,
}: {
  tickets?: RecentTicket[];
  isLoading?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Recent ticket"
        action={
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        }
      />

      <ul className="mt-4 flex-1">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="px-5 py-3">
              <Skeleton className="h-10 w-full" />
            </li>
          ))}

        {tickets?.map((ticket) => (
          <li key={ticket.id}>
            <Link
              href="/tickets"
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-beige-lighter"
            >
              {ticket.resolved ? (
                <CircleCheck className="h-5 w-5 shrink-0 text-text-300" aria-hidden />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-text-300" aria-hidden />
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate font-jost text-sm leading-5 text-text-900">
                  {ticket.subject}
                </span>
                <span className="block truncate font-jost text-xs leading-4 text-text-500">
                  <span className="underline">{ticket.reference}</span> ·{" "}
                  {formatDateLong(ticket.created_at)}
                </span>
              </span>

              <StatusBadge status={ticket.priority} domain="ticket" showIcon={false} />
              <ChevronRight className="h-4 w-4 shrink-0 text-text-300" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
