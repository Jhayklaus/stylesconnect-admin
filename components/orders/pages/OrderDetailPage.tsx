"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Navigation } from "lucide-react";
import { AdminTopBar, DetailHeader, type Crumb } from "@/components/shell";
import { InfoChip } from "@/components/customers";
import {
  Avatar,
  Button,
  CopyButton,
  EmptyState,
  Skeleton,
  SpecTable,
  StatusBadge,
} from "@/components/ui";
import { useOrder } from "@/hooks/orders/useOrders";
import { formatCount, formatDateLong, formatNaira, formatTime, titleCase } from "@/lib/format";
import { toast } from "@/lib/toast";
import type { OrderDetail, OrderMeasurement } from "@/services/orders";
import { DeliveryMap } from "../DeliveryMap";
import { OrderProgress } from "../OrderProgress";
import { OrderTimeline } from "../OrderTimeline";

const CRUMBS: Crumb[] = [
  { label: "Dashboard", href: "/overview" },
  { label: "Designer", href: "/customers/designers" },
  { label: "Order" },
];

function MeasurementList({ measurements }: { measurements: OrderMeasurement[] }) {
  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-1 font-jost text-sm leading-5">
      {measurements.map((m) => (
        <div key={m.type} className="flex gap-1">
          <dt className="text-text-500">{titleCase(m.type)}:</dt>
          <dd className="text-text-900">{m.measurement}</dd>
        </div>
      ))}
    </dl>
  );
}

function PaymentRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="font-jost text-sm leading-5 text-text-500">{label}</span>
      <span className="font-jost text-sm leading-5 text-text-900">
        {hint && <span className="mr-2 text-text-500">{hint}</span>}
        {value}
      </span>
    </div>
  );
}

function CustomerRail({ detail }: { detail: OrderDetail }) {
  const mapsHref = detail.shipping_address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.shipping_address)}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="font-inter font-medium text-base leading-6 text-text-900">Customer</h2>
        <div className="flex items-center gap-3">
          <Avatar src={detail.customer.avatar_url} name={detail.customer.name} size="md" />
          <div className="min-w-0">
            <p className="truncate font-jost font-medium text-sm leading-5 text-text-900">
              {detail.customer.name}
            </p>
            <p className="font-jost text-xs leading-4 text-text-500">ID: {detail.customer.id}</p>
          </div>
        </div>

        <dl className="flex flex-col gap-3">
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <dt className="font-jost text-sm leading-5 text-text-500">Email</dt>
            <dd className="min-w-0">
              <InfoChip href={`mailto:${detail.customer.email}`}>{detail.customer.email}</InfoChip>
            </dd>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <dt className="font-jost text-sm leading-5 text-text-500">Phone</dt>
            <dd className="min-w-0">
              {detail.customer.phone ? (
                <InfoChip href={`tel:${detail.customer.phone}`}>{detail.customer.phone}</InfoChip>
              ) : (
                <span className="font-jost text-sm leading-5 text-text-500">—</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-inter font-medium text-base leading-6 text-text-900">
          Delivery address
        </h2>
        <p className="font-jost text-sm leading-5 text-text-900">{detail.shipping_address ?? "—"}</p>

        <DeliveryMap address={detail.shipping_address} />

        {mapsHref && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-jost text-sm leading-5 text-text-900 underline"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden />
            View on map
          </a>
        )}
      </section>
    </div>
  );
}

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useOrder(orderId);

  if (error) {
    return (
      <>
        <AdminTopBar breadcrumb={CRUMBS} />
        <div className="flex-1 px-8 py-6">
          <EmptyState title="Couldn't load this order" description={error.message} />
        </div>
      </>
    );
  }

  const itemCount = data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const shippingStops = data
    ? [data.shipping.origin, data.shipping.destination].filter((a): a is string => Boolean(a))
    : [];

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <DetailHeader
        isLoading={isLoading}
        title={
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-inter font-medium text-xl leading-7 text-text-900">
              Order {data?.order_id}
            </h1>
            {data && (
              <>
                <StatusBadge status={data.payment_status} domain="order" />
                {data.fulfillment_status && (
                  <StatusBadge status={data.fulfillment_status} domain="order" showIcon={false} />
                )}
              </>
            )}
          </div>
        }
        subtitle={
          data && (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-jost text-sm leading-5 text-text-500">
              <span>
                Order date:{" "}
                <span className="text-text-900">
                  {formatDateLong(data.ordered_at)} {formatTime(data.ordered_at)}
                </span>
              </span>
              <span aria-hidden>•</span>
              <span>
                Order from: <span className="text-text-900 underline">{data.store}</span>
              </span>
              {data.reference && (
                <>
                  <span aria-hidden>•</span>
                  <span className="inline-flex items-center gap-1.5">
                    Payment ref: <span className="text-text-900">{data.reference}</span>
                    <CopyButton value={data.reference} label="Payment ref" />
                  </span>
                </>
              )}
            </p>
          )
        }
        hasPrev={Boolean(data?.prev_id)}
        hasNext={Boolean(data?.next_id)}
        onPrev={() => data?.prev_id && router.push(`/orders/${data.prev_id}`)}
        onNext={() => data?.next_id && router.push(`/orders/${data.next_id}`)}
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success("Return request isn't wired up yet")}
          >
            Return request
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-8 border-t border-stroke-soft px-8 py-6 lg:flex-row lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {isLoading || !data ? (
            <>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-40 w-full" />
            </>
          ) : (
            <>
              <OrderProgress stage={data.stage} estimatedDeliveryAt={data.estimated_delivery_at} />

              <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-inter font-medium text-base leading-6 text-text-900">
                    Product
                  </h2>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toast.success("Cancel order isn't wired up yet")}
                      className="font-jost text-sm leading-5 text-text-900 underline"
                    >
                      Cancel order
                    </button>
                    <Button onClick={() => toast.success("Fulfil order isn't wired up yet")}>
                      Fulfil order
                    </Button>
                  </div>
                </div>

                <SpecTable
                  title="Product"
                  rows={[
                    {
                      label: "Product image",
                      value: data.product.image_url ? (
                        <Image
                          src={data.product.image_url}
                          alt={data.product.title}
                          width={72}
                          height={72}
                          className="h-18 w-18 rounded-lg border border-stroke-soft object-cover"
                        />
                      ) : (
                        "—"
                      ),
                    },
                    { label: "Color", value: data.product.color ?? "—" },
                    {
                      label: "Size",
                      value: (
                        <div className="flex flex-col gap-3">
                          <span>{data.product.size ?? "—"}</span>
                          {/* Only custom-fit orders carry measurements. */}
                          {data.product.measurements && data.product.measurements.length > 0 && (
                            <div className="rounded-lg bg-bg-soft px-3 py-2.5">
                              <MeasurementList measurements={data.product.measurements} />
                            </div>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-inter font-medium text-base leading-6 text-text-900">
                  Shipping label
                </h2>
                <div className="overflow-hidden rounded-xl border border-stroke-soft">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-soft px-5 py-3.5">
                    {data.shipping.tracking_id ? (
                      <span className="inline-flex items-center gap-1.5 font-jost text-sm leading-5 text-text-500">
                        Tracking ID:{" "}
                        <span className="font-medium text-text-900">{data.shipping.tracking_id}</span>
                        <CopyButton value={data.shipping.tracking_id} label="Tracking ID" />
                      </span>
                    ) : (
                      <span className="font-jost text-sm leading-5 text-text-500">
                        Not handed to a courier yet
                      </span>
                    )}
                    {data.shipping.tracking_url && (
                      <a
                        href={data.shipping.tracking_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-jost text-sm leading-5 text-text-900 underline"
                      >
                        View tracking
                      </a>
                    )}
                  </div>

                  <ol className="flex flex-col gap-4 px-5 py-4">
                    {shippingStops.map((address, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <MapPin
                          className={
                            i === 0
                              ? "mt-0.5 h-4 w-4 shrink-0 text-text-500"
                              : "mt-0.5 h-4 w-4 shrink-0 text-primary-base"
                          }
                          aria-hidden
                        />
                        <span className="font-jost text-sm leading-5 text-text-900">{address}</span>
                      </li>
                    ))}
                    {data.shipping.carrier && (
                      <li className="font-jost text-sm leading-5 text-text-900">
                        {data.shipping.carrier}
                      </li>
                    )}
                  </ol>
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <h2 className="font-inter font-medium text-base leading-6 text-text-900">
                  Payment details
                </h2>
                <div className="divide-y divide-stroke-soft">
                  <PaymentRow
                    label="Subtotal total"
                    hint={`${formatCount(itemCount)} items`}
                    value={formatNaira(data.subtotal)}
                  />
                  <PaymentRow label="Payment method" value={data.payment_method ?? "—"} />
                  <PaymentRow label="Shipping fee" value={formatNaira(data.shipping_fee)} />
                  {data.discount_amount > 0 && (
                    <PaymentRow label="Discount" value={`−${formatNaira(data.discount_amount)}`} />
                  )}
                  {data.tax_amount > 0 && (
                    <PaymentRow label="Tax" value={formatNaira(data.tax_amount)} />
                  )}
                  <PaymentRow label="Total" value={formatNaira(data.total)} />
                </div>
              </section>

              <OrderTimeline events={data.events} />
            </>
          )}
        </div>

        <div className="w-full shrink-0 lg:w-[330px] lg:border-l lg:border-stroke-soft lg:pl-8">
          {isLoading || !data ? <Skeleton className="h-64 w-full" /> : <CustomerRail detail={data} />}
        </div>
      </div>
    </>
  );
}
