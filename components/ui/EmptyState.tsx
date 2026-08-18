import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-16 text-center",
        className
      )}
    >
      <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-bg-soft text-text-500">
        {icon ?? <SearchX className="h-5 w-5" aria-hidden />}
      </span>
      <p className="font-inter font-medium text-base leading-6 text-text-900">{title}</p>
      {description && (
        <p className="max-w-sm font-jost text-sm leading-5 text-text-500">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
