import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
} as const;

/** Deterministic tint so the same person keeps the same colour across screens. */
const TINTS = [
  "bg-[#fef0c7] text-[#b54708]",
  "bg-[#e0eaff] text-[#3538cd]",
  "bg-[#fce7f6] text-[#c11574]",
  "bg-[#d1fadf] text-[#027a48]",
  "bg-[#ede9fe] text-[#5925dc]",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function tintFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return TINTS[Math.abs(hash) % TINTS.length];
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-jost font-medium",
    sizeStyles[size],
    className
  );

  if (src) {
    // Fixtures use local files; remote hosts need next.config remotePatterns,
    // so a plain <img> keeps the mock phase unblocked.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={cn(base, "object-cover")} />;
  }

  return (
    <span className={cn(base, tintFor(name))} aria-hidden>
      {initials(name)}
    </span>
  );
}
