import { Suspense } from "react";
import { ListingsPage } from "@/components/listings/pages/ListingsPage";

export default function Page() {
  return (
    <Suspense>
      <ListingsPage />
    </Suspense>
  );
}
