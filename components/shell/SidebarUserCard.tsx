import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui";

export interface SidebarUserCardProps {
  name: string;
  role: string;
  avatarUrl?: string | null;
}

/**
 * Static until auth lands — there is no session to read from yet, and the
 * consumer app's localStorage role mock is deliberately not carried over.
 */
export function SidebarUserCard({ name, role, avatarUrl }: SidebarUserCardProps) {
  return (
    <div className="mt-auto pt-6">
      <div className="flex items-center gap-3 rounded-2xl border border-stroke-soft bg-bg-white px-3 py-2.5 shadow-card">
        <Avatar src={avatarUrl} name={name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-jost font-medium text-sm leading-5 text-text-900">{name}</p>
          <p className="truncate font-jost text-xs leading-4 text-text-500">{role}</p>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-text-500" aria-hidden />
      </div>
    </div>
  );
}
