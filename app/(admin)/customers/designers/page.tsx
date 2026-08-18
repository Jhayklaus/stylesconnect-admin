import { Suspense } from "react";
import { DesignersPage } from "@/components/designers/pages/DesignersPage";

export default function Page() {
  return (
    <Suspense>
      <DesignersPage />
    </Suspense>
  );
}
