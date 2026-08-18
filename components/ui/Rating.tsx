import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  /** 0–5, halves allowed. */
  value: number;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles = { sm: "h-3.5 w-3.5", md: "h-[18px] w-[18px]" } as const;

/** Five stars, filled to `value` — halves round to the nearest 0.5. */
export function Rating({ value, size = "md", className }: RatingProps) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-chart-amber", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const position = i + 1;
        if (rounded >= position) {
          return <Star key={i} className={cn(sizeStyles[size], "fill-current")} aria-hidden />;
        }
        if (rounded + 0.5 === position) {
          return <StarHalf key={i} className={cn(sizeStyles[size], "fill-current")} aria-hidden />;
        }
        return (
          <Star key={i} className={cn(sizeStyles[size], "text-stroke-soft fill-current")} aria-hidden />
        );
      })}
    </span>
  );
}
