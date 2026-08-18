"use client";

import type { ReactNode } from "react";
import { Avatar, Drawer, EmptyState, Skeleton, StatusBadge } from "@/components/ui";
import { useRefund } from "@/hooks/refunds/useRefunds";
import { formatDateLong, formatNaira, formatTime } from "@/lib/format";
import { REFUND_DESTINATION_LABEL, REFUND_SOURCE_LABEL } from "@/services/refunds";

function SectionBand({ children }: { children: ReactNode }) {
  return (
    <h3 className="bg-bg-soft px-5 py-2.5 font-jost text-xs uppercase leading-4 tracking-wide text-text-500">
      {children}
    </h3>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3">
      <dt className="font-jost text-sm leading-5 text-text-500">{label}</dt>
      <dd className="font-jost font-medium text-sm leading-5 text-text-900">{value}</dd>
    </div>
  );
}

/** Mirrors the Payments drawer so the two tabs read as one module. */
export function RefundDrawer({
  refundId,
  onClose,
}: {
  refundId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, error } = useRefund(refundId);

  return (
    <Drawer open={Boolean(refundId)} onClose={onClose} title="Refund Details">
      {isLoading && (
        <div className="flex flex-col gap-4 px-5 py-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {error && (
        <div className="px-5 py-4">
          <EmptyState title="Couldn't load this refund" description={error.message} />
        </div>
      )}

      {data && (
        <>
          <div className="flex flex-col gap-2 px-5 pb-5">
            <p className="font-inter font-medium text-[32px] leading-10 text-text-900">
              {formatNaira(data.amount)}
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge status={data.status} domain="transaction" />
              <span className="font-jost text-sm leading-5 text-text-500">
                {REFUND_SOURCE_LABEL[data.source]} refund
              </span>
            </div>
          </div>

          <SectionBand>Refund details</SectionBand>
          <dl className="flex flex-col">
            <Row label="Refund ID" value={data.refund_id} />
            <Row label="Original transaction" value={data.transaction_id} />
            <Row label="Reason" value={data.reason} />
            <Row label="Destination" value={REFUND_DESTINATION_LABEL[data.destination]} />
          </dl>

          <SectionBand>Timeline</SectionBand>
          <dl className="flex flex-col">
            <Row
              label="Requested"
              value={`${formatDateLong(data.requested_at)} ${formatTime(data.requested_at)}`}
            />
            <Row
              label="Processed"
              value={
                data.processed_at ? (
                  `${formatDateLong(data.processed_at)} ${formatTime(data.processed_at)}`
                ) : (
                  <span className="font-normal text-text-300">Not yet settled</span>
                )
              }
            />
          </dl>

          <SectionBand>Customer</SectionBand>
          <div className="flex items-center gap-3 px-5 py-4 pb-6">
            <Avatar src={data.customer.avatar_url} name={data.customer.name} size="md" />
            <div className="min-w-0">
              <p className="truncate font-jost font-medium text-sm leading-5 text-text-900">
                {data.customer.name}
              </p>
              <p className="font-jost text-xs leading-4 text-text-500">ID: {data.customer.id}</p>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
