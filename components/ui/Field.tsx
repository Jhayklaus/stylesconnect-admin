"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  htmlFor?: string;
  /** Renders under the control, in the danger tone. */
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="font-jost font-medium text-sm leading-5 text-text-900"
      >
        {label}
      </label>
      {children}
      {error && <p className="font-jost text-xs leading-4 text-status-danger-fg">{error}</p>}
    </div>
  );
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  onChange: (value: string) => void;
  error?: string;
  /** Control rendered inside the field, flush right — the role dropdown. */
  trailing?: ReactNode;
  fieldClassName?: string;
}

export function TextField({
  label,
  onChange,
  error,
  trailing,
  className,
  fieldClassName,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field label={label} htmlFor={inputId} error={error} className={fieldClassName}>
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border border-stroke-soft bg-bg-white px-3.5",
          "transition-colors focus-within:border-text-300",
          error && "border-status-danger-fg",
          className
        )}
      >
        <input
          id={inputId}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent font-jost text-sm leading-5 text-text-900 outline-none placeholder:text-text-300"
          {...props}
        />
        {trailing}
      </div>
    </Field>
  );
}

export interface SegmentedFieldOption {
  value: string;
  label: string;
  /** Tailwind background class for the leading dot. */
  dotClassName?: string;
}

export interface SegmentedFieldProps {
  label: string;
  options: SegmentedFieldOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** The Low / Medium / High priority picker. */
export function SegmentedField({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedFieldProps) {
  return (
    <Field label={label} className={className}>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex items-center gap-1 rounded-lg bg-bg-soft p-1"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 font-jost text-sm leading-5 transition-colors",
                active
                  ? "bg-bg-white text-text-900 shadow-pill-active"
                  : "text-text-500 hover:text-text-900"
              )}
            >
              {option.dotClassName && (
                <span className={cn("h-1.5 w-1.5 rounded-full", option.dotClassName)} aria-hidden />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
