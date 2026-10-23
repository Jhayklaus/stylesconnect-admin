import { CheckCircle2, Circle } from "lucide-react";
import { formatDateLong, formatTime } from "@/lib/format";
import type { OrderTimelineEntry } from "@/services/orders";

export function OrderTimeline({ events }: { events: OrderTimelineEntry[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-inter font-medium text-base leading-6 text-text-900">Timeline</h2>

      <ol className="flex flex-col">
        {events.map((event, i) => {
          const last = i === events.length - 1;
          const done = event.state === "done";
          return (
            <li key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                {done ? (
                  <CheckCircle2
                    className="h-[18px] w-[18px] shrink-0 text-status-success-fg"
                    aria-hidden
                  />
                ) : (
                  <Circle className="h-[18px] w-[18px] shrink-0 text-text-300" aria-hidden />
                )}
                {!last && <span className="w-px flex-1 bg-stroke-soft" aria-hidden />}
              </div>

              <div className={last ? "pb-0" : "pb-6"}>
                <p className="font-jost text-sm leading-5">
                  <span className="font-medium text-text-900">{event.title}</span>
                  {/* Steps that haven't happened yet have no timestamp. */}
                  {event.created_at && (
                    <span className="text-text-300">
                      {" • "}
                      {formatDateLong(event.created_at)} {formatTime(event.created_at)}
                    </span>
                  )}
                </p>
                <p className="mt-1 font-jost text-sm leading-5 text-text-500">
                  {event.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
