import { ComingSoon } from "@/components/ui";
import { AdminTopBar } from "@/components/shell";
import type { Crumb } from "@/components/shell";

export interface StubPageProps {
  title: string;
  breadcrumb?: Crumb[];
  description?: string;
}

/** A designless route still gets the full shell, header, and a styled body. */
export function StubPage({ title, breadcrumb, description }: StubPageProps) {
  return (
    <>
      <AdminTopBar
        title={breadcrumb ? undefined : title}
        breadcrumb={breadcrumb}
      />
      <div className="flex-1 px-8 py-6">
        <ComingSoon title={title} description={description} />
      </div>
    </>
  );
}
