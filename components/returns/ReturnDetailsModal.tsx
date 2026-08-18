"use client";

import { AlertCircle } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import { InfoChip } from "@/components/customers";
import { Avatar, Button, EmptyState, Modal, Skeleton, StatusBadge } from "@/components/ui";
import { useReturnDetail, useReturnDecisionMutation } from "@/hooks/returns/useReturnDetail";
import { formatDateLong, formatNaira, formatTime } from "@/lib/format";
import { SETTLEMENT_LABEL, type ReturnDetail } from "@/services/returns";

export interface ReturnDetailsModalProps {
  /** The row that was clicked; `null` keeps the dialog closed. */
  returnId: string | null;
  onClose: () => void;
}

/** The read-and-decide view for one return request. */
export function ReturnDetailsModal({ returnId, onClose }: ReturnDetailsModalProps) {
  const { data, isLoading, error } = useReturnDetail(returnId);
  const decision = useReturnDecisionMutation(returnId);

  // Once a request has been approved or rejected there is nothing left to
  // decide, so the footer stays visible but inert rather than disappearing.
  const decided = !data || data.status !== "pending";

  return (
    <Modal
      open={returnId !== null}
      onClose={onClose}
      title="Return details"
      size="xl"
      footer={
        <>
          <Button
            variant="outline"
            disabled={decided || decision.isPending}
            onClick={() => decision.mutate({ decision: "reject" })}
          >
            Reject
          </Button>
          <Button
            disabled={decided || decision.isPending}
            onClick={() => decision.mutate({ decision: "approve" })}
          >
            Approve
          </Button>
        </>
      }
    >
      {isLoading && <DetailSkeleton />}

      {error && (
        <EmptyState
          icon={<AlertCircle className="h-5 w-5" aria-hidden />}
          title="Couldn't load this return request"
          description={error.message}
        />
      )}

      {data && (
        <div className="grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <ReturnSummary detail={data} />
          <ReturnRail detail={data} />
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ left */

function ReturnSummary({ detail }: { detail: ReturnDetail }) {
  return (
    <div className="flex flex-col gap-8 px-6 py-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-inter font-semibold text-xl leading-7 text-text-900">
            Order {detail.reference}
          </h3>
          <StatusBadge status={detail.status} domain="order" />
          <StatusBadge
            status={detail.settlement}
            label={SETTLEMENT_LABEL[detail.settlement]}
            showIcon={false}
          />
        </div>
        <p className="font-jost text-sm leading-5 text-text-500">
          Request date: {formatDateLong(detail.requested_at)} {formatTime(detail.requested_at)}
          <span aria-hidden className="px-2">
            •
          </span>
          Order from: <span className="text-text-900 underline">{detail.store}</span>
        </p>
      </header>

      <div className="flex items-start gap-5">
        {detail.item.image_url && (
          // Fixtures are local files; a remote host would need next.config
          // remotePatterns, so a plain <img> keeps the mock phase unblocked.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={detail.item.image_url}
            alt={detail.item.name}
            className="h-[88px] w-[88px] shrink-0 rounded-xl bg-bg-soft object-cover"
          />
        )}
        <div className="flex min-w-0 flex-col gap-2">
          <h4 className="font-inter font-medium text-base leading-6 text-text-900">
            {detail.item.name}
          </h4>
          <p className="font-jost text-sm leading-5 text-text-500">
            Quantity: <span className="text-text-900">{detail.item.quantity}</span>
          </p>
          <p className="font-jost text-sm leading-5 text-text-500">ID: {detail.item.id}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-stroke-soft">
        <PanelCaption>Reason for return</PanelCaption>
        <ReasonBody text={detail.reason_detail} />

        {detail.media.length > 0 && (
          <>
            <PanelCaption className="border-t border-stroke-soft">Supporting media</PanelCaption>
            <ul className="grid grid-cols-3 gap-3 p-5">
              {detail.media.map((src, i) => (
                <li key={`${src}-${i}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Supporting media ${i + 1} for ${detail.item.name}`}
                    className="aspect-[4/5] w-full rounded-lg bg-bg-soft object-cover"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="font-inter font-medium text-base leading-6 text-text-900">
          Payment details
        </h4>
        <dl className="flex flex-col gap-4">
          <PaymentRow label="Subtotal total" value={detail.payment.subtotal} />
          <PaymentRow label="Discount" value={detail.payment.discount} />
          <PaymentRow label="Shipping fee" value={detail.payment.shipping_fee} />
          <PaymentRow label="Total" value={detail.payment.total} emphasis />
        </dl>
      </section>
    </div>
  );
}

function PanelCaption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h5
      className={`bg-bg-soft px-5 py-3 font-jost font-medium text-sm leading-5 text-text-900 ${className ?? ""}`}
    >
      {children}
    </h5>
  );
}

/** The shopper's narrative is long; clamp it until asked for the rest. */
function ReasonBody({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [clipped, setClipped] = useState(false);

  // Measured on mount rather than guessed from length: whether four lines are
  // enough depends on the rendered width, and a "see more" that reveals
  // nothing is worse than no toggle at all. The modal doesn't resize, so one
  // reading is enough.
  const measure = useCallback((el: HTMLParagraphElement | null) => {
    if (el) setClipped(el.scrollHeight > el.clientHeight + 1);
  }, []);

  return (
    <div className="flex flex-col items-start gap-1 p-5">
      <p
        ref={measure}
        className={`font-jost text-base leading-6 text-text-900 ${expanded ? "" : "line-clamp-4"}`}
      >
        {text}
      </p>
      {clipped && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="font-jost font-medium text-base leading-6 text-text-900 underline underline-offset-2"
        >
          {expanded ? "see less" : "see more"}
        </button>
      )}
    </div>
  );
}

function PaymentRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 font-jost text-sm leading-5">
      <dt className={emphasis ? "font-medium text-text-900" : "text-text-500"}>{label}</dt>
      <dd className={emphasis ? "font-medium text-text-900" : "text-text-900"}>
        {formatNaira(value)}
      </dd>
    </div>
  );
}

/* ----------------------------------------------------------------- right */

function ReturnRail({ detail }: { detail: ReturnDetail }) {
  return (
    <aside className="flex h-full flex-col gap-8 self-stretch bg-beige-lighter py-6 lg:border-l lg:border-stroke-soft">
      <section className="flex flex-col gap-4">
        <RailCaption>Order details</RailCaption>
        <dl className="flex flex-col gap-4 px-6">
          <RailRow label="Order ID" value={detail.order.id} />
          <RailRow label="Date" value={formatDateLong(detail.order.placed_at)} />
          <RailRow label="Total amount" value={formatNaira(detail.order.total_amount)} />
          <RailRow label="Total" value={formatNaira(detail.order.total)} />
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <RailCaption>Customer profile</RailCaption>
        <div className="flex items-center gap-4 px-6">
          <Avatar src={detail.customer.avatar_url} name={detail.customer.name} size="lg" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-inter font-medium text-lg leading-7 text-text-900">
              {detail.customer.name}
            </p>
            <p className="font-jost text-sm leading-5 text-text-500">ID: {detail.customer.id}</p>
          </div>
        </div>
        <dl className="flex flex-col gap-3 px-6">
          <RailRow
            label="Email"
            value={
              <InfoChip href={`mailto:${detail.customer.email}`}>{detail.customer.email}</InfoChip>
            }
          />
          <RailRow
            label="Phone"
            value={
              <InfoChip href={`tel:${detail.customer.phone}`}>{detail.customer.phone}</InfoChip>
            }
          />
        </dl>
      </section>
    </aside>
  );
}

function RailCaption({ children }: { children: ReactNode }) {
  return (
    <h4 className="bg-bg-soft px-6 py-2 font-jost font-medium text-xs uppercase leading-4 tracking-wide text-text-500">
      {children}
    </h4>
  );
}

function RailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 font-jost text-sm leading-5">
      <dt className="shrink-0 text-text-500">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium text-text-900">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------- skeleton */

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-6 px-6 py-6">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80" />
        <div className="flex gap-5">
          <Skeleton className="h-[88px] w-[88px] rounded-xl" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="flex flex-col gap-4 bg-beige-lighter px-6 py-6 lg:border-l lg:border-stroke-soft">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
