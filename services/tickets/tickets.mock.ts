import { PEOPLE, daysAgo, intBetween, pick, seeded } from "../mock/seed";
import type {
  Ticket,
  TicketChannel,
  TicketDetail,
  TicketEntry,
  TicketPriority,
  TicketStats,
  TicketStatus,
  TicketType,
} from "./tickets.types";

const SUBJECTS = [
  "Low activation in week-one onboarding cohort",
  "Payout not received after order completion",
  "Profile picture doesn't load on designer page",
  "Navigation issue on the listings filter",
  "Failed login attempt after password reset",
  "Duplicate charge on subscription renewal",
  "Order marked delivered but never arrived",
  "Cannot upload product images above 2MB",
  "Refund still pending after fourteen days",
  "Measurement guide missing for kaftan sizing",
];

/** The admins a ticket can be routed to. */
const ADMINS = ["Sophia Williams", "Adaeze Mbah", "Kunle Balogun", "Zainab Musa"];

export const MOCK_TICKETS: Ticket[] = Array.from({ length: 40 }, (_, i) => {
  const roll = seeded(`ticket-status-${i}`);
  const status: TicketStatus =
    roll > 0.86 ? "closed" : roll > 0.72 ? "resolved" : roll > 0.24 ? "pending" : "open";

  const customerName = PEOPLE[i % PEOPLE.length];
  const assigned = seeded(`ticket-assigned-${i}`) > 0.18;
  const adminName = pick(ADMINS, `ticket-admin-${i}`);

  return {
    id: `TCK-${String(2000 + i)}`,
    ticket_id: `IKU—${1000 + intBetween(10, 99, `ticket-${i}`)}`,
    subject: pick(SUBJECTS, `subject-${i}`),
    status,
    requested_at: daysAgo(intBetween(0, 150, `requested-${i}`)),
    customer: { id: `CUS-${3000 + i}`, name: customerName, avatar_url: null },
    assignee: assigned
      ? { id: `ADM-${ADMINS.indexOf(adminName) + 1}`, name: adminName, avatar_url: null }
      : null,
  };
});

/** Card figures are taken straight from the design. */
export const MOCK_TICKET_STATS: TicketStats = {
  total: 240,
  pending: 224,
  overdue: 4,
  delta: 9.4,
};

const TAG_SETS = [
  ["App speed", "Network", "blocked"],
  ["Payments", "urgent"],
  ["Onboarding", "cohort"],
];
const ACCOUNTS = ["Pine & Peak", "Aso Atelier", "Lagos Linen Co."];
const TYPES: TicketType[] = ["incident", "question", "problem", "task"];
const PRIORITIES: TicketPriority[] = ["low", "medium", "high"];
const CHANNELS: TicketChannel[] = ["email", "chat", "phone"];

export function mockTicketDetail(id: string): TicketDetail | undefined {
  const base = MOCK_TICKETS.find((t) => t.id === id);
  if (!base) return undefined;

  const index = MOCK_TICKETS.findIndex((t) => t.id === id);

  return {
    ...base,
    reference: `#TC—${String(intBetween(100_000, 999_999, `tref-${id}`))}`,
    channel: pick(CHANNELS, `tchannel-${id}`),
    type: pick(TYPES, `ttype-${id}`),
    account: pick(ACCOUNTS, `taccount-${id}`),
    priority: pick(PRIORITIES, `tpriority-${id}`),
    tags: pick(TAG_SETS, `ttags-${id}`),
    created_at: base.requested_at,
    prev_id: index > 0 ? MOCK_TICKETS[index - 1].id : null,
    next_id: index < MOCK_TICKETS.length - 1 ? MOCK_TICKETS[index + 1].id : null,
  };
}

/** Local so the fixture layer stays free of `lib` imports. */
function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const REPLY =
  "Thank you for providing that. Can you please tell me which product you wanted to order instead?";

export function mockTicketThread(id: string): TicketEntry[] {
  const detail = mockTicketDetail(id);
  const customer = detail?.customer ?? { id: "CUS-0", name: "Juliet Igbokwe", avatar_url: null };
  const day1 = daysAgo(intBetween(20, 60, `tthread-${id}`));
  const day2 = daysAgo(intBetween(1, 15, `tthread2-${id}`));

  return [
    {
      kind: "event",
      id: `TEV-${id}-1`,
      icon: "created",
      segments: [{ text: "Stylesconnect", strong: true }, { text: " created ticket" }],
      created_at: day1,
    },
    {
      kind: "message",
      id: `TMS-${id}-1`,
      author: customer,
      is_agent: false,
      body: REPLY,
      created_at: day1,
    },
    {
      kind: "message",
      id: `TMS-${id}-2`,
      author: { id: "ADM-1", name: "Styleconnect", avatar_url: null },
      is_agent: true,
      body: REPLY,
      created_at: day1,
    },
    {
      kind: "event",
      id: `TEV-${id}-2`,
      icon: "priority",
      segments: [
        { text: "Stylesconnect", strong: true },
        { text: " changed ticket priority to " },
        { text: capitalise(detail ? detail.priority : "low"), strong: true },
      ],
      created_at: day1,
    },
    {
      kind: "event",
      id: `TEV-${id}-3`,
      icon: "type",
      segments: [
        { text: "Stylesconnect", strong: true },
        { text: " changed ticket type to " },
        { text: capitalise(detail ? detail.type : "incident"), strong: true },
      ],
      created_at: day1,
    },
    {
      kind: "message",
      id: `TMS-${id}-3`,
      author: customer,
      is_agent: false,
      body: REPLY,
      created_at: day2,
    },
  ];
}
