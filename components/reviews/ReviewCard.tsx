import type { ReactNode } from "react";
import Image from "next/image";
import { Avatar, Rating } from "@/components/ui";
import { formatDateShort, formatTime } from "@/lib/format";

export interface ReviewCardProps {
  reviewer: { name: string; avatar_url: string | null };
  createdAt: string;
  rating: number;
  body: string;
  images: string[];
  /** Beside the stars — the copyable review ID, a status badge. */
  meta?: ReactNode;
  /** The quoted line naming what was reviewed: "Order: Ladies boyfriend jeans". */
  context?: ReactNode;
  /** Top-right controls. */
  actions?: ReactNode;
}

/** One review in a stacked feed — the designer profile and the moderation queues. */
export function ReviewCard({
  reviewer,
  createdAt,
  rating,
  body,
  images,
  meta,
  context,
  actions,
}: ReviewCardProps) {
  return (
    <article className="flex flex-col gap-3 border-b border-stroke-soft pb-6 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={reviewer.avatar_url} name={reviewer.name} size="sm" />
          <span className="font-jost font-medium text-sm leading-5 text-text-900">
            {reviewer.name}
          </span>
          <span className="font-jost text-sm leading-5 text-text-300">
            • {formatDateShort(createdAt)} {formatTime(createdAt)}
          </span>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {meta}
        <Rating value={rating} size="sm" />
      </div>

      {context && (
        <p className="border-l-2 border-stroke-soft pl-3 font-jost text-sm leading-5 text-text-500">
          {context}
        </p>
      )}

      {body && <p className="font-jost text-sm leading-5 text-text-900">{body}</p>}

      {images.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <li key={`${src}-${i}`}>
              <Image
                src={src}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg border border-stroke-soft object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
