import { Suspense } from "react";
import { DesignerProfilePage } from "@/components/designers/pages/DesignerProfilePage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <DesignerProfilePage designerId={id} />
    </Suspense>
  );
}
