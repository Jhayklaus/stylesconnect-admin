"use client";

import dynamic from "next/dynamic";
import { Card, FilterDropdown, Skeleton } from "@/components/ui";
import { formatNaira } from "@/lib/format";
import type { RevenueRange, RevenueSeries } from "@/services/overview";

// Recharts is ~90kb; keep it off the four table routes.
const RevenueAreaChart = dynamic(
  () => import("./RevenueAreaChart").then((m) => m.RevenueAreaChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-xl" /> }
);

const RANGE_OPTIONS = [
  { value: "last_year", label: "Last year" },
  { value: "last_6_months", label: "Last 6 months" },
  { value: "last_30_days", label: "Last 30 days" },
];

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 font-jost text-sm leading-5 text-text-500">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export interface RevenueOverviewCardProps {
  revenue?: RevenueSeries;
  isLoading?: boolean;
  range: RevenueRange;
  onRangeChange: (range: RevenueRange) => void;
}

export function RevenueOverviewCard({
  revenue,
  isLoading,
  range,
  onRangeChange,
}: RevenueOverviewCardProps) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <h2 className="font-inter font-medium text-base leading-6 text-text-900">
            Revenue overview
          </h2>
          <div className="flex items-center gap-5">
            <LegendDot color="#7f56d9" label="Purchase" />
            <LegendDot color="#f2ae40" label="Subscription" />
          </div>
        </div>
        <FilterDropdown
          label="Last year"
          options={RANGE_OPTIONS}
          value={range}
          onChange={(v) => onRangeChange(v as RevenueRange)}
        />
      </div>

      {isLoading || !revenue ? (
        <Skeleton className="mt-4 h-9 w-56" />
      ) : (
        <p className="mt-4 font-inter font-medium text-[28px] leading-9 text-text-900">
          {formatNaira(revenue.total, { decimals: true })}
        </p>
      )}

      <div className="mt-6 flex-1">
        {isLoading || !revenue ? (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        ) : (
          <RevenueAreaChart points={revenue.points} />
        )}
      </div>
    </Card>
  );
}
