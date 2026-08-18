import { PEOPLE, daysAgo, intBetween, pick, seeded } from "../mock/seed";
import type { Ticket, TicketStats, TicketStatus } from "./tickets.types";

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
