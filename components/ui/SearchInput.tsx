"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Debounce before `onChange` fires. */
  debounceMs?: number;
  className?: string;
}

/**
 * Controlled with a local echo: typing stays instant while the parent (and the
 * query key) only updates after the debounce. Resyncs when `value` changes
 * externally — e.g. the back button restoring `?q=` from the URL.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Adjusting state during render (React's documented pattern) rather than in
  // an effect — this resyncs when `value` changes externally, e.g. the back
  // button restoring `?q=` from the URL.
  if (value !== lastValue) {
    setLastValue(value);
    setLocal(value);
  }

  // Held in a ref so the debounce timer isn't reset by callers that pass a
  // fresh closure each render. Synced in an effect — never during render.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (local === value) return;
    const id = setTimeout(() => onChangeRef.current(local), debounceMs);
    return () => clearTimeout(id);
    // `value` is intentionally excluded: the timer keys off local edits only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs]);

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2.5 rounded-lg border border-stroke-soft bg-bg-white px-3.5",
        "transition-colors focus-within:border-text-300",
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-text-300" aria-hidden />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent font-jost text-sm leading-5 text-text-900 outline-none placeholder:text-text-300 [&::-webkit-search-cancel-button]:appearance-none"
      />
    </div>
  );
}
