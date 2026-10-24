import { PEOPLE, daysAgo, emailFor, intBetween, pick, seeded } from "../mock/seed";
import type { PlatformUser, WaitlistEntry } from "./users.types";

const ROLE_SETS = [["customer"], ["customer"], ["designer"], ["designer", "admin"], []];
const CITIES = ["Lagos", "Abuja", "Ibadan", "Port Harcourt", "Accra"];

export const MOCK_USERS: PlatformUser[] = PEOPLE.map((name, i) => {
  const [first, ...rest] = name.split(" ");
  return {
    uuid: `USR-${1000 + i}`,
    name,
    first_name: first,
    last_name: rest.join(" ") || null,
    email: emailFor(name),
    phone_number: `0${intBetween(7_000_000_000, 9_099_999_999, `uphone-${i}`)}`,
    gender: null,
    profile_picture_url: null,
    is_email_verified: seeded(`uverified-${i}`) > 0.25,
    roles: pick(ROLE_SETS, `uroles-${i}`),
    created_at: daysAgo(intBetween(0, 400, `ujoined-${i}`)),
  };
});

export const MOCK_WAITLIST: WaitlistEntry[] = Array.from({ length: 19 }, (_, i) => {
  const name = PEOPLE[(i * 5 + 3) % PEOPLE.length];
  return {
    id: `WL-${2000 + i}`,
    type: seeded(`wltype-${i}`) > 0.6 ? "designer" : "customer",
    full_name: name,
    email: emailFor(name),
    phone: `0${intBetween(7_000_000_000, 9_099_999_999, `wlphone-${i}`)}`,
    city: pick(CITIES, `wlcity-${i}`),
    created_at: daysAgo(intBetween(0, 120, `wljoined-${i}`)),
  };
});
