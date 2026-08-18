import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <EmptyState
        icon={<FileQuestion className="h-5 w-5" aria-hidden />}
        title="Page not found"
        description="That route doesn't exist in the admin platform."
        action={
          <Link href="/overview">
            <Button variant="outline" size="sm">
              Back to Overview
            </Button>
          </Link>
        }
      />
    </div>
  );
}
