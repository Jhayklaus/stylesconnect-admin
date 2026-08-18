import { formatCount } from "@/lib/format";
import type { RatingSummary as RatingSummaryData } from "@/services/types";
import { cn } from "@/lib/utils";
import { Rating } from "./Rating";

export interface RatingSummaryProps {
  rating: RatingSummaryData;
  /** Heading above the block; omit to render just the figures. */
  title?: string;
  /** "row" puts the histogram beside the average, "stacked" below it. */
  layout?: "row" | "stacked";
  className?: string;
}

/** Average, star row, review count, and the 5→1 histogram. */
export function RatingSummary({
  rating,
  title,
  layout = "row",
  className,
}: RatingSummaryProps) {
  // Bars are scaled against the largest bucket, not the total, so a dominant
  // rating doesn't flatten the rest into invisible slivers.
  const max = Math.max(...rating.distribution.map((b) => b.count), 1);

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {title && (
        <h2 className="font-inter font-medium text-base leading-6 text-text-900">{title}</h2>
      )}
      <div
        className={cn(
          "flex gap-x-12 gap-y-6",
          layout === "row" ? "flex-wrap items-start" : "flex-col"
        )}
      >
        <div className="flex items-center gap-4">
          <p className="font-inter font-medium text-[40px] leading-[48px] text-text-900">
            {rating.average}
          </p>
          <div className="flex flex-col gap-1">
            <Rating value={rating.average} />
            <p className="font-jost text-sm leading-5 text-text-500">
              {formatCount(rating.total)} reviews
            </p>
          </div>
        </div>

        <ul className={cn("flex flex-col gap-2", layout === "row" ? "min-w-[280px] flex-1" : "w-full")}>
          {rating.distribution.map((bucket) => (
            <li key={bucket.stars} className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-jost text-sm leading-5 text-text-500">
                <span>{bucket.stars}</span>
                <span>{formatCount(bucket.count)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-soft">
                <div
                  className="h-full rounded-full bg-chart-amber"
                  style={{ width: `${(bucket.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
