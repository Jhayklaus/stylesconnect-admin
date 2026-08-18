import { Suspense } from "react";
import { AdministrationPage } from "@/components/members/pages/AdministrationPage";

export default function Page() {
  return (
    <Suspense>
      <AdministrationPage />
    </Suspense>
  );
}
