"use client";

import { CircleAlert, FilePlus2, Flag, UserRound } from "lucide-react";
import { Avatar, EmptyState, Skeleton } from "@/components/ui";
import { formatDateLong, formatTime } from "@/lib/format";
import type { TicketEntry, TicketEvent } from "@/services/tickets";

const EVENT_ICON: Record<TicketEvent["icon"], typeof Flag> = {
  created: FilePlus2,
  priority: Flag,
  type: CircleAlert,
  assignment: UserRound,
};

/** The brand monogram, used where an agent reply would otherwise show a photo. */
function AgentAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-base">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/StyleConnect_Monogram_Symbol_White.svg"
        alt=""
        aria-hidden
        className="h-4 w-auto"
      />
    </span>
  );
}

function groupByDay(entries: TicketEntry[]) {
  const groups: { label: string; entries: TicketEntry[] }[] = [];
  for (const entry of entries) {
    const label = formatDateLong(entry.created_at);
    const last = groups.at(-1);
    if (last?.label === label) last.entries.push(entry);
    else groups.push({ label, entries: [entry] });
  }
  return groups;
}

export function TicketThread({
  entries,
  isLoading,
  error,
}: {
  entries: TicketEntry[] | undefined;
  isLoading?: boolean;
  error?: Error | null;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (error) return <EmptyState title="Couldn't load this conversation" description={error.message} />;
  if (!entries?.length)
    return <EmptyState title="Nothing here yet" description="This ticket has no messages." />;

  return (
    <div className="flex flex-col gap-6">
      {groupByDay(entries).map((group) => (
        <section key={group.label} className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-stroke-soft" />
            <span className="font-jost text-xs leading-4 text-text-500">{group.label}</span>
            <span className="h-px flex-1 bg-stroke-soft" />
          </div>

          {group.entries.map((entry) => {
            if (entry.kind === "event") {
              const Icon = EVENT_ICON[entry.icon];
              return (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-soft text-text-500">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="font-jost text-sm leading-5 text-text-500">
                    {entry.segments.map((segment, i) => (
                      <span key={i} className={segment.strong ? "font-medium text-text-900" : undefined}>
                        {segment.text}
                      </span>
                    ))}
                    <span className="text-text-300">{" • "}{formatTime(entry.created_at)}</span>
                  </p>
                </div>
              );
            }

            return (
              <article key={entry.id} className="flex items-start gap-3">
                {entry.is_agent ? (
                  <AgentAvatar />
                ) : (
                  <Avatar src={entry.author.avatar_url} name={entry.author.name} size="sm" />
                )}
                <div className="min-w-0">
                  <p className="font-jost text-sm leading-5">
                    <span className="font-medium text-text-900">{entry.author.name}</span>
                    <span className="text-text-300">{" • "}{formatTime(entry.created_at)}</span>
                  </p>
                  <p className="mt-1 font-jost text-sm leading-5 text-text-900">{entry.body}</p>
                </div>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}
