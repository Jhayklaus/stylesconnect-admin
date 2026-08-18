"use client";

import { Copy } from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  value: string;
  /** What to call the value in the toast and the aria-label. */
  label: string;
  className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Couldn't copy the ${label.toLowerCase()}`);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label.toLowerCase()} ${value}`}
      className={cn(
        "rounded p-0.5 text-text-300 transition-colors hover:text-text-900",
        className
      )}
    >
      <Copy className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
