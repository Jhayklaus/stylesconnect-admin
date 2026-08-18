"use client";

import { useState } from "react";
import { Paperclip, Send, Smile, Type } from "lucide-react";
import { Button, FilterDropdown, IconButton } from "@/components/ui";
import { toast } from "@/lib/toast";
import type { TicketChannel } from "@/services/tickets";

const CHANNEL_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
  { value: "phone", label: "Phone" },
];

const MACRO_OPTIONS = [
  { value: "all", label: "Macros" },
  { value: "ack", label: "Acknowledge receipt" },
  { value: "refund", label: "Refund policy" },
  { value: "escalate", label: "Escalating to the team" },
];

const MACRO_BODIES: Record<string, string> = {
  ack: "Thanks for getting in touch — we've received your report and are looking into it now.",
  refund: "Refunds are processed within 5–7 working days of an approved return request.",
  escalate: "I'm escalating this to our specialist team; they'll follow up here shortly.",
};

export function TicketComposer({
  channel,
  onSend,
  isSending,
}: {
  channel: TicketChannel;
  onSend: (body: string, channel: TicketChannel) => void;
  isSending?: boolean;
}) {
  const [body, setBody] = useState("");
  const [replyChannel, setReplyChannel] = useState<TicketChannel>(channel);

  function submit() {
    const trimmed = body.trim();
    if (!trimmed) {
      toast.error("Write a reply first");
      return;
    }
    onSend(trimmed, replyChannel);
    setBody("");
  }

  return (
    <div className="rounded-xl border border-stroke-soft bg-bg-white">
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
        <span className="font-jost text-sm leading-5 text-text-500">Channel:</span>
        <FilterDropdown
          label="Email"
          align="start"
          options={CHANNEL_OPTIONS}
          value={replyChannel}
          onChange={(v) => setReplyChannel(v as TicketChannel)}
        />
        <span className="ml-2 font-jost text-sm leading-5 text-text-500">From</span>
        <FilterDropdown
          label="Email"
          align="start"
          options={CHANNEL_OPTIONS}
          value={replyChannel}
          onChange={(v) => setReplyChannel(v as TicketChannel)}
        />
      </div>

      <label className="sr-only" htmlFor="ticket-reply">
        Reply
      </label>
      <textarea
        id="ticket-reply"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Reply or type something"
        className="w-full resize-y bg-transparent px-4 py-4 font-jost text-sm leading-5 text-text-900 placeholder:text-text-300 focus:outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4">
        <div className="flex items-center gap-2">
          <IconButton
            label="Formatting"
            size="sm"
            className="border-0 bg-transparent"
            icon={<Type className="h-[18px] w-[18px]" />}
          />
          <IconButton
            label="Emoji"
            size="sm"
            className="border-0 bg-transparent"
            icon={<Smile className="h-[18px] w-[18px]" />}
          />
          <IconButton
            label="Attach a file"
            size="sm"
            className="border-0 bg-transparent"
            icon={<Paperclip className="h-[18px] w-[18px]" />}
          />
          <FilterDropdown
            label="Macros"
            align="start"
            options={MACRO_OPTIONS}
            onChange={(v) => {
              const macro = MACRO_BODIES[v];
              if (macro) setBody((current) => (current ? `${current}\n\n${macro}` : macro));
            }}
          />
        </div>

        <Button
          onClick={submit}
          disabled={isSending}
          trailingIcon={<Send className="h-4 w-4" aria-hidden />}
        >
          {isSending ? "Sending" : "Send"}
        </Button>
      </div>
    </div>
  );
}
