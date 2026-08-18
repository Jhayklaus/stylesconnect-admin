import { Suspense } from "react";
import { ShoppersPage } from "@/components/shoppers/pages/ShoppersPage";

export default function Page() {
  return (
    <Suspense>
      <ShoppersPage />
    </Suspense>
  );
}
