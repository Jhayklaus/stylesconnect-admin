"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Renders the dash state and sets input.indeterminate on the DOM node. */
  indeterminate?: boolean;
  label?: string;
}

/**
 * Built fresh rather than copied from the consumer app, whose version puts
 * `peer-checked:` on an icon *nested inside* the sibling label — a selector
 * that can never match, so its checkmark never appears. Here the visual box is
 * a sibling of the input, and the icons key off `peer-checked` / `peer-indeterminate`.
 */
export function Checkbox({
  indeterminate = false,
  label,
  className,
  checked,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cn("group inline-flex items-center gap-2.5", label && "cursor-pointer")}>
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className={cn(
            "peer h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px] border border-stroke-soft bg-bg-white transition-colors",
            "checked:border-primary-base checked:bg-primary-base",
            "indeterminate:border-primary-base indeterminate:bg-primary-base",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0"
        />
        <Minus
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-indeterminate:opacity-100"
        />
      </span>
      {label && (
        <span className="font-jost text-sm leading-5 text-text-900">{label}</span>
      )}
    </label>
  );
}
