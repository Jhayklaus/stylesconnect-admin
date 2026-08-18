"use client";

import { CheckCircle2, Receipt, UserRound } from "lucide-react";
import { EmptyState, Skeleton } from "@/components/ui";
import { useShopperActivity } from "@/hooks/shoppers/useShopperDetail";
import { formatDateLong, formatTime } from "@/lib/format";
import type { ActivityKind, ShopperActivity } from "@/services/shoppers";

const KIND_ICON: Record<ActivityKind, typeof UserRound> = {
  account: UserRound,
  order: CheckCircle2,
  payment: Receipt,
};

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "Today" for anything from the current day, otherwise the long date. */
function dayLabel(iso: string): string {
  const date = new Date(iso);
  return sameDay(date, new Date()) ? "Today" : formatDateLong(iso);
}

function groupByDay(items: ShopperActivity[]) {
  const groups: { label: string; items: ShopperActivity[] }[] = [];
  for (const item of items) {
    const label = dayLabel(item.created_at);
    const last = groups.at(-1);
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export function ShopperActivityTab({ shopperId }: { shopperId: string }) {
  const { data, isLoading, error } = useShopperActivity(shopperId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <EmptyState title="Couldn't load activity" description={error.message} />;
  if (!data?.length)
    return <EmptyState title="No activity yet" description="Nothing has happened on this account." />;

  return (
    <div className="flex flex-col gap-8">
      {groupByDay(data).map((group) => (
        <section key={group.label} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-jost text-sm leading-5 text-text-500">{group.label}</h3>
            <span className="h-px flex-1 bg-stroke-soft" />
          </div>

          <ul className="flex flex-col gap-4">
            {group.items.map((item) => {
              const Icon = KIND_ICON[item.kind];
              const success = item.kind === "order";
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className={
                      success
                        ? "mt-0.5 shrink-0 text-status-success-fg"
                        : "mt-0.5 shrink-0 text-text-300"
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <p className="font-jost text-sm leading-5 text-text-900">
                    {item.segments.map((segment, i) => (
                      <span key={i} className={segment.strong ? "font-medium" : undefined}>
                        {segment.text}
                      </span>
                    ))}
                    <span className="text-text-300">
                      {" • "}
                      {formatDateLong(item.created_at)} {formatTime(item.created_at)}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
