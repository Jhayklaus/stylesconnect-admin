import type { MemberListParams } from "./members.types";

export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (params: MemberListParams) => [...memberKeys.lists(), params] as const,
  detail: (id: string) => [...memberKeys.all, "detail", id] as const,
};
