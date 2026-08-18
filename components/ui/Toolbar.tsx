import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Toolbar({ left, right, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex flex-wrap items-center gap-3">{right}</div>
    </div>
  );
}
