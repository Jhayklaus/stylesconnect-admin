import { Card, CardHeader, Skeleton } from "@/components/ui";
import { formatCount, formatNaira } from "@/lib/format";
import type { OverviewFinance } from "@/services/overview";

interface Line {
  label: string;
  value: number;
  /** Counts, not money. */
  count?: boolean;
  /** Money leaving the platform — shown with a minus. */
  outflow?: boolean;
}

function groups(f: OverviewFinance): { title: string; lines: Line[] }[] {
  return [
    {
      title: "Sales",
      lines: [
        { label: "Item sales", value: f.item_sales },
        { label: "Refunds issued", value: f.refunds_issued, outflow: true },
      ],
    },
    {
      title: "Commission",
      lines: [
        { label: "Earned", value: f.commission_earned },
        { label: "Pending", value: f.commission_pending },
        { label: "First-order waived", value: f.first_order_commission_waived, outflow: true },
      ],
    },
    {
      title: "VAT",
      lines: [
        { label: "Owed", value: f.vat_owed },
        { label: "Pending", value: f.vat_pending },
      ],
    },
    {
      title: "Delivery",
      lines: [
        { label: "Fees collected", value: f.delivery_fees_collected },
        { label: "Courier costs", value: f.courier_costs, outflow: true },
        { label: "Margin", value: f.delivery_margin },
        { label: "Shipments missing cost", value: f.shipments_missing_cost, count: true },
      ],
    },
  ];
}

function display(line: Line): string {
  if (line.count) return formatCount(line.value);
  const money = formatNaira(line.value, { decimals: true });
  return line.outflow && line.value > 0 ? `−${money}` : money;
}

/** Where the platform's money came from over the selected range. */
export function FinanceBreakdownCard({
  finance,
  isLoading,
}: {
  finance?: OverviewFinance;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader
        title="Platform finance"
        action={
          isLoading || !finance ? (
            <Skeleton className="h-7 w-40" />
          ) : (
            <p className="text-right font-jost text-sm leading-5 text-text-500">
              Platform income{" "}
              <span className="ml-1 font-inter font-medium text-lg leading-7 text-text-900">
                {formatNaira(finance.platform_income, { decimals: true })}
              </span>
            </p>
          )
        }
      />

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 px-5 pb-5 pt-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !finance
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          : groups(finance).map((group) => (
              <section key={group.title} className="flex flex-col gap-2">
                <h3 className="font-jost font-medium text-xs uppercase leading-4 tracking-wide text-text-300">
                  {group.title}
                </h3>
                <dl className="flex flex-col divide-y divide-stroke-soft">
                  {group.lines.map((line) => (
                    <div key={line.label} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="font-jost text-sm leading-5 text-text-500">{line.label}</dt>
                      <dd className="font-jost text-sm leading-5 text-text-900">{display(line)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
      </div>
    </Card>
  );
}
