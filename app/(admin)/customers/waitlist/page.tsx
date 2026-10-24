import { Suspense } from "react";
import { WaitlistPage } from "@/components/users/pages/WaitlistPage";

export default function Page() {
  return (
    <Suspense>
      <WaitlistPage />
    </Suspense>
  );
}
