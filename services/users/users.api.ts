import { apiClient } from "../client";
import type { Paginated } from "../types";
import { MOCKS } from "../mock/config";
import { applyFilter, delay, mockPaginate } from "../mock/transport";
import { MOCK_USERS, MOCK_WAITLIST } from "./users.mock";
import type {
  PlatformUser,
  UserListParams,
  WaitlistEntry,
  WaitlistParams,
  WaitlistType,
} from "./users.types";

/** GET /admin/users — paginates, but ignores search and role filters for now. */
export async function fetchUsers(params: UserListParams = {}): Promise<Paginated<PlatformUser>> {
  if (MOCKS.users) {
    await delay();
    return mockPaginate(MOCK_USERS, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<PlatformUser>>("/admin/users", { params });
  return data;
}

type Raw = Record<string, unknown>;

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

/** Unverified against a real row — see WaitlistEntry. */
function normalizeWaitlistEntry(raw: Raw): WaitlistEntry {
  return {
    id: String(raw.uuid ?? raw.id),
    type: (str(raw.type) ?? "customer") as WaitlistType,
    full_name: str(raw.full_name) ?? str(raw.name) ?? "—",
    email: str(raw.email) ?? "—",
    phone: str(raw.phone) ?? str(raw.phone_number),
    city: str(raw.city),
    created_at: str(raw.created_at) ?? new Date(0).toISOString(),
  };
}

/** GET /admin/waitlist */
export async function fetchWaitlist(params: WaitlistParams = {}): Promise<Paginated<WaitlistEntry>> {
  if (MOCKS.users) {
    await delay();
    const rows = applyFilter(MOCK_WAITLIST, params.type, (w) => w.type);
    return mockPaginate(rows, params.page ?? 1, params.per_page ?? 7);
  }

  const { data } = await apiClient.get<Paginated<Raw>>("/admin/waitlist", { params });
  return { ...data, data: data.data.map(normalizeWaitlistEntry) };
}
