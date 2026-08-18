"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterDropdown, IconButton, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface DetailHeaderProps {
  /** Avatar, thumbnail, or nothing. */
  media?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  isLoading?: boolean;
  /** Stepping through the list the record was opened from. */
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  manageOptions: { value: string; label: string }[];
  onManage: (value: string) => void;
  className?: string;
}

/**
 * The band above the two-column detail screens: media, title, meta line, and
 * the prev/next + Manage cluster. Shared by the customer profiles and the
 * product detail, which differ only in what goes in the media and title slots.
 */
export function DetailHeader({
  media,
  title,
  subtitle,
  isLoading,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
  manageOptions,
  onManage,
  className,
}: DetailHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4 px-8 py-6", className)}>
      <div className="flex min-w-0 items-center gap-4">
        {isLoading ? <Skeleton className="h-16 w-16 rounded-full" /> : media}
        <div className="min-w-0">
          {isLoading ? <Skeleton className="h-7 w-48" /> : title}
          {isLoading ? <Skeleton className="mt-2 h-4 w-72" /> : subtitle}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <IconButton
          label="Previous"
          onClick={onPrev}
          disabled={!hasPrev || !onPrev}
          icon={<ChevronLeft className="h-[18px] w-[18px]" />}
        />
        <IconButton
          label="Next"
          onClick={onNext}
          disabled={!hasNext || !onNext}
          icon={<ChevronRight className="h-[18px] w-[18px]" />}
        />
        <FilterDropdown label="Manage" options={manageOptions} onChange={onManage} />
      </div>
    </div>
  );
}
