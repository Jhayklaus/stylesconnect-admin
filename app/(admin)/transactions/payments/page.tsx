import { Suspense } from "react";
import { PaymentsPage } from "@/components/payments/pages/PaymentsPage";

export default function Page() {
  return (
    <Suspense>
      <PaymentsPage />
    </Suspense>
  );
}
