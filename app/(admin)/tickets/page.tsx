import { Suspense } from "react";
import { TicketsPage } from "@/components/tickets/pages/TicketsPage";

export default function Page() {
  return (
    <Suspense>
      <TicketsPage />
    </Suspense>
  );
}
