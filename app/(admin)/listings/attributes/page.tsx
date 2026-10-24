import { Suspense } from "react";
import { AttributesPage } from "@/components/attributes/pages/AttributesPage";

export default function Page() {
  return (
    <Suspense>
      <AttributesPage />
    </Suspense>
  );
}
