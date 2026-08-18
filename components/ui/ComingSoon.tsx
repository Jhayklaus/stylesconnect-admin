import Link from "next/link";
import { Hammer } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

export interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

/**
 * Placeholder for routes that exist in the navigation but have no design yet.
 * Every sidebar entry resolves to a real, styled page rather than a dead end.
 */
export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <EmptyState
      icon={icon ?? <Hammer className="h-5 w-5" aria-hidden />}
      title={`${title} is coming soon`}
      description={
        description ??
        "This section hasn't been designed yet. It's wired into the navigation so the flow stays intact."
      }
      action={
        <Link href="/overview">
          <Button variant="outline" size="sm">
            Back to Overview
          </Button>
        </Link>
      }
      className="py-24"
    />
  );
}
