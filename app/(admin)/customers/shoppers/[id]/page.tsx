import { Suspense } from "react";
import { ShopperProfilePage } from "@/components/shoppers/pages/ShopperProfilePage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <ShopperProfilePage shopperId={id} />
    </Suspense>
  );
}
