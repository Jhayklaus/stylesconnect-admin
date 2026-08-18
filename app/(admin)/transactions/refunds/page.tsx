import { Suspense } from "react";
import { RefundsPage } from "@/components/refunds/pages/RefundsPage";

export default function Page() {
  return (
    <Suspense>
      <RefundsPage />
    </Suspense>
  );
}
