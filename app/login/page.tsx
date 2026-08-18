import { Suspense } from "react";
import { LoginPage } from "@/components/auth/pages/LoginPage";

export default function Page() {
  return (
    // useSearchParams (the ?next= round-trip) opts this route out of static
    // prerendering without a boundary.
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
