"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { AdminTopBar, type Crumb } from "@/components/shell";
import {
  Button,
  ComingSoon,
  EmptyState,
  IconButton,
  Skeleton,
  StatusBadge,
  UnderlineTabs,
} from "@/components/ui";
import {
  useReplyToTicket,
  useTicket,
  useTicketThread,
} from "@/hooks/tickets/useTicketDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatDateLong, formatTime, titleCase } from "@/lib/format";
import { toast } from "@/lib/toast";
import { ticketKeys, type TicketDetail, type TicketPriority } from "@/services/tickets";
import { TicketComposer } from "../TicketComposer";
import { TicketDetailsRail } from "../TicketDetailsRail";
import { TicketThread } from "../TicketThread";

const CRUMBS: Crumb[] = [{ label: "Ticket", href: "/tickets" }, { label: "Details" }];

const TABS = [
  { value: "conversations", label: "Conversations" },
  { value: "activity", label: "Activity" },
];

export function TicketDetailPage({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useListParams({ tab: "conversations" });

  const { data, isLoading, error } = useTicket(ticketId);
  const thread = useTicketThread(ticketId);
  const reply = useReplyToTicket(ticketId);

  /** No PATCH endpoint is designed yet, so edits stay in the query cache. */
  function patchDetail(patch: Partial<TicketDetail>, message: string) {
    queryClient.setQueryData<TicketDetail>(ticketKeys.detail(ticketId), (prev) =>
      prev ? { ...prev, ...patch } : prev
    );
    toast.success(message);
  }

  if (error) {
    return (
      <>
        <AdminTopBar breadcrumb={CRUMBS} />
        <div className="flex-1 px-8 py-6">
          <EmptyState title="Couldn't load this ticket" description={error.message} />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar
        breadcrumb={CRUMBS}
        leading={
          <div className="ml-2 flex items-center gap-2">
            <IconButton
              label="Previous ticket"
              size="sm"
              disabled={!data?.prev_id}
              onClick={() => data?.prev_id && router.push(`/tickets/${data.prev_id}`)}
              icon={<ChevronLeft className="h-4 w-4" />}
            />
            <IconButton
              label="Next ticket"
              size="sm"
              disabled={!data?.next_id}
              onClick={() => data?.next_id && router.push(`/tickets/${data.next_id}`)}
              icon={<ChevronRight className="h-4 w-4" />}
            />
          </div>
        }
        actions={
          <>
            <IconButton
              label="More actions"
              icon={<MoreHorizontal className="h-[18px] w-[18px]" />}
            />
            {/* Split button: the caret would open other resolutions. */}
            <div className="flex items-stretch">
              <Button
                className="rounded-r-none"
                onClick={() => patchDetail({ status: "closed" }, "Ticket submitted as closed")}
              >
                Submit as closed
              </Button>
              <Button
                aria-label="Other resolutions"
                className="rounded-l-none border-l border-white/20 px-2"
                onClick={() => toast.success("Other resolutions aren't wired up yet")}
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </>
        }
      />

      <div className="flex flex-col gap-4 px-8 py-6">
        {isLoading || !data ? (
          <>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-jost text-sm leading-5 text-text-900">{data.reference}</span>
              <StatusBadge status={data.status} domain="ticket" dot />
            </div>
            <h1 className="font-inter font-medium text-xl leading-7 text-text-900">
              {data.subject}
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-jost text-sm leading-5 text-text-500">
              <span>
                Created:{" "}
                <span className="text-text-900">
                  {formatDateLong(data.created_at)} {formatTime(data.created_at)}
                </span>
              </span>
              <span aria-hidden>•</span>
              <span className="flex items-center gap-1.5">
                Channel:
                <span className="rounded-md border border-stroke-soft px-2 py-0.5 text-text-900">
                  {titleCase(data.channel)}
                </span>
              </span>
              <span aria-hidden>•</span>
              <span>
                Type: <span className="text-text-900">{titleCase(data.type)}</span>
              </span>
              <span aria-hidden>•</span>
              <span>
                Account: <span className="text-text-900 underline">{data.account}</span>
              </span>
            </p>
          </>
        )}

        <UnderlineTabs tabs={TABS} value={params.tab} onChange={params.setTab} />
      </div>

      <div className="flex flex-1 flex-col gap-8 px-8 pb-6 lg:flex-row lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {params.tab === "conversations" ? (
            <>
              <TicketThread
                entries={thread.data}
                isLoading={thread.isLoading}
                error={thread.error}
              />
              <TicketComposer
                channel={data?.channel ?? "email"}
                isSending={reply.isPending}
                onSend={(body, channel) => reply.mutate({ body, channel })}
              />
            </>
          ) : (
            <ComingSoon
              title="Activity"
              description="The Activity frame duplicates the Conversations layout, so there's no separate spec to build from yet."
            />
          )}
        </div>

        <TicketDetailsRail
          detail={data}
          isLoading={isLoading}
          className="w-full shrink-0 lg:w-[300px] lg:border-l lg:border-stroke-soft lg:pl-8"
          onTypeChange={(value) =>
            patchDetail({ type: value as TicketDetail["type"] }, `Type set to ${titleCase(value)}`)
          }
          onPriorityChange={(value: TicketPriority) =>
            patchDetail({ priority: value }, `Priority set to ${titleCase(value)}`)
          }
          onRemoveTag={(tag) =>
            patchDetail(
              { tags: (data?.tags ?? []).filter((t) => t !== tag) },
              `Removed tag "${tag}"`
            )
          }
        />
      </div>
    </>
  );
}
