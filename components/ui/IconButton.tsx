import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — the button has no text for a screen reader to announce. */
  label: string;
  icon: ReactNode;
  /** Red notification dot, as on the top bar's bell. */
  dot?: boolean;
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, icon, dot, size = "md", className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg border border-stroke-soft",
          "bg-bg-white text-text-900 transition-colors hover:bg-beige-lighter",
          "disabled:opacity-50 disabled:pointer-events-none",
          size === "sm" ? "h-8 w-8" : "h-10 w-10",
          className
        )}
        {...props}
      >
        {icon}
        {dot && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-status-danger-fg" />
        )}
      </button>
    );
  }
);
