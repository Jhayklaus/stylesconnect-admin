"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Paperclip, Smile, Ticket as TicketIcon, Type } from "lucide-react";
import {
  Button,
  Field,
  FilterDropdown,
  IconButton,
  Modal,
  SegmentedField,
  TextField,
} from "@/components/ui";
import { useCreateTicket } from "@/hooks/tickets/useTicketDetail";
import { toast } from "@/lib/toast";
import {
  TICKET_PRIORITIES,
  TICKET_TYPE_OPTIONS,
  type TicketPriority,
  type TicketType,
} from "@/services/tickets";

/**
 * Requester and assignee would come from lookup endpoints; these stand in until
 * those exist, matching the placeholder copy in the design.
 */
const REQUESTER_OPTIONS = [
  { value: "juliet-igokwe", label: "Juliet Igokwe" },
  { value: "akinwale-james", label: "Akinwale James" },
  { value: "chidinma-okafor", label: "Chidinma Okafor" },
];

const ASSIGNEE_OPTIONS = [
  { value: "sophia-williams", label: "Sophia Williams" },
  { value: "adaeze-mbah", label: "Adaeze Mbah" },
  { value: "kunle-balogun", label: "Kunle Balogun" },
];

const FROM_OPTIONS = [
  { value: "sales", label: "Sales operator" },
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
];

const MACRO_OPTIONS = [
  { value: "all", label: "Macros" },
  { value: "ack", label: "Acknowledge receipt" },
  { value: "escalate", label: "Escalating to the team" },
];

const PRIORITY_DOT: Record<TicketPriority, string> = {
  low: "bg-status-danger-fg",
  medium: "bg-status-warning-fg",
  high: "bg-status-success-fg",
};

export function CreateTicketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // The design ships two frames: a form-only panel and a wide variant that adds
  // the message pane. One modal, one toggle.
  const [expanded, setExpanded] = useState(false);
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<TicketType>("incident");
  const [requester, setRequester] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("low");
  const [followers, setFollowers] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("sales");
  const [submitted, setSubmitted] = useState(false);

  const create = useCreateTicket();
  const subjectError = submitted && !subject.trim() ? "Give the ticket a name" : undefined;
  const requesterError = submitted && !requester ? "Pick a requester" : undefined;

  function reset() {
    setSubject("");
    setType("incident");
    setRequester("");
    setAssignee("");
    setPriority("low");
    setFollowers("");
    setMessage("");
    setSubmitted(false);
  }

  function submit() {
    setSubmitted(true);
    if (!subject.trim() || !requester) {
      toast.error("Fill in the required fields");
      return;
    }

    create.mutate(
      {
        subject: subject.trim(),
        type,
        priority,
        requester_id: requester,
        assignee_id: assignee || null,
        followers: followers ? followers.split(",").map((f) => f.trim()).filter(Boolean) : [],
        message: message.trim(),
        from,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  }

  const form = (
    <div className="flex flex-col gap-5 px-6 py-6">
      <TextField
        label="Ticket name"
        value={subject}
        onChange={setSubject}
        placeholder="e.g Customer onboarding issue"
        error={subjectError}
      />

      <Field label="Type">
        <FilterDropdown
          label="Select ticket type"
          align="start"
          className="w-full [&>button]:w-full [&>button]:justify-between"
          options={TICKET_TYPE_OPTIONS}
          value={type}
          onChange={(v) => setType(v as TicketType)}
        />
      </Field>

      <Field label="Requester" error={requesterError}>
        <FilterDropdown
          label="Select requester"
          align="start"
          className="w-full [&>button]:w-full [&>button]:justify-between"
          options={REQUESTER_OPTIONS}
          value={requester}
          onChange={setRequester}
        />
      </Field>

      <Field label="Assignee">
        <FilterDropdown
          label="Select assignee"
          align="start"
          className="w-full [&>button]:w-full [&>button]:justify-between"
          options={ASSIGNEE_OPTIONS}
          value={assignee}
          onChange={setAssignee}
        />
      </Field>

      <SegmentedField
        label="Priority"
        value={priority}
        onChange={(v) => setPriority(v as TicketPriority)}
        options={TICKET_PRIORITIES.map((p) => ({
          ...p,
          dotClassName: PRIORITY_DOT[p.value],
        }))}
      />

      <TextField
        label="Followers"
        value={followers}
        onChange={setFollowers}
        placeholder="Add followers..."
      />
    </div>
  );

  const messagePane = (
    <div className="flex flex-col gap-4 px-6 py-6">
      <h3 className="font-inter font-medium text-base leading-6 text-text-900">Message</h3>

      <div className="flex items-center gap-2">
        <span className="font-jost text-sm leading-5 text-text-500">From</span>
        <FilterDropdown
          label="Sales operator"
          align="start"
          options={FROM_OPTIONS}
          value={from}
          onChange={setFrom}
        />
      </div>

      <div className="rounded-xl border border-stroke-soft">
        <label className="sr-only" htmlFor="new-ticket-message">
          Message
        </label>
        <textarea
          id="new-ticket-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Reply or type something"
          className="w-full resize-y bg-transparent px-4 py-4 font-jost text-sm leading-5 text-text-900 placeholder:text-text-300 focus:outline-none"
        />
        <div className="flex items-center gap-2 px-4 pb-3">
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
            onChange={() => toast.success("Macros aren't wired up yet")}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size={expanded ? "lg" : "sm"}
      title="Create New Ticket"
      icon={
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-status-warning-bg text-status-warning-fg">
          <TicketIcon className="h-4 w-4" aria-hidden />
        </span>
      }
      headerActions={
        <IconButton
          label={expanded ? "Collapse" : "Expand"}
          onClick={() => setExpanded((v) => !v)}
          className="border-0 bg-transparent"
          icon={
            expanded ? (
              <Minimize2 className="h-[18px] w-[18px]" />
            ) : (
              <Maximize2 className="h-[18px] w-[18px]" />
            )
          }
        />
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending ? "Submitting" : "Submit ticket"}
          </Button>
        </>
      }
    >
      {expanded ? (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="border-b border-stroke-soft lg:border-b-0 lg:border-r">{messagePane}</div>
          <div className="bg-bg-soft/40">{form}</div>
        </div>
      ) : (
        form
      )}
    </Modal>
  );
}
