import { Loader2 } from "lucide-react";
import { ORDER_STAGES, type OrderStage } from "@/services/orders";
import { formatDateLong, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Estimated-delivery banner plus the four-step progress bar. */
export function OrderProgress({
  stage,
  estimatedDeliveryAt,
}: {
  stage: OrderStage;
  estimatedDeliveryAt: string;
}) {
  const currentIndex = ORDER_STAGES.findIndex((s) => s.value === stage);

  return (
    <section className="overflow-hidden rounded-xl border border-stroke-soft">
      <p className="bg-bg-soft px-5 py-3.5 font-jost text-sm leading-5 text-text-900">
        Estimated delivery:{" "}
        <span className="font-medium">
          {formatDateLong(estimatedDeliveryAt)} {formatTime(estimatedDeliveryAt)}
        </span>
      </p>

      <ol className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-4">
        {ORDER_STAGES.map((step, i) => {
          const reached = i <= currentIndex;
          const current = i === currentIndex;
          return (
            <li key={step.value} className="flex flex-col gap-2">
              <span
                className={cn(
                  "flex items-center gap-1.5 font-jost text-sm leading-5",
                  current ? "font-medium text-text-900" : reached ? "text-text-900" : "text-text-300"
                )}
              >
                {current && (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-text-500" aria-hidden />
                )}
                {step.label}
              </span>
              <span
                className={cn(
                  "h-1 w-full rounded-full",
                  reached ? "bg-primary-base" : "bg-stroke-soft"
                )}
                aria-hidden
              />
            </li>
          );
        })}
      </ol>
      <p className="sr-only">
        Current stage: {ORDER_STAGES[currentIndex]?.label ?? "unknown"}
      </p>
    </section>
  );
}
