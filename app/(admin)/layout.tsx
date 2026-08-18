import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AdminShell } from "@/components/shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
