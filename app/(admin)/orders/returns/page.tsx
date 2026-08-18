import { Suspense } from "react";
import { ReturnsPage } from "@/components/returns/pages/ReturnsPage";

export default function Page() {
  return (
    <Suspense>
      <ReturnsPage />
    </Suspense>
  );
}
