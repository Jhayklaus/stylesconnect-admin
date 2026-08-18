"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNaira } from "@/lib/format";
import type { RevenuePoint } from "@/services/overview";
import { BAND_LABELS, BAND_TICKS, fromBand, toBand } from "./revenueScale";

const AXIS_TICK = {
  fill: "#585251",
  fontSize: 12,
  fontFamily: "var(--font-jost), sans-serif",
};

interface TooltipPayloadEntry {
  name?: string;
  value?: number;
  color?: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-stroke-soft bg-bg-white px-3 py-2 shadow-popover">
      <p className="mb-1 font-jost text-xs leading-4 text-text-500">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="flex items-center gap-2 font-jost text-sm leading-5 text-text-900"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}
          {/* Values are plotted in band space; map back for display. */}
          <span className="ml-auto font-medium">{formatNaira(fromBand(entry.value ?? 0))}</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueAreaChart({ points }: { points: RevenuePoint[] }) {
  const data = points.map((p) => ({
    month: p.month,
    Purchase: toBand(p.purchase),
    Subscription: toBand(p.subscription),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fillPurchase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7f56d9" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#7f56d9" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="fillSubscription" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2ae40" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f2ae40" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#ecebeb" strokeDasharray="4 6" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={AXIS_TICK}
            tickMargin={12}
          />
          <YAxis
            type="number"
            domain={[0, BAND_TICKS.length - 1]}
            ticks={BAND_TICKS}
            tickFormatter={(i: number) => BAND_LABELS[i] ?? ""}
            axisLine={false}
            tickLine={false}
            tick={AXIS_TICK}
            width={52}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#c4c2c2", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="Subscription"
            stroke="#f2ae40"
            strokeWidth={2}
            fill="url(#fillSubscription)"
          />
          <Area
            type="monotone"
            dataKey="Purchase"
            stroke="#7f56d9"
            strokeWidth={2}
            fill="url(#fillPurchase)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
