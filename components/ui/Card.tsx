import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-stroke-soft bg-bg-white", className)}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  /** Right-hand slot — "See All" / "View all" buttons, selects, legends. */
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 px-5 pt-5", className)}>
      <h2 className="font-inter font-medium text-base leading-6 text-text-900">{title}</h2>
      {action}
    </div>
  );
}
