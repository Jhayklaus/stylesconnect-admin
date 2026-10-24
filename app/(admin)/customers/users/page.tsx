import { Suspense } from "react";
import { UsersPage } from "@/components/users/pages/UsersPage";

export default function Page() {
  return (
    <Suspense>
      <UsersPage />
    </Suspense>
  );
}
