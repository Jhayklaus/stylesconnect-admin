"use client";

import type { ReactNode } from "react";
import { Drawer, EmptyState, Skeleton } from "@/components/ui";
import { usePaymentDetail } from "@/hooks/payments/usePayments";
import { formatDateLong, formatNaira, formatTime, titleCase } from "@/lib/format";
import { PAYMENT_METHOD_LABEL } from "@/services/payments";

/** Tinted caption band that separates the drawer's groups. */
function SectionBand({ children }: { children: ReactNode }) {
  return (
    <h3 className="bg-bg-soft px-5 py-2.5 font-jost text-xs uppercase leading-4 tracking-wide text-text-500">
      {children}
    </h3>
  );
}

/** Label above value, rather than the label:value pairs used elsewhere. */
function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3">
      <dt className="font-jost text-sm leading-5 text-text-500">{label}</dt>
      <dd className="font-jost font-medium text-sm leading-5 text-text-900">{value}</dd>
    </div>
  );
}

export function TransactionDrawer({
  paymentId,
  onClose,
}: {
  paymentId: string | null;
  onClose: () => void;
}) {
  const { data, isLoading, error } = usePaymentDetail(paymentId);

  return (
    <Drawer open={Boolean(paymentId)} onClose={onClose} title="Transaction Details">
      {isLoading && (
        <div className="flex flex-col gap-4 px-5 py-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {error && (
        <div className="px-5 py-4">
          <EmptyState title="Couldn't load this transaction" description={error.message} />
        </div>
      )}

      {data && (
        <>
          <div className="flex flex-col gap-1 px-5 pb-5">
            <p className="font-inter font-medium text-[32px] leading-10 text-text-900">
              {formatNaira(data.amount)}
            </p>
            {data.card_label && (
              <p className="font-jost text-sm leading-5 text-text-500">{data.card_label}</p>
            )}
          </div>

          {data.subscription && (
            <>
              <SectionBand>Subscription</SectionBand>
              <dl className="flex flex-col">
                <Row label="Plan" value={data.subscription.plan} />
                <Row label="Starts" value={formatDateLong(data.subscription.starts_at)} />
                <Row
                  label="Ends"
                  value={`${formatDateLong(data.subscription.ends_at)} ${formatTime(
                    data.subscription.ends_at
                  )}`}
                />
              </dl>
            </>
          )}

          <SectionBand>Transaction details</SectionBand>
          <dl className="flex flex-col">
            <Row
              label="Date & time"
              value={`${formatDateLong(data.paid_at)} ${formatTime(data.paid_at)}`}
            />
            <Row label="Transaction ID" value={data.transaction_ref ?? data.transaction_id} />
            <Row
              label="Payment method"
              value={
                data.method ? (
                  <>
                    {PAYMENT_METHOD_LABEL[data.method]}
                    {data.card_label && (
                      <span className="font-normal text-text-500"> ({data.card_label})</span>
                    )}
                  </>
                ) : (
                  titleCase(data.gateway)
                )
              }
            />
            <Row label="Description" value={data.description} />
            {data.customer && <Row label="Customer" value={data.customer.name} />}
          </dl>

          <SectionBand>Amount summary</SectionBand>
          <dl className="flex flex-col pb-6">
            <Row label="Fee" value={formatNaira(data.fee)} />
            <Row label="Tax" value={formatNaira(data.tax)} />
            <Row label="Total" value={formatNaira(data.net)} />
          </dl>
        </>
      )}
    </Drawer>
  );
}
