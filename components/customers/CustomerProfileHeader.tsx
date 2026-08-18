"use client";

import { Avatar } from "@/components/ui";
import { DetailHeader } from "@/components/shell";
import { formatDateLong, formatTime } from "@/lib/format";

export interface CustomerProfileHeaderProps {
  name: string | undefined;
  avatarUrl?: string | null;
  /** Display form including the hash — "#4536546". */
  customerId: string | undefined;
  lastLoginAt: string | undefined;
  isLoading?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  manageOptions: { value: string; label: string }[];
  onManage: (value: string) => void;
  className?: string;
}

export function CustomerProfileHeader({
  name,
  avatarUrl,
  customerId,
  lastLoginAt,
  ...rest
}: CustomerProfileHeaderProps) {
  return (
    <DetailHeader
      {...rest}
      media={<Avatar src={avatarUrl} name={name ?? ""} size="lg" />}
      title={
        <h1 className="truncate font-inter font-medium text-xl leading-7 text-text-900">{name}</h1>
      }
      subtitle={
        <p className="mt-1 font-jost text-sm leading-5 text-text-500">
          Customer ID: {customerId}
          {lastLoginAt && (
            <>
              {" • "}
              Last login: {formatDateLong(lastLoginAt)} {formatTime(lastLoginAt)}
            </>
          )}
        </p>
      }
    />
  );
}
