"use client";

import { useState } from "react";
import { ShoppingBag, UserCheck, Users, Wallet } from "lucide-react";
import { AdminTopBar } from "@/components/shell";
import { StatCardRow, statDelta } from "@/components/ui";
import { useOverview } from "@/hooks/overview/useOverview";
import type { RevenueRange } from "@/services/overview";
import { FinanceBreakdownCard } from "../FinanceBreakdownCard";
import { RecentOrdersCard } from "../RecentOrdersCard";
import { RecentTicketsCard } from "../RecentTicketsCard";
import { RecentTransactionsCard } from "../RecentTransactionsCard";
import { RevenueOverviewCard } from "../RevenueOverviewCard";

const ICON = "h-4 w-4";

export function OverviewPage() {
  const [range, setRange] = useState<RevenueRange>("last_year");
  const { data, isLoading } = useOverview(range);
  const stats = data?.stats;

  return (
    <>
      <AdminTopBar breadcrumb={[{ label: "Dashboard", href: "/overview" }, { label: "Overview" }]} />

      <div className="flex flex-col gap-6 px-8 py-6">
        <StatCardRow
          isLoading={isLoading}
          items={[
            {
              label: "Total orders",
              value: stats?.total_orders,
              icon: <ShoppingBag className={ICON} aria-hidden />,
              delta: statDelta(stats?.total_orders_delta),
            },
            {
              label: "Active buyers",
              value: stats?.active_buyers,
              icon: <Users className={ICON} aria-hidden />,
              delta: statDelta(stats?.active_buyers_delta),
            },
            {
              label: "Active designers",
              value: stats?.active_designers,
              icon: <Wallet className={ICON} aria-hidden />,
              delta: statDelta(stats?.active_designers_delta),
            },
            {
              label: "Pending verification",
              value: stats?.pending_verification,
              icon: <UserCheck className={ICON} aria-hidden />,
              delta: statDelta(stats?.pending_verification_delta),
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <RevenueOverviewCard
            revenue={data?.revenue}
            isLoading={isLoading}
            range={range}
            onRangeChange={setRange}
          />
          <RecentTicketsCard tickets={data?.tickets} isLoading={isLoading} />
        </div>

        <FinanceBreakdownCard finance={data?.finance} isLoading={isLoading} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <RecentTransactionsCard transactions={data?.transactions} isLoading={isLoading} />
          <RecentOrdersCard orders={data?.orders} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
