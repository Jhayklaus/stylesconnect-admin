"use client";

import { X } from "lucide-react";
import { Avatar, FilterDropdown, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  TICKET_PRIORITIES,
  TICKET_TYPE_OPTIONS,
  type TicketDetail,
  type TicketPriority,
} from "@/services/tickets";

const PRIORITY_DOT: Record<TicketPriority, string> = {
  low: "bg-status-danger-fg",
  medium: "bg-status-warning-fg",
  high: "bg-status-success-fg",
};

export interface TicketDetailsRailProps {
  detail: TicketDetail | undefined;
  isLoading?: boolean;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: TicketPriority) => void;
  onRemoveTag: (tag: string) => void;
  className?: string;
}

export function TicketDetailsRail({
  detail,
  isLoading,
  onTypeChange,
  onPriorityChange,
  onRemoveTag,
  className,
}: TicketDetailsRailProps) {
  if (isLoading || !detail) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <h2 className="font-inter font-medium text-base leading-6 text-text-900">Ticket details</h2>

      <section className="flex flex-col gap-2">
        <h3 className="font-jost text-sm leading-5 text-text-500">Type</h3>
        <FilterDropdown
          label="Type"
          align="start"
          className="w-full"
          options={TICKET_TYPE_OPTIONS}
          value={detail.type}
          onChange={onTypeChange}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-jost text-sm leading-5 text-text-500">Priority</h3>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Priority">
          {TICKET_PRIORITIES.map((option) => {
            const active = option.value === detail.priority;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onPriorityChange(option.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-jost text-sm leading-5 transition-colors",
                  active
                    ? "border-primary-base bg-beige-lighter text-text-900"
                    : "border-stroke-soft bg-bg-white text-text-500 hover:bg-beige-lighter"
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", PRIORITY_DOT[option.value])}
                  aria-hidden
                />
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-jost text-sm leading-5 text-text-500">Assigned to</h3>
        {detail.assignee ? (
          <div className="flex items-center gap-2.5">
            <Avatar src={detail.assignee.avatar_url} name={detail.assignee.name} size="sm" />
            <span className="truncate font-jost text-sm leading-5 text-text-900">
              {detail.assignee.name}
            </span>
          </div>
        ) : (
          <p className="font-jost text-sm leading-5 text-text-300">Unassigned</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-jost text-sm leading-5 text-text-500">Tags</h3>
        <ul className="flex flex-wrap gap-2">
          {detail.tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-stroke-soft px-2.5 py-1 font-jost text-xs leading-4 text-text-900">
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="text-text-300 transition-colors hover:text-text-900"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
          {detail.tags.length === 0 && (
            <li className="font-jost text-sm leading-5 text-text-300">No tags</li>
          )}
        </ul>
      </section>
    </div>
  );
}
