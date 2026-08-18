import { PEOPLE, daysAgo, emailFor, intBetween, pick, seeded } from "../mock/seed";
import { MEMBER_ROLES, type Member, type MemberStatus } from "./members.types";

export const MOCK_MEMBERS: Member[] = Array.from({ length: 14 }, (_, i) => {
  const name = PEOPLE[(i * 3) % PEOPLE.length];
  const roll = seeded(`member-status-${i}`);
  const status: MemberStatus = roll > 0.86 ? "deactivated" : roll > 0.72 ? "invited" : "active";

  return {
    id: `MEM-${String(100 + i)}`,
    name,
    email: emailFor(name),
    role: pick(MEMBER_ROLES, `member-role-${i}`),
    status,
    // Invited members haven't joined yet, so they have no tenure and no login.
    joined_at: status === "invited" ? null : daysAgo(intBetween(400, 1800, `joined-${i}`)),
    added_at: daysAgo(intBetween(0, 360, `added-${i}`)),
    last_login_at: status === "invited" ? null : daysAgo(intBetween(0, 30, `login-${i}`)),
  };
});
