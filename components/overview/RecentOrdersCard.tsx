import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button, Card, CardHeader, Skeleton, StatusBadge } from "@/components/ui";
import { formatDateLong } from "@/lib/format";
import type { RecentOrder } from "@/services/overview";

export function RecentOrdersCard({
  orders,
  isLoading,
}: {
  orders?: RecentOrder[];
  isLoading?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Recent orders"
        action={
          <Link href="/orders/list">
            <Button variant="outline" size="sm">
              See All
            </Button>
          </Link>
        }
      />

      <ul className="mt-4 flex-1">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="px-5 py-3">
              <Skeleton className="h-11 w-full" />
            </li>
          ))}

        {orders?.map((order) => (
          <li key={order.id}>
            <Link
              href="/orders/list"
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-beige-lighter"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.image_url}
                alt=""
                aria-hidden
                className="h-11 w-11 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-jost text-sm leading-5 text-text-900">
                  Order {order.order_id}
                </span>
                <span className="block truncate font-jost text-xs leading-4 text-text-500">
                  {order.category} · QTY: {order.quantity}
                </span>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-1">
                <StatusBadge status={order.status} domain="order" showIcon={false} />
                <span className="font-jost text-xs leading-4 text-text-500">
                  {formatDateLong(order.created_at)}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-text-300" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
