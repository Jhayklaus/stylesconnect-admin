import { Suspense } from "react";
import { OrderDetailPage } from "@/components/orders/pages/OrderDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <OrderDetailPage orderId={id} />
    </Suspense>
  );
}
