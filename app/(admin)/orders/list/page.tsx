import { Suspense } from "react";
import { OrderListPage } from "@/components/orders/pages/OrderListPage";

export default function Page() {
  return (
    <Suspense>
      <OrderListPage />
    </Suspense>
  );
}
