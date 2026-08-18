import { Suspense } from "react";
import { TicketDetailPage } from "@/components/tickets/pages/TicketDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <TicketDetailPage ticketId={id} />
    </Suspense>
  );
}
